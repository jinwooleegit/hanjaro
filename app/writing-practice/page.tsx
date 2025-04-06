'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WritingPractice() {
  const router = useRouter();

  useEffect(() => {
    // PDF 다운로드 페이지로 리디렉션
    router.replace('/pdf-practice');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium">페이지가 이동되었습니다.</h1>
        <p className="mt-2 text-gray-600">PDF 다운로드 페이지로 이동합니다...</p>
      </div>
    </div>
  );
} 