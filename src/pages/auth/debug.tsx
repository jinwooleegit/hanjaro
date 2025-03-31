import { useState, useEffect } from 'react';
import { useSession, getProviders } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthDebug() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<{ [key: string]: boolean }>({});
  
  // 제공자 목록 가져오기
  useEffect(() => {
    async function fetchProviders() {
      const providers = await getProviders();
      setProviders(providers);
    }
    fetchProviders();
  }, []);

  // 환경 변수 상태 확인 (API 호출)
  useEffect(() => {
    async function checkEnvStatus() {
      try {
        const res = await fetch('/api/auth/check-env');
        const data = await res.json();
        setEnvStatus(data.env || {});
      } catch (error) {
        console.error('환경 변수 확인 중 오류 발생:', error);
      }
    }
    checkEnvStatus();
  }, []);

  return (
    <>
      <Head>
        <title>인증 디버그 - 한자로(韓字路)</title>
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="flex justify-center">
              <h1 className="text-4xl font-bold text-primary">한자로</h1>
              <span className="ml-2 text-2xl">(韓字路)</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              인증 시스템 디버그
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              이 페이지는 NextAuth.js 설정 문제를 디버그하는 데 도움이 됩니다.
            </p>
          </div>

          <div className="space-y-8">
            {/* 세션 상태 */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">세션 상태</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  현재 사용자 세션 정보
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">상태</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {status === 'authenticated' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          인증됨
                        </span>
                      ) : status === 'loading' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          로딩 중
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          인증되지 않음
                        </span>
                      )}
                    </dd>
                  </div>
                  {session && (
                    <>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">사용자 ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{session.user?.id || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">이름</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{session.user?.name || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">이메일</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{session.user?.email || '-'}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">세션 데이터</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <pre className="p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
                            {JSON.stringify(session, null, 2)}
                          </pre>
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>

            {/* 공급자 목록 */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">인증 공급자</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  구성된 NextAuth.js 공급자 목록
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                {providers ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.values(providers).map((provider: any) => (
                      <li key={provider.id} className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white">
                            {provider.id.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">유형: {provider.type}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">공급자 정보를 불러오는 중...</p>
                )}
              </div>
            </div>

            {/* 환경 변수 상태 */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">환경 변수 상태</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  필요한 NextAuth.js 환경 변수 구성 상태
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {Object.entries(envStatus).length > 0 ? (
                    Object.entries(envStatus).map(([key, value]) => (
                      <div key={key} className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {value ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              설정됨
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              설정되지 않음
                            </span>
                          )}
                        </dd>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 dark:text-gray-400">환경 변수 상태를 확인하는 중...</p>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            {/* 문제 해결 안내 */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">문제 해결 안내</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  로그인 문제 해결을 위한 정보
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">1. 환경 변수 설정</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <code className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-900">
                      npm run setup-auth
                    </code> 스크립트를 실행하여 필요한 환경 변수를 설정하세요.
                  </p>
                  
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">2. Google OAuth 설정</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Google Cloud Console(https://console.cloud.google.com/)에 로그인합니다.</li>
                    <li>프로젝트를 선택하거나 새 프로젝트를 생성합니다.</li>
                    <li>&quot;API 및 서비스&quot; &gt; &quot;사용자 인증 정보&quot;로 이동합니다.</li>
                    <li>&quot;OAuth 동의 화면&quot;을 설정합니다.</li>
                    <li>&quot;사용자 인증 정보 만들기&quot; &gt; &quot;OAuth 클라이언트 ID&quot;를 클릭합니다.</li>
                    <li>애플리케이션 유형으로 &quot;웹 애플리케이션&quot;을 선택합니다.</li>
                    <li>&quot;승인된 자바스크립트 원본&quot;에 <code className="px-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-900">http://localhost:3000</code>을 추가합니다.</li>
                    <li>&quot;승인된 리디렉션 URI&quot;에 <code className="px-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-900">http://localhost:3000/api/auth/callback/google</code>을 추가합니다.</li>
                    <li>&quot;만들기&quot;를 클릭한 후 생성된 클라이언트 ID와 시크릿을 <code className="px-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-900">.env.local</code> 파일에 추가합니다.</li>
                  </ol>

                  <h4 className="text-md font-medium text-gray-900 dark:text-white">3. 서버 재시작</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    환경 변수를 수정한 후에는 반드시 서버를 재시작해야 합니다. <code className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-900">Ctrl+C</code>로 서버를 중지하고 <code className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-900">npm run dev</code>로 다시 시작하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 링크 */}
            <div className="flex justify-center space-x-4">
              <Link href="/auth/signin" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                로그인 페이지로 돌아가기
              </Link>
              <Link href="/" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 