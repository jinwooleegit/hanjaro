'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  initializeHanjaSystem, 
  getExtendedHanjaById,
  getRelatedCharactersInfo,
  getCompoundWords
} from '@/utils/hanjaPageUtils';
import { HanjaExtendedCharacter } from '@/utils/gradeBasedHanjaUtils';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import ContentCard from '@/app/components/ContentCard';

// 한자 상세 정보 섹션 컴포넌트
const HanjaInfoSection = ({ hanjaData }: { hanjaData: HanjaExtendedCharacter }) => (
  <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col items-center justify-center">
        <div className="text-9xl font-serif mb-4 animate-fadeIn">{hanjaData.character}</div>
        <div className="text-2xl font-bold">{hanjaData.meaning}</div>
        <div className="text-xl text-gray-600">{hanjaData.pronunciation}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm transition-all hover:bg-blue-200">
            {hanjaData.grade}급
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm transition-all hover:bg-green-200">
            {hanjaData.stroke_count}획
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm transition-all hover:bg-purple-200">
            부수: {hanjaData.radical}
          </span>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <h3 className="text-xl font-bold mb-2 text-blue-700">한자 상세 의미</h3>
        <p className="mb-4 leading-relaxed">{hanjaData.extended_data?.detailed_meaning || hanjaData.meaning}</p>
        
        <h3 className="text-xl font-bold mb-2 text-blue-700">어원</h3>
        <p className="mb-4 leading-relaxed">{hanjaData.extended_data?.etymology || '정보가 없습니다.'}</p>
        
        <h3 className="text-xl font-bold mb-2 text-blue-700">기억법</h3>
        <p className="leading-relaxed">{hanjaData.extended_data?.mnemonics || '정보가 없습니다.'}</p>
      </div>
    </div>
  </ContentCard>
);

// 획순 정보 섹션 컴포넌트
const StrokeOrderSection = ({ hanjaData }: { hanjaData: HanjaExtendedCharacter }) => {
  // 획순 안내 이미지 URL
  const getStrokeOrderImageUrl = (char: string) => {
    return `/images/stroke-order/${char}.svg`;
  };

  return (
    <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-700 border-b pb-2">획순 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">획순 안내</h3>
          <p className="mb-4 leading-relaxed">{hanjaData.extended_data?.stroke_order?.description || '정보가 없습니다.'}</p>
          
          {hanjaData.extended_data?.stroke_order?.directions && (
            <ol className="list-decimal list-inside space-y-1">
              {hanjaData.extended_data.stroke_order.directions.map((direction, index) => (
                <li key={index} className="mb-1 pl-1 transition-colors duration-200 hover:bg-gray-50 p-1 rounded">{direction}</li>
              ))}
            </ol>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative h-56 w-56 border border-gray-200 flex items-center justify-center bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image 
              src={getStrokeOrderImageUrl(hanjaData.character)}
              alt={`${hanjaData.character} 획순`}
              fill
              className="object-contain p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackElement = document.createElement('div');
                fallbackElement.className = 'text-8xl font-serif animate-pulse';
                fallbackElement.innerText = hanjaData.character;
                target.parentNode?.appendChild(fallbackElement);
              }}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              획순 애니메이션
            </div>
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

// 발음 및 문화적 배경 섹션 컴포넌트
const CulturalSection = ({ hanjaData }: { hanjaData: HanjaExtendedCharacter }) => (
  <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">발음 정보</h2>
        <p className="leading-relaxed">{hanjaData.extended_data?.pronunciation_guide || `한국어에서는 '${hanjaData.pronunciation}'로 발음합니다.`}</p>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">문화적 배경</h2>
        <p className="leading-relaxed">{hanjaData.extended_data?.cultural_notes || '문화적 배경 정보가 없습니다.'}</p>
      </div>
    </div>
  </ContentCard>
);

// 관련 한자 섹션 컴포넌트
const RelatedHanjaSection = ({ 
  relatedCharacters, 
  navigateToRelatedCharacter 
}: { 
  relatedCharacters: HanjaExtendedCharacter[],
  navigateToRelatedCharacter: (id: string) => void
}) => (
  <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-red-700 border-b pb-2">관련 한자</h2>
    {relatedCharacters.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {relatedCharacters.map((char) => (
          <div 
            key={char.id} 
            className="flex flex-col items-center bg-white p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
            onClick={() => navigateToRelatedCharacter(char.id)}
          >
            <div className="text-4xl font-serif mb-2">{char.character}</div>
            <div className="text-sm font-medium">{char.meaning}</div>
            <div className="text-xs text-gray-600">{char.pronunciation}</div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">관련 한자 정보가 없습니다.</p>
    )}
  </ContentCard>
);

// 복합어 섹션 컴포넌트
const CompoundWordsSection = ({ compoundWords }: { compoundWords: any[] }) => (
  <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-amber-700 border-b pb-2">복합어</h2>
    {compoundWords.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {compoundWords.map((word, index) => (
          <div 
            key={index}
            className="bg-white p-4 border rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
          >
            <div className="font-bold text-lg mb-1">{word.word}</div>
            <div className="text-gray-600 mb-1">{word.meaning}</div>
            <div className="text-gray-500 text-sm">{word.pronunciation}</div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">복합어 정보가 없습니다.</p>
    )}
  </ContentCard>
);

// 학습 도구 섹션 컴포넌트
const LearningToolsSection = ({ hanjaData }: { hanjaData: HanjaExtendedCharacter }) => (
  <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-teal-700 border-b pb-2">학습 도구</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Link href={`/writing-practice/${hanjaData.character}`}>
        <div className="bg-teal-50 p-4 rounded-lg text-center transition-all duration-200 hover:bg-teal-100 hover:shadow-md">
          <div className="text-3xl mb-2">✏️</div>
          <div className="font-bold">한자 쓰기 연습</div>
        </div>
      </Link>
      <Link href={`/quiz?character=${hanjaData.character}`}>
        <div className="bg-blue-50 p-4 rounded-lg text-center transition-all duration-200 hover:bg-blue-100 hover:shadow-md">
          <div className="text-3xl mb-2">🧩</div>
          <div className="font-bold">퀴즈 풀기</div>
        </div>
      </Link>
      <Link href={`/pdf-practice?character=${hanjaData.character}`}>
        <div className="bg-purple-50 p-4 rounded-lg text-center transition-all duration-200 hover:bg-purple-100 hover:shadow-md">
          <div className="text-3xl mb-2">📄</div>
          <div className="font-bold">연습장 PDF</div>
        </div>
      </Link>
    </div>
  </ContentCard>
);

// 예시 단어 섹션 컴포넌트 추가
const ExampleWordsSection = ({ hanjaData }: { hanjaData: HanjaExtendedCharacter }) => (
  <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-orange-700 border-b pb-2">예시 단어</h2>
    {hanjaData.extended_data?.common_words && hanjaData.extended_data.common_words.length > 0 ? (
      <div className="divide-y divide-gray-100">
        {hanjaData.extended_data.common_words.map((word, index) => (
          <div key={index} className="py-4 hover:bg-gray-50 rounded transition-colors duration-200">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-2xl font-serif">{word.word}</span>
              <span className="text-lg font-medium">{word.meaning}</span>
              <span className="text-gray-600 text-sm">({word.pronunciation})</span>
            </div>
            {word.example_sentence && (
              <div className="bg-blue-50 p-3 rounded my-2">
                <p className="text-blue-800 mb-1 font-medium">{word.example_sentence}</p>
                {word.example_meaning && (
                  <p className="text-gray-700 text-sm">{word.example_meaning}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">예시 단어 정보가 없습니다.</p>
    )}
  </ContentCard>
);

// 예문 섹션 컴포넌트 추가
const ExampleSentencesSection = ({ hanjaData }: { hanjaData: HanjaExtendedCharacter }) => {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  
  // 예문 데이터 필터링
  const filteredSentences = useMemo(() => {
    if (!hanjaData.extended_data?.example_sentences || hanjaData.extended_data.example_sentences.length === 0) {
      return [];
    }
    
    if (filter === 'all') {
      return hanjaData.extended_data.example_sentences;
    }
    
    return hanjaData.extended_data.example_sentences.filter(item => 
      item.level?.toLowerCase() === filter
    );
  }, [hanjaData, filter]);
  
  // 난이도별 예문 개수 계산
  const sentenceCounts = useMemo(() => {
    if (!hanjaData.extended_data?.example_sentences) {
      return { all: 0, beginner: 0, intermediate: 0, advanced: 0 };
    }
    
    const counts = hanjaData.extended_data.example_sentences.reduce((acc: Record<string, number>, item) => {
      const level = item.level?.toLowerCase() || 'uncategorized';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    return {
      all: hanjaData.extended_data.example_sentences.length,
      beginner: counts['beginner'] || 0,
      intermediate: counts['intermediate'] || 0,
      advanced: counts['advanced'] || 0
    };
  }, [hanjaData]);
  
  if (!hanjaData.extended_data?.example_sentences || hanjaData.extended_data.example_sentences.length === 0) {
    return null;
  }

  return (
    <ContentCard className="mb-6 transform transition-transform duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-purple-700">예문</h2>
        
        {hanjaData.extended_data?.example_sentences && hanjaData.extended_data.example_sentences.length > 0 && (
          <div className="flex space-x-2 mt-2 md:mt-0">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === 'all' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({sentenceCounts.all})
            </button>
            {sentenceCounts.beginner > 0 && (
              <button 
                onClick={() => setFilter('beginner')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === 'beginner' 
                    ? 'bg-green-700 text-white' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                초급 ({sentenceCounts.beginner})
              </button>
            )}
            {sentenceCounts.intermediate > 0 && (
              <button 
                onClick={() => setFilter('intermediate')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === 'intermediate' 
                    ? 'bg-yellow-700 text-white' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                중급 ({sentenceCounts.intermediate})
              </button>
            )}
            {sentenceCounts.advanced > 0 && (
              <button 
                onClick={() => setFilter('advanced')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === 'advanced' 
                    ? 'bg-red-700 text-white' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                고급 ({sentenceCounts.advanced})
              </button>
            )}
          </div>
        )}
      </div>
      
      {filteredSentences.length > 0 ? (
        <div className="space-y-4 mt-4">
          {filteredSentences.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200">
              <div className="text-lg font-bold mb-2">{item.hanja}</div>
              <div className="text-gray-700 mb-1">{item.hangul}</div>
              <div className="text-gray-600 text-sm">{item.meaning}</div>
              {item.level && (
                <div className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
                  item.level.toLowerCase() === 'beginner' ? 'bg-green-100 text-green-800' :
                  item.level.toLowerCase() === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  item.level.toLowerCase() === 'advanced' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.level}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : hanjaData.extended_data?.example_sentences && hanjaData.extended_data.example_sentences.length > 0 ? (
        <p className="text-gray-500 py-4">선택한 난이도의 예문이 없습니다.</p>
      ) : (
        <p className="text-gray-500 py-4">예문 정보가 없습니다.</p>
      )}
    </ContentCard>
  );
};

// 메인 컴포넌트
export default function HanjaDetailPage() {
  const params = useParams() || {};
  const router = useRouter();
  const hanjaId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hanjaData, setHanjaData] = useState<HanjaExtendedCharacter | null>(null);
  const [relatedCharacters, setRelatedCharacters] = useState<HanjaExtendedCharacter[]>([]);
  const [compoundWords, setCompoundWords] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 시스템 초기화 - 자주 사용하는 급수 데이터 미리 로딩
        await initializeHanjaSystem();
        
        // 한자 정보 로드 - 급수별 파일에서 데이터 로드
        const hanja = await getExtendedHanjaById(hanjaId);
        if (!hanja) {
          setError(`ID가 "${hanjaId}"인 한자를 찾을 수 없습니다.`);
          return;
        }
        
        setHanjaData(hanja);
        
        // 관련 한자 로드
        if (hanja.extended_data?.related_characters) {
          const related = await getRelatedCharactersInfo(hanja.id);
          setRelatedCharacters(related);
        }
        
        // 복합어 로드
        const compounds = getCompoundWords(hanja.id);
        setCompoundWords(compounds);
        
        setError(null);
      } catch (err) {
        console.error('Error loading hanja data:', err);
        setError('한자 데이터를 로드하는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (hanjaId) {
      loadData();
    }
  }, [hanjaId]);

  // 관련 한자로 이동하는 함수
  const navigateToRelatedCharacter = (id: string) => {
    router.push(`/hanja-v2/${id}`);
  };
  
  return (
    <PageContainer maxWidth="max-w-6xl">
      <PageHeader
        title={hanjaData ? `${hanjaData.character} 한자 상세정보` : '한자 상세정보'}
        description={hanjaData ? `${hanjaData.meaning} (${hanjaData.pronunciation}) - ${hanjaData.grade}급 한자` : '한자 학습을 위한 상세 정보 페이지입니다.'}
        navButtons={[
          {
            href: '/learn',
            label: '한자 학습',
            colorClass: 'btn-secondary'
          },
          {
            href: '/dashboard',
            label: '대시보드',
            colorClass: 'btn-primary'
          }
        ]}
      />
      
      {isLoading ? (
        <ContentCard>
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <span className="mt-4 text-gray-600">한자 데이터를 로드 중입니다...</span>
          </div>
        </ContentCard>
      ) : error ? (
        <ContentCard>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => router.push('/learn')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                한자 학습으로 돌아가기
              </button>
            </div>
          </div>
        </ContentCard>
      ) : hanjaData ? (
        <>
          <HanjaInfoSection hanjaData={hanjaData} />
          <StrokeOrderSection hanjaData={hanjaData} />
          <CulturalSection hanjaData={hanjaData} />
          
          <ExampleWordsSection hanjaData={hanjaData} />
          <ExampleSentencesSection hanjaData={hanjaData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <CompoundWordsSection compoundWords={compoundWords} />
            </div>
          </div>
          
          <RelatedHanjaSection 
            relatedCharacters={relatedCharacters}
            navigateToRelatedCharacter={navigateToRelatedCharacter}
          />
          
          <LearningToolsSection hanjaData={hanjaData} />
        </>
      ) : null}
    </PageContainer>
  );
} 