import React, { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HanjaCharacter } from '../../utils/types';
import { loadCharactersByLevelsAndTags, getTagInfo } from '../../utils/tagUtils';
import { LoadingSpinner } from '../../components/layout';

interface HanjaDetailPageProps {
  character?: string;
}

const HanjaDetailPage: NextPage<HanjaDetailPageProps> = ({ character }) => {
  const router = useRouter();
  const [hanjaData, setHanjaData] = useState<HanjaCharacter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHanjaData = async () => {
      if (!character) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 모든 레벨에서 해당 한자 검색
        const allLevels = [1, 2, 3, 4, 5, 6];
        const characters = await loadCharactersByLevelsAndTags('basic', allLevels);
        
        // 요청된 한자 찾기
        const foundHanja = characters.find(h => h.character === character);
        
        if (foundHanja) {
          setHanjaData(foundHanja);
          
          // 태그 이름 로드
          if (foundHanja.tags && foundHanja.tags.length > 0) {
            const tagNameMap: Record<string, string> = {};
            
            for (const tagId of foundHanja.tags) {
              const tagInfo = await getTagInfo(tagId);
              if (tagInfo) {
                tagNameMap[tagId] = tagInfo.name;
              }
            }
            
            setTagNames(tagNameMap);
          }
        } else {
          setError('해당 한자를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('한자 데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('한자 데이터를 불러오는 중 오류가 발생했습니다:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHanjaData();
  }, [character]);

  // 태그 색상 함수
  const getTagColor = (tagId: string): string => {
    const categoryId = tagId.split(':')[0];
    const colorMap: Record<string, string> = {
      meaning: 'bg-blue-100 border-blue-300 text-blue-800',
      difficulty: 'bg-green-100 border-green-300 text-green-800',
      radical: 'bg-purple-100 border-purple-300 text-purple-800',
      usage: 'bg-orange-100 border-orange-300 text-orange-800',
      education: 'bg-red-100 border-red-300 text-red-800'
    };

    return colorMap[categoryId] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{character ? `${character} - 한자 상세 정보` : '한자 상세 정보'} - 한자로</title>
        <meta name="description" content={`${character || '한자'} 상세 정보, 뜻, 음, 획수, 부수 및 예문`} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dictionary" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            한자 사전으로 돌아가기
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            {LoadingSpinner ? <LoadingSpinner /> : <div className="text-xl">로딩 중...</div>}
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : hanjaData ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* 한자 헤더 섹션 */}
            <div className="bg-gray-50 p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="text-center mr-6">
                  <div className="text-7xl font-bold mb-2">{hanjaData.character}</div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{hanjaData.meaning}</h1>
                  <div className="flex flex-wrap gap-4 text-gray-700">
                    <div>
                      <span className="font-medium">발음:</span> {hanjaData.pronunciation}
                    </div>
                    <div>
                      <span className="font-medium">획수:</span> {hanjaData.stroke_count}획
                    </div>
                    <div>
                      <span className="font-medium">부수:</span> {hanjaData.radical}
                    </div>
                    {hanjaData.level && (
                      <div>
                        <span className="font-medium">레벨:</span> {hanjaData.level}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 섹션 */}
            <div className="p-6">
              {/* 예시 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">예시</h2>
                {hanjaData.examples && hanjaData.examples.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hanjaData.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-lg font-medium mb-1">{example.word}</div>
                        <div className="text-gray-600 text-sm">
                          <div>{example.meaning}</div>
                          <div className="mt-1 text-gray-500">{example.pronunciation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">예시가 없습니다.</p>
                )}
              </div>

              {/* 태그 섹션 */}
              {hanjaData.tags && hanjaData.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">태그</h2>
                  <div className="flex flex-wrap gap-2">
                    {hanjaData.tags.map((tagId, index) => (
                      <Link
                        key={index}
                        href={`/tags?tag=${encodeURIComponent(tagId)}`}
                        className={`
                          px-3 py-1 rounded-full text-sm border transition
                          hover:shadow-md
                          ${getTagColor(tagId)}
                        `}
                      >
                        {tagNames[tagId] || tagId.split(':')[1]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
            한자 정보를 불러올 수 없습니다.
          </div>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { character } = context.params || {};
  
  return {
    props: {
      character: character || null,
    },
  };
};

export default HanjaDetailPage; 