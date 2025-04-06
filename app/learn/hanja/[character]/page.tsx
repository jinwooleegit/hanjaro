'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getHanjaCharacter, loadHanjaCharacter } from '@/utils/hanjaUtils';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FaPlay, FaRedo, FaPencilAlt } from 'react-icons/fa';
import HANJA_DATABASE from '../../../../data/hanja_database_main.json';

// 기본 HanziWriterComponent를 사용 (더 안정적)
const HanziWriterComponent = dynamic(
  () => import('../../../components/HanziWriterComponent'),
  { ssr: false }
);

// 동적 임포트 부분 변경
const SimpleHanziWriter = dynamic(
  () => import('../../../components/SimpleHanziWriter'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">한자 로딩 중...</p>
        </div>
      </div>
    ) 
  }
);

// window 타입 확장 - 일관된 타입 정의
declare global {
  interface Window {
    HanziWriter: any;
    HanziWriterInstance: any;
    HanziWriterLoaders?: Record<string, (callback: any) => void>;
    HanziCache?: Record<string, any>;
    HanziWriterTimers?: Record<string, number>;
    loadHanjaData?: (char: string, callback: (data: any) => void) => void;
    HanziDebug?: {
      scriptLoaded: boolean;
      loadedAt: string;
    };
  }
}

// 타입 정의
interface HanjaExample {
  word: string;
  meaning: string;
  pronunciation: string;
  sentence?: string;
}

interface HanjaCharacter {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  examples: HanjaExample[];
  korean?: string;
  etymology?: string;
  level?: number;
  order?: number;
  grade?: number;
  explanation?: string;
}

// 타입 확장
interface HanjaLevel {
  name: string;
  description: string;
  characters: HanjaCharacter[];
}

interface HanjaCategory {
  name: string;
  description: string;
  total_characters: number;
  levels: {
    [key: string]: HanjaLevel;
  };
}

interface HanjaDatabase {
  basic: HanjaCategory;
  advanced: HanjaCategory;
}

// 데이터베이스 타입 지정
const typedDatabase = HANJA_DATABASE as HanjaDatabase;

type HanjaDetailProps = {
  params: {
    character: string;
  };
};

// 서버 컴포넌트에서 한자 정보 로드
async function getHanjaData(character: string): Promise<HanjaCharacter | null> {
  try {
    // 데이터베이스에서 한자 찾기
    for (const categoryKey of ['basic', 'advanced'] as const) {
      const category = typedDatabase[categoryKey];
      for (const levelKey in category.levels) {
        const level = category.levels[levelKey];
        const foundHanja = level.characters.find(h => h.character === character);
        if (foundHanja) {
          return foundHanja;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('한자 데이터 로드 오류:', error);
    return null;
  }
}

export default function HanjaDetailPage({ params }: HanjaDetailProps) {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get('category') || 'basic';
  const levelId = searchParams?.get('level') || 'level1';
  
  // URL 디코딩 관련 이슈 방지를 위해 메모이제이션 추가
  const character = useCallback(() => {
    try {
      // URL에서 한자 가져오기 - 디코딩 로직 개선
      const rawChar = params.character;
      
      // 이미 디코딩된 경우 그대로 반환
      if (rawChar.length === 1) {
        console.log('한자가 이미 디코딩됨:', rawChar);
        return rawChar;
      }
      
      // 여러 번 인코딩된 경우를 처리
      let decodedChar = rawChar;
      try {
        decodedChar = decodeURIComponent(rawChar);
        // 여전히 긴 문자열이면 다시 디코딩 시도
        if (decodedChar.length > 1 && decodedChar.includes('%')) {
          decodedChar = decodeURIComponent(decodedChar);
        }
      } catch (e) {
        console.error('URL 디코딩 오류:', e);
      }
      
      // 디코딩 후에도 길이가 1이 아니면 원본 반환
      if (decodedChar.length !== 1) {
        console.warn('비정상 디코딩 결과:', decodedChar, '원본으로 대체');
        return rawChar;
      }
      
      console.log('한자 디코딩 성공:', decodedChar);
      return decodedChar;
    } catch (e) {
      console.error('URL 디코딩 과정 오류:', e);
      return params.character; // 디코딩 실패 시 원본 사용
    }
  }, [params.character])();
  
  // 한자 데이터 상태 관리 (비동기 로딩)
  const [hanjaData, setHanjaData] = useState<HanjaCharacter | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 비동기 데이터 로딩
  useEffect(() => {
    async function fetchHanjaData() {
      setIsLoading(true);
      try {
        // 비동기 로딩 방식 (새로운 방식)
        const data = await loadHanjaCharacter(character);
        
        if (data) {
          // 데이터 확장
          const enhancedData: HanjaCharacter = {
            ...data,
            korean: data.meaning, // 한글 의미에 meaning 값 사용
            etymology: `'${data.character}' 한자는 ${data.radical} 부수에 속하며, 총 ${data.stroke_count}획으로 이루어져 있습니다.`, // 기본 어원 정보 생성
            examples: data.examples?.map(ex => ({
              ...ex,
              sentence: undefined // sentence 필드 추가 (기본값은 undefined)
            })) || []
          };
          
          setHanjaData(enhancedData);
        } else {
          // 기존 방식으로 폴백 (레거시 지원)
          console.warn('비동기 로딩 실패, 동기 방식으로 시도:', character);
          const legacyData = getHanjaCharacter(character);
          
          if (legacyData) {
            // 데이터 확장
            const enhancedLegacyData: HanjaCharacter = {
              ...legacyData,
              korean: legacyData.meaning, // 한글 의미에 meaning 값 사용
              etymology: `'${legacyData.character}' 한자는 ${legacyData.radical} 부수에 속하며, 총 ${legacyData.stroke_count}획으로 이루어져 있습니다.`, // 기본 어원 정보 생성
              examples: legacyData.examples?.map(ex => ({
                ...ex,
                sentence: undefined // sentence 필드 추가 (기본값은 undefined)
              })) || []
            };
            
            setHanjaData(enhancedLegacyData);
          } else {
            console.error('한자 데이터 로드 실패:', character);
            setHanjaData(null);
          }
        }
      } catch (error) {
        console.error('한자 데이터 로드 중 오류:', error);
        setHanjaData(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHanjaData();
  }, [character]);
  
  const [activeTab, setActiveTab] = useState<'필순' | '의미' | '예문'>('필순');
  
  // 애니메이션 설정
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [writerKey, setWriterKey] = useState(Date.now());
  
  // 필기 연습 관련 상태
  const [quizMode, setQuizMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writerRef = useRef<any>(null);
  const [strokeHelp, setStrokeHelp] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // 한자가 제대로 로드되었는지 확인
  const [hanjaLoaded, setHanjaLoaded] = useState(false);
  
  // 한자 데이터 유효성 확인
  useEffect(() => {
    if (hanjaData && hanjaData.character === character) {
      setHanjaLoaded(true);
    } else {
      console.error('한자 데이터 불일치:', {
        요청한자: character,
        로드된한자: hanjaData?.character,
        한자데이터: hanjaData
      });
    }
  }, [character, hanjaData]);
  
  // 애니메이션 리셋
  const resetAnimation = () => {
    console.log('획순 다시보기');
    setWriterKey(Date.now()); // 컴포넌트 강제 리렌더링
  };

  // HanziWriter 스크립트 로드 상태 관리
  const handleScriptLoad = () => {
    console.log('HanziWriter 스크립트 로드 완료');
    setScriptLoaded(true);
    
    // HanziWriter 로드 이벤트 발생
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new Event('HanziWriterLoaded'));
      } catch (e) {
        console.error('HanziWriter 로드 이벤트 발생 오류:', e);
      }
      
      // 글로벌 객체에 상태 기록
      window.HanziDebug = {
        scriptLoaded: true,
        loadedAt: new Date().toISOString()
      };
    }
    
    // 필기 연습 모드에서 스크립트 로드되었다면 초기화
    if (quizMode && canvasRef.current) {
      console.log('필기 연습 모드에서 스크립트 로드됨, 초기화 진행');
      setTimeout(() => {
        initializeWriter();
      }, 300);
    }
  };
  
  // 필기 연습 모드 초기화
  const initializeWriter = () => {
    try {
      // 기존 인스턴스 정리
      if (writerRef.current) {
        writerRef.current = null;
      }
      
      setFeedback('획순을 따라 써보세요');
      
      // 기본 옵션
      const options = {
        width: 300,
        height: 300,
        padding: 10,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 800,
        showOutline: strokeHelp,
        highlightOnComplete: true,
        drawingFadeDuration: 400, // 필기 애니메이션 자연스럽게
        drawingWidth: 12, // 획 두께 증가
        drawingColor: '#333', // 그리기 색상
        outlineColor: '#aaa', // 윤곽선 색상
        strokeWidth: 8, // 획 두께
        outlineWidth: 2, // 윤곽선 두께
        showHintAfterMisses: 3, // 3회 실패 후 힌트
        // 글로벌 로더 활용
        charDataLoader: function(char: string, onComplete: (data: any) => void) {
          let isCompleted = false;
          
          // 타임아웃 설정 (5초)
          const timeoutId = setTimeout(() => {
            if (!isCompleted) {
              console.warn('한자 데이터 로딩 타임아웃:', char);
              isCompleted = true;
              setFeedback('한자 데이터 로딩 시간이 초과되었습니다. 다시 시도해주세요.');
              // 타임아웃 시 기본 X 표시 데이터 제공
              const fallbackData = {
                character: char,
                strokes: ['M 25 25 L 75 75', 'M 75 25 L 25 75'],
                medians: [[[25, 25], [75, 75]], [[75, 25], [25, 75]]],
                isPlaceholder: true
              };
              onComplete(fallbackData);
            }
          }, 5000);
          
          // 캐시에서 데이터 가져오기 시도
          if (window.HanziCache && window.HanziCache[char]) {
            clearTimeout(timeoutId);
            isCompleted = true;
            console.log(`캐시에서 한자 데이터 로드: ${char}`);
            setFeedback('획순을 따라 써보세요');
            onComplete(window.HanziCache[char]);
            return;
          }
          
          // 로더 등록 (비동기 로드 완료 후 업데이트를 위해)
          if (window.HanziWriterLoaders) {
            window.HanziWriterLoaders[char] = (data: any) => {
              if (!isCompleted) {
                clearTimeout(timeoutId);
                isCompleted = true;
                console.log(`로더에서 한자 데이터 업데이트: ${char}`);
                setFeedback('획순을 따라 써보세요');
                onComplete(data);
              }
            };
          }
          
          // 글로벌 로더 사용
          if (window.loadHanjaData) {
            window.loadHanjaData(char, (data: any) => {
              if (!isCompleted) {
                clearTimeout(timeoutId);
                isCompleted = true;
                console.log(`글로벌 로더에서 한자 데이터 로드: ${char}`);
                setFeedback('획순을 따라 써보세요');
                onComplete(data);
              }
            });
            return;
          }
          
          // 글로벌 로더가 없는 경우 기존 방식으로 로드
          const encodedChar = encodeURIComponent(char);
          
          // 모든 소스에서 시도
          Promise.any([
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodedChar}.json`)
              .then(res => res.ok ? res.json() : Promise.reject()),
            fetch(`/api/hanja/strokes?character=${encodedChar}`)
              .then(res => res.ok ? res.json() : Promise.reject()),
            fetch(`https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/${encodedChar}.json`)
              .then(res => res.ok ? res.json() : Promise.reject())
          ])
          .then(data => {
            if (isCompleted) return; // 이미 타임아웃되었으면 무시
            
            clearTimeout(timeoutId);
            isCompleted = true;
            console.log(`한자 데이터 로드 성공: ${char}`);
            
            // 캐시에 저장
            if (window.HanziCache) {
              window.HanziCache[char] = data;
            }
            
            setFeedback('획순을 따라 써보세요');
            onComplete(data);
          })
          .catch(err => {
            if (isCompleted) return; // 이미 타임아웃되었으면 무시
            
            clearTimeout(timeoutId);
            isCompleted = true;
            console.error('한자 데이터 로드 실패:', err);
            setFeedback('한자 데이터를 불러올 수 없습니다. 다른 한자를 시도해보세요.');
            
            // 기본 X 표시 데이터 제공
            const fallbackData = {
              character: char,
              strokes: ['M 25 25 L 75 75', 'M 75 25 L 25 75'],
              medians: [[[25, 25], [75, 75]], [[75, 25], [25, 75]]],
              isPlaceholder: true
            };
            onComplete(fallbackData);
          });
        }
      };
      
      // 필기 연습 인스턴스 생성
      if (!canvasRef.current) {
        setFeedback('캔버스 요소를 찾을 수 없습니다');
        return;
      }
      
      // 캔버스 클리어
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      try {
        writerRef.current = window.HanziWriter.create(canvasRef.current, character, options);
        
        // 퀴즈 모드 시작
        setTimeout(() => {
          if (!writerRef.current) {
            setFeedback('한자 인스턴스 생성에 실패했습니다. 다시 시도해주세요.');
            return;
          }
          
          // 먼저 첫 획을 보여주고 시작
          writerRef.current.animateCharacter({
            onComplete: () => {
              // 애니메이션 완료 후 잠시 대기 후 퀴즈 시작
              setTimeout(() => {
                if (!writerRef.current) return;
                
                // 퀴즈 모드 시작
                writerRef.current.quiz({
                  onMistake: (strokeData: any) => {
                    setAttempts(prev => prev + 1);
                    const newAttempts = attempts + 1;
                    if (newAttempts > 2) {
                      setFeedback('획순이 맞지 않습니다. 힌트를 참고하세요.');
                    }
                  },
                  onCorrectStroke: (strokeData: any) => {
                    setFeedback('좋아요! 계속 진행하세요.');
                  },
                  onComplete: () => {
                    setSuccess(true);
                    setFeedback('훌륭해요! 한자를 성공적으로 작성했습니다.');
                    
                    // 완료 후 애니메이션 보여주기
                    setTimeout(() => {
                      if (writerRef.current) {
                        writerRef.current.highlightStroke(0);
                        // 각 획 하이라이트
                        for (let i = 0; i < (writerRef.current._character?.strokes?.length || 0); i++) {
                          setTimeout(() => {
                            if (writerRef.current) {
                              writerRef.current.highlightStroke(i);
                            }
                          }, i * 300);
                        }
                      }
                    }, 1000);
                  }
                });
              }, 1000);
            }
          });
        }, 500);
      } catch (error) {
        console.error('필기 연습 초기화 오류:', error);
        setFeedback('필기 연습을 시작할 수 없습니다. 새로고침 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('필기 연습 초기화 오류:', error);
      setFeedback('필기 연습을 시작할 수 없습니다. 새로고침 후 다시 시도해주세요.');
    }
  };
  
  // 필기 연습 시작
  const startPractice = () => {
    // 이미 퀴즈 모드라면 리셋만 하고 리턴
    if (quizMode) {
      setSuccess(false);
      setFeedback('한자 필기 연습을 재시작합니다...');
      setAttempts(0);
      setTimeout(() => initializeWriter(), 300);
      return;
    }
    
    // 퀴즈 모드로 전환
    setQuizMode(true);
    setSuccess(false);
    setFeedback('한자 필기 연습을 준비 중입니다...');
    setAttempts(0);
    
    // HanziWriter가 없으면 스크립트 로드 시도
    if (!window.HanziWriter) {
      console.log('HanziWriter 스크립트 로드 시도');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        setTimeout(() => initializeWriter(), 500);
      };
      script.onerror = () => {
        // 대체 URL 시도
        const backupScript = document.createElement('script');
        backupScript.src = 'https://unpkg.com/hanzi-writer@3.5/dist/hanzi-writer.min.js';
        backupScript.onload = () => {
          setScriptLoaded(true);
          setTimeout(() => initializeWriter(), 500);
        };
        backupScript.onerror = () => {
          setFeedback('한자 작성 라이브러리를 로드할 수 없습니다. 인터넷 연결을 확인하고 페이지를 새로고침 해주세요.');
        };
        document.head.appendChild(backupScript);
      };
      document.head.appendChild(script);
      return;
    }
    
    // 라이브러리 로드되었으면 초기화 진행
    setTimeout(() => initializeWriter(), 300);
  };
  
  // HanziWriter 로드 함수 추가
  const loadHanziWriter = (callback: () => void) => {
    if (typeof window !== 'undefined') {
      if (window.HanziWriter) {
        callback();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('HanziWriter 스크립트 수동 로드 완료');
        callback();
      };
      
      script.onerror = () => {
        console.error('HanziWriter 스크립트 로드 실패, 백업 CDN 시도');
        const backupScript = document.createElement('script');
        backupScript.src = 'https://unpkg.com/hanzi-writer@3.5/dist/hanzi-writer.min.js';
        backupScript.async = true;
        
        backupScript.onload = () => {
          console.log('HanziWriter 스크립트 백업에서 로드 성공');
          callback();
        };
        
        backupScript.onerror = () => {
          console.error('HanziWriter 스크립트 로드 최종 실패');
        };
        
        document.head.appendChild(backupScript);
      };
      
      document.head.appendChild(script);
    }
  };
  
  // 카테고리의 한자 가져오기 함수 추가
  const getCategoryHanja = (categoryId: string, levelId: string, index: number): HanjaCharacter | undefined => {
    try {
      // categoryId를 basic 또는 advanced로 변환
      const category = categoryId === 'basic' ? typedDatabase.basic : typedDatabase.advanced;
      
      // 레벨 찾기
      const level = category.levels[levelId];
      if (!level || !level.characters || level.characters.length === 0) return undefined;
      
      // 인덱스가 유효한지 확인
      if (index < 0 || index >= level.characters.length) {
        // 인덱스 범위를 벗어나면 순환하도록 처리
        const adjustedIndex = ((index % level.characters.length) + level.characters.length) % level.characters.length;
        return level.characters[adjustedIndex];
      }
      
      return level.characters[index];
    } catch (error) {
      console.error('관련 한자 가져오기 오류:', error);
      return undefined;
    }
  };
  
  // 한자 상세 페이지 반환 부분 - Script 태그 위치 조정
    return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isLoading ? (
        // 로딩 중 UI
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">한자 데이터를 불러오는 중입니다...</p>
        </div>
      ) : !hanjaData ? (
        // 데이터 로드 실패 UI
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
      </div>
          <p className="text-gray-700 font-medium mb-2">한자 데이터를 찾을 수 없습니다</p>
          <p className="text-gray-500 text-sm mb-4">요청한 한자: {character}</p>
          <Link 
            href={`/learn?category=${categoryId}&level=${levelId}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
          >
            목록으로 돌아가기
          </Link>
        </div>
      ) : (
        <>
          {/* 헤더 섹션 */}
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">
                {hanjaData?.character} <span className="text-lg font-normal text-gray-600">({hanjaData?.meaning})</span>
              </h1>
              <p className="text-gray-600 mb-2">발음: {hanjaData?.pronunciation} | 획수: {hanjaData?.stroke_count}획 | 부수: {hanjaData?.radical}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Link
                  href={`/learn?category=${categoryId}&level=${levelId}`}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                >
                  ← 목록으로
                </Link>
                <Link
                  href={`/practice/direct/${encodeURIComponent(character)}`}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
                >
                  <FaPencilAlt className="mr-1" /> 필기 연습하기
                </Link>
          </div>
        </div>

            <div className="mt-6 md:mt-0 flex flex-col items-center">
              <div className="text-9xl mb-2">{hanjaData?.character}</div>
              <div className="text-sm text-gray-500">{hanjaData?.korean}</div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-2">
              {(['필순', '의미', '예문'] as const).map((tab) => (
            <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
            </button>
              ))}
            </div>
          </div>
          
          {/* 탭 콘텐츠 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 필순 탭 */}
            {activeTab === '필순' && (
              <div className="flex flex-col items-center">
                <div className="flex justify-center mb-6">
                  <SimpleHanziWriter
                    character={character}
                    width={300}
                    height={300}
                    strokeColor="#333333"
                    outlineColor="#dddddd"
                    highlightColor="#3b82f6"
                  />
        </div>

                <div className="w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      획수: {hanjaData?.stroke_count}획
                    </h3>
                    <button
                      onClick={resetAnimation}
                      className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm transition-colors"
                    >
                      <FaRedo className="mr-1" /> 필순 다시보기
                    </button>
            </div>
            
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">필순 규칙</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>가로(→)가 세로(↓)보다 먼저</li>
                      <li>왼쪽에서 오른쪽으로</li>
                      <li>위에서 아래로</li>
                      <li>바깥에서 안쪽으로</li>
                      <li>왼쪽 삐침이 오른쪽 삐침보다 먼저</li>
                    </ul>
              </div>
              </div>
              </div>
            )}
            
            {/* 의미 탭 */}
            {activeTab === '의미' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">기본 의미</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-lg">{hanjaData?.meaning}</p>
                    <p className="text-gray-600 mt-2">한글 의미: {hanjaData?.korean}</p>
              </div>
            </div>
            
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">관련 단어</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hanjaData?.examples?.map((example, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="font-medium">{example.word}</div>
                        <div className="text-gray-600 text-sm">{example.meaning}</div>
                        <div className="text-gray-500 text-xs mt-1">발음: {example.pronunciation}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">어원 및 추가 정보</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {hanjaData?.etymology || `'${hanjaData?.character}' 한자는 ${hanjaData?.radical} 부수에 속하며, 총 ${hanjaData?.stroke_count}획으로 이루어져 있습니다.`}
                    </p>
              </div>
            </div>
          </div>
        )}

            {/* 예문 탭 */}
            {activeTab === '예문' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">예문</h3>
                
                {hanjaData?.examples?.map((example, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="text-3xl font-medium mr-3">{example.word}</div>
                      <div className="text-gray-600">{example.pronunciation}</div>
                    </div>
                    <p className="text-gray-800">{example.meaning}</p>
                    
                    {example.sentence && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-gray-700 italic">{example.sentence}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {(!hanjaData?.examples || hanjaData.examples.length === 0) && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                    이 한자에 대한 예문이 아직 준비되지 않았습니다.
                  </div>
                )}
            </div>
            )}
          </div>
          
          {/* 관련 한자 추천 */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-800 mb-4">함께 학습하면 좋은 한자</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => {
                const relatedIndex = (hanjaData?.order || 1) + i;
                const relatedChar = getCategoryHanja(categoryId, levelId, relatedIndex);
                
                if (!relatedChar || relatedChar.character === character) return null;
                
                return (
                  <Link
                    key={i}
                    href={`/learn/hanja/${encodeURIComponent(relatedChar.character)}?category=${categoryId}&level=${levelId}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col items-center"
                  >
                    <div className="text-4xl mb-2">{relatedChar.character}</div>
                    <div className="text-sm text-gray-700">{relatedChar.meaning}</div>
                    <div className="text-xs text-gray-500 mt-1">{relatedChar.pronunciation}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
        )}
    </div>
  );
} 