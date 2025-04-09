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

// 하드코딩된 샘플 한자 데이터 (API가 실패할 경우의 대비책)
const sampleHanjaData: RecommendedHanjaCharacter[] = [
  {
    character: '人',
    pronunciation: '인',
    meaning: '사람',
    radical: '人',
    stroke_count: 2,
    grade: 1,
    examples: [],
    category: {
      id: 'elementary',
      name: '초등학교'
    }
  },
  {
    character: '山',
    pronunciation: '산',
    meaning: '산',
    radical: '山',
    stroke_count: 3,
    grade: 1,
    examples: [],
    category: {
      id: 'elementary',
      name: '초등학교'
    }
  },
  {
    character: '水',
    pronunciation: '수',
    meaning: '물',
    radical: '水',
    stroke_count: 4,
    grade: 2,
    examples: [],
    category: {
      id: 'middle',
      name: '중학교'
    }
  },
  {
    character: '火',
    pronunciation: '화',
    meaning: '불',
    radical: '火',
    stroke_count: 4,
    grade: 1,
    examples: [],
    category: {
      id: 'middle',
      name: '중학교'
    }
  },
  {
    character: '木',
    pronunciation: '목',
    meaning: '나무',
    radical: '木',
    stroke_count: 4,
    grade: 1,
    examples: [],
    category: {
      id: 'high',
      name: '고등학교'
    }
  },
  {
    character: '土',
    pronunciation: '토',
    meaning: '흙',
    radical: '土',
    stroke_count: 3,
    grade: 1,
    examples: [],
    category: {
      id: 'university',
      name: '대학'
    }
  },
  {
    character: '金',
    pronunciation: '금',
    meaning: '쇠, 금',
    radical: '金',
    stroke_count: 8,
    grade: 1,
    examples: [],
    category: {
      id: 'expert',
      name: '전문가'
    }
  }
];

// 각 카테고리별 대표 한자 (JSON 파일이 없거나 오류 발생 시 사용)
const categoryRepresentativeHanja: Record<string, RecommendedHanjaCharacter> = {
  'elementary': {
    character: '日',
    pronunciation: '일',
    meaning: '해, 날',
    radical: '日',
    stroke_count: 4,
    grade: 1,
    examples: [],
    category: { id: 'elementary', name: '초등학교' }
  },
  'middle': {
    character: '月',
    pronunciation: '월',
    meaning: '달',
    radical: '月',
    stroke_count: 4,
    grade: 1,
    examples: [],
    category: { id: 'middle', name: '중학교' }
  },
  'high': {
    character: '車',
    pronunciation: '차',
    meaning: '수레, 차',
    radical: '車',
    stroke_count: 7,
    grade: 2,
    examples: [],
    category: { id: 'high', name: '고등학교' }
  },
  'university': {
    character: '心',
    pronunciation: '심',
    meaning: '마음',
    radical: '心',
    stroke_count: 4,
    grade: 2,
    examples: [],
    category: { id: 'university', name: '대학' }
  },
  'expert': {
    character: '門',
    pronunciation: '문',
    meaning: '문',
    radical: '門',
    stroke_count: 8,
    grade: 3,
    examples: [],
    category: { id: 'expert', name: '전문가' }
  }
};

export default function TodayRecommendedHanja() {
  const [recommendedHanja, setRecommendedHanja] = useState<RecommendedHanjaCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<number | null>(null);

  // 교육 수준별 랜덤 한자 가져오기
  const getRecommendedHanja = async () => {
    // 빠른 로딩을 위해 타임아웃 설정
    const loadingTimeout = setTimeout(() => {
      // 3초 이상 로딩되면 샘플 데이터로 폴백
      if (loading) {
        console.log('데이터 로딩 시간 초과, 샘플 데이터 사용');
        setRecommendedHanja(sampleHanjaData);
        setLoading(false);
      }
    }, 3000);
    
    setLoading(true);
    setError(null);
    
    try {
      // 로컬 스토리지 지원 확인
      let hasLocalStorage = false;
      try {
        hasLocalStorage = typeof window !== 'undefined' && window.localStorage !== undefined;
      } catch (e) {
        console.error('로컬 스토리지 접근 오류:', e);
      }
      
      // 로컬 스토리지에서 이전에 생성된 추천 한자 데이터 확인
      let storedHanja = null;
      let storedTime = null;
      
      if (hasLocalStorage) {
        try {
          storedHanja = localStorage.getItem('recommendedHanja');
          storedTime = localStorage.getItem('recommendedHanjaTime');
        } catch (e) {
          console.error('로컬 스토리지 데이터 읽기 오류:', e);
        }
      }
      
      const currentTime = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000; // 24시간을 밀리초로 변환
      
      // 저장된 데이터가 있고, 24시간이 지나지 않았다면 그대로 사용
      if (storedHanja && storedTime) {
        try {
          const timeDiff = currentTime - parseInt(storedTime, 10);
          
          if (timeDiff < oneDayMs) {
            console.log('로컬 스토리지에서 기존 추천 한자 데이터를 불러옵니다.');
            
            try {
              const parsedData = JSON.parse(storedHanja);
              if (Array.isArray(parsedData) && parsedData.length > 0) {
                setRecommendedHanja(parsedData);
                setLastGenerated(parseInt(storedTime, 10));
                setLoading(false);
                clearTimeout(loadingTimeout);
                return;
              }
            } catch (parseError) {
              console.error('저장된 한자 데이터 파싱 오류:', parseError);
              // 파싱 오류 시 계속 진행하여 새 데이터 생성
            }
          }
        } catch (e) {
          console.error('저장된 시간 파싱 오류:', e);
          // 오류 발생 시 계속 진행
        }
      }
      
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
          // getCharactersForLevel 호출을 try-catch로 래핑
          let characters: HanjaCharacter[] = [];
          try {
            characters = getCharactersForLevel(level.id, level.levelId);
          } catch (charError) {
            console.error(`${level.name} 문자 데이터 로드 오류:`, charError);
            // 오류 발생 시 빈 배열 사용
            characters = [];
          }
          
          console.log(`${level.name} 추천 한자 로딩:`, characters.length);
          
          if (characters && Array.isArray(characters) && characters.length > 0) {
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
          } else {
            // 레벨에 한자가 없는 경우 기본 대표 한자 사용
            console.log(`${level.name} 레벨에 한자가 없어 대표 한자를 사용합니다.`);
            
            if (categoryRepresentativeHanja[level.id]) {
              fetchedHanja.push(categoryRepresentativeHanja[level.id]);
            }
          }
        } catch (levelError) {
          console.error(`${level.name} 추천 한자 로드 오류:`, levelError);
          // 오류 발생 시 해당 카테고리 대표 한자를 사용
          if (categoryRepresentativeHanja[level.id]) {
            fetchedHanja.push(categoryRepresentativeHanja[level.id]);
          }
        }
      }
      
      // 추천 한자를 충분히 찾지 못했을 경우 부족한 부분 샘플 데이터로 채우기
      if (fetchedHanja.length < educationLevels.length) {
        console.log(`추천 한자 개수가 부족하여 샘플 데이터로 보충합니다. (현재: ${fetchedHanja.length}개)`);
        
        // 누락된 카테고리 식별
        const fetchedCategories = fetchedHanja.map(h => h.category?.id);
        const missingCategories = educationLevels
          .map(l => l.id)
          .filter(id => !fetchedCategories.includes(id));
        
        // 누락된 카테고리마다 샘플 데이터에서 해당 카테고리 한자 추가
        for (const catId of missingCategories) {
          const sampleForCategory = sampleHanjaData.find(h => h.category?.id === catId);
          if (sampleForCategory) {
            fetchedHanja.push(sampleForCategory);
          }
        }
        
        // 그래도 부족하면 샘플 데이터에서 부족한 만큼 채우기
        while (fetchedHanja.length < educationLevels.length && fetchedHanja.length < sampleHanjaData.length) {
          const nextSample = sampleHanjaData[fetchedHanja.length];
          // 중복 방지
          if (!fetchedHanja.some(h => h.character === nextSample.character)) {
            fetchedHanja.push(nextSample);
          }
        }
      }
      
      // 모든 시도에도 한자를 찾지 못했을 경우 샘플 데이터 사용
      if (fetchedHanja.length === 0) {
        console.log('추천 한자 데이터를 찾을 수 없어 샘플 데이터를 사용합니다.');
        setRecommendedHanja(sampleHanjaData);
        setLastGenerated(currentTime);
      } else {
        setRecommendedHanja(fetchedHanja);
        setLastGenerated(currentTime);
        
        // 로컬 스토리지에 추천 한자와 생성 시간 저장
        if (hasLocalStorage) {
          try {
            localStorage.setItem('recommendedHanja', JSON.stringify(fetchedHanja));
            localStorage.setItem('recommendedHanjaTime', currentTime.toString());
          } catch (storageError) {
            console.error('로컬 스토리지 저장 오류:', storageError);
            // 저장 실패해도 기능은 계속 동작
          }
        }
      }
    } catch (error) {
      console.error('추천 한자를 가져오는 중 오류가 발생했습니다:', error);
      setError('추천 한자를 불러오는 중 오류가 발생했습니다.');
      // 에러 발생 시 샘플 데이터 사용
      setRecommendedHanja(sampleHanjaData);
      setLastGenerated(Date.now());
    } finally {
      setLoading(false);
      clearTimeout(loadingTimeout);
    }
  };

  useEffect(() => {
    // 추천 한자 가져오기
    getRecommendedHanja();
    
    // 컴포넌트가 마운트된 지 5초가 지나도 여전히 로딩 중이면 샘플 데이터로 대체
    const fallbackTimer = setTimeout(() => {
      if (recommendedHanja.length === 0) {
        console.log('5초 제한 시간이 지나 샘플 데이터를 표시합니다.');
        setRecommendedHanja(sampleHanjaData);
        setLoading(false);
        setLastGenerated(Date.now());
      }
    }, 5000);
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  // 컴포넌트 렌더링 중에 recommendedHanja가 없는 경우를 처리하기 위한 useEffect
  useEffect(() => {
    // 로딩이 끝났는데도 데이터가 없으면 샘플 데이터 설정
    if (!loading && recommendedHanja.length === 0) {
      console.log('데이터가 없어 샘플 데이터를 표시합니다.');
      setRecommendedHanja(sampleHanjaData);
      if (!lastGenerated) {
        setLastGenerated(Date.now());
      }
    }
  }, [loading, recommendedHanja.length, lastGenerated]);

  // 다음 갱신 시간 계산 함수
  const getNextRefreshTime = () => {
    if (!lastGenerated) return '다음 접속 시';
    
    const oneDayMs = 24 * 60 * 60 * 1000;
    const nextRefresh = new Date(lastGenerated + oneDayMs);
    
    return nextRefresh.toLocaleString();
  };

  // 로딩 중일 때 로딩 UI 표시 (3초 이내에만 표시)
  if (loading && recommendedHanja.length === 0) {
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
  
  // 어떤 상황에서든 표시할 데이터 준비
  const hanjaToDisplay = recommendedHanja.length > 0 ? recommendedHanja : sampleHanjaData;

  // 추천 한자 화면에 표시
  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">오늘의 추천 한자</h2>
        {lastGenerated && (
          <div className="text-sm text-gray-500">
            다음 갱신: {getNextRefreshTime()}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {hanjaToDisplay.map((hanja, index) => {
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