'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 정적 테스트 페이지 구현
export default function StaticLevelTestPage() {
  // 상태를 최소화하여 정적으로 구현
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 카테고리 정의
  const categories = [
    {
      id: 'basic',
      name: '기본 한자 테스트',
      description: '한자의 기본적인 의미와 읽기를 중심으로 평가합니다.',
      icon: '基',
      difficulty: 'beginner'
    },
    {
      id: 'intermediate',
      name: '중급 한자 테스트',
      description: '일상에서 자주 사용되는 한자어와 한자성어를 포함합니다.',
      icon: '中',
      difficulty: 'intermediate'
    },
    {
      id: 'advanced',
      name: '고급 한자 테스트',
      description: '한자의 부수, 획순, 고급 한자성어 등의 지식을 평가합니다.',
      icon: '高',
      difficulty: 'advanced'
    },
    {
      id: 'comprehensive',
      name: '종합 한자 테스트',
      description: '다양한 난이도의 문제를 통해 전반적인 한자 실력을 평가합니다.',
      icon: '綜',
      difficulty: 'intermediate'
    }
  ];

  // 난이도에 따른 클래스
  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-200 bg-green-50';
      case 'intermediate':
        return 'border-blue-200 bg-blue-50';
      case 'advanced':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // 난이도 레이블
  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return '기본';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">한자 레벨 테스트</h1>
        <p className="text-gray-600 mb-8 text-center max-w-2xl">
          자신의 한자 실력을 정확히 평가하고 맞춤형 학습 경로를 찾아보세요.
          난이도별 테스트를 통해 실력을 확인할 수 있습니다.
        </p>
        
        <div className="mb-10 text-center">
          <div className="w-40 h-40 mx-auto mb-6 relative">
            <Image 
              src="/images/level-test-illustration.png" 
              alt="Level Test Illustration"
              width={160}
              height={160}
              className="object-contain transform transition-transform duration-500 hover:scale-110"
              priority
              onError={(e) => {
                console.error('이미지 로딩 실패');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">테스트 유형 선택</h2>
          <p className="text-gray-700 mb-8">
            자신의 목표와 현재 실력에 맞는 테스트 유형을 선택하세요. 각 테스트는 10문제로 구성되어 있으며, 
            결과에 따라 개인에게 맞는 학습 계획이 제공됩니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/level-test-static/${category.id}`}
                className={`flex items-start p-5 border-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 transform -translate-y-1 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full ${getDifficultyClass(category.difficulty)} transition-all duration-300 transform hover:scale-110`}>
                    <span className="text-2xl font-serif">{category.icon}</span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      category.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      category.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {getDifficultyLabel(category.difficulty)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{category.description}</p>
                  <div className="mt-3 flex justify-end">
                    <span className="text-blue-600 text-sm font-medium flex items-center">
                      시작하기 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
            <h3 className="font-semibold text-xl text-blue-800 mb-4">테스트 안내</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                테스트는 <span className="font-medium text-blue-700">10문제</span>로 구성되어 있으며, 난이도에 따라 다양한 유형의 문제가 제공됩니다.
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                각 문제당 <span className="font-medium text-blue-700">제한 시간은 60초</span>이며, 시간 내에 답변을 선택해야 합니다.
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                문제를 건너뛸 수 있으나, 건너뛴 문제는 <span className="font-medium text-blue-700">오답 처리</span>됩니다.
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                테스트 결과에 따라 <span className="font-medium text-blue-700">맞춤형 학습 계획</span>과 <span className="font-medium text-blue-700">레벨 추천</span>을 받을 수 있습니다.
              </li>
            </ul>
            
            <div className="mt-6 bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 italic">
                💡 더 정확한 레벨 측정을 위해 집중된 환경에서 테스트를 진행하는 것이 좋습니다. 
                테스트 완료 후 결과를 바탕으로 자신에게 맞는 학습 경로를 찾아보세요.
              </p>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => {
                // 선택된 카테고리가 있으면 해당 카테고리로 이동
                if (selectedCategory) {
                  window.location.href = `/level-test-static/${selectedCategory}`;
                } else {
                  // 없으면 기본 카테고리로 이동
                  window.location.href = `/level-test-static/basic`;
                }
              }}
              className="px-8 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
            >
              테스트 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 