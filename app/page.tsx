import Link from 'next/link';
import PageContainer from './components/PageContainer';
import PageHeader from './components/PageHeader';
import ContentCard from './components/ContentCard';
import Image from 'next/image';

export default function Home() {
  return (
    <PageContainer maxWidth="max-w-7xl">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              한자를 더 쉽고 <span className="text-blue-600">재미있게</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              한자로는 한자의 기초부터 고급 수준까지 체계적으로 학습할 수 있는 플랫폼입니다.
              단계별 학습, 쓰기 연습, 퀴즈를 통해 한자 실력을 향상시켜 보세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/level-test-static">
                <button className="btn-primary px-6 py-3 text-lg">
                  레벨 테스트 시작하기
                </button>
              </Link>
              <Link href="/learn">
                <button className="btn-outline px-6 py-3 text-lg">
                  학습 센터로 이동
                </button>
              </Link>
            </div>
          </div>
          <div className="relative w-full md:w-1/3 h-64 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl transform -rotate-3 shadow-lg"></div>
            <div className="absolute inset-0 bg-white rounded-xl transform rotate-3 p-6 flex items-center justify-center">
              <div className="text-6xl font-bold hanja-text text-center">
                學習漢字
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">한자로와 함께하는 학습 여정</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ContentCard
          gradient
          gradientColors="from-blue-50 to-blue-100"
          className="border-blue-200"
          title="맞춤형 학습 경로"
          titleSize="lg"
        >
          <p className="mb-4">레벨 테스트로 자신의 현재 실력을 파악하고, 맞춤형 학습 경로를 따라 효율적으로 공부하세요.</p>
          <Link href="/level-test-static">
            <button className="btn-primary w-full">
              레벨 테스트 시작하기
            </button>
          </Link>
        </ContentCard>
        
        <ContentCard
          gradient
          gradientColors="from-green-50 to-green-100"
          className="border-green-200"
          title="체계적인 학습 과정"
          titleSize="lg"
        >
          <p className="mb-4">단계별로 구성된 체계적인 학습 과정을 통해 한자의 기초부터 응용까지 배워보세요.</p>
          <Link href="/learn">
            <button className="btn-success w-full">
              학습 센터 방문하기
            </button>
          </Link>
        </ContentCard>
        
        <ContentCard
          gradient
          gradientColors="from-purple-50 to-purple-100"
          className="border-purple-200"
          title="한자 퀴즈와 복습"
          titleSize="lg"
        >
          <p className="mb-4">한자 퀴즈를 통해 학습한 내용을 확인하고, 맞춤형 복습 자료로 어려운 한자를 효과적으로 기억하세요.</p>
          <Link href="/quiz">
            <button className="btn-accent w-full">
              한자 퀴즈 풀기
            </button>
          </Link>
        </ContentCard>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">한자 원리 이해하기</h2>
        <div className="grid grid-cols-1 gap-6">
          <Link href="/hanja-principles">
            <ContentCard className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
              <h3 className="text-xl font-semibold mb-2">한자 원리 탐구</h3>
              <p>한자의 기원과 원리를 이해하면 더 쉽게 기억할 수 있습니다. 한자의 구조와 의미 체계를 통해 효과적으로 학습해보세요.</p>
            </ContentCard>
          </Link>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <Link href="/dashboard">
          <button className="btn-secondary px-6 py-3">
            내 학습 현황 확인하기
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link href="/dashboard" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-bold mb-2 text-blue-600">대시보드</h2>
          <p className="text-gray-600">나의 학습 현황과 진행 상황을 확인하세요.</p>
        </Link>
        
        <Link href="/new-hanja" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-bold mb-2 text-blue-600">한자 학습</h2>
          <p className="text-gray-600">급수별, 주제별로 다양한 한자를 학습하세요.</p>
        </Link>
        
        <Link href="/enhanced-hanja" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-bold mb-2 text-blue-600">확장된 한자 학습</h2>
          <p className="text-gray-600">더 풍부한 컨텐츠와 상세한 설명으로 한자를 깊이 이해하세요.</p>
        </Link>
        
        <Link href="/quiz" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-bold mb-2 text-blue-600">퀴즈</h2>
          <p className="text-gray-600">학습한 한자를 퀴즈로 복습하고 실력을 확인하세요.</p>
        </Link>
        
        <Link href="/writing-practice" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-bold mb-2 text-blue-600">쓰기 연습</h2>
          <p className="text-gray-600">한자 쓰기를 연습하고 획순을 익히세요.</p>
        </Link>
        
        <Link href="/tags" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-bold mb-2 text-blue-600">태그별 한자</h2>
          <p className="text-gray-600">주제별로 분류된 한자를 찾아보세요.</p>
        </Link>
      </div>
    </PageContainer>
  );
} 