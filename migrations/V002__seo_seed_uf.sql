-- migrations/V002__seo_seed_uf.sql
INSERT INTO seo.uf (code, name, region, populacao, pib_milhoes) VALUES
  ('AC', 'Acre',               'Norte',        906876,    17840.00),
  ('AL', 'Alagoas',            'Nordeste',     3351543,   52750.00),
  ('AM', 'Amazonas',           'Norte',        4269995,  107640.00),
  ('AP', 'Amapá',              'Norte',         877613,   18060.00),
  ('BA', 'Bahia',              'Nordeste',    14873064,  293610.00),
  ('CE', 'Ceará',              'Nordeste',     9240580,  180780.00),
  ('DF', 'Distrito Federal',   'Centro-Oeste', 3094325,  275200.00),
  ('ES', 'Espírito Santo',     'Sudeste',      4108508,  143020.00),
  ('GO', 'Goiás',              'Centro-Oeste', 7206589,  228870.00),
  ('MA', 'Maranhão',           'Nordeste',     7153262,  101850.00),
  ('MG', 'Minas Gerais',       'Sudeste',     21411923,  701620.00),
  ('MS', 'Mato Grosso do Sul', 'Centro-Oeste', 2879399,  125430.00),
  ('MT', 'Mato Grosso',        'Centro-Oeste', 3658649,  207960.00),
  ('PA', 'Pará',               'Norte',        8777124,  193370.00),
  ('PB', 'Paraíba',            'Nordeste',     4059905,   67530.00),
  ('PE', 'Pernambuco',         'Nordeste',     9674793,  220250.00),
  ('PI', 'Piauí',              'Nordeste',     3289290,   55280.00),
  ('PR', 'Paraná',             'Sul',         11597484,  527150.00),
  ('RJ', 'Rio de Janeiro',     'Sudeste',     17463349,  882810.00),
  ('RN', 'Rio Grande do Norte','Nordeste',     3560903,   72650.00),
  ('RO', 'Rondônia',           'Norte',        1815278,   46400.00),
  ('RR', 'Roraima',            'Norte',         652713,   15780.00),
  ('RS', 'Rio Grande do Sul',  'Sul',         11466630,  530150.00),
  ('SC', 'Santa Catarina',     'Sul',          7786392,  435870.00),
  ('SE', 'Sergipe',            'Nordeste',     2338474,   43980.00),
  ('SP', 'São Paulo',          'Sudeste',     45919049, 2808200.00),
  ('TO', 'Tocantins',          'Norte',        1607363,   44680.00)
ON CONFLICT (code) DO NOTHING;

INSERT INTO seo.schema_migrations (version) VALUES ('V002')
  ON CONFLICT DO NOTHING;
