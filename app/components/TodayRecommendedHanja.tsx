'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCharactersForLevel, HanjaCharacter } from '@/utils/hanjaUtils';
import { motion } from 'framer-motion';

/**
 * 오늘의 추천 한자 컴포넌트
 * 다섯 가지 교육 수준별 대표 한자를 표시합니다:
 * 초등학교, 중학교, 고등학교, 대학교, 전문가
 * 새로고침할 때마다 랜덤으로 한자가 변경됩니다.
 */

// 추천 한자 캐릭터 타입 정의
interface RecommendedHanjaCharacter extends HanjaCharacter {
  category?: {
    id: string;
    name: string;
  };
}

// 교육 수준별 실제 레벨 경로 매핑 (애플리케이션 라우팅에 맞게 변경)
const educationLevelsMappings = {
  // 웹 애플리케이션 경로 구조에 맞는 카테고리와 레벨 매핑
  elementary: { pathCategory: 'elementary', pathLevel: 'level1' },
  middle: { pathCategory: 'middle', pathLevel: 'level1' },
  high: { pathCategory: 'high', pathLevel: 'level1' },
  university: { pathCategory: 'university', pathLevel: 'level1' },
  expert: { pathCategory: 'expert', pathLevel: 'level1' }
};

export default function TodayRecommendedHanja() {
  const [recommendedHanja, setRecommendedHanja] = useState<RecommendedHanjaCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 교육 수준별 랜덤 한자 가져오기
  const getRecommendedHanja = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 각 교육 수준별로 한자 가져오기
      const educationLevels = [
        { id: 'elementary', name: '초등학교', levelId: 'level1' },
        { id: 'middle', name: '중학교', levelId: 'level1' },
        { id: 'high', name: '고등학교', levelId: 'level1' },
        { id: 'university', name: '대학', levelId: 'level1' },
        { id: 'expert', name: '전문가', levelId: 'level1' }
      ];

      const fetchedHanja: RecommendedHanjaCharacter[] = [];
      
      // 각 교육 수준별로 한자 가져오기
      for (const level of educationLevels) {
        try {
          const characters = getCharactersForLevel(level.id, level.levelId);
          
          console.log(`${level.name} 추천 한자 로딩:`, characters.length);
          
          if (characters.length > 0) {
            // 랜덤으로 하나 선택
            const randomIndex = Math.floor(Math.random() * characters.length);
            const selectedHanja = characters[randomIndex];
            
            // 카테고리 정보 추가
            fetchedHanja.push({
              ...selectedHanja,
              category: {
                id: level.id,
                name: level.name
              }
            });
          }
        } catch (levelError) {
          console.error(`${level.name} 추천 한자 로드 오류:`, levelError);
          // 개별 레벨 실패해도 계속 진행
        }
      }
      
      setRecommendedHanja(fetchedHanja);
      
      // 모든 레벨에서 한자를 가져오지 못한 경우
      if (fetchedHanja.length === 0) {
        setError('추천 한자를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('추천 한자를 가져오는 중 오류가 발생했습니다:', error);
      setError('추천 한자를 불러오는 중 오류가 발생했습니다.');
      setRecommendedHanja([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecommendedHanja();
  }, []);

  // 로딩 중일 때 로딩 UI 표시
  if (loading) {
    return (
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">오늘의 추천 한자</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-24 w-24 mx-auto mb-2 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-3/4 mx-auto mb-2 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-1/2 mx-auto mb-4 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-full bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 추천 한자가 없을 때
  if (recommendedHanja.length === 0 || error) {
    return (
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">오늘의 추천 한자</h2>
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-700">{error || '현재 추천 한자를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.'}</p>
          <button
            onClick={() => getRecommendedHanja()}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  // 추천 한자 화면에 표시
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">오늘의 추천 한자</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recommendedHanja.map((hanja, index) => {
          // 해당 교육 수준에 맞는 실제 카테고리와 레벨 ID로 매핑
          const categoryId = hanja.category?.id || 'elementary';
          const { pathCategory, pathLevel } = educationLevelsMappings[categoryId as keyof typeof educationLevelsMappings] || 
                         educationLevelsMappings.elementary;
          
          // 레벨 경로 구성 (경로 형식: 'categoryId-levelId')
          const levelPath = `${pathCategory}-${pathLevel}`;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 relative overflow-hidden hover:shadow-md transition-shadow"
            >
              {hanja.category && (
                <div
                  className={`
                    absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full text-white
                    ${hanja.category.id === 'elementary' ? 'bg-blue-500' : ''}
                    ${hanja.category.id === 'middle' ? 'bg-green-500' : ''}
                    ${hanja.category.id === 'high' ? 'bg-yellow-500' : ''}
                    ${hanja.category.id === 'university' ? 'bg-purple-500' : ''}
                    ${hanja.category.id === 'expert' ? 'bg-red-500' : ''}
                  `}
                >
                  {hanja.category.name}
                </div>
              )}
              <div className="text-center">
                <div
                  className={`
                    text-6xl font-bold mb-2 mx-auto inline-block
                    ${hanja.grade <= 2 ? 'text-blue-600' : ''}
                    ${hanja.grade > 2 && hanja.grade <= 4 ? 'text-green-600' : ''}
                    ${hanja.grade > 4 && hanja.grade <= 6 ? 'text-yellow-600' : ''}
                    ${hanja.grade > 6 ? 'text-red-600' : ''}
                  `}
                >
                  {hanja.character}
                </div>
                <p className="text-lg font-semibold mb-1">{hanja.meaning}</p>
                <p className="text-sm text-gray-500 mb-3">{hanja.pronunciation}</p>
                
                {/* 경로를 두 가지 옵션으로 제공 */}
                {/* 첫 번째: 단계별 학습에서 한자를 보는 링크 */}
                <Link
                  href={`/learn/level/${levelPath}`}
                  className="block w-full bg-primary text-white rounded-md py-2 text-center hover:bg-primary/90 transition-colors"
                >
                  학습 시작하기
                </Link>
                
                {/* 두 번째: 개별 한자 상세 페이지 링크 (클릭 후 한자 위에 올렸을 때 툴팁으로 표시) */}
                <div className="mt-2">
                  <Link
                    href={`/learn/hanja/${hanja.character}`}
                    className="text-sm text-blue-600 hover:underline"
                    title={`${hanja.character} 상세 정보 보기`}
                  >
                    한자 상세 보기
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}