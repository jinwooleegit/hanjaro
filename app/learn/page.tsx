'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LearningPathSelector from '../components/LearningPathSelector';

// 한자 데이터를 더 작은 데이터셋으로 축소하여 메인 페이지 로딩 속도 개선
const popularHanjaList = [
  { 
    character: '人', 
    meaning: '사람 인', 
    pronunciation: '인',
    stroke_count: 2 
  },
  { 
    character: '水', 
    meaning: '물 수', 
    pronunciation: '수',
    stroke_count: 4
  },
  { 
    character: '火', 
    meaning: '불 화', 
    pronunciation: '화',
    stroke_count: 4
  },
  { 
    character: '山', 
    meaning: '산 산', 
    pronunciation: '산',
    stroke_count: 3
  },
  { 
    character: '學', 
    meaning: '배울 학', 
    pronunciation: '학',
    stroke_count: 16
  }
];

// 카테고리 데이터도 간소화
const categories = [
  {
    id: 'difficulty',
    name: '난이도별 분류',
    tags: [
      { id: 'beginner', name: '초급 (1-4획)' },
      { id: 'intermediate', name: '중급 (5-9획)' },
      { id: 'advanced', name: '고급 (10획 이상)' }
    ]
  },
  {
    id: 'education',
    name: '교육 과정별 분류',
    tags: [
      { id: 'elementary', name: '초등학교' },
      { id: 'middle', name: '중학교' },
      { id: 'high', name: '고등학교' },
      { id: 'university', name: '대학' },
      { id: 'expert', name: '전문가' }
    ]
  }
];

export default function LearnPage() {
  const [selectedHanja, setSelectedHanja] = useState(popularHanjaList[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">
            단계별 <span className="text-yellow-300">한자 학습</span>
          </h1>
          <p className="text-xl text-blue-100 mb-6 text-center max-w-3xl mx-auto">
            학교급별로 체계적으로 나누어진 한자 학습 시스템
          </p>
        </div>
      </div>
      
      <div className="container mx-auto p-4 pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <LearningPathSelector />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100 transform transition duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">학습 방법</h2>
            <div className="space-y-4">
              <p className="text-lg text-slate-600">
                한자 학습은 학교급별로 체계적으로 진행됩니다. 초등학교 6단계, 중학교 3단계, 고등학교 3단계, 대학 4단계, 전문가 5단계로 
                나누어 난이도에 맞게 학습할 수 있습니다.
              </p>
              <ol className="list-decimal list-inside space-y-3 pl-4 text-slate-700">
                <li className="pl-2">위에서 자신에게 맞는 학습 과정(초등, 중등, 고등, 대학)을 선택합니다.</li>
                <li className="pl-2">해당 학습 과정에서 제공하는 단계(1단계, 2단계 등)를 선택합니다.</li>
                <li className="pl-2">선택한 단계에서 제공하는 한자 목록을 확인합니다.</li>
                <li className="pl-2">각 한자를 클릭하여 자세한 정보와 획순을 학습합니다.</li>
                <li className="pl-2">퀴즈를 통해 학습 성취도를 확인합니다.</li>
              </ol>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <span className="font-bold text-blue-800 block mb-1">초등학교</span>
                  <p className="text-sm text-gray-600">6단계로 구성된 기초 한자</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <span className="font-bold text-green-800 block mb-1">중학교</span>
                  <p className="text-sm text-gray-600">3단계로 구성된 중급 한자</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <span className="font-bold text-yellow-800 block mb-1">고등학교</span>
                  <p className="text-sm text-gray-600">3단계로 구성된 고급 한자</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
                  <span className="font-bold text-pink-800 block mb-1">대학</span>
                  <p className="text-sm text-gray-600">4단계로 구성된 전문 한자</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <span className="font-bold text-purple-800 block mb-1">전문가</span>
                  <p className="text-sm text-gray-600">5단계로 구성된 고급 분야별 한자</p>
                </div>
              </div>
            </div>
          </div>

          {/* 카테고리별 분류 섹션 - 더 가벼운 렌더링으로 변경 */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-8 text-slate-800 text-center">한자 분류 카테고리</h2>
            <div className="space-y-10">
              {categories.map((category) => (
                <div key={category.id} className="border-b pb-8 last:border-b-0 last:pb-0">
                  <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">
                      {category.id.charAt(0).toUpperCase()}
                    </span>
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <div 
                        key={tag.id}
                        className="px-4 py-2 bg-white rounded-full text-sm font-medium text-slate-700 shadow-sm hover:shadow-md hover:bg-blue-50 cursor-pointer transition transform hover:-translate-y-1"
                      >
                        {tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-700">
                현재 표시된 카테고리는 전체 한자의 다양한 분류 체계를 보여줍니다. 각 분류는 학습 과정에서 참고할 수 있습니다.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12 mb-8">
            <Link 
              href="/tags" 
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
            >
              태그별 탐색하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 