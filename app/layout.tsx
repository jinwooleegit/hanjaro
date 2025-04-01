import '../src/styles/globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '한자로 - 체계적인 한자 학습 플랫폼',
  description: '한자로는 한자의 의미, 발음, 획순을 쉽고 재미있게 배울 수 있는 플랫폼입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
