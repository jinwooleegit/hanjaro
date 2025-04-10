'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // 에러 로깅을 여기에 추가할 수 있습니다
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col">
          {/* 헤더 */}
          <header className="bg-indigo-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">한자로</Link>
              <nav>
                <ul className="flex space-x-4">
                  <li><Link href="/" className="hover:underline">홈</Link></li>
                  <li><Link href="/practice" className="hover:underline">학습</Link></li>
                  <li><Link href="/search" className="hover:underline">검색</Link></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* 에러 내용 */}
          <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 className="text-2xl text-red-600 font-bold mb-4">오류가 발생했습니다</h2>
              <p className="text-gray-600 mb-6">
                페이지를 로드하는 동안 문제가 발생했습니다. 다시 시도하거나 홈페이지로 돌아가세요.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => reset()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  다시 시도
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </main>

          {/* 푸터 */}
          <footer className="bg-gray-800 text-white p-4 mt-auto">
            <div className="container mx-auto text-center">
              <p>© 2024 한자로 - 한국어 한자 학습 플랫폼</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 