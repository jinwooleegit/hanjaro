'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ResultProps {
  score: number;
  totalQuestions: number;
  category?: string;
}

export default function TestResultPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ResultProps>({
    score: 0,
    totalQuestions: 10,
    category: 'basic',
  });
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    try {
      const score = Number(searchParams?.get('score') || 0);
      const total = Number(searchParams?.get('total') || 10);
      const category = searchParams?.get('category') || 'basic';
      
      // 유효성 검사
      if (isNaN(score) || isNaN(total) || score < 0 || total <= 0) {
        console.error('유효하지 않은 점수 또는 총 문제 수:', { score, total });
        setResult({ score: 0, totalQuestions: 10, category: 'basic' });
      } else {
        setResult({
          score: score > total ? total : score, // 점수가 총 문제수보다 클 수 없음
          totalQuestions: total,
          category: category
        });
      }

      // 애니메이션 효과 (3초 후 종료)
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);

      return () => clearTimeout(timer);
      
    } catch (error) {
      console.error('점수 계산 중 오류 발생:', error);
      setResult({ score: 0, totalQuestions: 10, category: 'basic' });
    }
  }, [searchParams]);
  
  // 점수 백분율 계산
  const scorePercentage = Math.round((result.score / result.totalQuestions) * 100);
  
  // 추천 레벨 계산 로직
  const getRecommendedLevel = () => {
    if (scorePercentage >= 90) return 5;
    else if (scorePercentage >= 75) return 4;
    else if (scorePercentage >= 60) return 3;
    else if (scorePercentage >= 40) return 2;
    else return 1;
  };
  
  // 추천 레벨
  const recommendedLevel = getRecommendedLevel();
  
  // 결과 메시지
  const getResultMessage = () => {
    if (scorePercentage >= 90) return '매우 우수한 실력입니다. 고급 한자에 도전해보세요!';
    else if (scorePercentage >= 75) return '좋은 실력을 갖추고 있습니다. 꾸준히 학습하세요!';
    else if (scorePercentage >= 60) return '기본기가 잘 갖춰져 있습니다. 조금 더 학습이 필요합니다.';
    else if (scorePercentage >= 40) return '기초부터 차근차근 학습하세요. 아직 기본기가 부족합니다.';
    else return '한자 기초부터 시작하는 것을 추천합니다.';
  };
  
  // 상세 분석 메시지
  const getDetailedAnalysis = () => {
    if (scorePercentage >= 90) {
      return {
        strengths: ['한자 독해 능력이 우수합니다', '한자의 구조와 의미를 정확히 이해하고 있습니다', '고급 한자성어에 대한 지식이 있습니다'],
        weaknesses: ['더 어려운 한자로 실력을 확장해보세요', '한문 문법에 도전해보세요'],
        nextSteps: ['한문 고전 읽기를 시작해보세요', '한자 작문에 도전해보세요', '한자 관련 자격증 시험을 준비해보세요']
      };
    } else if (scorePercentage >= 75) {
      return {
        strengths: ['기본 한자 지식이 탄탄합니다', '자주 사용되는 한자를 잘 알고 있습니다'],
        weaknesses: ['복잡한 한자 구조 이해가 필요합니다', '한자성어 활용 능력 향상이 필요합니다'],
        nextSteps: ['중급 한자성어를 학습하세요', '한자 조어법을 배워보세요', '매일 10개의 새로운 한자를 학습하세요']
      };
    } else if (scorePercentage >= 60) {
      return {
        strengths: ['기초 한자에 대한 이해가 있습니다', '기본적인 한자 읽기가 가능합니다'],
        weaknesses: ['한자의 의미와 음을 혼동하는 경우가 있습니다', '비슷한 모양의 한자 구별이 필요합니다'],
        nextSteps: ['기본 한자 부수를 완벽히 익히세요', '자주 사용되는 한자 100자를 집중적으로 학습하세요', '한자의 구조를 분석하는 방법을 배우세요']
      };
    } else if (scorePercentage >= 40) {
      return {
        strengths: ['한자에 대한 관심이 있습니다', '일부 기초 한자를 인식할 수 있습니다'],
        weaknesses: ['기본 한자 부수 지식이 부족합니다', '한자의 기본 구조 이해가 필요합니다'],
        nextSteps: ['한자의 기본 부수부터 학습하세요', '매일 5개의 기초 한자를 반복 학습하세요', '한자의 구조를 익히는 데 집중하세요']
      };
    } else {
      return {
        strengths: ['한자 학습을 시작했다는 것이 중요합니다', '개선의 여지가 많습니다'],
        weaknesses: ['기초 한자 지식이 부족합니다', '한자의 기본 개념 이해가 필요합니다'],
        nextSteps: ['한자의 기원과 기본 개념부터 학습하세요', '가장 기초적인 한자 10개부터 시작하세요', '한자 학습 앱을 활용하여 매일 조금씩 학습하세요']
      };
    }
  };
  
  const analysis = getDetailedAnalysis();
  
  // 점수 색상
  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'text-green-600';
    else if (scorePercentage >= 70) return 'text-blue-600';
    else if (scorePercentage >= 50) return 'text-yellow-600';
    else if (scorePercentage >= 30) return 'text-orange-600';
    else return 'text-red-600';
  };
  
  // 레벨 배지 이미지
  const getLevelBadgeClass = () => {
    switch (recommendedLevel) {
      case 5: return 'bg-purple-100 text-purple-800 border-purple-300';
      case 4: return 'bg-blue-100 text-blue-800 border-blue-300';
      case 3: return 'bg-green-100 text-green-800 border-green-300';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 1: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // 레벨에 따른 한자 아이콘
  const getLevelIcon = () => {
    switch (recommendedLevel) {
      case 5: return '特';
      case 4: return '優';
      case 3: return '良';
      case 2: return '基';
      case 1: return '初';
      default: return '學';
    }
  };
  
  // 추천 학습 경로 생성 함수
  const getRecommendedPath = (): string => {
    // 테스트 카테고리를 확인하여 적절한 경로 추천
    const category = result.category || 'basic'; // 기본값은 basic
    
    // 카테고리별 적절한 경로 매핑
    const categoryPathMap: Record<string, string> = {
      'basic': '/learn/level/elementary-level1', // 기본 테스트는 항상 초등 레벨로
      'intermediate': recommendedLevel >= 3 ? '/learn/level/middle-level1' : '/learn/level/elementary-level1',
      'advanced': recommendedLevel >= 3 ? '/learn/level/high-level1' : '/learn/level/middle-level1',
      'comprehensive': '/learn/level/' + (
        recommendedLevel >= 4 ? 'university-level1' : 
        recommendedLevel >= 3 ? 'high-level1' : 
        recommendedLevel >= 2 ? 'middle-level1' : 
        'elementary-level1'
      )
    };
    
    // 카테고리에 해당하는 경로 반환, 없으면 기본 경로
    return categoryPathMap[category] || '/learn/level/elementary-level1';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8">한자 레벨 테스트 결과</h1>
        
        <div className="flex flex-col items-center mb-10">
          <div className={`w-48 h-48 border-8 ${getScoreColor().replace('text', 'border')} rounded-full flex items-center justify-center mb-4 relative ${isAnimating ? 'animate-pulse' : ''}`}>
            <svg viewBox="0 0 36 36" className="absolute w-48 h-48">
              <path
                className={`stroke-current ${getScoreColor()}`}
                fill="none"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray={`${scorePercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                transform="rotate(-90, 18, 18)"
              />
            </svg>
            <span className={`text-5xl font-bold ${getScoreColor()} z-10`}>
              {scorePercentage}%
            </span>
          </div>
          <div className="text-center">
            <p className="text-xl">
              총 <span className="font-medium">{result.totalQuestions}</span>문제 중{' '}
              <span className="font-medium">{result.score}</span>문제 정답
            </p>
          </div>
        </div>
        
        <div className="mb-10 bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">추천 학습 레벨</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className={`w-24 h-24 border-4 ${getLevelBadgeClass()} rounded-full flex items-center justify-center text-4xl font-bold mr-6 mb-4 md:mb-0`} style={{ fontFamily: "var(--font-noto-serif-kr), 'Batang', serif" }}>
              {getLevelIcon()}
            </div>
            <div>
              <div className="text-2xl font-medium mb-2 text-center md:text-left">
                {recommendedLevel}급 수준
              </div>
              <p className="text-gray-700 mb-4 text-lg">{getResultMessage()}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">강점</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
                    {analysis.strengths.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">개선점</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
                    {analysis.weaknesses.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">다음 단계</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                    {analysis.nextSteps.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-indigo-800">효과적인 학습 방법</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 mr-3 mt-0.5">1</span>
              <div>
                <h3 className="font-medium text-indigo-700 mb-1">반복 학습</h3>
                <p className="text-sm text-indigo-600">매일 일정 시간을 정해 꾸준히 학습하세요. 짧은 시간이라도 매일 반복하는 것이 효과적입니다.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 mr-3 mt-0.5">2</span>
              <div>
                <h3 className="font-medium text-indigo-700 mb-1">연관성 만들기</h3>
                <p className="text-sm text-indigo-600">한자의 모양과 의미를 연결시키는 이야기나 이미지를 만들어보세요.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 mr-3 mt-0.5">3</span>
              <div>
                <h3 className="font-medium text-indigo-700 mb-1">부수 학습</h3>
                <p className="text-sm text-indigo-600">한자의 기본 구성 요소인 부수를 먼저 익히면 새로운 한자를 배우기 쉬워집니다.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 mr-3 mt-0.5">4</span>
              <div>
                <h3 className="font-medium text-indigo-700 mb-1">실생활 적용</h3>
                <p className="text-sm text-indigo-600">배운 한자를 일상생활에서 찾아보고 활용해보세요. 이해와 기억이 더 오래 지속됩니다.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
          <Link
            href="/level-test-static"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center shadow-sm hover:shadow-md"
          >
            테스트 다시 시작하기
          </Link>
          <Link
            href={getRecommendedPath()}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-center hover:border-gray-400"
          >
            추천 레벨로 학습하기
          </Link>
        </div>
      </div>
    </div>
  );
} 