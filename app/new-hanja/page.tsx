'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeHanjaSystem, getHanjaByGrade, getHanjaByCategory, getHanjaByStrokeCount, getHanjaByRadical, getHanjaByPronunciation, searchHanja, getRelatedHanja, getCompoundWords, HanjaCharacter } from '@/utils/newHanjaUtils';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import ContentCard from '@/app/components/ContentCard';

export default function NewHanjaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grade15Hanja, setGrade15Hanja] = useState<any[]>([]);
  const [strokeCountHanja, setStrokeCountHanja] = useState<any[]>([]);
  const [radicalHanja, setRadicalHanja] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 시스템 초기화
        await initializeHanjaSystem();
        
        // 15급 한자 로드
        const grade15 = await getHanjaByGrade(15);
        setGrade15Hanja(grade15);
        
        // 획수별 한자 (2획)
        const twoStrokeHanja = getHanjaByStrokeCount(2);
        setStrokeCountHanja(twoStrokeHanja);
        
        // 부수별 한자 ('人')
        const personRadicalHanja = getHanjaByRadical('人');
        setRadicalHanja(personRadicalHanja);
        
        setError(null);
      } catch (err) {
        console.error('Error loading hanja data:', err);
        setError('한자 데이터를 로드하는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  const handleSearch = () => {
    if (!searchTerm) return;
    
    const results = searchHanja({ text: searchTerm });
    setSearchResults(results);
  };
  
  const navigateToHanjaDetail = (character: string) => {
    router.push(`/hanja-detail/${encodeURIComponent(character)}`);
  };
  
  // 한자 카드 컴포넌트
  const HanjaCard = ({ hanja }: { hanja: HanjaCharacter }) => {
    const router = useRouter();
    
    const handleClick = () => {
      router.push(`/hanja/${hanja.id}`);
    };

    return (
      <button
        onClick={handleClick}
        className="border rounded p-3 text-center hover:bg-gray-50 transition"
      >
        <div className="text-4xl font-serif">{hanja.character}</div>
        <div className="text-sm">{hanja.meaning}</div>
        <div className="text-xs text-gray-500">{hanja.pronunciation} ({hanja.stroke_count}획)</div>
      </button>
    );
  };
  
  // 검색 결과 없음 컴포넌트
  const NoResults = () => (
    <div className="text-center py-10">
      <p className="text-xl text-gray-500 mb-4">검색 결과가 없습니다.</p>
      <button 
        onClick={() => {
          setSearchTerm('');
          setSelectedGrade(null);
          setSelectedCategory(null);
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        필터 초기화
      </button>
    </div>
  );
  
  return (
    <PageContainer maxWidth="max-w-6xl">
      <PageHeader
        title="새로운 한자 시스템 테스트"
        description="관계형 구조로 구축된 새로운 한자 데이터베이스 시스템을 테스트합니다."
        navButtons={[
          {
            href: '/dashboard',
            label: '대시보드',
            colorClass: 'btn-primary'
          }
        ]}
      />
      
      {isLoading ? (
        <ContentCard>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">한자 데이터를 로드 중입니다...</span>
          </div>
        </ContentCard>
      ) : error ? (
        <ContentCard>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        </ContentCard>
      ) : (
        <>
          {/* 검색 기능 */}
          <ContentCard className="mb-6">
            <h2 className="text-xl font-bold mb-4">한자 검색</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="한자, 의미, 발음으로 검색"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                검색
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">검색 결과</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {searchResults.map((hanja) => (
                    <HanjaCard key={hanja.id} hanja={hanja} />
                  ))}
                </div>
              </div>
            )}
          </ContentCard>
          
          {/* 15급 한자 목록 */}
          <ContentCard className="mb-6">
            <h2 className="text-xl font-bold mb-4">15급 한자 ({grade15Hanja.length}자)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {grade15Hanja.map((hanja) => (
                <HanjaCard key={hanja.id} hanja={hanja} />
              ))}
            </div>
          </ContentCard>
          
          {/* 2획 한자 */}
          <ContentCard className="mb-6">
            <h2 className="text-xl font-bold mb-4">2획 한자 ({strokeCountHanja.length}자)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {strokeCountHanja.map((hanja) => (
                <HanjaCard key={hanja.id} hanja={hanja} />
              ))}
            </div>
          </ContentCard>
          
          {/* '人' 부수 한자 */}
          <ContentCard className="mb-6">
            <h2 className="text-xl font-bold mb-4">'人' 부수 한자 ({radicalHanja.length}자)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {radicalHanja.map((hanja) => (
                <HanjaCard key={hanja.id} hanja={hanja} />
              ))}
            </div>
          </ContentCard>
        </>
      )}
    </PageContainer>
  );
} 