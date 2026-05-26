export interface FooterCity {
  city: string;
  uf: string;
  slug: string;
}

export const FOOTER_CITIES: FooterCity[] = [
  { city: 'São Paulo',       uf: 'sp', slug: 'sao-paulo'       },
  { city: 'Rio de Janeiro',  uf: 'rj', slug: 'rio-de-janeiro'  },
  { city: 'Belo Horizonte',  uf: 'mg', slug: 'belo-horizonte'  },
  { city: 'Curitiba',        uf: 'pr', slug: 'curitiba'        },
  { city: 'Salvador',        uf: 'ba', slug: 'salvador'        },
];
