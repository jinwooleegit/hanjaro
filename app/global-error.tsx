'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 에러를 로깅할 수 있습니다.
    console.error('글로벌 에러 발생:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center m-4">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-3">심각한 오류 발생</h1>
            
            <p className="text-gray-600 mb-6">
              애플리케이션에 심각한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              {error.digest && (
                <span className="block mt-2 text-sm text-gray-500">
                  오류 코드: {error.digest}
                </span>
              )}
            </p>
            
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 