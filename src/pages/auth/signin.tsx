import { useState, useEffect } from 'react';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

// 로그인 페이지의 서버 사이드 props
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // NextAuth URL을 확인 (환경 변수의 NEXTAUTH_URL 사용)
    const baseUrl = process.env.NEXTAUTH_URL || `http://${context.req.headers.host}`;
    console.log('NextAuth 베이스 URL:', baseUrl);
    
    // 명시적으로 baseUrl 옵션 지정
    const options = { req: context.req, baseUrl };
    const csrfToken = await getCsrfToken(options);
    const providers = await getProviders();
    
    // 환경 변수 확인을 위한 디버깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('로그인 페이지 초기화');
      console.log('사용 가능한 제공자:', providers ? Object.keys(providers) : 'none');
      console.log('Google 클라이언트 ID 설정 여부:', !!process.env.GOOGLE_CLIENT_ID);
    }
    
    return {
      props: { 
        csrfToken: csrfToken || "", 
        providers: providers || {},
      },
    };
  } catch (error) {
    console.error('getServerSideProps 오류:', error);
    return {
      props: { 
        csrfToken: "", 
        providers: {},
      },
    };
  }
}

export default function SignIn({ csrfToken, providers }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { callbackUrl } = router.query;

  // 이메일/비밀번호 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('로그인 시도:', email);
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: callbackUrl as string || '/',
      });

      console.log('로그인 결과:', result);

      if (result?.error) {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        setIsLoading(false);
      } else if (result?.url) {
        // 로그인 성공, 리디렉션
        router.push(result.url);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      setError('로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>로그인 - 한자로(韓字路)</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="flex justify-center">
              <h1 className="text-4xl font-bold text-primary">한자로</h1>
              <span className="ml-2 text-2xl">(韓字路)</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              계정에 로그인하세요
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              또는{' '}
              <Link href="/auth/register" className="font-medium text-primary hover:text-primary-dark">
                새 계정 만들기
              </Link>
            </p>
          </div>
          
          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* 테스트 계정 정보 */}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
            <p className="font-bold">테스트 계정 정보:</p>
            <p className="text-sm">이메일: test@example.com</p>
            <p className="text-sm">비밀번호: password123</p>
          </div>
          
          {/* 이메일/비밀번호 로그인 폼 */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">이메일 주소</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="이메일 주소"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="비밀번호"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
          
          {/* 소셜 로그인 - 임시 비활성화 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  소셜 로그인
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                소셜 로그인은 현재 설정 중입니다. 나중에 다시 시도해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 