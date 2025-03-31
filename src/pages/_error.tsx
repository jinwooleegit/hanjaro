import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

interface ErrorPageProps {
  statusCode?: number;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>오류 발생 - 한자로(韓字路)</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md w-full space-y-8">
          <div>
            <Link href="/" className="flex justify-center">
              <h1 className="text-4xl font-bold text-primary">한자로</h1>
              <span className="ml-2 text-2xl">(韓字路)</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              {statusCode ? `${statusCode} 오류` : '클라이언트 오류'}
            </h2>
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
              {statusCode
                ? `서버에서 ${statusCode} 오류가 발생했습니다.`
                : '클라이언트에서 오류가 발생했습니다.'}
            </p>
          </div>
          
          <div className="mt-8">
            <Link href="/"
              className="mx-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage; 