import '../src/styles/globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '한자로 - 한자 학습 플랫폼',
  description: '한자 학습과 필기 연습을 위한 플랫폼입니다.',
  keywords: '한자, 한자학습, 한문, 필기연습, 한자연습, 학습, 교육',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#3b82f6',
  icons: {
    icon: '/favicon.ico',
  },
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
