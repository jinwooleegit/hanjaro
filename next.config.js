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
  experimental: {
    // 최소한의 실험적 기능만 유지
    cpus: 4,
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