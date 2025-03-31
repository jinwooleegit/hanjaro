'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(() => import('../components/HanziWriterComponent'), {
  ssr: false,
});

const popularHanjaList = [
  { character: '人', meaning: '사람 인', korean: '사람' },
  { character: '永', meaning: '영원할 영', korean: '영원' },
  { character: '水', meaning: '물 수', korean: '물' },
  { character: '火', meaning: '불 화', korean: '불' },
  { character: '山', meaning: '산 산', korean: '산' },
  { character: '學', meaning: '배울 학', korean: '배움' },
  { character: '道', meaning: '길 도', korean: '길' }
];

export default function LearnPage() {
  const [selectedHanja, setSelectedHanja] = useState(popularHanjaList[0]);
  const [showOptions, setShowOptions] = useState(false);
  
  // 옵션 상태 관리
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [showCharacter, setShowCharacter] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#ff0000');
  const [outlineColor, setOutlineColor] = useState('#cccccc');

  const resetAnimation = () => {
    // 같은 한자를 강제로 다시 로드하는 효과
    const current = selectedHanja;
    setSelectedHanja({...current});
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center">한자 필순 학습</h1>
        
        <p className="text-lg text-center">
          한자의 올바른 획순을 애니메이션으로 배워보세요.
        </p>
        
        <div className="border rounded-md p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-center">
              {selectedHanja.character} ({selectedHanja.meaning})
            </h2>
          </div>
          <div className="flex flex-col items-center gap-6">
            <HanziWriterComponent 
              character={selectedHanja.character}
              width={250}
              height={250}
              delayBetweenStrokes={500}
              strokeAnimationSpeed={strokeSpeed}
              showCharacter={showCharacter}
              highlightColor={highlightColor}
              outlineColor={outlineColor}
            />
            
            <div className="text-center">
              <p>뜻: {selectedHanja.meaning}</p>
              <p>훈독: {selectedHanja.korean}</p>
              
              <div className="flex gap-2 mt-3 justify-center">
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  {showOptions ? '옵션 숨기기' : '옵션 표시'}
                </button>
                
                <button 
                  onClick={resetAnimation}
                  className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                >
                  애니메이션 재시작
                </button>
              </div>
            </div>
            
            {showOptions && (
              <div className="w-full max-w-md border rounded-md p-4 mt-2">
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {popularHanjaList.map((hanja) => (
            <button 
              key={hanja.character}
              onClick={() => setSelectedHanja(hanja)}
              className={`p-4 rounded-md text-3xl h-20 
                ${selectedHanja.character === hanja.character 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {hanja.character}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 