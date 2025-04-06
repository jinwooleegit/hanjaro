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
    
    // JSON 파일 처리 규칙 업데이트
    config.module.rules.push({
      test: /\.json$/,
      include: [
        /data\/advanced/,
        /data\/basic/,
        /data\/categories/,
        /data\/stroke_data/,
        /data\/strokes/
      ],
      type: 'javascript/auto',
      resolve: {
        fallback: {
          fs: false,
          path: false
        }
      }
    });
    
    // 대용량 JSON 파일 처리
    config.module.rules.push({
      test: /hanja_database_fixed_backup\.json$/,
      loader: 'ignore-loader',
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