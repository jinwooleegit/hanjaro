import '../src/styles/globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | 한자로',
    default: '한자로 - 한자 학습 서비스',
  },
  description: '쉽고 재미있게 한자를 배울 수 있는 한자 학습 서비스입니다.',
  keywords: '한자, 한자학습, 한문, 필기연습, 한자연습, 학습, 교육',
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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '한자로 - 한자 학습 서비스',
      },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
