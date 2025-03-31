import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const router = useRouter();
  const { asPath } = router;

  // 페이지 접근 로깅
  useEffect(() => {
    const logError = async () => {
      console.log(`404 에러: 존재하지 않는 경로 "${asPath}"에 접근 시도`);
      
      try {
        // API 엔드포인트를 통한 서버 측 로깅
        await fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: asPath,
            errorType: '404',
            message: `존재하지 않는 경로에 접근: ${asPath}`,
          }),
        });
      } catch (error) {
        console.error('오류 로깅 실패:', error);
      }
    };
    
    if (asPath) {
      logError();
    }
  }, [asPath]);

  return (
    <>
      <Head>
        <title>페이지를 찾을 수 없음 - 한자로(韓字路)</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md w-full space-y-8">
          <div>
            <Link href="/" className="flex justify-center">
              <h1 className="text-4xl font-bold text-primary">한자로</h1>
              <span className="ml-2 text-2xl">(韓字路)</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              404
            </h2>
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
              페이지를 찾을 수 없습니다
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              요청하신 주소 <code className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">{asPath}</code>에 해당하는 페이지가 존재하지 않습니다.
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => router.back()}
              className="mx-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              이전 페이지로 돌아가기
            </button>
            <Link href="/"
              className="mx-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 