'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // 에러 로깅
    console.error('Page level error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] p-4 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl text-amber-600 font-bold mb-4">페이지에 문제가 발생했습니다</h2>
        <p className="text-gray-600 mb-6">
          {error?.message || '페이지를 로드하는 동안 문제가 발생했습니다. 다시 시도하거나 다른 페이지로 이동하세요.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
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
    </div>
  );
} 