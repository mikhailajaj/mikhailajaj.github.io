import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // required for static export
  },
  turbopack: {
    root: __dirname,
  },
  // basePath is empty — this site deploys to the root of mikhailajaj.github.io
  // If testing in a subdirectory (e.g. /portfolio-v2), temporarily set:
  // basePath: '/portfolio-v2',
  trailingSlash: true,
};

export default nextConfig;
