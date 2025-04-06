'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SimpleHanziDisplay from '../../../../components/SimpleHanziDisplay';
import Link from 'next/link';

export default function DirectHanjaPage({ 
  params 
}: { 
  params: { character: string } 
}) {
  const [hanjaData, setHanjaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // URL 디코딩하여 한자 가져오기
  const character = decodeURIComponent(params.character);
  
  useEffect(() => {
    const fetchHanjaData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hanja?character=${character}`);
        
        if (!response.ok) {
          throw new Error('API 요청 실패');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setHanjaData(data[0]);
          setError(null);
        } else {
          setError('한자 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('한자 데이터 로딩 오류:', err);
        setError('한자 데이터베이스를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHanjaData();
  }, [character]);

  // 다른 레벨에 있는 동일 한자 존재 여부 확인
  const checkRelatedHanjas = async () => {
    // 추가 구현 시 활용
  };
  
  // 오류 표시 화면
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-600 mb-6">요청한 한자: {character}</p>
          <Link href="/learn" className="text-blue-500 hover:text-blue-700">
            돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  // 로딩 화면
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          한자 데이터 로딩 중...
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
        {/* 상단 네비게이션 */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <Link href="/learn" className="text-blue-500 hover:text-blue-700">
            &larr; 학습 목록으로
          </Link>
          <h1 className="text-xl font-bold">한자 상세 정보</h1>
          <div className="w-24"></div> {/* 균형을 위한 빈 공간 */}
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 한자 및 필순 표시 섹션 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-6 text-center">
                <SimpleHanziDisplay 
                  character={character} 
                  width={300} 
                  height={300} 
                  fontSize={200}
                  showAnimation={true} 
                />
              </div>
              
              <div className="text-center space-y-1">
                <div className="text-xl font-bold">{character}</div>
                {hanjaData?.pronunciation && (
                  <div className="text-lg text-gray-700">
                    {hanjaData.pronunciation}
                  </div>
                )}
                {hanjaData?.meaning && (
                  <div className="text-md text-gray-600">
                    {hanjaData.meaning}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  획수: {hanjaData?.strokeCount || '정보 없음'}
                </div>
              </div>
            </div>
            
            {/* 한자 정보 섹션 */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">한자 정보</h2>
              
              <div className="space-y-4">
                {hanjaData?.level && (
                  <div>
                    <h3 className="font-medium text-gray-700">급수</h3>
                    <p>{hanjaData.level}급</p>
                  </div>
                )}
                
                {hanjaData?.examples && hanjaData.examples.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700">예문</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {hanjaData.examples.map((example: string, idx: number) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {hanjaData?.radicals && (
                  <div>
                    <h3 className="font-medium text-gray-700">부수</h3>
                    <p>{hanjaData.radicals}</p>
                  </div>
                )}
                
                <div className="pt-4">
                  <Link 
                    href={`/learn/hanja/${character}`} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    기존 한자 페이지로 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 네비게이션 */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between">
            <Link href="/learn" className="text-blue-500 hover:text-blue-700">
              한자 목록
            </Link>
            <Link href="/practice" className="text-blue-500 hover:text-blue-700">
              필순 연습하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 