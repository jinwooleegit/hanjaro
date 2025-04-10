'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchHanja, HanjaCharacter } from '@/utils/hanjaUtils';
import { motion } from 'framer-motion';

interface HanjaSearchResultsProps {
  query: string;
}

export default function HanjaSearchResults({ query }: HanjaSearchResultsProps) {
  const [results, setResults] = useState<HanjaCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 검색 쿼리가 바뀔 때마다 검색 실행
  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchHanja(query);
        setResults(searchResults);
        
        if (searchResults.length === 0) {
          setError(`'${query}'에 대한 검색 결과가 없습니다.`);
        }
      } catch (err) {
        console.error('검색 오류:', err);
        setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // 로딩 상태일 때
  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">검색 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태일 때
  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700 mb-2">{error}</p>
          <p className="text-gray-600 text-sm">다른 키워드로 검색해 보세요.</p>
        </div>
      </div>
    );
  }

  // 검색 결과가 없거나 검색어가 빈 문자열일 때
  if (results.length === 0 && !loading && !error) {
    if (query.trim() === '') {
      return (
        <div className="mt-8 text-center text-gray-500">
          <p>한자, 음훈 또는 의미로 검색해보세요.</p>
        </div>
      );
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">'{query}' 검색 결과 ({results.length})</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((hanja, index) => (
          <motion.div
            key={`${hanja.character}_${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <Link href={`/hanja/${hanja.id || encodeURIComponent(hanja.character)}`} className="block w-full">
              <div className="text-center">
                <div
                  className={`
                    text-5xl font-bold mb-2 text-center
                    ${hanja.grade <= 2 ? 'text-blue-600' : ''}
                    ${hanja.grade > 2 && hanja.grade <= 4 ? 'text-green-600' : ''}
                    ${hanja.grade > 4 && hanja.grade <= 6 ? 'text-yellow-600' : ''}
                    ${hanja.grade > 6 ? 'text-red-600' : ''}
                  `}
                >
                  {hanja.character}
                </div>
                <p className="text-lg font-semibold mb-1">{hanja.meaning}</p>
                <p className="text-sm text-gray-500">{hanja.pronunciation}</p>
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                  <span>획수: {hanja.stroke_count}</span>
                  <span>부수: {hanja.radical || '—'}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 검색 결과가 있지만 적을 경우 추가 안내 */}
      {results.length > 0 && results.length < 3 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-blue-700 text-sm">
            더 많은 검색 결과를 보려면 다른 키워드로 검색해보세요. 한자, 음훈, 의미 모두 검색이 가능합니다.
          </p>
        </div>
      )}
    </div>
  );
} 