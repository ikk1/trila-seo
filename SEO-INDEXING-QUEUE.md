# Fila de "Request Indexing" no GSC — trila.app.br

Propriedade: `sc-domain:trila.app.br` (conta junior.htconex@gmail.com)
Sitemap: `https://trila.app.br/sitemap.xml` — índice nomeado (core/verticais/locais). Submetido no GSC em 2026-06-18.
Cota: ~10–12 solicitações/dia por propriedade. Reenviar a mesma URL não muda a posição na fila.

## Reestruturação de sitemaps — 2026-06-18 (PR trila-seo#5, mergeado + deploy)
Entry point agora é `/sitemap.xml` (era `/sitemap-index.xml`). Filhos nomeados por tipo:
`/sitemaps/core.xml` (4 URLs, inclui `/inteligencia-artificial` que estava órfã),
`/sitemaps/verticais.xml` (8), `/sitemaps/locais.xml` (~2.151; auto-pagina em `locais-N.xml` acima de 45k).
URLs antigas (`/sitemap-index.xml`, `/sitemap/0,1,2`) → 301/308 para os novos nomes.
`lastmod` estável (constante `SITEMAP_LASTMOD`); `robots.ts` e `llms.txt` apontam `/sitemap.xml`.
Pendente: desligar bloqueio de bots de IA no painel Cloudflare (sobrescreve o robots.txt do app).

### Diagnóstico de indexação — snapshot GSC (relatório "Páginas", última atualização 6/11/26)
- **Indexed: 282**
- **Discovered – currently not indexed: 10.368** ← gargalo dominante
- Excluded by 'noindex' tag: 113 (esperado — noindex inteligente do template)
- Not found (404): 5 · Crawled – not indexed: 2 · Page with redirect: 1
Leitura: o gargalo é **conteúdo raso** em páginas programáticas (cidade×vertical), não higiene de
sitemap (já corrigida). Próximo degrau de indexação = conteúdo editorial (blog/conteúdo, adiado) ou
podar/enriquecer as programáticas com dado local único. Reavaliar o relatório após o Google
reprocessar o `/sitemap.xml` novo (dias).

## Leva 1 — solicitada em 2026-06-01 ✅ (10/10)
- /sp/sao-paulo
- /planos
- /cidades
- /inteligencia-artificial
- /sistema-para-salao-de-beleza
- /sistema-para-barbearia
- /sistema-para-clinica-de-estetica
- /rj/rio-de-janeiro
- /df/brasilia
- /mg/belo-horizonte

## Correção estrutural — 2026-06-10 ✅
Sitemap reduzido de ~61k para ~2,5k URLs (só cidades >=100k hab ou capital, alinhado ao
noindex do template). Causa do gargalo: 50k+ URLs órfãs em "Discovered - currently not
indexed". PRs trila-seo#3 e #4 (mergeados + deploy). Sitemap reenviado no GSC em 2026-06-10.
Limiar único: `CITY_INDEX_POPULATION_THRESHOLD` (lib/city-pages.ts).

## Leva 2 — solicitada em 2026-06-10 ✅ (10/10)
Verticais restantes + capitais grandes (todas validadas com HTTP 200):
- https://trila.app.br/sistema-para-spa
- https://trila.app.br/sistema-para-manicure
- https://trila.app.br/sistema-para-nail-designer
- https://trila.app.br/sistema-para-centro-de-beleza
- https://trila.app.br/sistema-para-esteticista
- https://trila.app.br/pr/curitiba
- https://trila.app.br/rs/porto-alegre
- https://trila.app.br/ce/fortaleza
- https://trila.app.br/pe/recife
- https://trila.app.br/go/goiania

## Como solicitar (passo a passo no GSC, sessão logada no navegador)
1. Abrir GSC → caixa "Inspect any URL in trila.app.br" (topo).
2. Colar a URL → Enter → aguardar resultado ("URL is not on Google").
3. Clicar em "Request indexing" → roda teste ao vivo (~1 min) → confirma "added to a priority crawl queue".
4. Dismiss e repetir.

> Requer a sessão interativa do Chrome logada no Google (chrome-devtools MCP).
> Um agente headless/remoto NÃO acessa o GSC autenticado — só dá pra checar indexação pública (`site:`).

## Próximas levas (backlog sugerido)
Capitais: ba/salvador, am/manaus, pa/belem, pr/londrina, sc/florianopolis, es/vitoria,
ma/sao-luis, mt/cuiaba, ms/campo-grande, pi/teresina, rn/natal, pb/joao-pessoa, al/maceio.
Páginas `[uf]/[city]/[vertical]` das maiores cidades (ex.: /sp/sao-paulo/barbearia).
