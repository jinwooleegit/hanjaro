import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import { LoadingSpinner } from '../../components/layout';

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  
  // 설정 상태
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [learningPreferences, setLearningPreferences] = useState({
    dailyGoal: '10',
    reminderTime: '09:00',
    difficulty: 'medium'
  });

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

  // 알림 설정 변경 핸들러
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // 학습 설정 변경 핸들러
  const handleLearningChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLearningPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Head>
        <title>설정 - 한자로(韓字路)</title>
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container-custom max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">설정</h1>
              
              {/* 계정 설정 */}
              <section className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">계정 설정</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이메일</label>
                    <input
                      type="email"
                      disabled
                      value={session?.user?.email || ''}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                      비밀번호 변경
                    </button>
                  </div>
                </div>
              </section>
              
              {/* 테마 설정 */}
              <section className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">테마 설정</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors flex flex-col items-center ${
                      theme === 'light' 
                        ? 'border-primary bg-primary bg-opacity-10' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <svg className="w-8 h-8 text-yellow-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">라이트 모드</span>
                  </div>
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors flex flex-col items-center ${
                      theme === 'dark' 
                        ? 'border-primary bg-primary bg-opacity-10' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <svg className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">다크 모드</span>
                  </div>
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors flex flex-col items-center ${
                      theme === 'system' 
                        ? 'border-primary bg-primary bg-opacity-10' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => setTheme('system')}
                  >
                    <svg className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">시스템 설정</span>
                  </div>
                </div>
              </section>
              
              {/* 알림 설정 */}
              <section className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">알림 설정</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">이메일 알림</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email"
                        checked={notifications.email}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">푸시 알림</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="push"
                        checked={notifications.push}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">SMS 알림</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="sms"
                        checked={notifications.sms}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
              
              {/* 학습 설정 */}
              <section>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">학습 설정</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      일일 학습 목표 (한자 개수)
                    </label>
                    <select
                      name="dailyGoal"
                      value={learningPreferences.dailyGoal}
                      onChange={handleLearningChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="5">5개</option>
                      <option value="10">10개</option>
                      <option value="15">15개</option>
                      <option value="20">20개</option>
                      <option value="30">30개</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      학습 알림 시간
                    </label>
                    <input
                      type="time"
                      name="reminderTime"
                      value={learningPreferences.reminderTime}
                      onChange={handleLearningChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      학습 난이도
                    </label>
                    <select
                      name="difficulty"
                      value={learningPreferences.difficulty}
                      onChange={handleLearningChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="easy">쉬움</option>
                      <option value="medium">보통</option>
                      <option value="hard">어려움</option>
                    </select>
                  </div>
                </div>
              </section>
              
              {/* 저장 버튼 */}
              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                  설정 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 