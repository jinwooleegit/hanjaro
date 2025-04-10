'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HanjaCharacter, loadMoreCharacters, getTotalCharacterCount } from '@/utils/hanjaUtils';

type HanjaListProps = {
  characters: HanjaCharacter[];
  categoryId: string;
  levelId: string;
};

export default function HanjaList({ characters, categoryId, levelId }: HanjaListProps) {
  const [displayedCharacters, setDisplayedCharacters] = useState<HanjaCharacter[]>(characters);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const charactersPerPage = 20;

  // 초기 로딩
  useEffect(() => {
    setDisplayedCharacters(characters);
    
    // 총 한자 개수 가져오기
    const total = getTotalCharacterCount(categoryId, levelId);
    setTotalCount(total);
    
    // 더 많은 데이터가 있는지 확인
    setHasMoreData(characters.length < total);
  }, [characters, categoryId, levelId]);

  // 더 많은 한자 로드
  const loadMore = async () => {
    if (isLoading || !hasMoreData) return;
    
    setIsLoading(true);
    try {
      console.log(`더 많은 한자 로드 시도: ${categoryId}/${levelId}, 현재 페이지: ${currentPage}`);
      const nextPage = currentPage + 1;
      const moreCharacters = await loadMoreCharacters(categoryId, levelId, charactersPerPage);
      
      console.log(`로드된 새 한자 수: ${moreCharacters.length}`);
      
      if (moreCharacters.length > 0) {
        setDisplayedCharacters(prev => {
          // 중복 제거를 위해 Map 사용
          const uniqueChars = new Map();
          
          // 기존 한자 추가
          prev.forEach(char => {
            uniqueChars.set(char.character, char);
          });
          
          // 새 한자 추가
          moreCharacters.forEach(char => {
            uniqueChars.set(char.character, char);
          });
          
          // Map을 배열로 변환하여 반환
          return Array.from(uniqueChars.values());
        });
        setCurrentPage(nextPage);
        
        // 더 많은 데이터가 있는지 확인
        setHasMoreData(displayedCharacters.length + moreCharacters.length < totalCount);
      } else {
        // 더 이상 로드할 데이터가 없음
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('한자 추가 로드 오류:', error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리에 따른 색상 가져오기
  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'beginner': 
      case 'elementary': // 이전 카테고리 호환성
      case 'basic': // 이전 카테고리 호환성
        return {
          bg: 'from-blue-50 to-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'intermediate':
      case 'middle': // 이전 카테고리 호환성
        return {
          bg: 'from-green-50 to-green-100',
          border: 'border-green-200',
          text: 'text-green-800',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'advanced':
      case 'high': // 이전 카테고리 호환성
        return {
          bg: 'from-yellow-50 to-yellow-100',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'expert':
      case 'university': // 이전 카테고리 호환성
        return {
          bg: 'from-pink-50 to-pink-100',
          border: 'border-pink-200',
          text: 'text-pink-800',
          button: 'bg-pink-600 hover:bg-pink-700'
        };
      default:
        return {
          bg: 'from-slate-50 to-slate-100',
          border: 'border-slate-200',
          text: 'text-slate-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getCategoryColor(categoryId);

  return (
    <div className={`rounded-xl shadow-lg p-6 bg-gradient-to-br ${colors.bg}`}>
      <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>한자 목록</h2>
      
      {displayedCharacters.length === 0 ? (
        <p className="text-gray-500 text-center py-8 bg-white bg-opacity-60 rounded-lg">
          이 레벨에는 아직 한자가 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedCharacters.map((character, index) => (
              <Link
                key={`${character.character}_${index}`}
                href={`/hanja/${character.id || character.character}?category=${categoryId}&level=${levelId}`}
                className={`bg-white bg-opacity-80 hover:bg-opacity-100 p-4 rounded-xl text-center transition-all duration-300 border ${colors.border} transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center`}
              >
                <div className={`text-5xl font-bold mb-3 ${colors.text} hanja-text`} style={{ fontFamily: "var(--font-noto-serif-kr), 'Batang', serif" }}>{character.character}</div>
                <div className="text-sm font-medium text-gray-700">{character.meaning}</div>
                <div className="text-xs text-gray-500 mt-1">{character.pronunciation}</div>
                <div className="mt-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500">획수: {character.stroke_count}</div>
              </Link>
            ))}
          </div>
          
          {/* 로딩 상태 및 페이지네이션 */}
          <div className="mt-12 flex flex-col items-center">
            {isLoading ? (
              <div className="flex items-center p-3 bg-white bg-opacity-70 rounded-full shadow">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-gray-600">로딩 중...</span>
              </div>
            ) : (
              hasMoreData && (
                <button
                  onClick={loadMore}
                  className={`px-8 py-3 ${colors.button} text-white rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 font-semibold`}
                >
                  더 많은 한자 보기
                </button>
              )
            )}
            
            {totalCount > 0 && (
              <div className="text-gray-600 text-sm mt-4 bg-white bg-opacity-60 px-4 py-2 rounded-full shadow-sm">
                총 {totalCount}개 중 {displayedCharacters.length}개 로드됨
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 