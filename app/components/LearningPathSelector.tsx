'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 타입 정의
type CategoryId = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type LevelId = string;

interface Category {
  id: CategoryId;
  name: string;
  description: string;
  levels: number;
  badge: string;
}

interface Level {
  id: string;
  name: string;
  description: string;
  badge: string;
  gradeLevel: string;
}

// 정적 카테고리 데이터
const staticCategories: Category[] = [
  {
    id: 'beginner',
    name: '초급',
    description: '기초 한자와 간단한 구조의 한자를 학습합니다. 일상생활에서 자주 사용되는 기본 한자들이 포함됩니다.',
    levels: 5,
    badge: '🔵'
  },
  {
    id: 'intermediate',
    name: '중급',
    description: '중간 수준의 한자와 조금 더 복잡한 구조의 한자를 학습합니다. 더 많은 부수와 결합된 한자들이 포함됩니다.',
    levels: 5,
    badge: '🟢'
  },
  {
    id: 'advanced',
    name: '고급',
    description: '복잡한 구조와 의미를 가진 한자를 학습합니다. 전문 분야에서 사용되는 한자들이 포함됩니다.',
    levels: 3,
    badge: '🟡'
  },
  {
    id: 'expert',
    name: '전문가',
    description: '가장 높은 수준의 한자와 희귀 한자를 학습합니다. 고전 문헌과 전문 서적에서 사용되는 한자들이 포함됩니다.',
    levels: 2,
    badge: '🔴'
  }
];

// 정적 레벨 데이터
const getStaticLevelsForCategory = (categoryId: CategoryId): Level[] => {
  switch(categoryId) {
    case 'beginner':
      return [
        { id: 'level1', name: '15급', description: '한자 학습 입문 단계로 가장 기초적인 한자를 학습합니다.', badge: '15급', gradeLevel: '초등 1-2학년 수준' },
        { id: 'level2', name: '14급', description: '기초 한자를 확장하여 일상에서 자주 쓰이는 쉬운 한자를 학습합니다.', badge: '14급', gradeLevel: '초등 2-3학년 수준' },
        { id: 'level3', name: '13급', description: '초등 저학년 수준의 필수 한자를 학습합니다.', badge: '13급', gradeLevel: '초등 3-4학년 수준' },
        { id: 'level4', name: '12급', description: '기초 한자 구조와 의미를 이해하는 단계입니다.', badge: '12급', gradeLevel: '초등 4-5학년 수준' },
        { id: 'level5', name: '11급', description: '초급 마지막 단계로 초등학교 수준의 한자를 마스터합니다.', badge: '11급', gradeLevel: '초등 5-6학년 수준' }
      ];
    case 'intermediate':
      return [
        { id: 'level1', name: '10급', description: '중급 첫 단계로 더 복잡한 구조의 한자를 학습합니다.', badge: '10급', gradeLevel: '중학교 1학년 수준' },
        { id: 'level2', name: '9급', description: '일상 생활과 학업에 필요한 중요 한자를 학습합니다.', badge: '9급', gradeLevel: '중학교 1-2학년 수준' },
        { id: 'level3', name: '8급', description: '중급 수준의 한자어와 문화적 배경을 함께 학습합니다.', badge: '8급', gradeLevel: '중학교 2-3학년 수준' },
        { id: 'level4', name: '7급', description: '다양한 분야에서 사용되는 한자를 확장합니다.', badge: '7급', gradeLevel: '중학교 3학년-고등학교 1학년 수준' },
        { id: 'level5', name: '6급', description: '중급 마지막 단계로 고등학교 수준의 기초 한자를 학습합니다.', badge: '6급', gradeLevel: '고등학교 1학년 수준' }
      ];
    case 'advanced':
      return [
        { id: 'level1', name: '5급', description: '고급 첫 단계로 전문 분야에서 사용되는 한자를 학습합니다.', badge: '5급', gradeLevel: '고등학교 2학년 수준' },
        { id: 'level2', name: '4급', description: '다양한 한자 조합과 심화된 활용법을 학습합니다.', badge: '4급', gradeLevel: '고등학교 3학년 수준' },
        { id: 'level3', name: '3급', description: '고급 마지막 단계로 한자 지식을 심화합니다.', badge: '3급', gradeLevel: '대학 교양 수준' }
      ];
    case 'expert':
      return [
        { id: 'level1', name: '2급', description: '전문가 첫 단계로 희귀 한자와 전문 용어를 학습합니다.', badge: '2급', gradeLevel: '대학 전공 기초 수준' },
        { id: 'level2', name: '1급', description: '최고 수준의 한자 지식과 고전 문헌에 사용되는 한자를 학습합니다.', badge: '1급', gradeLevel: '대학 전공 심화 및 전문가 수준' }
      ];
    default:
      return [];
  }
};

export default function LearningPathSelector() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('beginner');
  const [levels, setLevels] = useState<Level[]>(getStaticLevelsForCategory('beginner'));
  const router = useRouter();

  // 카테고리 변경 시 레벨 데이터 업데이트
  useEffect(() => {
    if (selectedCategory) {
      const levelsData = getStaticLevelsForCategory(selectedCategory);
      setLevels(levelsData);
    }
  }, [selectedCategory]);

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
  };

  // 학습 시작 핸들러
  const handleStartLearning = (level: LevelId) => {
    if (selectedCategory && level) {
      router.push(`/learn/level/${selectedCategory}-${level}`);
    }
  };

  // 카테고리 스타일
  const getCategoryStyle = (categoryId: CategoryId) => {
    const baseStyle = "p-4 rounded-xl cursor-pointer transition duration-300 text-center flex flex-col items-center justify-center border shadow-sm hover:shadow-md transform hover:-translate-y-1";
    const selectedStyle = selectedCategory === categoryId ? "ring-2 shadow-md transform scale-105" : "";
    
    switch (categoryId) {
      case 'beginner':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-blue-100 ring-blue-500 border-blue-300' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'}`;
      case 'intermediate':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-green-100 ring-green-500 border-green-300' : 'bg-green-50 hover:bg-green-100 border-green-200'}`;
      case 'advanced':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-yellow-100 ring-yellow-500 border-yellow-300' : 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'}`;
      case 'expert':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-pink-100 ring-pink-500 border-pink-300' : 'bg-pink-50 hover:bg-pink-100 border-pink-200'}`;
      default:
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-gray-100 ring-gray-400 border-gray-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`;
    }
  };

  // 카테고리 아이콘 반환 함수
  const getCategoryIcon = (categoryId: CategoryId) => {
    // CSS 클래스 대신 텍스트 아이콘 사용
    const textIcon = 
      categoryId === 'beginner' ? '👤' : 
      categoryId === 'intermediate' ? '⛰️' : 
      categoryId === 'advanced' ? '💧' : 
      categoryId === 'expert' ? '🔥' : 
      '☀️';
      
    return (
      <div className="text-3xl" title={`${categoryId} 카테고리`}>
        {textIcon}
      </div>
    );
  };

  // 레벨 스타일
  const getLevelStyle = (categoryId: CategoryId) => {
    switch (categoryId) {
      case 'beginner':
        return "bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md";
      case 'intermediate':
        return "bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-md";
      case 'advanced':
        return "bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 hover:shadow-md";
      case 'expert':
        return "bg-pink-50 border border-pink-200 hover:bg-pink-100 hover:border-pink-300 hover:shadow-md";
      default:
        return "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-md";
    }
  };

  // 버튼 스타일
  const getButtonStyle = (categoryId: CategoryId) => {
    switch (categoryId) {
      case 'beginner':
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case 'intermediate':
        return "bg-green-600 hover:bg-green-700 text-white";
      case 'advanced':
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case 'expert':
        return "bg-pink-600 hover:bg-pink-700 text-white";
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white";
    }
  };

  // 배지 스타일
  const getBadgeStyle = (categoryId: CategoryId) => {
    switch (categoryId) {
      case 'beginner':
        return "bg-blue-600 text-white";
      case 'intermediate':
        return "bg-green-600 text-white";
      case 'advanced':
        return "bg-yellow-600 text-white";
      case 'expert':
        return "bg-pink-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // 배지 스타일을 배지 아이콘으로 변경
  const getLevelBadge = (badge: string) => {
    // 배지 클래스명으로 변환
    const badgeClass = `badge-icon badge-${badge.replace('급', 'level')}`;
    return (
      <div className={badgeClass} title={badge}></div>
    );
  };
  
  return (
    <div className="rounded-xl shadow-lg p-6 mb-8 bg-white border border-gray-200 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-center">한자 학습 단계 선택</h2>
      
      <div className="space-y-8">
        {/* 학습 과정 선택 (카드 방식) */}
        <div>
          <h3 className="text-lg font-semibold mb-3">학습 과정</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {staticCategories.map((category) => (
              <div 
                key={category.id}
                className={getCategoryStyle(category.id)}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="text-3xl mb-3">{getCategoryIcon(category.id)}</div>
                <div className="font-bold text-lg mb-1">{category.name}</div>
                <div className="text-sm opacity-80">{category.levels}단계</div>
              </div>
            ))}
          </div>
          {selectedCategory && (
            <p className="mt-4 py-2 px-4 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 text-sm">
              {staticCategories.find(c => c.id === selectedCategory)?.description}
            </p>
          )}
        </div>
        
        {/* 학습 단계 선택 (카드 그리드 방식) */}
        {selectedCategory && levels.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">학습 단계</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {levels.map((level: Level) => (
                <div 
                  key={level.id}
                  className={`p-4 rounded-lg transition duration-300 transform hover:-translate-y-1 ${getLevelStyle(selectedCategory)}`}
                >
                  <div className="flex items-center mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeStyle(selectedCategory)}`}>
                      {level.badge}
                    </span>
                    <h4 className="font-bold ml-2">{level.name}</h4>
                  </div>
                  <p className="text-sm mb-2 line-clamp-2 min-h-[2.5rem] text-gray-600">{level.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{level.gradeLevel}</p>
                  <button
                    onClick={() => handleStartLearning(level.id)}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition duration-300 ${getButtonStyle(selectedCategory)}`}
                  >
                    학습 시작하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/tags" 
          className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md hover:shadow-lg border border-blue-200 transform transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-3xl mb-3">🏷️</div>
          <div className="text-xl font-bold mb-2 text-blue-800">태그별 한자 학습</div>
          <p className="text-sm text-blue-700 text-center">다양한 주제별로 분류된 한자를 탐색하고 학습하세요</p>
        </Link>
        
        <Link
          href="/level-test" 
          className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md hover:shadow-lg border border-green-200 transform transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-3xl mb-3">📋</div>
          <div className="text-xl font-bold mb-2 text-green-800">레벨 테스트</div>
          <p className="text-sm text-green-700 text-center">자신의 한자 실력을 테스트하고 적합한 레벨을 추천받으세요</p>
        </Link>
      </div>
    </div>
  );
} 