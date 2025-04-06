'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCategories, getLevelsForCategory, getHanjaMetadata } from '@/utils/hanjaUtils';

export default function LearningPathSelector() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [levels, setLevels] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 데이터 로드
  useEffect(() => {
    async function loadMetadata() {
      setIsLoading(true);
      try {
        // 카테고리 로드
        const categoriesData = getCategories();
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
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
      const levelsData = getLevelsForCategory(selectedCategory);
      setLevels(levelsData);
      
      if (levelsData.length > 0) {
        setSelectedLevel(levelsData[0].id);
      } else {
        setSelectedLevel('');
      }
    }
  }, [selectedCategory]);

  // 카테고리 선택 핸들러
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // 레벨 선택 핸들러
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value);
  };

  // 학습 시작 핸들러
  const handleStartLearning = () => {
    if (selectedCategory && selectedLevel) {
      router.push(`/learn/level/${selectedCategory}-${selectedLevel}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">학습 단계 선택</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-600">데이터 로딩 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
              카테고리
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {categories.find(c => c.id === selectedCategory)?.description || ''}
            </p>
          </div>
          
          <div>
            <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-700">
              레벨
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleStartLearning}
          disabled={!selectedCategory || !selectedLevel || isLoading}
          className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
            !selectedCategory || !selectedLevel || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          학습 시작하기
        </button>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/learn/popular"
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-xl font-bold mb-2">인기 한자</div>
          <p className="text-sm text-gray-500 text-center">가장 많이 사용되는 한자를 배워보세요</p>
        </Link>
        
        <Link
          href="/learn/radicals"
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-xl font-bold mb-2">부수별 학습</div>
          <p className="text-sm text-gray-500 text-center">한자의 부수를 기준으로 체계적으로 학습하세요</p>
        </Link>
        
        <Link
          href="/practice"
          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-xl font-bold mb-2">필기 연습</div>
          <p className="text-sm text-gray-500 text-center">직접 한자를 써보며 획순을 익혀보세요</p>
        </Link>
      </div>
    </div>
  );
} 