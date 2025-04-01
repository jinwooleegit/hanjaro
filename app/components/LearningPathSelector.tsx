'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCategories, getLevelsForCategory } from '@/utils/hanjaUtils';

export default function LearningPathSelector() {
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'basic');
  const levels = getLevelsForCategory(selectedCategory);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">학습 단계 선택</h2>
      
      {/* 카테고리 탭 */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            className={`py-2 px-4 font-medium whitespace-nowrap ${selectedCategory === category.id 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* 카테고리 설명 */}
      <div className="mb-6">
        <p className="text-gray-600 italic">
          {categories.find(c => c.id === selectedCategory)?.description}
        </p>
      </div>
      
      {/* 레벨 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {levels.map((level) => (
          <Link 
            key={level.id}
            href={`/learn/level/${selectedCategory}-${level.id}`}
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition border border-gray-200 hover:border-primary"
          >
            <div className="text-2xl font-bold text-primary mb-2">{level.name.split('(')[0].trim()}</div>
            <p className="text-sm text-gray-600">
              {level.name.includes('(') ? `(${level.name.split('(')[1]}` : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 