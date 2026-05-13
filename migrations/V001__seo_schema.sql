-- migrations/V001__seo_schema.sql
-- Schema isolado para SEO programático.
-- Roles sem LOGIN — aplicação usa o role do app com GRANT explícito.

CREATE SCHEMA IF NOT EXISTS seo;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'seo_read') THEN
    CREATE ROLE seo_read NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'seo_write') THEN
    CREATE ROLE seo_write NOLOGIN;
  END IF;
END $$;

GRANT USAGE ON SCHEMA seo TO seo_read, seo_write;
ALTER DEFAULT PRIVILEGES IN SCHEMA seo
  GRANT SELECT ON TABLES TO seo_read;
ALTER DEFAULT PRIVILEGES IN SCHEMA seo
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO seo_write;

-- =================================================================
-- DIMENSÕES FRIAS (dados públicos, mudam raro)
-- =================================================================

CREATE TABLE IF NOT EXISTS seo.uf (
  code        char(2)       PRIMARY KEY,
  name        text          NOT NULL,
  region      text          NOT NULL CHECK (region IN ('Norte','Nordeste','Centro-Oeste','Sudeste','Sul')),
  populacao   integer       NOT NULL,
  pib_milhoes numeric(14,2),
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo.city (
  id              integer       PRIMARY KEY,   -- código IBGE 7 dígitos
  uf              char(2)       NOT NULL REFERENCES seo.uf(code),
  name            text          NOT NULL,
  slug            text          NOT NULL,
  capital         boolean       NOT NULL DEFAULT false,
  populacao       integer       NOT NULL,
  pib_per_capita  numeric(12,2),
  renda_media     numeric(12,2),
  lat             numeric(9,6)  NOT NULL,
  lon             numeric(9,6)  NOT NULL,
  meso_id         integer,
  micro_id        integer,
  rm_id           integer,
  ibge_updated_at date,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS city_uf_slug_uidx  ON seo.city (uf, slug);
CREATE INDEX       IF NOT EXISTS city_capital_idx    ON seo.city (capital) WHERE capital;
CREATE INDEX       IF NOT EXISTS city_populacao_idx  ON seo.city (populacao DESC);

CREATE TABLE IF NOT EXISTS seo.vertical (
  slug                    text     PRIMARY KEY,
  singular                text     NOT NULL,
  plural_estabelecimentos text     NOT NULL,
  plural_profissionais    text     NOT NULL,
  cnaes                   text[]   NOT NULL,
  artigo                  char(1)  NOT NULL CHECK (artigo IN ('o','a')),
  active                  boolean  NOT NULL DEFAULT true,
  priority                smallint NOT NULL DEFAULT 5,  -- 1=P0, 2=P1, 3=P2
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo.neighborhood (
  id         bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  city_id    integer     NOT NULL REFERENCES seo.city(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  slug       text        NOT NULL,
  source     text        NOT NULL CHECK (source IN ('osm','manual','prefeitura')),
  osm_id     bigint,
  lat        numeric(9,6),
  lon        numeric(9,6),
  populacao  integer,
  UNIQUE (city_id, slug)
);
CREATE INDEX IF NOT EXISTS neighborhood_city_idx ON seo.neighborhood (city_id);

-- =================================================================
-- FATOS FRIOS (dados públicos por chave composta)
-- =================================================================

CREATE TABLE IF NOT EXISTS seo.cnae_establishments (
  city_id        integer  NOT NULL REFERENCES seo.city(id),
  cnae           text     NOT NULL,
  snapshot_date  date     NOT NULL,
  total_ativos   integer  NOT NULL,
  total_mei      integer  NOT NULL DEFAULT 0,
  total_simples  integer  NOT NULL DEFAULT 0,
  abertos_12m    integer  NOT NULL DEFAULT 0,
  fechados_12m   integer  NOT NULL DEFAULT 0,
  PRIMARY KEY (city_id, cnae, snapshot_date)
);
CREATE INDEX IF NOT EXISTS cnae_est_city_recent_idx
  ON seo.cnae_establishments (city_id, cnae, snapshot_date DESC);

CREATE TABLE IF NOT EXISTS seo.cnae_establishments_neighborhood (
  neighborhood_id  bigint  NOT NULL REFERENCES seo.neighborhood(id) ON DELETE CASCADE,
  cnae             text    NOT NULL,
  snapshot_date    date    NOT NULL,
  total_ativos     integer NOT NULL,
  PRIMARY KEY (neighborhood_id, cnae, snapshot_date)
);

CREATE TABLE IF NOT EXISTS seo.seasonality (
  vertical_slug  text     NOT NULL REFERENCES seo.vertical(slug),
  uf             char(2)  NOT NULL REFERENCES seo.uf(code),
  month          smallint NOT NULL CHECK (month BETWEEN 1 AND 12),
  trend_index    smallint NOT NULL CHECK (trend_index BETWEEN 0 AND 100),
  source         text     NOT NULL DEFAULT 'google-trends',
  collected_at   date     NOT NULL,
  PRIMARY KEY (vertical_slug, uf, month, collected_at)
);

-- =================================================================
-- FATOS QUENTES (dados próprios do Trila, agregados/anonimizados)
-- =================================================================

CREATE TABLE IF NOT EXISTS seo.service_price_agg (
  vertical_slug  text          NOT NULL REFERENCES seo.vertical(slug),
  city_id        integer       NOT NULL REFERENCES seo.city(id),
  service_type   text          NOT NULL,
  sample_size    integer       NOT NULL CHECK (sample_size >= 5),
  p25            numeric(8,2)  NOT NULL,
  p50            numeric(8,2)  NOT NULL,
  p75            numeric(8,2)  NOT NULL,
  computed_at    timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (vertical_slug, city_id, service_type)
);

CREATE TABLE IF NOT EXISTS seo.ticket_agg (
  vertical_slug  text          NOT NULL REFERENCES seo.vertical(slug),
  city_id        integer       NOT NULL REFERENCES seo.city(id),
  sample_size    integer       NOT NULL CHECK (sample_size >= 5),
  ticket_p50     numeric(10,2) NOT NULL,
  ticket_p25     numeric(10,2) NOT NULL,
  ticket_p75     numeric(10,2) NOT NULL,
  no_show_pct    numeric(5,4),
  computed_at    timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (vertical_slug, city_id)
);

CREATE TABLE IF NOT EXISTS seo.testimonial (
  id             bigint  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  vertical_slug  text    NOT NULL REFERENCES seo.vertical(slug),
  city_id        integer REFERENCES seo.city(id),
  display_name   text    NOT NULL,
  role           text    NOT NULL,
  body           text    NOT NULL,
  rating         smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  consented_at   timestamptz NOT NULL,
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS testimonial_vertical_city_idx
  ON seo.testimonial (vertical_slug, city_id) WHERE active;

-- =================================================================
-- CONTROLE DE MIGRATIONS
-- =================================================================

CREATE TABLE IF NOT EXISTS seo.schema_migrations (
  version     text        PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO seo.schema_migrations (version) VALUES ('V001')
  ON CONFLICT DO NOTHING;
