'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCategories, getLevelsForCategory } from '@/utils/hanjaUtils';

type Level = {
  id: string;
  name: string;
  description?: string;
};

export default function LearningPathSelector() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 데이터 로드
  useEffect(() => {
    async function loadMetadata() {
      setIsLoading(true);
      try {
        // API로부터 카테고리 데이터 로드
        const categoriesData = getCategories();
        
        // 확인: 모든 카테고리가 로드되었는지 콘솔에 출력
        console.log('로드된 카테고리:', categoriesData);
        
        setCategories(categoriesData);
        
        // 초기 카테고리 선택 (초등학교)
        if (categoriesData.length > 0) {
          const defaultCategory = categoriesData.find(cat => cat.id === 'elementary') || categoriesData[0];
          setSelectedCategory(defaultCategory.id);
        }
      } catch (error) {
        console.error('카테고리 로드 에러:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMetadata();
  }, []);

  // 카테고리 변경 시 레벨 로드
  useEffect(() => {
    if (selectedCategory) {
      // 선택된 카테고리에 따라 레벨 데이터 로드
      const levelsData = getLevelsForCategory(selectedCategory);
      console.log('로드된 레벨:', selectedCategory, levelsData);
      setLevels(levelsData);
    }
  }, [selectedCategory]);

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // 학습 시작 핸들러
  const handleStartLearning = (level: string) => {
    if (selectedCategory && level) {
      router.push(`/learn/level/${selectedCategory}-${level}`);
    }
  };

  // 카테고리 스타일
  const getCategoryStyle = (categoryId: string) => {
    const baseStyle = "p-4 rounded-xl cursor-pointer transition duration-300 text-center flex flex-col items-center justify-center border shadow-sm hover:shadow-md transform hover:-translate-y-1";
    const selectedStyle = selectedCategory === categoryId ? "ring-2 shadow-md transform scale-105" : "";
    
    switch (categoryId) {
      case 'elementary':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-blue-100 ring-blue-500 border-blue-300' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'}`;
      case 'middle':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-green-100 ring-green-500 border-green-300' : 'bg-green-50 hover:bg-green-100 border-green-200'}`;
      case 'high':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-yellow-100 ring-yellow-500 border-yellow-300' : 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'}`;
      case 'university':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-pink-100 ring-pink-500 border-pink-300' : 'bg-pink-50 hover:bg-pink-100 border-pink-200'}`;
      case 'expert':
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-purple-100 ring-purple-500 border-purple-300' : 'bg-purple-50 hover:bg-purple-100 border-purple-200'}`;
      default:
        return `${baseStyle} ${selectedStyle} ${selectedCategory === categoryId ? 'bg-gray-100 ring-gray-400 border-gray-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`;
    }
  };

  // 카테고리 아이콘 반환 함수 추가
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'elementary':
        return "🔤"; // 초등학교
      case 'middle':
        return "📚"; // 중학교
      case 'high':
        return "📝"; // 고등학교
      case 'university':
        return "🎓"; // 대학교
      case 'expert':
        return "🔍"; // 전문가
      default:
        return "📖";
    }
  };

  // 레벨 스타일
  const getLevelStyle = (categoryId: string) => {
    switch (categoryId) {
      case 'elementary':
        return "bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md";
      case 'middle':
        return "bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-md";
      case 'high':
        return "bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 hover:shadow-md";
      case 'university':
        return "bg-pink-50 border border-pink-200 hover:bg-pink-100 hover:border-pink-300 hover:shadow-md";
      case 'expert':
        return "bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 hover:shadow-md";
      default:
        return "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-md";
    }
  };

  // 버튼 스타일
  const getButtonStyle = (categoryId: string) => {
    switch (categoryId) {
      case 'elementary':
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case 'middle':
        return "bg-green-600 hover:bg-green-700 text-white";
      case 'high':
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case 'university':
        return "bg-pink-600 hover:bg-pink-700 text-white";
      case 'expert':
        return "bg-purple-600 hover:bg-purple-700 text-white";
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white";
    }
  };

  // 교육 과정별 단계 수
  const getCategoryLevelCount = (categoryId: string) => {
    switch (categoryId) {
      case 'elementary':
        return "6단계";
      case 'middle':
        return "3단계";
      case 'high':
        return "3단계";
      case 'university':
        return "4단계";
      case 'expert':
        return "5단계";
      default:
        return "";
    }
  };
  
  return (
    <div className="rounded-xl shadow-lg p-6 mb-8 bg-white border border-gray-200 transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-center">한자 학습 단계 선택</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-600">데이터 로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 학습 과정 선택 (카드 방식) */}
          <div>
            <h3 className="text-lg font-semibold mb-3">학습 과정</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={getCategoryStyle(category.id)}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="text-3xl mb-3">{getCategoryIcon(category.id)}</div>
                  <div className="font-bold text-lg mb-1">{category.name}</div>
                  <div className="text-sm opacity-80">{getCategoryLevelCount(category.id)}</div>
                </div>
              ))}
            </div>
            {selectedCategory && (
              <p className="mt-4 py-2 px-4 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 text-sm">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            )}
          </div>
          
          {/* 학습 단계 선택 (카드 그리드 방식) */}
          {selectedCategory && levels.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">학습 단계</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {levels.map((level) => (
                  <div 
                    key={level.id}
                    className={`p-4 rounded-lg transition duration-300 transform hover:-translate-y-1 ${getLevelStyle(selectedCategory)}`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2" style={{
                        backgroundColor: 
                          selectedCategory === 'elementary' ? '#3B82F6' :
                          selectedCategory === 'middle' ? '#10B981' : 
                          selectedCategory === 'high' ? '#F59E0B' :
                          selectedCategory === 'university' ? '#EC4899' :
                          selectedCategory === 'expert' ? '#8B5CF6' : '#6B7280'
                      }}>
                        {level.id.replace('level', '')}
                      </span>
                      <h4 className="font-bold">{level.name}</h4>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2 min-h-[2.5rem] text-gray-600">{level.description || '단계별 한자 학습'}</p>
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
      )}
      
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
          href="/learn" 
          className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md hover:shadow-lg border border-green-200 transform transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-3xl mb-3">📋</div>
          <div className="text-xl font-bold mb-2 text-green-800">한자 연습장</div>
          <p className="text-sm text-green-700 text-center">
            한자를 직접 써보며 효과적으로 학습하세요. 
            획순, 음훈, 의미가 포함된 연습을 통해 한자 실력을 향상시킬 수 있습니다.
          </p>
        </Link>
      </div>
    </div>
  );
} 