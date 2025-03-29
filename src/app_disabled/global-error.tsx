'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 개발용 콘솔에 에러 로그 출력
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            심각한 오류가 발생했습니다
          </h1>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            애플리케이션에 문제가 발생했습니다.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 mr-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </body>
    </html>
  );
} 