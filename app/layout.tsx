import '../styles/globals.css'
import '../public/css/icon-sprites.css'
import { Inter, Noto_Serif_KR } from 'next/font/google'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { Metadata } from 'next'

// 폰트 최적화 - preload 적용
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 폰트 로딩 중에도 텍스트 표시
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'], // 폰트 로딩 실패 시 폴백
  adjustFontFallback: true, // 글꼴 대체 최적화
})

// 한자 표시를 위한 명조체 폰트
const notoSerifKR = Noto_Serif_KR({
  weight: ['400', '700'],  // Regular와 Bold만 사용하여 로딩 시간 단축
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-serif-kr',
  fallback: ['Batang', 'serif'],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: {
    template: '%s | 한자로',
    default: '한자로 - 한자 학습 서비스',
  },
  description: '쉽고 재미있게 한자를 배울 수 있는 한자 학습 서비스입니다.',
  keywords: '한자, 한자학습, 한문, 필기연습, 한자연습, 학습, 교육',
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hanjaro.com',
    title: '한자로 - 한자 학습 서비스',
    description: '쉽고 재미있게 한자를 배울 수 있는 한자 학습 서비스입니다.',
    siteName: '한자로',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // 사용자 확대 허용
  minimumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.className} ${notoSerifKR.variable}`}>
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Navigation을 배치 */}
          <Navigation />
          {/* 메인 콘텐츠 */}
          <main className="pt-4 flex-grow">{children}</main>
          {/* 푸터 추가 */}
          <Footer />
        </div>
      </body>
    </html>
  )
}
