import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { LoadingSpinner } from '../../components/layout';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  // 클라이언트 사이드에서만 리디렉션하도록 useEffect 사용
  useEffect(() => {
    if (status === 'loading') {
      // 세션 정보를 아직 불러오는 중이므로 기다립니다
      return;
    }
    
    if (status === 'unauthenticated') {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(router.asPath));
    } else {
      // 인증되었으면 로딩 상태 해제
      setIsLoading(false);
    }
  }, [status, router]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 UI 표시
  if (isLoading || status !== 'authenticated') {
    return <LoadingSpinner fullScreen size="large" />;
  }

  return (
    <>
      <Head>
        <title>내 프로필 - 한자로(韓字路)</title>
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container-custom">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* 프로필 헤더 */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user?.name || '사용자'}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800">
                      {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 사용자 정보 */}
            <div className="pt-20 px-8 pb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{session?.user?.name || '이름 없음'}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{session?.user?.email || '이메일 없음'}</p>
              
              <div className="mt-6 flex space-x-2">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                  프로필 편집
                </button>
                <Link href="/settings" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  설정
                </Link>
              </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'profile' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  프로필 정보
                </button>
                <button 
                  onClick={() => setActiveTab('learning')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'learning' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  학습 현황
                </button>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'achievements' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  업적
                </button>
              </div>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">소개</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      아직 소개글이 없습니다. 프로필을 편집하여 소개글을 추가해보세요.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">기본 정보</h3>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">이름</span>
                        <span className="block mt-1 text-gray-900 dark:text-white">{session?.user?.name || '이름 없음'}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">이메일</span>
                        <span className="block mt-1 text-gray-900 dark:text-white">{session?.user?.email || '이메일 없음'}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">가입일</span>
                        <span className="block mt-1 text-gray-900 dark:text-white">2023년 7월 15일</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">인증 방식</span>
                        <span className="block mt-1 text-gray-900 dark:text-white">
                          {session?.user?.image?.includes('google') ? 'Google' : 
                            session?.user?.image?.includes('github') ? 'GitHub' : 
                            session?.user?.image?.includes('kakao') ? 'Kakao' : '이메일/비밀번호'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">학습 통계</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">학습한 한자</span>
                        <span className="block mt-1 text-2xl font-semibold text-gray-900 dark:text-white">0</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">연속 학습일</span>
                        <span className="block mt-1 text-2xl font-semibold text-gray-900 dark:text-white">0일</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">총 학습 시간</span>
                        <span className="block mt-1 text-2xl font-semibold text-gray-900 dark:text-white">0시간</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">최근 학습 기록</h3>
                    <div className="mt-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
                          아직 학습 기록이 없습니다. 지금 바로 학습을 시작해보세요!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">획득한 배지</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center opacity-30">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <span className="block mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">잠겨 있음</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">최근 달성</h3>
                    <div className="mt-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
                          아직 달성한 업적이 없습니다. 도전을 계속하세요!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 