'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import HanjaSearchResults from '../components/HanjaSearchResults';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 검색 히스토리를 로컬 스토리지에서 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('hanjaSearchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, []);

  // 새 검색어를 히스토리에 저장
  useEffect(() => {
    if (query && query.trim() !== '') {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('hanjaSearchHistory', JSON.stringify(newHistory));
      }
    }
  }, [query, searchHistory]);

  // 검색 히스토리에서 항목 제거
  const removeFromHistory = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanjaSearchHistory', JSON.stringify(newHistory));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 검색창 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">한자 검색</h1>
          <SearchBar 
            defaultValue={query} 
            size="lg" 
            className="max-w-4xl" 
            placeholder="한자, 한글음, 훈독 또는 의미로 검색하세요" 
          />
          <p className="text-blue-100 mt-3 text-center text-sm">
            예: '水', '木', '수', '나무', '물 수' 등으로 검색할 수 있습니다
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 왼쪽 사이드바 - 모바일에서는 숨김 */}
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-800">검색 도움말</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>한자: '水', '木', '山' 등</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>음독: '수', '목', '산' 등</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>훈독: '물', '나무', '뫼' 등</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>의미: '물 수', '나무 목' 등</span>
                </li>
              </ul>
            </div>

            {/* 최근 검색어 */}
            {searchHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">최근 검색어</h3>
                <ul className="space-y-2">
                  {searchHistory.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <Link 
                        href={`/search?q=${encodeURIComponent(item)}`}
                        className="text-blue-600 hover:underline truncate"
                      >
                        {item}
                      </Link>
                      <button 
                        onClick={() => removeFromHistory(item)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="삭제"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 메인 검색 결과 */}
          <div className="md:col-span-3">
            {/* 모바일에서만 보이는 히스토리 */}
            {searchHistory.length > 0 && (
              <div className="md:hidden bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                <h3 className="font-bold text-sm mb-2 text-gray-800">최근 검색어</h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 5).map((item, idx) => (
                    <Link 
                      key={idx}
                      href={`/search?q=${encodeURIComponent(item)}`}
                      className="text-sm bg-gray-50 text-blue-600 px-3 py-1 rounded-full border border-gray-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 검색 결과 표시 */}
            <HanjaSearchResults query={query} />
          </div>
        </div>
      </div>
    </div>
  );
} 