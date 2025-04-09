'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// 인기 한자 목록 (실제 데이터로 대체해야 함)
const popularHanjaList = [
  { id: 1, character: '人', meaning: '사람 인', pronunciation: '인', level: 'beginner-level1', views: 1245 },
  { id: 2, character: '水', meaning: '물 수', pronunciation: '수', level: 'beginner-level1', views: 1198 },
  { id: 3, character: '火', meaning: '불 화', pronunciation: '화', level: 'beginner-level1', views: 1156 },
  { id: 4, character: '日', meaning: '날 일', pronunciation: '일', level: 'beginner-level1', views: 1120 },
  { id: 5, character: '月', meaning: '달 월', pronunciation: '월', level: 'beginner-level1', views: 1089 },
  { id: 6, character: '金', meaning: '쇠 금', pronunciation: '금', level: 'beginner-level2', views: 1043 },
  { id: 7, character: '木', meaning: '나무 목', pronunciation: '목', level: 'beginner-level1', views: 1021 },
  { id: 8, character: '土', meaning: '흙 토', pronunciation: '토', level: 'beginner-level1', views: 987 }
];

export default function PopularHanjaList() {
  const [selectedHanja, setSelectedHanja] = useState(popularHanjaList[0]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={selectedHanja.id}
              className="mb-6"
            >
              <div className="h-40 w-40 mx-auto bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-md flex items-center justify-center border border-blue-100">
                <span className="text-7xl font-semibold text-slate-800">
                  {selectedHanja.character}
                </span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              key={`info-${selectedHanja.id}`}
              className="space-y-3"
            >
              <h3 className="text-xl font-bold text-slate-800">
                {selectedHanja.meaning}
              </h3>
              <p className="text-gray-600">
                발음: <span className="font-medium">{selectedHanja.pronunciation}</span>
              </p>
              <p className="text-sm text-gray-500">
                조회수: {selectedHanja.views.toLocaleString()}
              </p>
              <Link 
                href={`/learn/character/${selectedHanja.character}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                자세히 보기
              </Link>
            </motion.div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">인기 한자 목록</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
            {popularHanjaList.map((hanja) => (
              <button
                key={hanja.id}
                onClick={() => setSelectedHanja(hanja)}
                className={`h-20 rounded-lg border transition-all flex items-center justify-center
                  ${selectedHanja.id === hanja.id 
                    ? 'bg-blue-50 border-blue-300 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
              >
                <div className="text-center">
                  <span className="block text-3xl font-medium text-slate-700">
                    {hanja.character}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {hanja.pronunciation}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6">
            <Link 
              href="/learn"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end"
            >
              더 많은 인기 한자 보기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 