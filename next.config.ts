import type { NextConfig } from 'next';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'langspot-learning-studio';
const isPages = process.env.GITHUB_ACTIONS === 'true';
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isPages ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` } : {}),
};
export default config;
