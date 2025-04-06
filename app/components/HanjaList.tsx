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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">한자 목록</h2>
      
      {displayedCharacters.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          이 레벨에는 아직 한자가 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedCharacters.map((character) => (
              <Link
                key={`${character.character}_${character.order}`}
                href={`/learn/hanja/${character.character}?category=${categoryId}&level=${levelId}`}
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition border border-gray-200 hover:border-primary flex flex-col items-center"
              >
                <div className="text-4xl font-bold mb-2">{character.character}</div>
                <div className="text-sm text-gray-700">{character.meaning}</div>
                <div className="text-xs text-gray-500 mt-1">{character.pronunciation}</div>
                <div className="text-xs text-gray-400 mt-1">획수: {character.stroke_count}</div>
              </Link>
            ))}
          </div>
          
          {/* 로딩 상태 및 페이지네이션 */}
          <div className="mt-8 flex flex-col items-center">
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-gray-600">로딩 중...</span>
              </div>
            ) : (
              hasMoreData && (
                <button
                  onClick={loadMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  더 많은 한자 보기
                </button>
              )
            )}
            
            {totalCount > 0 && (
              <div className="text-gray-500 text-sm mt-2">
                총 {totalCount}개 중 {displayedCharacters.length}개 로드됨
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 