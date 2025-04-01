import Link from 'next/link';
import { getServerSession } from 'next-auth';

export default async function Home() {
  // 간단한 세션 확인 (authOptions 없이)
  const session = await getServerSession();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 pt-8">
      <div className="max-w-5xl w-full flex flex-col gap-8">
        <section className="text-center">
          <h1 className="text-5xl font-bold mb-5">한자로</h1>
          <p className="text-xl text-gray-600">
            체계적인 한자 학습 플랫폼
          </p>
        </section>
        
        <section className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-center">한자 학습의 새로운 시작</h2>
          <p className="text-center text-gray-600">
            한자로는 한자의 의미, 발음, 획순을 쉽고 재미있게 배울 수 있는 플랫폼입니다.<br />
            체계적인 학습 경로와 다양한 연습 기능으로 한자 실력을 향상시키세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Link 
              href="/learn" 
              className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg text-center transition-colors"
            >
              <div className="text-4xl mb-3">學</div>
              <h3 className="font-semibold mb-2">한자 학습</h3>
              <p className="text-sm text-gray-600">
                획순, 의미, 예문까지 한자의 모든 것을 배워보세요.
              </p>
            </Link>
            
            <Link 
              href="/practice" 
              className="bg-green-100 hover:bg-green-200 p-6 rounded-lg text-center transition-colors"
            >
              <div className="text-4xl mb-3">習</div>
              <h3 className="font-semibold mb-2">필기 연습</h3>
              <p className="text-sm text-gray-600">
                직접 한자를 써보며 획순을 익히고 평가받으세요.
              </p>
            </Link>
            
            <Link 
              href="/quiz" 
              className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg text-center transition-colors"
            >
              <div className="text-4xl mb-3">試</div>
              <h3 className="font-semibold mb-2">한자 퀴즈</h3>
              <p className="text-sm text-gray-600">
                다양한 유형의 퀴즈로 한자 실력을 테스트하세요.
              </p>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg text-center transition-colors"
            >
              <div className="text-4xl mb-3">統</div>
              <h3 className="font-semibold mb-2">학습 대시보드</h3>
              <p className="text-sm text-gray-600">
                학습 진행 상황을 한눈에 확인하고 관리하세요.
              </p>
            </Link>
          </div>
        </section>
        
        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">추천 한자</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
            {['人', '永', '水', '火', '山', '木', '日'].map(char => (
              <Link 
                key={char}
                href={`/learn?char=${char}`}
                className="border rounded-lg p-4 text-center hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-2">{char}</div>
              </Link>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/learn">
              <button className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition">
                더 많은 한자 학습하기
              </button>
            </Link>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">한자 학습 팁</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li>획순을 정확히 익히는 것이 중요합니다.</li>
              <li>한자의 부수를 파악하면 의미 이해에 도움이 됩니다.</li>
              <li>매일 조금씩 꾸준히 학습하는 것이 효과적입니다.</li>
              <li>유사한 한자들을 그룹으로 학습하세요.</li>
              <li>실생활에서 한자를 찾아보며 활용해 보세요.</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">계정 상태</h2>
            {session ? (
              <div>
                <p className="mb-4">
                  <span className="font-semibold">{session.user?.name}</span>님, 환영합니다!
                </p>
                <Link href="/dashboard">
                  <button className="w-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition">
                    내 학습 현황 보기
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="mb-4">로그인하여 학습 진행 상황을 저장하고 더 많은 기능을 이용하세요.</p>
                <Link href="/api/auth/signin">
                  <button className="w-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition">
                    로그인하기
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
} 