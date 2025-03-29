import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

// 샘플 한자 데이터
const sampleHanjaData = [
  {
    id: 1,
    character: '人',
    meaning: '사람 인',
    pronunciation: '인',
    strokes: 2,
    examples: ['人間(인간): 사람', '人格(인격): 인격'],
    level: 1,
    story: '두 획이 서로 기대어 있는 모습이 사람이 두 다리로 서 있는 모습을 표현하고 있습니다.'
  },
  {
    id: 2,
    character: '山',
    meaning: '산 산',
    pronunciation: '산',
    strokes: 3,
    examples: ['山水(산수): 산과 물', '登山(등산): 산에 오름'],
    level: 1,
    story: '세 개의 봉우리가 있는 모습이 산의 형태를 나타냅니다.'
  },
  {
    id: 3,
    character: '水',
    meaning: '물 수',
    pronunciation: '수',
    strokes: 4,
    examples: ['水源(수원): 물의 근원', '水泳(수영): 물에서 헤엄침'],
    level: 1,
    story: '물이 흐르는 모습을 형상화했습니다.'
  },
  {
    id: 4,
    character: '火',
    meaning: '불 화',
    pronunciation: '화',
    strokes: 4,
    examples: ['火山(화산): 불을 뿜는 산', '火災(화재): 불로 인한 재해'],
    level: 1,
    story: '불꽃이 타오르는 모습을 형상화했습니다.'
  },
  {
    id: 5,
    character: '木',
    meaning: '나무 목',
    pronunciation: '목',
    strokes: 4,
    examples: ['木材(목재): 나무 재료', '木曜日(목요일): 목성의 날'],
    level: 1,
    story: '나무의 줄기와 가지를 형상화했습니다.'
  },
  {
    id: 6,
    character: '金',
    meaning: '쇠 금',
    pronunciation: '금',
    strokes: 8,
    examples: ['金属(금속): 금속', '金曜日(금요일): 금성의 날'],
    level: 1,
    story: '땅 속에 묻힌 광석을 표현한 것으로 보입니다.'
  }
];

export default function Learn() {
  const [selectedHanja, setSelectedHanja] = useState(sampleHanjaData[0]);
  const [showStrokeOrder, setShowStrokeOrder] = useState(false);
  
  return (
    <>
      <Head>
        <title>학습하기 - 한자로(韓字路)</title>
        <meta name="description" content="한자로(韓字路)에서 체계적으로 한자를 학습하세요." />
      </Head>

      <main className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">기초 한자 학습</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 한자 선택 영역 (왼쪽) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="font-bold text-xl mb-4">학습할 한자</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                {sampleHanjaData.map((hanja) => (
                  <button
                    key={hanja.id}
                    className={`aspect-square flex items-center justify-center text-3xl rounded-md transition-colors ${
                      selectedHanja.id === hanja.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedHanja(hanja)}
                  >
                    {hanja.character}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-bold mb-2">학습 진행도</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  레벨 1: 6/20 학습 완료
                </p>
              </div>
            </div>
          </div>
          
          {/* 한자 상세 정보 영역 (오른쪽) */}
          <div className="lg:col-span-2">
            <motion.div 
              key={selectedHanja.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {/* 한자 헤더 */}
              <div className="bg-primary/10 p-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <span className="text-6xl font-bold mr-6">{selectedHanja.character}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedHanja.meaning}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      음: {selectedHanja.pronunciation} | 획수: {selectedHanja.strokes}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="btn-primary"
                    onClick={() => setShowStrokeOrder(!showStrokeOrder)}
                  >
                    {showStrokeOrder ? '정보 보기' : '필순 보기'}
                  </button>
                </div>
              </div>
              
              {/* 한자 콘텐츠 */}
              <div className="p-6">
                {showStrokeOrder ? (
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-4">필순</h3>
                    <div className="relative w-64 h-64 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {/* 여기에는 실제로 SVG 필순 애니메이션이 들어갑니다 */}
                      <svg className="w-full h-full stroke-animation" viewBox="0 0 100 100">
                        {selectedHanja.character === '人' && (
                          <>
                            <path
                              d="M 30 20 L 50 70"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-stroke-draw"
                              strokeDasharray="100"
                              strokeDashoffset="100"
                              style={{ animationDelay: '0s' }}
                            />
                            <path
                              d="M 50 70 L 70 20"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-stroke-draw"
                              strokeDasharray="100"
                              strokeDashoffset="100"
                              style={{ animationDelay: '1s' }}
                            />
                          </>
                        )}
                        {selectedHanja.character === '山' && (
                          <>
                            <path
                              d="M 30 20 L 50 40"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-stroke-draw"
                            />
                            <path
                              d="M 50 40 L 70 20"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-stroke-draw"
                              style={{ animationDelay: '0.5s' }}
                            />
                            <path
                              d="M 50 40 L 50 80"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-stroke-draw"
                              style={{ animationDelay: '1s' }}
                            />
                          </>
                        )}
                        {/* 다른 한자들은 여기에 추가 */}
                        <text x="40" y="40" className="text-4xl fill-gray-400 dark:fill-gray-600" style={{ opacity: 0.2 }}>
                          {selectedHanja.character}
                        </text>
                      </svg>
                    </div>
                    <div className="mt-6 text-center">
                      <p className="mb-2">직접 따라 그려보세요!</p>
                      <button className="btn-secondary">
                        필기 연습 시작하기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2">유래 및 설명</h3>
                      <p>{selectedHanja.story}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2">예문</h3>
                      <ul className="space-y-2">
                        {selectedHanja.examples.map((example, index) => (
                          <li key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-2">연관 한자</h3>
                      <div className="flex flex-wrap gap-2">
                        {/* 여기에 연관 한자들이 나열됩니다 */}
                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                          木 (나무 목)
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                          林 (수풀 림)
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                          森 (빽빽할 삼)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 한자 푸터 */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between">
                <button className="btn-outline">
                  이전 한자
                </button>
                <button className="btn-primary">
                  학습 완료
                </button>
                <button className="btn-outline">
                  다음 한자
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 퀴즈 섹션 */}
        <div className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">학습 확인 퀴즈</h2>
            <p className="mb-6">지금까지 배운 한자를 테스트해보세요!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">뜻 맞추기</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">한자를 보고 뜻을 맞춰보세요.</p>
                <Link href="/quiz/meaning" className="btn-secondary block text-center">
                  시작하기
                </Link>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">한자 고르기</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">뜻을 보고 알맞은 한자를 고르세요.</p>
                <Link href="/quiz/character" className="btn-secondary block text-center">
                  시작하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 