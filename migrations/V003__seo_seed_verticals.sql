-- migrations/V003__seo_seed_verticals.sql
INSERT INTO seo.vertical
  (slug, singular, plural_estabelecimentos, plural_profissionais, cnaes, artigo, active, priority)
VALUES
  (
    'salao-de-beleza',
    'salão de beleza',
    'salões de beleza',
    'profissionais de beleza',
    ARRAY['9602501'],
    'o', true, 1
  ),
  (
    'barbearia',
    'barbearia',
    'barbearias',
    'barbeiros',
    ARRAY['9602503'],
    'a', true, 1
  ),
  (
    'clinica-de-estetica',
    'clínica de estética',
    'clínicas de estética',
    'esteticistas',
    ARRAY['8690901','8690999'],
    'a', true, 1
  ),
  (
    'spa',
    'spa',
    'spas',
    'terapeutas',
    ARRAY['9609299'],
    'o', true, 2
  ),
  (
    'manicure',
    'espaço de manicure',
    'espaços de manicure',
    'manicures e pedicures',
    ARRAY['9602502'],
    'o', true, 2
  ),
  (
    'nail-designer',
    'nail studio',
    'nail studios',
    'nail designers',
    ARRAY['9602502'],
    'o', true, 3
  ),
  (
    'centro-de-beleza',
    'centro de beleza',
    'centros de beleza',
    'profissionais de beleza',
    ARRAY['9602501','9602503'],
    'o', true, 3
  ),
  (
    'esteticista',
    'espaço de estética',
    'espaços de estética',
    'esteticistas autônomos',
    ARRAY['8690901'],
    'o', true, 3
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO seo.schema_migrations (version) VALUES ('V003')
  ON CONFLICT DO NOTHING;
