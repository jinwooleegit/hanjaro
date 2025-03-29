import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Metadata } from 'next';
import ThemeProviderWrapper from './theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '한자로(韓字路) - 당신만의 한자 학습 여정',
  description: '개인화된 한자 학습 경험을 제공하는 한자로(韓字路)에서 재미있고 효과적으로 한자를 배워보세요.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
} 