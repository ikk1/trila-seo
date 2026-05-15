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
};

export default nextConfig;
