export interface CityEntry {
  uf: string;
  city: string;
  slug: string;
  region: string;
  populationLabel: string;
  isCapital: boolean;
  marketNote: string;
}

export const CITIES: CityEntry[] = [
  {
    uf: 'sp',
    city: 'São Paulo',
    slug: 'sao-paulo',
    region: 'Sudeste',
    populationLabel: 'cerca de 12,3 milhões de habitantes',
    isCapital: true,
    marketNote: 'Maior mercado do país, com alta densidade de negócios de beleza e estética.',
  },
  {
    uf: 'rj',
    city: 'Rio de Janeiro',
    slug: 'rio-de-janeiro',
    region: 'Sudeste',
    populationLabel: 'cerca de 6,7 milhões de habitantes',
    isCapital: true,
    marketNote: 'Mercado grande e competitivo, com forte demanda por agenda e recorrência.',
  },
  {
    uf: 'df',
    city: 'Brasília',
    slug: 'brasilia',
    region: 'Centro-Oeste',
    populationLabel: 'cerca de 3,0 milhões de habitantes',
    isCapital: true,
    marketNote: 'Operação com ticket médio mais alto e expectativa de experiência premium.',
  },
  {
    uf: 'mg',
    city: 'Belo Horizonte',
    slug: 'belo-horizonte',
    region: 'Sudeste',
    populationLabel: 'cerca de 2,7 milhões de habitantes',
    isCapital: true,
    marketNote: 'Base urbana forte para salões, clínicas e operações multi-serviço.',
  },
  {
    uf: 'ba',
    city: 'Salvador',
    slug: 'salvador',
    region: 'Nordeste',
    populationLabel: 'cerca de 2,9 milhões de habitantes',
    isCapital: true,
    marketNote: 'Mercado com forte potencial para recorrência e aquisição local.',
  },
  {
    uf: 'ce',
    city: 'Fortaleza',
    slug: 'fortaleza',
    region: 'Nordeste',
    populationLabel: 'cerca de 2,6 milhões de habitantes',
    isCapital: true,
    marketNote: 'Cidade com operação intensa e demanda consistente por agenda organizada.',
  },
  {
    uf: 'pe',
    city: 'Recife',
    slug: 'recife',
    region: 'Nordeste',
    populationLabel: 'cerca de 1,7 milhão de habitantes',
    isCapital: true,
    marketNote: 'Mercado forte para clínicas, spas e operações com fluxo recorrente.',
  },
  {
    uf: 'pr',
    city: 'Curitiba',
    slug: 'curitiba',
    region: 'Sul',
    populationLabel: 'cerca de 1,8 milhão de habitantes',
    isCapital: true,
    marketNote: 'Ambiente urbano maduro para posicionamento mais sofisticado.',
  },
  {
    uf: 'am',
    city: 'Manaus',
    slug: 'manaus',
    region: 'Norte',
    populationLabel: 'cerca de 2,2 milhões de habitantes',
    isCapital: true,
    marketNote: 'Cidade grande com oportunidade para padronização operacional.',
  },
  {
    uf: 'go',
    city: 'Goiânia',
    slug: 'goiania',
    region: 'Centro-Oeste',
    populationLabel: 'cerca de 1,5 milhão de habitantes',
    isCapital: true,
    marketNote: 'Mercado relevante para salão, estética e barbearia com foco em recorrência.',
  },
  {
    uf: 'rs',
    city: 'Porto Alegre',
    slug: 'porto-alegre',
    region: 'Sul',
    populationLabel: 'cerca de 1,3 milhão de habitantes',
    isCapital: true,
    marketNote: 'Base urbana sólida para posicionamento e oferta de valor mais clara.',
  },
  {
    uf: 'sc',
    city: 'Florianópolis',
    slug: 'florianopolis',
    region: 'Sul',
    populationLabel: 'cerca de 500 mil habitantes',
    isCapital: true,
    marketNote: 'Mercado menor, porém com forte aderência a marcas premium.',
  },
];

export function getCityEntry(uf: string, city: string) {
  return CITIES.find((entry) => entry.uf === uf && entry.slug === city);
}
