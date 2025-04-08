/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  reactStrictMode: true,
  // output: 'export', // 이 부분을 주석 처리 (Vercel 배포시에는 필요하지 않음)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // 이미지 최적화 설정 강화
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  onDemandEntries: {
    maxInactiveAge: 120 * 1000,
    pagesBufferLength: 10,
  },
  webpack: (config, { dev, isServer }) => {
    // 개발 모드에서 캐시 활성화 (성능 향상)
    if (!dev) {
      // 프로덕션 모드에서만 캐시 최적화
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // 라이브러리 코드를 별도 청크로 분리
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              chunks: 'all',
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // 노드 모듈 경로에서 패키지 이름 가져오기
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `lib.${packageName.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            hanziwriter: {
              name: 'hanziwriter',
              test: /[\\/]node_modules[\\/]hanzi-writer[\\/]/,
              priority: 50,
              chunks: 'all',
            },
            // JSON 데이터는 별도의 청크로 관리
            data: {
              name: 'data',
              test: /[\\/]data[\\/]/,
              priority: 20,
              minChunks: 1,
              reuseExistingChunk: true,
            },
          },
        },
      };
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
    
    // 문제 파일은 제외 처리
    config.module.rules.push({
      test: /empty\.json$/,
      type: 'javascript/auto',
      use: ['ignore-loader']
    });
    
    // JSON 파일을 위한 경로 별칭 추가
    config.resolve.alias = {
      ...config.resolve.alias,
      '/data': require('path').resolve('./data')
    };
    
    // fs 및 path 모듈을 위한 폴리필 설정 추가
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
  experimental: {
    cpus: 4, // 더 많은 CPU 코어 사용
    workerThreads: true, // 워커 스레드 활성화
    serverComponentsExternalPackages: ['mongoose', 'fs', 'path'],
    optimizeCss: true,
    optimizeServerReact: true,
    turbotrace: {
      // turbotrace 성능 최적화
      logLevel: 'error',
      contextDirectory: '.',
      processCwd: '.',
    },
    // 동적 임포트 최적화
    optimizePackageImports: [
      'react-icons',
      'hanzi-writer',
      'tailwindcss'
    ],
  },
  generateEtags: false,
  swcMinify: true, // SWC 미니파이 사용
  trailingSlash: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // 캐시 기간 연장
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          // 보안 및 성능 관련 헤더 추가
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          }
        ],
      },
      // 정적 파일에 대한 특별 캐싱 규칙
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JSON 데이터 파일에 대한 캐싱 규칙
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 