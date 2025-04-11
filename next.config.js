/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 이미지 요청 중 오류가 발생할 경우 기본 이미지로 폴백
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 개발 서버 안정성 향상을 위한 설정
  onDemandEntries: {
    // 서버 측 렌더링된 페이지를 캐시에 보관할 시간(초)
    maxInactiveAge: 60 * 60 * 1000,
    // 한 번에 메모리에 유지할 페이지 수
    pagesBufferLength: 5,
  },
  experimental: {
    // 최소한의 실험적 기능만 유지
    cpus: 4,
    // 더 많은 메모리 할당
    isrMemoryCacheSize: 50 * 1024 * 1024, // 50MB
    // 서버 구성요소 에러 처리 개선
    serverComponentsExternalPackages: [],
    // 오류 발생 시 서버 복구 시도
    externalDir: true,
  },
  // 미들웨어에서 SVG 파일이 없을 때 기본 SVG 제공
  async rewrites() {
    return [
      {
        source: '/images/hanja/:hanja.svg',
        destination: '/api/hanja-fallback?hanja=:hanja',
        has: [
          {
            type: 'header',
            key: 'x-custom-check',
            value: '(?<check>.*)',
          }
        ],
      }
    ];
  }
}

module.exports = nextConfig 