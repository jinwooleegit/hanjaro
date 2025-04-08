'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { HanjaCharacter, cachedSearchHanja } from '../../lib/hanja';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<HanjaCharacter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 검색어 변경 시 결과 업데이트
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setIsLoading(true);
      // 디바운스를 위한 타이머
      const timer = setTimeout(() => {
        try {
          const results = cachedSearchHanja(searchTerm, {
            searchCharacter: true,
            searchPronunciation: true,
            searchMeaning: true,
            useCache: true
          });
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('검색 오류:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  // 검색창 외부 클릭 시 결과창 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="한자, 음독, 훈독, 의미로 검색하기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => {
            if (searchTerm.trim().length > 0) {
              setShowResults(true);
            }
          }}
          className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : searchTerm.trim().length > 0 ? (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* 검색 결과 드롭다운 */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-10 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">검색 결과 ({searchResults.length})</h3>
            <div className="space-y-2">
              {searchResults.slice(0, 10).map((result) => (
                <Link
                  key={result.id}
                  href={`/learn/hanja/${encodeURIComponent(result.character)}`}
                  onClick={() => setShowResults(false)}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="text-3xl font-serif mr-4">{result.character}</div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {result.kor_pronunciation.join(', ')} ({result.kor_meaning.join(', ')})
                      </div>
                      <div className="text-sm text-gray-600">{result.meaning}</div>
                    </div>
                    {result.level && (
                      <div className="ml-auto">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {result.level}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              
              {searchResults.length > 10 && (
                <Link
                  href={`/search?q=${encodeURIComponent(searchTerm)}`}
                  onClick={() => setShowResults(false)}
                  className="block text-center py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  모든 결과 보기 ({searchResults.length})
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과가 없는 경우 */}
      {showResults && searchTerm.trim().length > 0 && searchResults.length === 0 && !isLoading && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-10">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-2">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-500">다른 검색어로 시도해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
} 