import React, { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HanjaCharacter } from '../../utils/types';
import { loadCharactersByLevelsAndTags, getTagInfo } from '../../utils/tagUtils';
import { LoadingSpinner } from '../../components/layout';

interface HanjaDetailPageProps {
  id?: string;
}

const HanjaDetailPage: NextPage<HanjaDetailPageProps> = ({ id }) => {
  const router = useRouter();
  const [hanjaData, setHanjaData] = useState<HanjaCharacter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHanjaData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 모든 레벨에서 해당 한자 검색
        const allLevels = [1, 2, 3, 4, 5, 6];
        const characters = await loadCharactersByLevelsAndTags('basic', allLevels);
        
        // 요청된 한자 찾기
        const foundHanja = characters.find(h => h.character === id);
        
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
  }, [id]);

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{id ? `${id} - 한자 상세 정보` : '한자 상세 정보'} - 한자로</title>
        <meta name="description" content={`${id || '한자'} 상세 정보, 뜻, 음, 획수, 부수 및 예문`} />
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

        {/* ... existing code ... */}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  return {
    props: {
      id: id || null,
    },
  };
};

export default HanjaDetailPage; 