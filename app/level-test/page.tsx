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
      <div className="flex flex-col items-center max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">한자 레벨 테스트</h1>
        
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            자신의 한자 실력을 확인하고 적절한 학습 레벨을 찾아보세요.
          </p>
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <Image 
              src="/images/level-test-illustration.png" 
              alt="Level Test Illustration"
              width={128}
              height={128}
              className="object-contain"
              priority
              onError={(e) => {
                console.error('이미지 로딩 실패');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">테스트 유형 선택</h2>
          <p className="text-gray-600 mb-6">
            자신의 목표와 현재 실력에 맞는 테스트 유형을 선택하세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/level-test-static/${category.id}`}
                className={`flex items-start p-4 border-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getDifficultyClass(category.difficulty)}`}>
                    <span className="text-lg">{category.icon}</span>
      </div>
    </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      category.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {getDifficultyLabel(category.difficulty)}
                    </span>
        </div>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
        </div>
              </Link>
            ))}
      </div>
      
          <div className="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-lg text-blue-800 mb-2">테스트 안내</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>테스트는 총 10문제로 구성되어 있습니다.</li>
              <li>제한 시간은 10분입니다.</li>
              <li>문제를 건너뛸 수 있으나, 점수에 반영됩니다.</li>
              <li>테스트 결과에 따라 적합한 학습 레벨을 추천해 드립니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 