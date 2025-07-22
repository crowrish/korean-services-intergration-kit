import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/korean-services-intergration-kit',
  assetPrefix: '/korean-services-intergration-kit/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
