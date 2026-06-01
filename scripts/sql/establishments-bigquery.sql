-- Estabelecimentos ativos por município × CNAE (6 CNAEs de beleza/estética),
-- com crescimento de 12 meses. Fonte: Base dos Dados, dataset br_me_cnpj (RFB/CNPJ).
--
-- Rodar no BigQuery e exportar o resultado como JSON para scripts/data/establishments.json
-- (no console: Save Results -> JSON local; ou via bq query --format=prettyjson).
--
-- Confirmado em 2026-06-01 contra `basedosdados.br_me_cnpj.estabelecimentos`:
--   - A tabela empilha MÚLTIPLOS snapshots na coluna de partição `data` (~mensal).
--     Filtre o snapshot mais recente, senão a contagem infla ~60x.
--   - situacao_cadastral: '2' = ativa, '8' = baixada (SEM zero à esquerda).
--   - cnae_fiscal_principal é string ('9602501' etc.); id_municipio = IBGE 7 dígitos.
--   - A janela de 12 meses usa a própria `data` do snapshot como referência.
--   - Anote a data do snapshot (ex.: 2025-11-09) para passar em --snapshot na ingestão.
SELECT
  id_municipio,
  cnae_fiscal_principal AS cnae,
  COUNTIF(situacao_cadastral = '2') AS total_ativos,
  COUNTIF(
    situacao_cadastral = '2'
    AND data_inicio_atividade >= DATE_SUB(data, INTERVAL 12 MONTH)
  ) AS abertos_12m,
  COUNTIF(
    situacao_cadastral = '8'
    AND data_situacao_cadastral >= DATE_SUB(data, INTERVAL 12 MONTH)
  ) AS fechados_12m
FROM `basedosdados.br_me_cnpj.estabelecimentos`
WHERE data = (SELECT MAX(data) FROM `basedosdados.br_me_cnpj.estabelecimentos`)
  AND cnae_fiscal_principal IN (
    '9602501', '9602502', '9602503', '8690901', '8690999', '9609299'
  )
GROUP BY id_municipio, cnae
HAVING total_ativos > 0;
