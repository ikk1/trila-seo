-- migrations/V004__seo_seed_cities.sql
INSERT INTO seo.city (id, uf, name, slug, capital, populacao, lat, lon) VALUES
  (3550308, 'SP', 'São Paulo', 'sao-paulo', true, 12325000, -23.682400, -46.595650),
  (3304557, 'RJ', 'Rio de Janeiro', 'rio-de-janeiro', true, 6748000, -22.914200, -43.448950),
  (5300108, 'DF', 'Brasília', 'brasilia', true, 3055149, -15.775900, -47.797050),
  (3106200, 'MG', 'Belo Horizonte', 'belo-horizonte', true, 2315560, -19.918100, -43.960250),
  (2927408, 'BA', 'Salvador', 'salvador', true, 2861953, -12.875450, -38.501800),
  (2304400, 'CE', 'Fortaleza', 'fortaleza', true, 2686612, -3.793300, -38.519650),
  (2611606, 'PE', 'Recife', 'recife', true, 1653461, -8.042150, -34.937850),
  (4106902, 'PR', 'Curitiba', 'curitiba', true, 1963726, -25.495250, -49.287250),
  (1302603, 'AM', 'Manaus', 'manaus', true, 2255903, -2.573250, -59.981300),
  (5208707, 'GO', 'Goiânia', 'goiania', true, 1500000, -16.642850, -49.262450),
  (4314902, 'RS', 'Porto Alegre', 'porto-alegre', true, 1332570, -30.100750, -51.157550),
  (4205407, 'SC', 'Florianópolis', 'florianopolis', true, 508826, -27.558200, -48.470700)
ON CONFLICT (id) DO UPDATE SET
  uf = EXCLUDED.uf,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  capital = EXCLUDED.capital,
  populacao = EXCLUDED.populacao,
  lat = EXCLUDED.lat,
  lon = EXCLUDED.lon,
  updated_at = now();

INSERT INTO seo.schema_migrations (version) VALUES ('V004') ON CONFLICT DO NOTHING;
