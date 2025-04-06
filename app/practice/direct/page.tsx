'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SimpleHanziDisplay from '../../components/SimpleHanziDisplay';
import Link from 'next/link';

export default function DirectHanjaPracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCharacter, setCurrentCharacter] = useState('一');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);
  const [hanjaData, setHanjaData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 기본 한자 리스트
  const commonHanjaList = [
    { char: '一', meaning: '하나 일', stroke: 1 },
    { char: '二', meaning: '두 이', stroke: 2 },
    { char: '三', meaning: '세 삼', stroke: 3 },
    { char: '大', meaning: '큰 대', stroke: 3 },
    { char: '中', meaning: '가운데 중', stroke: 4 },
    { char: '人', meaning: '사람 인', stroke: 2 },
    { char: '口', meaning: '입 구', stroke: 3 },
    { char: '日', meaning: '날 일', stroke: 4 },
    { char: '月', meaning: '달 월', stroke: 4 },
    { char: '水', meaning: '물 수', stroke: 4 }
  ];
  
  // URL 파라미터에서 한자 가져오기
  useEffect(() => {
    const charParam = searchParams?.get('char') || '';
    if (charParam) {
      setCurrentCharacter(charParam);
      
      // 현재 한자가 리스트에 있는지 확인하고 인덱스 설정
      const index = commonHanjaList.findIndex(item => item.char === charParam);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [searchParams]);
  
  // 한자 데이터 가져오기
  useEffect(() => {
    const fetchHanjaData = async () => {
      try {
        // 기본 데이터에 있는지 확인
        const defaultData = commonHanjaList.find(item => item.char === currentCharacter);
        if (defaultData) {
          setHanjaData({
            character: currentCharacter,
            meaning: defaultData.meaning,
            strokeCount: defaultData.stroke
          });
          return;
        }
        
        // API에서 데이터 가져오기
        const response = await fetch(`/api/hanja?character=${currentCharacter}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setHanjaData(data[0]);
          } else {
            // 데이터가 없으면 기본 정보 사용
            setHanjaData({ 
              character: currentCharacter,
              meaning: '정보 없음',
              strokeCount: 0
            });
          }
        }
      } catch (error) {
        console.error("한자 데이터 로드 실패:", error);
        // 오류 시 기본 정보 사용
        setHanjaData({ 
          character: currentCharacter,
          meaning: '정보 없음',
          strokeCount: 0
        });
      }
    };
    
    fetchHanjaData();
  }, [currentCharacter]);
  
  // 다음 문자로 이동
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % commonHanjaList.length;
    setCurrentIndex(nextIndex);
    setCurrentCharacter(commonHanjaList[nextIndex].char);
  };
  
  // 이전 문자로 이동
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + commonHanjaList.length) % commonHanjaList.length;
    setCurrentIndex(prevIndex);
    setCurrentCharacter(commonHanjaList[prevIndex].char);
  };
  
  // 애니메이션 토글
  const toggleAnimation = () => {
    setShowAnimation(!showAnimation);
  };
  
  // 한자 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const char = searchTerm.trim().charAt(0);
      setCurrentCharacter(char);
      setSearchTerm('');
      
      // 한자가 리스트에 있는지 확인
      const index = commonHanjaList.findIndex(item => item.char === char);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">직접 폰트로 보는 한자 연습</h1>
      
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          편리하게 한자를 확인하고 연습하세요. 각 한자의 정확한 형태와 획수를 확인할 수 있습니다.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        {/* 현재 한자 정보 및 네비게이션 */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            이전
          </button>
          
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-2">{currentCharacter}</h2>
            {hanjaData && (
              <div className="text-sm text-gray-600 mb-1">
                <p>{hanjaData.meaning}</p>
                <p>획수: {hanjaData.strokeCount}획</p>
              </div>
            )}
            <p className="text-xs text-gray-500">
              {currentIndex + 1} / {commonHanjaList.length}
            </p>
          </div>
          
          <button 
            onClick={handleNext}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            다음
          </button>
        </div>
        
        {/* 한자 표시 컴포넌트 */}
        <div className="flex justify-center mb-6">
          <SimpleHanziDisplay 
            character={currentCharacter}
            width={250}
            height={250}
            fontSize={180}
            showAnimation={showAnimation}
          />
        </div>
        
        {/* 모드 토글 버튼 */}
        <div className="flex justify-center space-x-3 mb-6">
          <button 
            onClick={toggleAnimation}
            className={`px-4 py-2 rounded transition-colors ${
              showAnimation 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {showAnimation ? '애니메이션 끄기' : '애니메이션 켜기'}
          </button>
          
          <Link
            href={`/learn/hanja/${currentCharacter}`}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            상세 정보
          </Link>
        </div>
        
        {/* 한자 검색 */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="연습할 한자 입력"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
            >
              검색
            </button>
          </div>
        </form>
        
        {/* 한자 격자 */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {commonHanjaList.map((hanja, idx) => (
            <button
              key={hanja.char}
              onClick={() => {
                setCurrentCharacter(hanja.char);
                setCurrentIndex(idx);
              }}
              className={`p-2 text-lg rounded transition-colors ${
                currentCharacter === hanja.char
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {hanja.char}
            </button>
          ))}
        </div>
        
        {/* 링크 */}
        <div className="flex justify-center space-x-4 mt-6 text-sm">
          <Link href="/practice" className="text-blue-500 hover:text-blue-700 transition-colors">
            필순 애니메이션 연습 페이지로 이동
          </Link>
          <Link href="/practice/enhanced" className="text-blue-500 hover:text-blue-700 transition-colors">
            향상된 필순 연습 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
} 