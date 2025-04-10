'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getHanjaIdByCharacter } from '@/utils/hanjaPageUtils';

// 오늘의 추천 한자 목록 - 정적 데이터
const recommendedHanja = [
  {
    character: '水',
    pronunciation: '수',
    meaning: '물 수',
    strokes: 4,
    example: '水泳(수영): 물에서 헤엄치는 것'
  },
  {
    character: '山',
    pronunciation: '산',
    meaning: '산 산',
    strokes: 3,
    example: '山林(산림): 산과 숲'
  },
  {
    character: '人',
    pronunciation: '인',
    meaning: '사람 인',
    strokes: 2,
    example: '人間(인간): 사람 사이, 사람'
  },
  {
    character: '心',
    pronunciation: '심',
    meaning: '마음 심',
    strokes: 4,
    example: '心臟(심장): 가슴 속에 있는 장기'
  },
  {
    character: '日',
    pronunciation: '일',
    meaning: '날 일, 해 일',
    strokes: 4,
    example: '日光(일광): 햇빛, 해의 빛'
  }
];

// 한자 카드 컴포넌트
const HanjaCard = ({ 
  character, 
  pronunciation, 
  meaning, 
  strokes, 
  example 
}: { 
  character: string; 
  pronunciation: string; 
  meaning: string; 
  strokes: number; 
  example: string;
}) => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  
  // 한자 ID 가져오기
  useEffect(() => {
    async function fetchHanjaId() {
      try {
        const id = await getHanjaIdByCharacter(character);
        setCharacterId(id);
      } catch (error) {
        console.error(`Error getting ID for character ${character}:`, error);
      }
    }
    
    fetchHanjaId();
  }, [character]);
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 bg-blue-50 flex items-center justify-center">
          <span className="text-7xl font-normal text-gray-900">{character}</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{pronunciation} ({meaning})</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {strokes}획
            </span>
          </div>
          <p className="text-gray-600 text-sm">{example}</p>
          <div className="mt-4">
            <Link 
              href={`/hanja/${characterId || character}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
            >
              상세 정보
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RecommendedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">
            오늘의 <span className="text-yellow-300">추천 한자</span>
          </h1>
          <p className="text-xl text-blue-100 mb-6 text-center max-w-3xl mx-auto">
            학습에 유용한 기초 한자를 매일 추천해 드립니다
          </p>
          <div className="text-center mt-6">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
              {new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4 pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {recommendedHanja.map((hanja, index) => (
              <HanjaCard
                key={index}
                character={hanja.character}
                pronunciation={hanja.pronunciation}
                meaning={hanja.meaning}
                strokes={hanja.strokes}
                example={hanja.example}
              />
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">추천 한자 학습 방법</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                위의 한자들은 기초 한자로서 자주 사용되는 한자들입니다. 
                아래의 방법으로 효과적으로 학습해 보세요.
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>한자의 모양을 자세히 살펴보고 구성 요소를 파악합니다.</li>
                <li>발음과 뜻을 여러 번 소리내어 읽어봅니다.</li>
                <li>한자를 종이에 여러 번 써보며 획순을 익힙니다.</li>
                <li>예문을 통해 실제 사용 맥락을 이해합니다.</li>
                <li>한자 조합으로 만들어지는 다양한 단어를 학습합니다.</li>
              </ol>
            </div>
          </div>
          
          <div className="text-center mt-12 mb-8">
            <Link 
              href="/learn" 
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
            >
              단계별 한자 학습하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 