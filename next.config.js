/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  onDemandEntries: {
    maxInactiveAge: 120 * 1000,
    pagesBufferLength: 10,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false;
    }
    
    // Add a rule to exclude large JSON files from bundling
    config.module.rules.push({
      test: /hanja_database_fixed_backup\.json$/,
      loader: 'ignore-loader', // Change to ignore-loader
      include: /data/,
    });
    
    return config;
  },
  output: 'standalone',
  distDir: '.next-custom',
  experimental: {
    cpus: 1,
    workerThreads: false,
    serverComponentsExternalPackages: ['mongoose'],
    optimizeCss: true,
    optimizeServerReact: true,
    isrMemoryCacheSize: 0,
    swcFileReading: false,
  },
  generateEtags: false,
  swcMinify: true,
  trailingSlash: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
    localeDetection: false,
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 