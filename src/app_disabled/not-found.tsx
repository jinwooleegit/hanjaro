import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
} 