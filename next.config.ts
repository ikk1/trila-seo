import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/sistema-para-:vertical',
        destination: '/sistema-para/:vertical',
      },
    ];
  },
  async redirects() {
    return [
      { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap/0', destination: '/sitemaps/core.xml', permanent: true },
      // pares cidade×vertical e cidades-hub antigos -> locais
      { source: '/sitemap/:id(\\d+)', destination: '/sitemaps/locais.xml', permanent: true },
    ];
  },
};

export default nextConfig;
