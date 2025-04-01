'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getHanjaCharacter } from '@/utils/hanjaUtils';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(
  () => import('../../../components/HanziWriterComponent'),
  { ssr: false }
);

type HanjaDetailProps = {
  params: {
    character: string;
  };
};

export default function HanjaDetailPage({ params }: HanjaDetailProps) {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get('category') || 'basic';
  const levelId = searchParams?.get('level') || 'level1';
  const character = decodeURIComponent(params.character);
  
  const hanjaData = getHanjaCharacter(character);
  const [activeTab, setActiveTab] = useState<'필순' | '의미' | '예문'>('필순');
  
  // 애니메이션 설정
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [showCharacter, setShowCharacter] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#3498db');
  const [outlineColor, setOutlineColor] = useState('#333333');
  const [showOptions, setShowOptions] = useState(false);
  
  const resetAnimation = () => {
    const hanziWriterElement = document.getElementById('hanzi-writer-container');
    if (hanziWriterElement) {
      // HanziWriter 인스턴스 리셋을 위해 컨테이너를 리셋
      hanziWriterElement.innerHTML = '';
      // 약간의 지연 후 컴포넌트 강제 리렌더링을 위한 상태 변경
      setTimeout(() => {
        setStrokeSpeed(strokeSpeed + 0.01);
      }, 100);
    }
  };

  if (!hanjaData) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">존재하지 않는 한자</h1>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="mb-4">요청하신 한자를 찾을 수 없습니다.</p>
            <Link href={`/learn/level/${categoryId}-${levelId}`} className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href={`/learn/level/${categoryId}-${levelId}`} className="text-blue-500 hover:underline">
            &larr; 목록으로 돌아가기
          </Link>
        </div>

        <div className="border rounded-md shadow-md overflow-hidden">
          {/* 한자 헤더 정보 */}
          <div className="bg-gray-100 p-4 border-b flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1">
                {hanjaData.character} <span className="text-lg font-normal text-gray-600">{hanjaData.meaning}</span>
              </h2>
              <p className="text-gray-600">
                <span className="font-medium">부수:</span> {hanjaData.radical} | 
                <span className="font-medium ml-2">획수:</span> {hanjaData.stroke_count}획 | 
                <span className="font-medium ml-2">음:</span> {hanjaData.pronunciation}
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex space-x-3">
              <button 
                onClick={resetAnimation}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition"
              >
                애니메이션 재시작
              </button>
              <Link href={`/practice?char=${hanjaData.character}`}>
                <button className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md transition">
                  필기 연습하기
                </button>
              </Link>
            </div>
          </div>
          
          {/* 탭 메뉴 */}
          <div className="flex border-b">
            {(['필순', '의미', '예문'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-medium text-center transition
                  ${activeTab === tab 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === '필순' && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-xs">
                    <div id="hanzi-writer-container">
                      <HanziWriterComponent 
                        character={hanjaData.character}
                        width={250}
                        height={250}
                        delayBetweenStrokes={500}
                        strokeAnimationSpeed={strokeSpeed}
                        showCharacter={showCharacter}
                        highlightColor={highlightColor}
                        outlineColor={outlineColor}
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <button 
                        onClick={() => setShowOptions(!showOptions)}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
                      >
                        {showOptions ? '옵션 숨기기' : '옵션 표시'}
                      </button>
                    </div>
                    
                    {showOptions && (
                      <div className="mt-4 border rounded-md p-4">
                        <h3 className="font-semibold mb-3">표시 옵션</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm mb-1">획 속도 조절</label>
                            <input 
                              type="range" 
                              min="0.5" 
                              max="3" 
                              step="0.5" 
                              value={strokeSpeed}
                              onChange={(e) => setStrokeSpeed(parseFloat(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>느리게</span>
                              <span>빠르게</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id="showCharacter" 
                              checked={showCharacter}
                              onChange={() => setShowCharacter(!showCharacter)}
                              className="mr-2"
                            />
                            <label htmlFor="showCharacter">글자 미리보기 표시</label>
                          </div>
                          
                          <div>
                            <label className="block text-sm mb-1">강조 색상</label>
                            <input 
                              type="color" 
                              value={highlightColor}
                              onChange={(e) => setHighlightColor(e.target.value)}
                              className="w-full h-8"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm mb-1">윤곽선 색상</label>
                            <input 
                              type="color" 
                              value={outlineColor}
                              onChange={(e) => setOutlineColor(e.target.value)}
                              className="w-full h-8"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">획순 설명</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-3"><span className="font-medium">총 획수:</span> {hanjaData.stroke_count}획</p>
                    <p className="mb-3"><span className="font-medium">부수:</span> {hanjaData.radical}</p>
                    <p className="mb-3"><span className="font-medium">획순 설명:</span></p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>천천히 따라서 써보면서 획순을 익혀보세요.</li>
                      <li>획의 방향과 순서를 주의깊게 관찰하세요.</li>
                      <li>각 획의 시작점과 끝점을 확인하세요.</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">필기 연습</h3>
                    <Link href={`/practice?char=${hanjaData.character}`}>
                      <button className="w-full px-4 py-3 bg-indigo-500 text-white hover:bg-indigo-600 rounded-md transition">
                        필기 연습 시작하기
                      </button>
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                      마우스나 터치로 직접 한자를 따라 써보세요.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === '의미' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">기본 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-medium">의미:</span> {hanjaData.meaning}</p>
                    <p><span className="font-medium">음:</span> {hanjaData.pronunciation}</p>
                    <p><span className="font-medium">부수:</span> {hanjaData.radical}</p>
                    <p><span className="font-medium">획수:</span> {hanjaData.stroke_count}획</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">관련 한자어</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hanjaData.examples.map((example, index) => (
                        <li key={index} className="flex items-center">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          <strong>{example.word}</strong>: {example.meaning} ({example.pronunciation})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === '예문' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">활용 예문</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <ul className="space-y-4">
                      {hanjaData.examples.map((example, index) => (
                        <li key={index} className="pb-2 border-b border-gray-200 last:border-0 last:pb-0">
                          <p className="font-medium">{example.word}: {example.meaning}</p>
                          <p className="text-sm text-gray-600">발음: {example.pronunciation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 