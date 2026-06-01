-- Estabelecimentos ativos por município × CNAE (6 CNAEs de beleza/estética),
-- com crescimento de 12 meses. Fonte: Base dos Dados, dataset RFB do CNPJ.
--
-- Rodar no BigQuery e exportar JSON, ex.:
--   bq query --use_legacy_sql=false --format=prettyjson --max_rows=1000000 \
--     "$(cat scripts/sql/establishments-bigquery.sql)" > scripts/data/establishments.json
--
-- IMPORTANTE: confirmar nomes de tabela/coluna e códigos de situação contra o
-- schema atual da Base dos Dados antes de rodar (podem mudar de versão):
--   - tabela: `basedosdados.br_rf_cnpj.estabelecimentos`
--   - id_municipio (IBGE 7 dígitos), cnae_fiscal_principal
--   - situacao_cadastral: '02' = ativa, '08' = baixada
--   - data_inicio_atividade, data_situacao_cadastral
SELECT
  id_municipio,
  cnae_fiscal_principal AS cnae,
  COUNTIF(situacao_cadastral = '02') AS total_ativos,
  COUNTIF(
    situacao_cadastral = '02'
    AND data_inicio_atividade >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
  ) AS abertos_12m,
  COUNTIF(
    situacao_cadastral = '08'
    AND data_situacao_cadastral >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
  ) AS fechados_12m
FROM `basedosdados.br_rf_cnpj.estabelecimentos`
WHERE cnae_fiscal_principal IN (
  '9602501', '9602502', '9602503', '8690901', '8690999', '9609299'
)
GROUP BY id_municipio, cnae
HAVING total_ativos > 0;
