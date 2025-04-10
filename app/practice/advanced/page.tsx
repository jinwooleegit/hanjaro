'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getHanjaCharacter } from '@/utils/hanjaUtils';
import { getHanjaIdByCharacter } from '@/utils/hanjaPageUtils';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(
  () => import('../../components/HanziWriterComponent'),
  { ssr: false }
);

// 레벨별 한자 데이터
const hanjaByLevel = {
  '초급': ['一', '二', '三', '大', '中'],
  '중급': ['人', '口', '日', '月', '水'],
  '고급': ['木', '火', '土', '金', '山']
};

export default function AdvancedPracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [character, setCharacter] = useState<string>('一');
  const [hanjaData, setHanjaData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showOutline, setShowOutline] = useState(true);
  const [showCharacter, setShowCharacter] = useState(false);
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string>('초급');
  const [levelIndex, setLevelIndex] = useState(0);
  const [characterId, setCharacterId] = useState<string | null>(null);

  // URL에서 한자 정보 가져오기
  useEffect(() => {
    const charFromQuery = searchParams?.get('char');
    
    if (charFromQuery) {
      try {
        setCharacter(charFromQuery);
        const data = getHanjaCharacter(charFromQuery);
        
        if (data) {
          setHanjaData(data);
          
          // 한자 ID 가져오기
          const fetchHanjaId = async () => {
            try {
              const id = await getHanjaIdByCharacter(charFromQuery);
              setCharacterId(id);
            } catch (idError) {
              console.error('한자 ID 가져오기 실패:', idError);
            }
          };
          
          fetchHanjaId();
          
          // 레벨 찾기
          for (const [level, chars] of Object.entries(hanjaByLevel)) {
            if (chars.includes(charFromQuery)) {
              setSelectedLevel(level);
              setLevelIndex(chars.indexOf(charFromQuery));
              break;
            }
          }
        } else {
          setError('해당 한자 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError('한자 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    } else {
      // 한자가 지정되지 않은 경우 기본 한자 표시
      setCharacter('一');
      
      // 기본 한자 ID 가져오기
      const fetchDefaultHanjaId = async () => {
        try {
          const id = await getHanjaIdByCharacter('一');
          setCharacterId(id);
        } catch (idError) {
          console.error('기본 한자 ID 가져오기 실패:', idError);
        } finally {
          setLoading(false);
        }
      };
      
      fetchDefaultHanjaId();
    }
  }, [searchParams]);

  // 다음 한자로 이동
  const handleNextHanja = () => {
    const currentLevelChars = hanjaByLevel[selectedLevel as keyof typeof hanjaByLevel];
    const nextIndex = (levelIndex + 1) % currentLevelChars.length;
    const nextChar = currentLevelChars[nextIndex];
    
    setLevelIndex(nextIndex);
    router.push(`/practice/advanced?char=${nextChar}`);
  };

  // 이전 한자로 이동
  const handlePrevHanja = () => {
    const currentLevelChars = hanjaByLevel[selectedLevel as keyof typeof hanjaByLevel];
    const prevIndex = (levelIndex - 1 + currentLevelChars.length) % currentLevelChars.length;
    const prevChar = currentLevelChars[prevIndex];
    
    setLevelIndex(prevIndex);
    router.push(`/practice/advanced?char=${prevChar}`);
  };

  // 레벨 변경
  const changeLevel = (level: string) => {
    if (level in hanjaByLevel) {
      setSelectedLevel(level);
      const firstChar = hanjaByLevel[level as keyof typeof hanjaByLevel][0];
      setLevelIndex(0);
      router.push(`/practice/advanced?char=${firstChar}`);
    }
  };

  // 속도 변경 핸들러
  const handleSpeedChange = (value: number) => {
    setStrokeSpeed(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">오류 발생</h2>
          <p className="text-red-600">{error}</p>
          <Link href="/practice" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md">
            연습 메뉴로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">고급 한자 필기 연습</h1>
      
      {/* 연습 모드 선택 탭 추가 */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white rounded-lg shadow-sm inline-flex">
          <Link href={`/practice?char=${character}`} className="px-4 py-2 font-medium text-sm rounded-l-lg bg-gray-100 hover:bg-gray-200 transition">
            기본 연습
          </Link>
          <Link href={`/practice/enhanced?char=${character}`} className="px-4 py-2 font-medium text-sm bg-gray-100 hover:bg-gray-200 transition">
            일반 연습
          </Link>
          <Link href={`/practice/advanced?char=${character}`} className="px-4 py-2 font-medium text-sm rounded-r-lg bg-blue-500 text-white">
            고급 연습
          </Link>
        </div>
      </div>
      
      {/* 현재 한자 정보 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {character} 
              {hanjaData && <span className="text-xl font-normal text-gray-600 ml-2">{hanjaData.meaning}</span>}
            </h2>
            {hanjaData && (
              <p className="text-gray-600">
                <span className="font-medium">획수:</span> {hanjaData.stroke_count}획 | 
                <span className="font-medium ml-2">음:</span> {hanjaData.pronunciation} |
                <span className="font-medium ml-2">부수:</span> {hanjaData.radical}
              </p>
            )}
          </div>
          <div className="text-right">
            <Link href={`/hanja/${characterId || character}`} className="text-blue-500 hover:underline">
              한자 상세 정보 보기
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* 왼쪽: 한자 필기 영역 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">필순 애니메이션</h3>
            <p className="text-sm text-gray-600">
              한자 '{character}'의 올바른 필순을 보여주는 애니메이션입니다.
            </p>
          </div>
          
          <div className="flex justify-center mb-6">
            <HanziWriterComponent
              character={character}
              width={300}
              height={300}
              delayBetweenStrokes={500 / strokeSpeed}
              strokeAnimationSpeed={strokeSpeed}
              showOutline={showOutline}
              showCharacter={showCharacter}
              highlightColor="#E63946"
            />
          </div>
          
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
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              애니메이션 속도: {strokeSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.5"
              value={strokeSpeed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* 오른쪽: 레벨 선택 및 한자 리스트 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">단계별 연습</h3>
            <p className="text-sm text-gray-600 mb-4">
              다양한 레벨의 한자들을 연습해 보세요. 레벨을 선택하고 한자를 눌러 연습할 수 있습니다.
            </p>
            
            <div className="flex justify-center space-x-2 mb-6">
              {Object.keys(hanjaByLevel).map(level => (
                <button
                  key={level}
                  onClick={() => changeLevel(level)}
                  className={`px-3 py-1 rounded-md ${
                    selectedLevel === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={handlePrevHanja}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                이전
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {levelIndex + 1} / {hanjaByLevel[selectedLevel as keyof typeof hanjaByLevel]?.length}
                </p>
              </div>
              
              <button 
                onClick={handleNextHanja}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                다음
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">한자 목록</h3>
            <div className="grid grid-cols-5 gap-2">
              {hanjaByLevel[selectedLevel as keyof typeof hanjaByLevel].map((char, idx) => (
                <Link 
                  key={char} 
                  href={`/practice/advanced?char=${char}`}
                  className={`p-3 text-lg text-center rounded-md transition-colors ${
                    character === char
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {char}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">연습 팁</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>한자의 기본 획순을 익히는 것이 중요합니다.</li>
              <li>일정한 속도로 꾸준히 연습하는 것이 효과적입니다.</li>
              <li>한자의 부수와 구조를 이해하면 더 쉽게 익힐 수 있습니다.</li>
              <li>먼저 천천히 정확하게 쓰는 연습을 한 후, 속도를 높여보세요.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/practice" className="text-blue-500 hover:text-blue-700 transition-colors">
          연습 메인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
} 