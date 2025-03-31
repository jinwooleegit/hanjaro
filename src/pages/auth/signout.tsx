import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시 자동으로 로그아웃 처리
    const performSignOut = async () => {
      await signOut({ redirect: false });
      router.push('/');
    };
    
    performSignOut();
  }, [router]);

  return (
    <>
      <Head>
        <title>로그아웃 - 한자로(韓字路)</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">로그아웃 중...</h1>
          <p className="text-gray-600 dark:text-gray-400">잠시만 기다려주세요. 메인 페이지로 이동합니다.</p>
          <div className="mt-8">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
} 