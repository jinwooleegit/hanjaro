import { NextPageContext } from 'next/types';
import React from 'react';

interface ErrorProps {
  statusCode: number;
}

const Error = ({ statusCode }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">
        {statusCode
          ? `${statusCode} - 서버 오류가 발생했습니다`
          : '클라이언트 오류가 발생했습니다'}
      </h1>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
        페이지를 표시하는 동안 문제가 발생했습니다.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default Error; 