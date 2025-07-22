import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/korean-services-intergration-kit' : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath + '/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
