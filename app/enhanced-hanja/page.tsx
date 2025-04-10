'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { initializeHanjaSystem, loadExtendedHanjaData, HanjaCharacter } from '@/utils/newHanjaUtils';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import ContentCard from '@/app/components/ContentCard';

export default function EnhancedHanjaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extendedHanja, setExtendedHanja] = useState<HanjaCharacter[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 시스템 초기화
        await initializeHanjaSystem();
        
        // 확장 데이터 로드
        const hanjaList = await loadExtendedHanjaData();
        setExtendedHanja(hanjaList);
        
        setError(null);
      } catch (err) {
        console.error('Error loading extended hanja data:', err);
        setError('확장된 한자 데이터를 로드하는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  const navigateToHanjaDetail = (character: string) => {
    router.push(`/hanja-detail/${encodeURIComponent(character)}`);
  };
  
  const HanjaPreviewCard = ({ hanja }: { hanja: HanjaCharacter }) => {
    // 첫 번째 예시 단어 가져오기
    const firstExample = hanja.extended_data?.common_words?.[0];
    
    return (
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
          <div className="text-6xl font-serif">{hanja.character}</div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-1">{hanja.meaning}</h3>
          <p className="text-gray-600 mb-2">{hanja.pronunciation} ({hanja.stroke_count}획)</p>
          
          {hanja.extended_data?.detailed_meaning && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{hanja.extended_data.detailed_meaning}</p>
          )}
          
          {firstExample && (
            <div className="bg-blue-50 p-2 rounded text-sm">
              <div className="font-medium">{firstExample.word} ({firstExample.meaning})</div>
              {firstExample.example_sentence && (
                <div className="text-gray-600 mt-1">{firstExample.example_sentence}</div>
              )}
            </div>
          )}
          
          <button
            onClick={() => navigateToHanjaDetail(hanja.character)}
            className="mt-3 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            상세 정보 보기
          </button>
        </div>
      </div>
    );
  };

  // 한자 카드 컴포넌트
  const HanjaCard = ({ hanja }: { hanja: HanjaCharacter }) => {
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

  return (
    <PageContainer maxWidth="max-w-6xl">
      <PageHeader
        title="확장된 한자 학습 시스템"
        description="더 풍부한 컨텐츠와 학습 자료를 제공하는 개선된 한자 데이터베이스"
        navButtons={[
          {
            href: '/new-hanja',
            label: '한자 목록',
            colorClass: 'btn-secondary'
          },
          {
            href: '/dashboard',
            label: '대시보드',
            colorClass: 'btn-primary'
          }
        ]}
      />
      
      <ContentCard className="mb-6">
        <div className="prose max-w-none">
          <h2>한자 학습의 새로운 접근</h2>
          <p>
            기존의 한자 학습 방식에서 더 나아가, 이제 각 한자에 대한 더 풍부한 컨텐츠와 학습 자료를 제공합니다.
            어원, 발음 가이드, 문화적 배경, 예문과 함께 하는 예시 단어, 기억법 등 한자를 더 깊이 이해하고
            효과적으로 학습할 수 있는 다양한 자료를 만나보세요.
          </p>
          
          <h3>주요 특징</h3>
          <ul>
            <li><strong>상세한 한자 설명</strong> - 한자의 기본 의미뿐만 아니라 여러 맥락에서의 의미를 이해합니다.</li>
            <li><strong>어원 정보</strong> - 한자가 어떻게 형성되었는지 이해하여 더 쉽게 기억할 수 있습니다.</li>
            <li><strong>예문이 포함된 예시 단어</strong> - 실제 문장에서 한자가 어떻게 사용되는지 배웁니다.</li>
            <li><strong>문화적 배경</strong> - 한자와 관련된 문화적 맥락을 이해하여 더 깊은 학습이 가능합니다.</li>
            <li><strong>효과적인 기억법</strong> - 한자를 더 쉽게 기억할 수 있는 시각적 기억법을 제공합니다.</li>
            <li><strong>관련 한자 연결</strong> - 유사한 의미나 형태를 가진 한자를 함께 학습할 수 있습니다.</li>
          </ul>
        </div>
      </ContentCard>
      
      {isLoading ? (
        <ContentCard>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">확장된 한자 데이터를 로드 중입니다...</span>
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
          <h2 className="text-2xl font-bold mb-4">확장된 한자 미리보기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {extendedHanja.slice(0, 6).map((hanja) => (
              <HanjaPreviewCard key={hanja.id} hanja={hanja} />
            ))}
          </div>
          
          <ContentCard>
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold mb-3">지금 바로 새로운 한자 학습을 시작하세요</h2>
              <p className="text-gray-600 mb-6">
                기초부터 고급까지, 더 풍부한 콘텐츠로 한자를 효과적으로 학습하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/new-hanja"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  한자 목록 보기
                </Link>
                <Link 
                  href="/hanja-detail/人"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  '人' 한자 예시 보기
                </Link>
              </div>
            </div>
          </ContentCard>
        </>
      )}
    </PageContainer>
  );
} 