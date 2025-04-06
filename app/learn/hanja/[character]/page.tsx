'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getHanjaCharacter, loadHanjaCharacter } from '@/utils/hanjaUtils';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { FaPlay, FaRedo, FaPencilAlt } from 'react-icons/fa';
import HANJA_DATABASE from '../../../../data/hanja_database_main.json';
import TAGS_DATA from '../../../../data/tags.json';

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

// 태그 관련 타입 정의
interface Tag {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
}

interface TagsData {
  tag_categories: TagCategory[];
}

// 데이터베이스 타입 지정
const typedDatabase = HANJA_DATABASE as HanjaDatabase;
const typedTagsData = TAGS_DATA as TagsData;

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
  const router = useRouter();
  const categoryId = searchParams?.get('category') || 'basic';
  const levelId = searchParams?.get('level') || 'level1';
  
  // URL 디코딩 관련 이슈 방지를 위해 메모이제이션 추가
  const character = useCallback(() => {
    try {
      // URL에서 한자 가져오기 - 디코딩 로직 개선
      const rawChar = params.character;
      console.log('URL에서 추출한 원본 한자 파라미터:', rawChar);
      
      // 이미 디코딩된 경우 그대로 반환
      if (rawChar.length === 1) {
        console.log('한자가 이미 디코딩된 상태:', rawChar);
        return rawChar;
      }
      
      // 여러 번 인코딩된 경우를 처리
      let decodedChar = rawChar;
      try {
        // URI 디코딩 시도
        while (decodedChar.includes('%')) {
          const prevDecoded = decodedChar;
          decodedChar = decodeURIComponent(decodedChar);
          console.log('디코딩 진행:', prevDecoded, '->', decodedChar);
          
          // 더 이상 변화가 없으면 중단
          if (prevDecoded === decodedChar) break;
        }
      } catch (e) {
        console.error('URL 디코딩 오류:', e);
        // 부분적으로 디코딩된 결과라도 사용
      }
      
      // 디코딩 후에도 길이가 1이 아니면 원본 반환
      if (decodedChar.length !== 1) {
        console.warn('비정상 디코딩 결과:', decodedChar, '(길이:', decodedChar.length, ') - 첫 글자만 사용');
        // 한자는 한 글자이므로 첫 번째 글자만 사용
        if (decodedChar.length > 1) {
          decodedChar = decodedChar.charAt(0);
        } else {
          // 디코딩 실패 시 대체 문자 반환
          return rawChar;
        }
      }
      
      console.log('최종 한자 디코딩 결과:', decodedChar);
      return decodedChar;
    } catch (e) {
      console.error('URL 디코딩 과정 중 치명적 오류:', e);
      return params.character; // 디코딩 실패 시 원본 사용
    }
  }, [params.character])();
  
  // 카테고리와 레벨 ID 안전하게 처리
  const safeGetParam = useCallback((name: string, defaultValue: string): string => {
    try {
      const value = searchParams?.get(name);
      return value ? decodeURIComponent(value) : defaultValue;
    } catch (e) {
      console.error(`${name} 파라미터 디코딩 중 오류:`, e);
      return defaultValue;
    }
  }, [searchParams]);

  // 안전하게 카테고리와 레벨 파라미터 가져오기
  const safeCategoryId = safeGetParam('category', 'basic');
  const safeLevelId = safeGetParam('level', 'level1');
  
  // 한자 데이터 상태 관리 (비동기 로딩)
  const [hanjaData, setHanjaData] = useState<HanjaCharacter | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 비동기 데이터 로딩
  useEffect(() => {
    async function fetchHanjaData() {
      setIsLoading(true);
      try {
        console.log(`한자 데이터 로드 시작: "${character}"`);
        
        // 비동기 로딩 방식 (새로운 방식)
        let data = await loadHanjaCharacter(character);
        
        if (data) {
          console.log(`한자 데이터 로드 성공: "${character}"`, data);
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
          console.warn(`비동기 로딩 실패, 동기 방식으로 시도: "${character}"`);
          
          // 데이터베이스에서 직접 검색
          for (const categoryKey of ['basic', 'advanced'] as const) {
            const category = typedDatabase[categoryKey];
            for (const levelKey in category.levels) {
              const level = category.levels[levelKey];
              const foundHanja = level.characters.find(h => h.character === character);
              if (foundHanja) {
                console.log(`한자 데이터베이스에서 직접 찾음: "${character}"`, foundHanja);
                // 데이터 확장
                const enhancedLegacyData: HanjaCharacter = {
                  ...foundHanja,
                  korean: foundHanja.meaning, // 한글 의미에 meaning 값 사용
                  etymology: `'${foundHanja.character}' 한자는 ${foundHanja.radical} 부수에 속하며, 총 ${foundHanja.stroke_count}획으로 이루어져 있습니다.`, // 기본 어원 정보 생성
                  examples: foundHanja.examples?.map(ex => ({
                    ...ex,
                    sentence: undefined // sentence 필드 추가 (기본값은 undefined)
                  })) || []
                };
                
                setHanjaData(enhancedLegacyData);
                setIsLoading(false);
                return;
              }
            }
          }
          
          // 마지막으로 getHanjaCharacter 함수로 시도
          const legacyData = getHanjaCharacter(character);
          
          if (legacyData) {
            console.log(`getHanjaCharacter로 데이터 찾음: "${character}"`, legacyData);
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
            console.error(`모든 방법으로 한자 데이터 로드 실패: "${character}"`);
            setHanjaData(null);
          }
        }
      } catch (error) {
        console.error(`한자 데이터 로드 중 오류: "${character}"`, error);
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
      if (!typedDatabase) return undefined;
      
      const category = categoryId === 'basic' ? typedDatabase.basic : 
                       categoryId === 'advanced' ? typedDatabase.advanced : undefined;
      
      // 카테고리가 없으면 undefined 반환
      if (!category) return undefined;
      
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
  
  // 한자에 맞는 태그를 찾는 함수
  const getMatchingTags = useCallback((character: string, tagCategories: TagCategory[]): Record<string, Tag[]> => {
    const result: Record<string, Tag[]> = {};
    
    // 각 태그 카테고리를 순회하면서 한자가 해당하는 태그를 찾음
    tagCategories.forEach(category => {
      const matchedTags = category.tags.filter(tag => 
        tag.examples.includes(character)
      );
      
      // 매칭된 태그가 있으면 결과에 추가
      if (matchedTags.length > 0) {
        result[category.id] = matchedTags;
      }
    });
    
    // 메타데이터 기반으로 태그 매핑 (직접 매핑이 없을 경우)
    // 부수 기반 태그 매핑
    if (hanjaData && !result['radical'] && hanjaData.radical) {
      const radicalCategory = tagCategories.find(cat => cat.id === 'radical');
      if (radicalCategory) {
        // 한자의 부수와 일치하는 태그 찾기
        const radicalNameMatch = hanjaData.radical;
        const matchingRadicalTags = radicalCategory.tags.filter(tag => 
          tag.name.includes(radicalNameMatch) || radicalNameMatch.includes(tag.name)
        );
        
        if (matchingRadicalTags.length > 0) {
          result['radical'] = matchingRadicalTags;
        }
      }
    }
    
    // 난이도 기반 태그 매핑
    if (hanjaData && !result['difficulty'] && typeof hanjaData.stroke_count === 'number') {
      const difficultyCategory = tagCategories.find(cat => cat.id === 'difficulty');
      if (difficultyCategory) {
        let difficultyTag: Tag | undefined;
        
        // 획수에 따른 난이도 분류
        if (hanjaData.stroke_count <= 4) {
          difficultyTag = difficultyCategory.tags.find(tag => tag.id === 'beginner');
        } else if (hanjaData.stroke_count <= 9) {
          difficultyTag = difficultyCategory.tags.find(tag => tag.id === 'intermediate');
        } else {
          difficultyTag = difficultyCategory.tags.find(tag => tag.id === 'advanced');
        }
        
        if (difficultyTag) {
          result['difficulty'] = [difficultyTag];
        }
      }
    }
    
    // 의미 카테고리 매핑 - 한자의 의미 기반으로 추정
    if (hanjaData && !result['meaning']) {
      const meaningCategory = tagCategories.find(cat => cat.id === 'meaning');
      if (meaningCategory && hanjaData.meaning) {
        // 의미를 기반으로 카테고리 매핑 시도
        const meaningKeywords: Record<string, string[]> = {
          'nature': ['산', '물', '나무', '불', '흙', '돌', '강', '바다', '천', '지', '화', '목'],
          'human': ['사람', '남자', '여자', '아이', '아버지', '어머니', '인', '남', '녀', '자', '부', '모'],
          'body': ['눈', '귀', '입', '손', '발', '심장', '목', '이', '구', '수', '족', '심'],
          'time': ['날', '달', '해', '시간', '분', '일', '월', '년', '시', '분', '초'],
          'place': ['집', '방', '길', '문', '나라', '가', '실', '도', '문', '국'],
          'number': ['하나', '둘', '셋', '넷', '다섯', '일', '이', '삼', '사', '오'],
          'action': ['가다', '오다', '먹다', '보다', '듣다', '행', '래', '식', '견', '문'],
          'attribute': ['크다', '작다', '길다', '짧다', '높다', '대', '소', '장', '단', '고'],
          'color': ['빨강', '파랑', '노랑', '하양', '검정', '적', '청', '황', '백', '흑']
        };
        
        // 한자의 의미와 일치하는 키워드가 있는 카테고리 찾기
        const meaningText = hanjaData.meaning.toLowerCase();
        const matchedMeaningTags: Tag[] = [];
        
        Object.entries(meaningKeywords).forEach(([categoryId, keywords]) => {
          for (const keyword of keywords) {
            if (meaningText.includes(keyword)) {
              const tag = meaningCategory.tags.find(t => t.id === categoryId);
              if (tag && !matchedMeaningTags.some(mt => mt.id === tag.id)) {
                matchedMeaningTags.push(tag);
                break;
              }
            }
          }
        });
        
        if (matchedMeaningTags.length > 0) {
          result['meaning'] = matchedMeaningTags;
        }
      }
    }
    
    // 교육 과정 매핑
    if (!result['education'] && categoryId) {
      const educationCategory = tagCategories.find(cat => cat.id === 'education');
      if (educationCategory) {
        let educationTag: Tag | undefined;
        
        if (categoryId === 'elementary' || categoryId === 'basic') {
          educationTag = educationCategory.tags.find(tag => tag.id === 'elementary');
        } else if (categoryId === 'middle') {
          educationTag = educationCategory.tags.find(tag => tag.id === 'middle');
        } else if (categoryId === 'high') {
          educationTag = educationCategory.tags.find(tag => tag.id === 'high');
        } else if (categoryId === 'advanced') {
          educationTag = educationCategory.tags.find(tag => tag.id === 'university');
        }
        
        if (educationTag) {
          result['education'] = [educationTag];
        }
      }
    }
    
    return result;
  }, [categoryId, hanjaData]);
  
  // 한자에 맞는 태그 상태 관리
  const [matchedTags, setMatchedTags] = useState<Record<string, Tag[]>>({});
  
  // 한자 데이터가 로드되면 태그 매칭 실행
  useEffect(() => {
    if (hanjaData && hanjaData.character) {
      const tags = getMatchingTags(hanjaData.character, typedTagsData.tag_categories);
      setMatchedTags(tags);
    }
  }, [hanjaData, getMatchingTags]);
  
  // 관련 한자 찾기 함수 추가
  const findRelatedHanja = useCallback((currentHanja: HanjaCharacter): HanjaCharacter[] => {
    if (!currentHanja || !typedDatabase) return [];
    
    const relatedHanjaList: HanjaCharacter[] = [];
    const seenCharacters = new Set<string>([currentHanja.character]); // 중복 방지
    
    // 1. 동일한 부수를 가진 한자 찾기
    const radicalMatches: HanjaCharacter[] = [];
    
    // 2. 비슷한 획수를 가진 한자 찾기 (±2)
    const strokeCountMatches: HanjaCharacter[] = [];
    
    // 3. 의미가 유사한 한자 찾기
    const meaningMatches: HanjaCharacter[] = [];
    
    // 모든 카테고리와 레벨에서 한자 검색
    for (const categoryKey of ['basic', 'advanced'] as const) {
      const category = typedDatabase[categoryKey];
      for (const levelKey in category.levels) {
        const level = category.levels[levelKey];
        
        for (const hanja of level.characters) {
          // 현재 한자와 동일하면 건너뜀
          if (hanja.character === currentHanja.character) continue;
          // 이미 추가된 한자면 건너뜀
          if (seenCharacters.has(hanja.character)) continue;
          
          // 부수 일치 여부 확인
          if (hanja.radical === currentHanja.radical) {
            radicalMatches.push(hanja);
            seenCharacters.add(hanja.character);
          }
          // 획수 유사성 확인 (±2)
          else if (
            Math.abs(hanja.stroke_count - currentHanja.stroke_count) <= 2 && 
            !seenCharacters.has(hanja.character)
          ) {
            strokeCountMatches.push(hanja);
            seenCharacters.add(hanja.character);
          }
          // 의미 유사성 확인 (키워드 포함)
          else if (
            (currentHanja.meaning.includes('水') && hanja.meaning.includes('水')) ||
            (currentHanja.meaning.includes('불') && hanja.meaning.includes('불')) ||
            (currentHanja.meaning.includes('산') && hanja.meaning.includes('산')) ||
            (currentHanja.meaning.includes('나무') && hanja.meaning.includes('나무')) ||
            (currentHanja.meaning.includes('사람') && hanja.meaning.includes('사람')) ||
            (currentHanja.meaning.includes('마음') && hanja.meaning.includes('마음')) ||
            (currentHanja.meaning.includes('말') && hanja.meaning.includes('말')) ||
            (currentHanja.meaning.includes('손') && hanja.meaning.includes('손')) ||
            (currentHanja.meaning.includes('발') && hanja.meaning.includes('발')) ||
            (currentHanja.meaning.includes('귀') && hanja.meaning.includes('귀')) ||
            (currentHanja.meaning.includes('눈') && hanja.meaning.includes('눈')) ||
            // 발음 유사성
            (currentHanja.pronunciation === hanja.pronunciation && 
             !seenCharacters.has(hanja.character))
          ) {
            meaningMatches.push(hanja);
            seenCharacters.add(hanja.character);
          }
        }
      }
    }
    
    // 각 카테고리에서 최대 2개씩 선택 (부수 → 획수 → 의미 순 우선순위)
    let count = 0;
    
    // 부수 관련 한자 (최대 2개)
    for (let i = 0; i < radicalMatches.length && count < 2; i++) {
      relatedHanjaList.push(radicalMatches[i]);
      count++;
    }
    
    // 획수 관련 한자 (최대 1개)
    for (let i = 0; i < strokeCountMatches.length && count < 3; i++) {
      relatedHanjaList.push(strokeCountMatches[i]);
      count++;
    }
    
    // 의미 관련 한자 (나머지)
    for (let i = 0; i < meaningMatches.length && count < 4; i++) {
      relatedHanjaList.push(meaningMatches[i]);
      count++;
    }
    
    // 충분한 관련 한자를 찾지 못한 경우, 현재 카테고리/레벨에서 무작위로 선택
    if (relatedHanjaList.length < 4) {
      const currentCategoryId = safeCategoryId;
      const currentLevelId = safeLevelId;
      
      if (currentCategoryId && currentLevelId && typedDatabase[currentCategoryId as 'basic' | 'advanced']) {
        const currentLevel = typedDatabase[currentCategoryId as 'basic' | 'advanced'].levels[currentLevelId];
        
        if (currentLevel && currentLevel.characters) {
          // 현재 레벨의 한자들을 섞음
          const shuffled = [...currentLevel.characters]
            .filter(h => !seenCharacters.has(h.character)) // 이미 추가된 한자 제외
            .sort(() => 0.5 - Math.random()); // 무작위 정렬
          
          // 필요한 만큼 추가
          for (let i = 0; i < shuffled.length && relatedHanjaList.length < 4; i++) {
            relatedHanjaList.push(shuffled[i]);
          }
        }
      }
    }
    
    return relatedHanjaList;
  }, [safeCategoryId, safeLevelId]);
  
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
            href={`/learn?category=${safeCategoryId}&level=${safeLevelId}`}
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
              
              {/* 분류 및 태그 정보 추가 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {/* 학습 단계 표시 */}
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {safeCategoryId === 'elementary' ? '초등' : 
                   safeCategoryId === 'middle' ? '중등' : 
                   safeCategoryId === 'high' ? '고등' : 
                   safeCategoryId === 'basic' ? '기초' : 
                   safeCategoryId === 'advanced' ? '심화' : '일반'} 
                  {safeLevelId.replace('level', '')}단계
                </div>
                
                {/* 한자 유형 태그 (획수 기반) */}
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {hanjaData?.stroke_count <= 5 ? '기초 한자' : 
                   hanjaData?.stroke_count <= 10 ? '일반 한자' : 
                   hanjaData?.stroke_count <= 15 ? '중급 한자' : '고급 한자'}
                </div>
                
                {/* 부수 태그 */}
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {hanjaData?.radical}
                </div>
                
                {/* 의미 태그 추가 */}
                {matchedTags['meaning']?.map((tag, index) => (
                  <div 
                    key={`meaning-${index}`} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    title={tag.description}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Link
                  href={`/learn?category=${safeCategoryId}&level=${safeLevelId}`}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                >
                  ← 목록으로
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
                
                {/* 학습 분류 정보 추가 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">학습 분류</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">학습 단계</p>
                        <p className="font-medium">
                          {safeCategoryId === 'elementary' ? '초등학교' : 
                           safeCategoryId === 'middle' ? '중학교' : 
                           safeCategoryId === 'high' ? '고등학교' : 
                           safeCategoryId === 'basic' ? '기초 한자' : 
                           safeCategoryId === 'advanced' ? '심화 한자' : '일반'} {' '}
                          {safeLevelId.replace('level', '')}단계
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">난이도</p>
                        <p className="font-medium">
                          {hanjaData?.stroke_count <= 5 ? '쉬움' : 
                           hanjaData?.stroke_count <= 10 ? '보통' : 
                           hanjaData?.stroke_count <= 15 ? '어려움' : '매우 어려움'}
                          <span className="text-sm text-gray-500 ml-1">
                            (획수 {hanjaData?.stroke_count}획 기준)
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">부수 계열</p>
                        <p className="font-medium">{hanjaData?.radical}</p>
                      </div>
                    </div>
                    
                    {/* 의미 태그 섹션 추가 */}
                    {Object.keys(matchedTags).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-blue-100">
                        <p className="text-sm text-gray-500 mb-2">의미 분류</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(matchedTags).map(([categoryId, tags]) => (
                            tags.map((tag, index) => (
                              <div 
                                key={`${categoryId}-${index}`}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                  ${categoryId === 'meaning' ? 'bg-purple-100 text-purple-800' : 
                                   categoryId === 'radical' ? 'bg-yellow-100 text-yellow-800' : 
                                   categoryId === 'difficulty' ? 'bg-green-100 text-green-800' : 
                                   categoryId === 'education' ? 'bg-blue-100 text-blue-800' : 
                                   categoryId === 'usage' ? 'bg-orange-100 text-orange-800' : 
                                   'bg-gray-100 text-gray-800'}`}
                                  title={tag.description}
                              >
                                {tag.name}
                              </div>
                            ))
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-blue-100">
                      <p className="text-sm text-blue-600">
                        학습 경로: <Link href="/learn" className="underline hover:text-blue-800">학습 메인</Link> &gt; {' '}
                        <Link href={`/learn?category=${safeCategoryId}`} className="underline hover:text-blue-800">
                          {safeCategoryId === 'elementary' ? '초등학교' : 
                           safeCategoryId === 'middle' ? '중학교' : 
                           safeCategoryId === 'high' ? '고등학교' : 
                           safeCategoryId === 'basic' ? '기초 한자' : 
                           safeCategoryId === 'advanced' ? '심화 한자' : '일반'}
                        </Link> &gt; {' '}
                        <Link href={`/learn/level/${safeCategoryId}-${safeLevelId}`} className="underline hover:text-blue-800">
                          {safeLevelId.replace('level', '')}단계
                        </Link>
                      </p>
                    </div>
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
                
                {/* 학습 태그 정보 */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {safeCategoryId === 'elementary' ? '초등' : 
                       safeCategoryId === 'middle' ? '중등' : 
                       safeCategoryId === 'high' ? '고등' : 
                       safeCategoryId === 'basic' ? '기초' : 
                       safeCategoryId === 'advanced' ? '심화' : '일반'} {' '}
                      {safeLevelId.replace('level', '')}단계
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {hanjaData?.stroke_count <= 5 ? '기초 한자' : 
                       hanjaData?.stroke_count <= 10 ? '일반 한자' : 
                       hanjaData?.stroke_count <= 15 ? '중급 한자' : '고급 한자'}
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      획수: {hanjaData?.stroke_count}획
                    </div>
                    
                    {/* 의미 태그 표시 추가 */}
                    {matchedTags['meaning']?.map((tag, index) => (
                      <div 
                        key={`meaning-example-${index}`} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        title={tag.description}
                      >
                        {tag.name}
                      </div>
                    ))}
                  </div>
                </div>
                
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
              {hanjaData ? (
                (() => {
                  // 관련 한자 찾기
                  const relatedChars = findRelatedHanja(hanjaData);
                  
                  // 관련 한자가 없는 경우
                  if (relatedChars.length === 0) {
                    return [...Array(4)].map((_, i) => (
                      <div key={`empty-${i}`} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col items-center">
                        <div className="text-gray-300 text-4xl mb-2">?</div>
                        <div className="text-sm text-gray-400">추천 준비 중</div>
                      </div>
                    ));
                  }
                  
                  // 관련 한자 표시
                  return relatedChars.map((relatedChar, i) => {
                    // 관련 한자가 없으면 빈 UI 표시
                    if (!relatedChar || !relatedChar.character) {
                      return (
                        <div key={`empty-${i}`} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col items-center">
                          <div className="text-gray-300 text-4xl mb-2">?</div>
                          <div className="text-sm text-gray-400">추천 준비 중</div>
                        </div>
                      );
                    }
                    
                    // 관련성 라벨 결정
                    let relationLabel = "";
                    if (relatedChar.radical === hanjaData.radical) {
                      relationLabel = `같은 부수 (${relatedChar.radical})`;
                    } else if (Math.abs(relatedChar.stroke_count - hanjaData.stroke_count) <= 2) {
                      relationLabel = `유사한 획수 (${relatedChar.stroke_count}획)`;
                    } else if (relatedChar.pronunciation === hanjaData.pronunciation) {
                      relationLabel = `같은 발음 (${relatedChar.pronunciation})`;
                    } else {
                      relationLabel = "의미 연관";
                    }
                    
                    // 안전하게 URL 생성
                    const safeChar = encodeURIComponent(relatedChar.character);
                    const categoryId = safeCategoryId || 'basic';
                    const levelId = safeLevelId || 'level1';
                    const url = `/learn/hanja/${safeChar}?category=${categoryId}&level=${levelId}`;
                    
                    return (
                      <Link
                        key={`related-${i}-${relatedChar.character}`}
                        href={url}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col items-center"
                      >
                        <div className="text-4xl mb-2">{relatedChar.character}</div>
                        <div className="text-sm text-gray-700">{relatedChar.meaning}</div>
                        <div className="text-xs text-gray-500 mt-1">{relatedChar.pronunciation}</div>
                        <div className="mt-2 text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                          {relationLabel}
                        </div>
                      </Link>
                    );
                  });
                })()
              ) : (
                // 데이터 로딩 중이거나 없는 경우
                [...Array(4)].map((_, i) => (
                  <div key={`loading-${i}`} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col items-center">
                    <div className="text-gray-300 text-4xl mb-2">...</div>
                    <div className="text-sm text-gray-400">로딩 중</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 