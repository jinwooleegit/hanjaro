'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(
  () => import('../../components/HanziWriterComponent'),
  { ssr: false }
);

// 기본 한자 리스트 (한자와 의미 포함)
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

// 레벨별 한자 데이터
const hanjaByLevel = {
  '초급': ['一', '二', '三', '大', '中'],
  '중급': ['人', '口', '日', '月', '水'],
  '고급': ['木', '火', '土', '金', '山']
};

export default function EnhancedHanjaPracticePage() {
  const [currentCharacter, setCurrentCharacter] = useState('一');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOutline, setShowOutline] = useState(true);
  const [showCharacter, setShowCharacter] = useState(false);
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLevel, setCurrentLevel] = useState<string>('초급');
  const [hanjaData, setHanjaData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 한자 데이터 가져오기
  useEffect(() => {
    const fetchHanjaData = async () => {
      try {
        const response = await fetch(`/api/hanja?character=${currentCharacter}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setHanjaData(data[0]);
          } else {
            // 기본 데이터 사용
            const defaultData = commonHanjaList.find(item => item.char === currentCharacter);
            setHanjaData({ 
              character: currentCharacter,
              meaning: defaultData?.meaning || '의미 없음',
              strokeCount: defaultData?.stroke || 0
            });
          }
        }
      } catch (error) {
        console.error("한자 데이터 로드 실패:", error);
      }
    };
    
    fetchHanjaData();
  }, [currentCharacter]);
  
  // 다음 문자로 이동
  const handleNext = () => {
    const charList = hanjaByLevel[currentLevel as keyof typeof hanjaByLevel] || commonHanjaList.map(h => h.char);
    const nextIndex = (currentIndex + 1) % charList.length;
    setCurrentIndex(nextIndex);
    setCurrentCharacter(charList[nextIndex]);
    setFeedback('');
  };
  
  // 이전 문자로 이동
  const handlePrev = () => {
    const charList = hanjaByLevel[currentLevel as keyof typeof hanjaByLevel] || commonHanjaList.map(h => h.char);
    const prevIndex = (currentIndex - 1 + charList.length) % charList.length;
    setCurrentIndex(prevIndex);
    setCurrentCharacter(charList[prevIndex]);
    setFeedback('');
  };
  
  // 스트로크 속도 변경
  const handleStrokeSpeedChange = (value: number) => {
    setStrokeSpeed(value);
  };
  
  // 레벨 변경
  const changeLevel = (level: string) => {
    if (level in hanjaByLevel) {
      setCurrentLevel(level);
      setCurrentIndex(0);
      setCurrentCharacter(hanjaByLevel[level as keyof typeof hanjaByLevel][0]);
      setFeedback('');
    }
  };
  
  // 한자 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const char = searchTerm.trim().charAt(0);
      setCurrentCharacter(char);
      setSearchTerm('');
      setFeedback('');
      
      // 해당 한자가 리스트에 있는지 확인
      const allChars = Object.values(hanjaByLevel).flat();
      if (allChars.includes(char)) {
        // 해당 레벨로 변경
        for (const [level, chars] of Object.entries(hanjaByLevel)) {
          if (chars.includes(char)) {
            setCurrentLevel(level);
            setCurrentIndex(chars.indexOf(char));
            break;
          }
        }
      }
    }
  };

  // 학습 페이지로 이동
  const goToLearnPage = () => {
    router.push(`/learn/hanja/${currentCharacter}`);
  };

  const char = searchParams?.get('char') || '大';

  // URL에서 한자를 가져오는 경우
  useEffect(() => {
    if (char) {
      setCurrentCharacter(char);
      // 레벨 및 인덱스 찾기
      for (const [level, chars] of Object.entries(hanjaByLevel)) {
        if (chars.includes(char)) {
          setCurrentLevel(level);
          setCurrentIndex(chars.indexOf(char));
          break;
        }
      }
    }
  }, [char]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">향상된 한자 필기 연습</h1>

        {/* 연습 모드 선택 탭 추가 */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm inline-flex">
            <Link href={`/practice?char=${char}`} className="px-4 py-2 font-medium text-sm rounded-l-lg bg-gray-100 hover:bg-gray-200 transition">
              기본 연습
            </Link>
            <Link href={`/practice/enhanced?char=${char}`} className="px-4 py-2 font-medium text-sm bg-blue-500 text-white">
              일반 연습
            </Link>
            <Link href={`/practice/advanced?char=${char}`} className="px-4 py-2 font-medium text-sm rounded-r-lg bg-gray-100 hover:bg-gray-200 transition">
              고급 연습
            </Link>
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">
            실제 필순에 따라 한자를 쓰는 방법을 배우고 연습하세요.
          </p>
          <p className="text-gray-600">
            각 한자의 정확한 필순과 쓰는 방법을 애니메이션으로 확인할 수 있습니다.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
          {/* 레벨 선택 */}
          <div className="flex justify-center space-x-2 mb-4">
            {Object.keys(hanjaByLevel).map(level => (
              <button
                key={level}
                onClick={() => changeLevel(level)}
                className={`px-3 py-1 rounded-md ${
                  currentLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
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
                  <p>{hanjaData.meaning || commonHanjaList.find(h => h.char === currentCharacter)?.meaning}</p>
                  <p>획수: {hanjaData.strokeCount || commonHanjaList.find(h => h.char === currentCharacter)?.stroke}획</p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                {currentIndex + 1} / {hanjaByLevel[currentLevel as keyof typeof hanjaByLevel]?.length || commonHanjaList.length}
              </p>
            </div>
            
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              다음
            </button>
          </div>
          
          {/* 한자 필기 컴포넌트 */}
          <div className="flex justify-center mb-6">
            <HanziWriterComponent 
              character={currentCharacter}
              width={250}
              height={250}
              showOutline={showOutline}
              showCharacter={showCharacter}
              highlightColor="#3498db"
              strokeAnimationSpeed={strokeSpeed}
            />
          </div>
          
          {/* 피드백 메시지 */}
          {feedback && (
            <div className={`mb-4 p-3 text-center rounded ${
              feedback.includes('정확') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-yellow-50 text-yellow-800'
            }`}>
              {feedback}
            </div>
          )}
          
          {/* 모드 토글 버튼 */}
          <div className="flex justify-center space-x-3 mb-6">
            <button 
              onClick={() => setShowOutline(!showOutline)}
              className={`px-4 py-2 rounded transition-colors ${
                showOutline 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {showOutline ? '윤곽선 끄기' : '윤곽선 켜기'}
            </button>
            
            <button 
              onClick={() => setShowCharacter(!showCharacter)}
              className={`px-4 py-2 rounded transition-colors ${
                showCharacter 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {showCharacter ? '한자 숨기기' : '한자 표시'}
            </button>
            
            <button 
              onClick={goToLearnPage}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              상세 학습
            </button>
          </div>
          
          {/* 속도 조절 슬라이더 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              애니메이션 속도: {strokeSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.5"
              value={strokeSpeed}
              onChange={(e) => handleStrokeSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
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
            {hanjaByLevel[currentLevel as keyof typeof hanjaByLevel]?.map((char, idx) => (
              <button
                key={char}
                onClick={() => {
                  setCurrentCharacter(char);
                  setCurrentIndex(idx);
                  setFeedback('');
                }}
                className={`p-2 text-lg rounded transition-colors ${
                  currentCharacter === char
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
          
          {/* 링크 */}
          <div className="flex justify-center space-x-4 mt-6 text-sm">
            <Link href="/practice" className="text-blue-500 hover:text-blue-700 transition-colors">
              기존 연습 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 