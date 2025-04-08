'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getHanjaCharacter, getCharactersForLevel } from '@/utils/hanjaUtils';
import { FaPlay, FaRedo, FaPencilAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// 기본 HanziWriterComponent를 사용 (더 안정적)
const HanziWriterComponent = dynamic(
  () => import('../../../components/HanziWriterComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">한자 모듈 로딩 중...</p>
        </div>
      </div>
    )
  }
);

// 동적 임포트 부분 변경
const SimpleHanziWriter = dynamic(
  () => import('../../../components/SimpleHanziWriter'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-40 w-full bg-gray-50 rounded-lg">
        <p className="text-4xl font-bold text-gray-700">...</p>
      </div>
    ) 
  }
);

// window 타입 확장 수정
declare global {
  interface Window {
    HanziWriter: any;
    HanziWriterInstance: any;
    HanziWriterTimers?: Record<string, number>;
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

type HanjaDetailProps = {
  params: {
    character: string;
  };
};

// 상단 isClient 변수 추가
const isClient = typeof window !== 'undefined';

// 카테고리에 따른 색상 및 이름 관련 함수들을 모아서 정의
const getCategoryColor = (categoryId: string): any => {
  switch (categoryId) {
    case 'basic':
      return {
        gradient: 'from-blue-500 to-cyan-500',
        text: 'text-blue-600',
        border: 'border-blue-200',
        light: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
    case 'advanced':
      return {
        gradient: 'from-purple-500 to-indigo-500',
        text: 'text-purple-600',
        border: 'border-purple-200',
        light: 'bg-purple-50',
        button: 'bg-purple-600 hover:bg-purple-700'
      };
    case 'university':
      return {
        gradient: 'from-orange-500 to-red-500',
        text: 'text-pink-600',
        border: 'border-pink-200',
        light: 'bg-pink-50',
        button: 'bg-pink-600 hover:bg-pink-700'
      };
    default:
      return {
        gradient: 'from-blue-500 to-cyan-500',
        text: 'text-blue-600',
        border: 'border-blue-200',
        light: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
  }
};

const getCategoryName = (id: string): string => {
  switch (id) {
    case 'basic': return '기본';
    case 'advanced': return '고급';
    case 'university': return '대학';
    default: return '기본';
  }
};

const getLevelName = (id: string): string => {
  const matches = id.match(/level(\d+)/i);
  if (matches && matches[1]) {
    return `레벨 ${matches[1]}`;
  }
  return '레벨 1';
};

export default function HanjaDetailPage({ params }: HanjaDetailProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams?.get('category') || 'basic';
  const levelId = searchParams?.get('level') || 'level1';
  
  // 한자 데이터 상태
  const [hanjaData, setHanjaData] = useState<HanjaCharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // 쓰기 연습 관련 상태
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [showOutline, setShowOutline] = useState(true);
  const [isChangingMode, setIsChangingMode] = useState(false);
  
  // URL 디코딩 관련 이슈 방지를 위해 메모이제이션 추가
  const character = useMemo(() => {
    try {
      // URL에서 한자 가져오기 - 디코딩 로직 개선
      const rawChar = params.character;
      
      // 이미 디코딩된 경우 그대로 반환
      if (rawChar.length === 1) {
        return rawChar;
      }
      
      // 디코딩 시도
      let decodedChar = rawChar;
      try {
        // URI 디코딩 시도
        while (decodedChar.includes('%')) {
          const prevDecoded = decodedChar;
          decodedChar = decodeURIComponent(decodedChar);
          
          // 더 이상 변화가 없으면 중단
          if (prevDecoded === decodedChar) break;
        }
      } catch (e) {
        console.error('URL 디코딩 오류:', e);
      }
      
      // 디코딩 후에도 길이가 1이 아니면 첫 글자만 반환
      if (decodedChar.length !== 1) {
        if (decodedChar.length > 1) {
          decodedChar = decodedChar.charAt(0);
        } else {
          return rawChar;
        }
      }
      
      return decodedChar;
    } catch (e) {
      console.error('URL 디코딩 과정 오류:', e);
      return params.character;
    }
  }, [params.character]);
  
  // 이전/다음 한자 찾기 로직
  const prevNextHanja = useMemo(() => {
    try {
      const levelHanja = getCharactersForLevel(categoryId, levelId);
      const currentIndex = levelHanja.findIndex(h => h.character === character);
      
      if (currentIndex === -1) return { prev: null, next: null };
      
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
      const nextIndex = currentIndex < levelHanja.length - 1 ? currentIndex + 1 : null;
      
      return {
        prev: prevIndex !== null ? levelHanja[prevIndex] : null,
        next: nextIndex !== null ? levelHanja[nextIndex] : null
      };
    } catch (err) {
      console.error('이전/다음 한자 로딩 오류:', err);
      return { prev: null, next: null };
    }
  }, [categoryId, levelId, character]);

  // 한자 데이터 로드 함수
  useEffect(() => {
    async function fetchHanjaData() {
      setIsLoading(true);
      setIsError(false);
      
      try {
        console.log(`한자 데이터 요청: ${character}, 카테고리: ${categoryId}, 레벨: ${levelId}`);
        
        // 한자 데이터 가져오기
        const data = getHanjaCharacter(character);
        
        if (data) {
          console.log(`한자 데이터 로드 성공:`, data);
          setHanjaData(data);
        } else {
          console.error(`한자 데이터 찾을 수 없음: ${character}`, {
            character,
            categoryId,
            levelId
          });
          setIsError(true);
        }
      } catch (err) {
        console.error(`한자 데이터 로드 오류: ${character}`, err, {
          character,
          categoryId,
          levelId
        });
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHanjaData();
  }, [character, categoryId, levelId]);
  
  // 애니메이션 초기화
  const resetAnimation = useCallback(() => {
    if (window.HanziWriterInstance) {
      try {
        window.HanziWriterInstance.animateCharacter();
      } catch (e) {
        console.error('애니메이션 초기화 오류:', e);
      }
    }
  }, []);

  // 안전한 모드 전환 함수 추가
  const safeSetWritingMode = useCallback((newMode: boolean) => {
    if (isWritingMode !== newMode) {
      setIsChangingMode(true);
      
      // 약간의 지연 후 모드 변경 - 이전 인스턴스가 정리될 시간 제공
        setTimeout(() => {
        setIsWritingMode(newMode);
          
        // 모드 변경 완료 후 추가 지연
              setTimeout(() => {
          setIsChangingMode(false);
        }, 50);
      }, 50);
    }
  }, [isWritingMode]);

  // 한자 쓰기 모드 전환
  const startPractice = useCallback(() => {
    safeSetWritingMode(!isWritingMode);
  }, [isWritingMode, safeSetWritingMode]);

  // 새로운 상태 변수 추가
  const [learningStep, setLearningStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // 학습 단계 관리 함수
  const goToNextStep = useCallback(() => {
    if (learningStep < 3) {
      setLearningStep(prev => prev + 1);
      setCompletedSteps(prev => [...prev, learningStep]);
    }
  }, [learningStep]);

  const goToPrevStep = useCallback(() => {
    if (learningStep > 1) {
      setLearningStep(prev => prev - 1);
    }
  }, [learningStep]);

  // 퀴즈 완료 처리
  const handleQuizComplete = useCallback((success: boolean) => {
    if (success) {
      setQuizCompleted(true);
      setCompletedSteps(prev => [...prev, 3]);
    }
  }, []);

  // completedSteps에 has 함수 대체
  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  // 단계별 학습 컨텐츠 렌더링
  const renderLearningStep = () => {
    if (!hanjaData) return null;
    
    switch(learningStep) {
      case 1: // 의미 학습
        return (
          <div className="mb-8 px-4 py-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              한자 의미 이해하기
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-7xl font-bold p-4 bg-gray-50 rounded-lg shadow-inner">
                {character}
              </div>
              <div className="flex-1">
                <p className="text-xl font-medium mb-2">
                  <span className="font-bold text-gray-700">뜻:</span> {hanjaData.meaning}
                </p>
                <p className="text-xl mb-4">
                  <span className="font-bold text-gray-700">음:</span> {hanjaData.pronunciation}
                </p>
                <p className="text-gray-600 mb-4">{hanjaData.explanation || '이 한자는 일상 생활에서 자주 사용됩니다.'}</p>
                <button 
                  onClick={goToNextStep}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  다음 단계 &rarr;
                </button>
              </div>
            </div>
          </div>
        );
        
      case 2: // 발음 학습
        return (
          <div className="mb-8 px-4 py-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              발음 연습하기
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-7xl font-bold p-4 bg-gray-50 rounded-lg shadow-inner">
                {character}
              </div>
              <div className="flex-1">
                <p className="text-2xl font-medium mb-2">
                  <span className="font-bold text-gray-700">음:</span> {hanjaData.pronunciation}
                </p>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <p className="text-lg text-gray-700">발음 연습:</p>
                  <p className="text-xl font-medium mt-2">
                    1. 소리내어 말해보세요: <span className="font-bold">{hanjaData.pronunciation}</span>
                  </p>
                  {hanjaData.examples && hanjaData.examples.length > 0 && (
                    <div className="mt-4">
                      <p className="text-lg text-gray-700">예문:</p>
                      <ul className="list-disc pl-5 mt-2">
                        {hanjaData.examples.slice(0, 3).map((example, idx) => (
                          <li key={idx} className="mb-2">
                            <span className="font-medium">{example.word}</span>: {example.meaning}
                            <span className="block text-sm text-gray-500">발음: {example.pronunciation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={goToPrevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200"
                  >
                    &larr; 이전
                  </button>
                  <button 
                    onClick={goToNextStep}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    다음 단계 &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // 쓰기 연습 및 퀴즈 (통합)
        return (
          <div className="mb-8 px-4 py-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              쓰기 연습 및 퀴즈
            </h3>
            <p className="text-gray-600 mb-4">
              한자의 쓰기 순서를 배우고 직접 따라 써보세요. 획순에 맞게 직접 쓰는 연습도 할 수 있습니다.
            </p>
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="w-full md:w-1/2 flex flex-col items-center mb-6 md:mb-0">
                {isClient && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex justify-center" style={{ width: '300px', height: '300px' }}>
                    {isChangingMode ? (
                      // 모드 전환 중 로딩 표시
                      <div className="flex items-center justify-center" style={{ width: 250, height: 250 }}>
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : isWritingMode ? (
                      <HanziWriterComponent
                        character={character}
                        width={250}
                        height={250}
                        strokeAnimationSpeed={strokeSpeed}
                        delayBetweenStrokes={1000 / strokeSpeed}
                        strokeColor="#3B82F6"
                        showOutline={showOutline}
                        outlineColor="#E5E7EB"
                        highlightColor="#60A5FA"
                        drawingWidth={8}
                      />
                    ) : (
                      <SimpleHanziWriter
                        character={character}
                        width={250}
                        height={250}
                        quizMode={true}
                        showHint={true}
                        strokeColor="#3B82F6"
                        outlineColor="#E5E7EB"
                        highlightColor="#60A5FA"
                        onQuizComplete={handleQuizComplete}
                      />
                    )}
                  </div>
                )}
                <div className="mt-4 space-x-2 flex justify-center">
                  <button
                    onClick={() => safeSetWritingMode(true)}
                    disabled={isChangingMode}
                    className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                      isWritingMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${isChangingMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    애니메이션
                  </button>
                  <button
                    onClick={() => safeSetWritingMode(false)}
                    disabled={isChangingMode}
                    className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                      !isWritingMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${isChangingMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    퀴즈 모드
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-lg mb-4">
                  <span className="font-bold">총 획수:</span> {hanjaData.stroke_count || '정보 없음'}
                </p>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  {isWritingMode ? (
                    <>
                      <p className="text-lg text-gray-700">쓰기 팁:</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li className="mb-1">획순을 정확히, 천천히 따라해보세요.</li>
                        <li className="mb-1">각 획의 방향에 주의하세요.</li>
                        <li className="mb-1">실제 종이에 여러 번 연습해보세요.</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="text-lg text-gray-700">퀴즈 가이드:</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li className="mb-1">정확한 획순으로 선을 그려야 합니다.</li>
                        <li className="mb-1">획이 잘못되면 힌트가 표시됩니다.</li>
                        <li className="mb-1">모든 획을 완성하면 퀴즈가 종료됩니다.</li>
                      </ul>
                    </>
                  )}
                </div>

                {quizCompleted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <p className="text-green-700 font-bold">축하합니다! 퀴즈를 완료했습니다.</p>
                    <p className="text-green-600">이 한자의 모든 학습 단계를 성공적으로 완료했습니다.</p>
                    
                    <div className="mt-4">
                      <a
                        href={`/api/generate-pdf?character=${encodeURIComponent(character)}&category=${categoryId}&level=${levelId}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-md"
                        rel="noopener noreferrer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                        PDF 복습자료 다운로드
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button 
                    onClick={goToPrevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200"
                  >
                    &larr; 이전
                  </button>
                  {quizCompleted && prevNextHanja.next ? (
                    <Link
                      href={`/learn/hanja/${encodeURIComponent(prevNextHanja.next.character)}?category=${categoryId}&level=${levelId}`}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                    >
                      다음 한자 &rarr;
                    </Link>
                  ) : (
                    !quizCompleted && (
                      <button 
                        onClick={() => {
                          if (isWritingMode) {
                            safeSetWritingMode(false);
                          } else {
                            // 퀴즈 모드에 있을 때는 안내 메시지 표시
                            alert('퀴즈를 완료해주세요!');
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                      >
                        {isWritingMode ? '퀴즈 시작하기' : '퀴즈 완료하기'}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // 학습 진행 상태 표시
  const renderProgressBar = () => {
    // 총 3단계로 변경 (4단계에서 3단계로)
    const totalSteps = 3;
    const progress = (learningStep / totalSteps) * 100;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  // 학습 단계 네비게이션 렌더링
  const renderStepNavigation = () => {
    return (
      <div className="flex justify-between mb-6 px-4">
        <button 
          onClick={() => setLearningStep(1)} 
          className={`flex flex-col items-center ${learningStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
            learningStep >= 1 
              ? isStepCompleted(1) 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {isStepCompleted(1) ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : '1'}
          </div>
          <span className="text-xs">의미</span>
        </button>
        
        <div className="w-1/4 h-0.5 mt-4 bg-gray-200"></div>
        
        <button 
          onClick={() => learningStep >= 2 ? setLearningStep(2) : null} 
          className={`flex flex-col items-center ${learningStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
            learningStep >= 2 
              ? isStepCompleted(2) 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {isStepCompleted(2) ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : '2'}
          </div>
          <span className="text-xs">발음</span>
        </button>
        
        <div className="w-1/4 h-0.5 mt-4 bg-gray-200"></div>
        
        <button 
          onClick={() => learningStep >= 3 ? setLearningStep(3) : null} 
          className={`flex flex-col items-center ${learningStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
            learningStep >= 3 
              ? isStepCompleted(3) 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {isStepCompleted(3) ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : '3'}
          </div>
          <span className="text-xs">쓰기/퀴즈</span>
        </button>
      </div>
    );
  };

  // 페이지를 벗어날 때 정리 효과 추가
  useEffect(() => {
    return () => {
      // 페이지를 벗어날 때 모든 전역 상태 정리
      if (typeof window !== 'undefined') {
        // 전역 타이머 정리
        if (window.HanziWriterTimers) {
          Object.keys(window.HanziWriterTimers).forEach(key => {
            if (window.HanziWriterTimers && window.HanziWriterTimers[key]) {
              clearTimeout(window.HanziWriterTimers[key]);
              delete window.HanziWriterTimers[key];
            }
          });
        }
        
        // 전역 인스턴스 정리
        if (window.HanziWriterInstance) {
          window.HanziWriterInstance = null;
        }
      }
    };
  }, []);

  // 로딩 상태 및 오류 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 px-4 bg-gray-50">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-gray-600">한자 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">한자 데이터를 불러올 수 없습니다</h2>
            <p className="text-gray-600 mb-6">
              요청하신 한자 "{character}"에 대한 정보를 찾을 수 없습니다.<br />
              카테고리: {categoryId}, 레벨: {levelId}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/learn" className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                학습 메인으로 돌아가기
              </Link>
              <button 
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                이전 페이지로 돌아가기
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 font-medium mb-2">문제 해결 방법:</p>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-1">URL이 올바른지 확인해 주세요.</li>
              <li className="mb-1">선택한 카테고리와 레벨에 해당 한자가 있는지 확인해 주세요.</li>
              <li className="mb-1">한자 목록으로 돌아가서 다른, 한자를 선택해 보세요.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // 여기부터는 데이터가 있는 경우 렌더링
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 섹션 */}
      <div className={`bg-gradient-to-r ${getCategoryColor(categoryId || 'basic').gradient} pt-16 pb-6 px-4 shadow-lg`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">한자 학습</h1>
              <div className="flex items-center text-white opacity-90">
                <Link href={`/learn?category=${categoryId}`} className="hover:underline">
                  {getCategoryName(categoryId || '') || '기본'}
                </Link>
                <span className="mx-2">&gt;</span>
                <Link href={`/learn/${categoryId}/${levelId}`} className="hover:underline">
                  {getLevelName(levelId || '') || '레벨 1'}
                </Link>
                <span className="mx-2">&gt;</span>
                <span>한자 상세</span>
              </div>
            </div>
            
            {/* 네비게이션 버튼 */}
            <div className="flex gap-2 mt-4 md:mt-0">
              <Link
                href={`/learn/${categoryId}/${levelId}`}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg flex items-center gap-1 transition-all duration-200"
              >
                <span>&larr;</span> 목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            한자 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
          </div>
        ) : hanjaData ? (
          <>
            {/* 한자 정보 요약 */}
            <div className="bg-white px-6 py-6 rounded-xl shadow-lg mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="text-center">
                  <div className="text-7xl md:text-8xl font-bold bg-gray-50 p-4 rounded-lg shadow-inner inline-block">
                    {character}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{hanjaData.meaning}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">발음</p>
                      <p className="text-lg font-medium">{hanjaData.pronunciation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">획수</p>
                      <p className="text-lg font-medium">{hanjaData.stroke_count || '정보 없음'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">카테고리</p>
                      <p className="text-lg font-medium">{getCategoryName(categoryId || '')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">레벨</p>
                      <p className="text-lg font-medium">{getLevelName(levelId || '')}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{hanjaData.explanation || '이 한자는 일상 생활에서 자주 사용됩니다.'}</p>
                </div>
              </div>
            </div>
            
            {/* 학습 단계 진행 바 */}
            {renderProgressBar()}
            
            {/* 현재 학습 단계 컨텐츠 */}
            {renderLearningStep()}
            
            {/* 이전/다음 한자 네비게이션 */}
            <div className="flex justify-between mt-8">
              {prevNextHanja.prev && (
                <Link
                  href={`/learn/hanja/${encodeURIComponent(prevNextHanja.prev.character)}?category=${categoryId}&level=${levelId}`}
                  className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <span>&larr;</span>
                  <div>
                    <p className="text-sm text-gray-500">이전 한자</p>
                    <p className="text-lg font-medium">{prevNextHanja.prev.character}</p>
                  </div>
                </Link>
              )}
              
              <div className="flex-1"></div>
              
              {prevNextHanja.next && (
                <Link
                  href={`/learn/hanja/${encodeURIComponent(prevNextHanja.next.character)}?category=${categoryId}&level=${levelId}`}
                  className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="text-right">
                    <p className="text-sm text-gray-500">다음 한자</p>
                    <p className="text-lg font-medium">{prevNextHanja.next.character}</p>
                  </div>
                  <span>&rarr;</span>
                </Link>
              )}
            </div>
            
            {/* 예제 단어 섹션 */}
            {hanjaData.examples && hanjaData.examples.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">예제 단어</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hanjaData.examples.map((example, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                      <p className="text-xl font-bold mb-2">{example.word}</p>
                      <p className="text-gray-500 mb-1 text-sm">발음: {example.pronunciation}</p>
                      <p className="text-gray-700">{example.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
} 