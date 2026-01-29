import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js v16 removed the `eslint` config option from next.config.
  // If you need to ignore ESLint during build, run the CLI with the
  // `--no-lint` flag or configure ESLint separately.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ntrdd.mlsmatrix.com',
        pathname: '/mediaserver/**',
      },
      {
        protocol: 'https',
        hostname: '*.mlsmatrix.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
