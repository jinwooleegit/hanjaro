'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    HanziWriter: any;
    HanziWriterInstance: any;
    HanziWriterLoaders?: Record<string, (callback: any) => void>;
    HanziCache?: Record<string, any>;
    HanziWriterTimers?: Record<string, number>;
    loadHanjaData?: (char: string, callback: (data: any) => void) => void;
  }
}

// 기본 한자 SVG 데이터 확장 - 주요 한자만 포함
const BASIC_HANJA_DATA: Record<string, any> = {
  '一': { character: '一', strokes: ['M 5 50 L 95 50'], medians: [[[5, 50], [95, 50]]] },
  '二': { 
    character: '二', 
    strokes: ['M 5 33 L 95 33', 'M 5 66 L 95 66'], 
    medians: [[[5, 33], [95, 33]], [[5, 66], [95, 66]]] 
  },
  '三': { 
    character: '三', 
    strokes: ['M 5 25 L 95 25', 'M 5 50 L 95 50', 'M 5 75 L 95 75'], 
    medians: [[[5, 25], [95, 25]], [[5, 50], [95, 50]], [[5, 75], [95, 75]]] 
  },
  '人': {
    character: '人',
    strokes: ['M 40 15 L 5 75', 'M 40 15 L 95 75'],
    medians: [[[40, 15], [5, 75]], [[40, 15], [95, 75]]]
  },
  '大': {
    character: '大',
    strokes: ['M 50 15 L 10 80', 'M 50 15 L 90 80', 'M 15 40 L 85 40'],
    medians: [[[50, 15], [10, 80]], [[50, 15], [90, 80]], [[15, 40], [85, 40]]]
  },
  '土': {
    character: '土',
    strokes: [
      'M 20 40 L 80 40',
      'M 50 20 L 50 80',
      'M 20 80 L 80 80'
    ],
    medians: [
      [[20, 40], [80, 40]],
      [[50, 20], [50, 80]],
      [[20, 80], [80, 80]]
    ]
  },
  '木': {
    character: '木',
    strokes: ['M 50 10 L 50 90', 'M 15 40 L 85 40', 'M 20 10 L 50 40', 'M 80 10 L 50 40'],
    medians: [[[50, 10], [50, 90]], [[15, 40], [85, 40]], [[20, 10], [50, 40]], [[80, 10], [50, 40]]]
  },
  '水': {
    character: '水',
    strokes: ['M 35 10 L 35 80', 'M 35 10 L 10 30', 'M 35 10 L 65 30', 'M 10 50 L 35 70', 'M 60 50 L 35 70'],
    medians: [[[35, 10], [35, 80]], [[35, 10], [10, 30]], [[35, 10], [65, 30]], [[10, 50], [35, 70]], [[60, 50], [35, 70]]]
  },
  '心': {
    character: '心',
    strokes: [
      'M 50 20 L 50 50',
      'M 20 50 C 30 30 70 30 80 50',
      'M 20 50 L 35 90',
      'M 80 50 L 65 90'
    ],
    medians: [
      [[50, 20], [50, 50]],
      [[20, 50], [50, 40], [80, 50]],
      [[20, 50], [35, 90]],
      [[80, 50], [65, 90]]
    ]
  },
  '月': {
    character: '月',
    strokes: [
      'M 25 15 L 75 15', 
      'M 25 15 L 25 85', 
      'M 25 85 L 75 85', 
      'M 75 15 L 75 85',
      'M 40 40 L 60 40',
      'M 40 65 L 60 65'
    ],
    medians: [
      [[25, 15], [75, 15]],
      [[25, 15], [25, 85]],
      [[25, 85], [75, 85]],
      [[75, 15], [75, 85]],
      [[40, 40], [60, 40]],
      [[40, 65], [60, 65]]
    ]
  },
  '日': {
    character: '日',
    strokes: [
      'M 25 15 L 75 15', 
      'M 25 15 L 25 85', 
      'M 25 85 L 75 85', 
      'M 75 15 L 75 85',
      'M 25 50 L 75 50'
    ],
    medians: [
      [[25, 15], [75, 15]],
      [[25, 15], [25, 85]],
      [[25, 85], [75, 85]],
      [[75, 15], [75, 85]],
      [[25, 50], [75, 50]]
    ]
  },
  '山': {
    character: '山',
    strokes: [
      'M 15 75 L 35 25', 
      'M 35 25 L 50 50', 
      'M 50 50 L 65 25', 
      'M 65 25 L 85 75'
    ],
    medians: [
      [[15, 75], [35, 25]],
      [[35, 25], [50, 50]],
      [[50, 50], [65, 25]],
      [[65, 25], [85, 75]]
    ]
  },
  '口': {
    character: '口',
    strokes: [
      'M 25 25 L 75 25', 
      'M 25 25 L 25 75', 
      'M 25 75 L 75 75', 
      'M 75 25 L 75 75'
    ],
    medians: [
      [[25, 25], [75, 25]],
      [[25, 25], [25, 75]],
      [[25, 75], [75, 75]],
      [[75, 25], [75, 75]]
    ]
  },
  '過': {
    character: '過',
    strokes: [
      // 좌측 부수 (쇠변)
      'M 20 10 L 20 90',
      'M 20 10 L 40 10',
      'M 20 50 L 40 50',
      'M 20 90 L 40 90',
      // 우측 상단
      'M 45 15 L 70 15',
      'M 57 15 L 57 25',
      'M 50 25 L 65 25',
      // 우측 중앙
      'M 45 35 L 85 35',
      'M 45 45 L 85 45',
      // 우측 하단
      'M 55 55 L 55 80',
      'M 45 65 L 65 65',
      'M 75 55 L 75 80',
      'M 45 80 L 85 80'
    ],
    medians: [
      [[20, 10], [20, 90]],
      [[20, 10], [40, 10]],
      [[20, 50], [40, 50]],
      [[20, 90], [40, 90]],
      [[45, 15], [70, 15]],
      [[57, 15], [57, 25]],
      [[50, 25], [65, 25]],
      [[45, 35], [85, 35]],
      [[45, 45], [85, 45]],
      [[55, 55], [55, 80]],
      [[45, 65], [65, 65]],
      [[75, 55], [75, 80]],
      [[45, 80], [85, 80]]
    ]
  },
  '程': {
    character: '程',
    strokes: [
      // 좌측 부수 (곡식 화)
      'M 10 10 L 40 10',
      'M 25 10 L 25 30',
      'M 15 20 L 35 20',
      'M 10 30 L 40 30',
      'M 5 40 L 45 40',
      // 우측 상단
      'M 60 10 L 60 25',
      'M 50 15 L 70 15',
      // 우측 중앙
      'M 50 30 L 80 30',
      'M 50 40 L 80 40',
      // 우측 하단
      'M 60 50 L 60 80',
      'M 50 60 L 70 60',
      'M 70 50 L 70 80',
      'M 50 80 L 80 80'
    ],
    medians: [
      [[10, 10], [40, 10]],
      [[25, 10], [25, 30]],
      [[15, 20], [35, 20]],
      [[10, 30], [40, 30]],
      [[5, 40], [45, 40]],
      [[60, 10], [60, 25]],
      [[50, 15], [70, 15]],
      [[50, 30], [80, 30]],
      [[50, 40], [80, 40]],
      [[60, 50], [60, 80]],
      [[50, 60], [70, 60]],
      [[70, 50], [70, 80]],
      [[50, 80], [80, 80]]
    ]
  },
  '學': {
    character: '學',
    strokes: [
      // 상단 부분 (아래 뚫린 사각형)
      'M 25 10 L 75 10',
      'M 25 10 L 25 30',
      'M 75 10 L 75 30',
      // 상단 중앙 가로선
      'M 30 20 L 70 20',
      // 중앙 어깨 부분
      'M 20 30 L 80 30',
      // 중앙 세로선
      'M 50 30 L 50 55',
      // 좌측 子 부분
      'M 30 40 L 45 40',
      'M 30 50 L 45 50',
      'M 35 40 L 35 65',
      // 우측 子 부분
      'M 55 40 L 70 40',
      'M 55 50 L 70 50',
      'M 65 40 L 65 65',
      // 하단 부분
      'M 25 65 L 75 65',
      'M 25 65 L 25 85',
      'M 75 65 L 75 85',
      'M 25 85 L 75 85'
    ],
    medians: [
      [[25, 10], [75, 10]],
      [[25, 10], [25, 30]],
      [[75, 10], [75, 30]],
      [[30, 20], [70, 20]],
      [[20, 30], [80, 30]],
      [[50, 30], [50, 55]],
      [[30, 40], [45, 40]],
      [[30, 50], [45, 50]],
      [[35, 40], [35, 65]],
      [[55, 40], [70, 40]],
      [[55, 50], [70, 50]],
      [[65, 40], [65, 65]],
      [[25, 65], [75, 65]],
      [[25, 65], [25, 85]],
      [[75, 65], [75, 85]],
      [[25, 85], [75, 85]]
    ]
  }
};

// 한자 데이터 자동 생성 함수 - 없는 한자에 대한 기본 패턴 생성
const generateBasicHanjaPattern = (char: string): any => {
  // 유니코드 코드포인트 확인
  const codePoint = char.codePointAt(0) || 0;
  
  // 한자 획수 추정 (복잡도에 따라 패턴 조정)
  // 중국어 간체자 범위: 0x4E00-0x9FFF
  const isHanja = codePoint >= 0x4E00 && codePoint <= 0x9FFF;
  
  if (!isHanja) {
    // 한자가 아닌 경우 X 표시
    return {
      character: char,
      strokes: ['M 25 25 L 75 75', 'M 75 25 L 25 75'],
      medians: [[[25, 25], [75, 75]], [[75, 25], [25, 75]]],
      isGenerated: true
    };
  }
  
  // 한자의 복잡도에 따라 획수 추정 (간단한 알고리즘)
  const estimatedStrokes = Math.max(3, Math.min(20, 
    Math.floor((codePoint - 0x4E00) / (0x9FFF - 0x4E00) * 15) + 3
  ));
  
  const strokes = [];
  const medians = [];
  
  // 기본 사각형 패턴 (대부분 한자의 공통 구조)
  strokes.push('M 25 25 L 75 25'); // 상단 가로선
  medians.push([[25, 25], [75, 25]]);
  
  strokes.push('M 25 25 L 25 75'); // 좌측 세로선
  medians.push([[25, 25], [25, 75]]);
  
  strokes.push('M 75 25 L 75 75'); // 우측 세로선
  medians.push([[75, 25], [75, 75]]);
  
  strokes.push('M 25 75 L 75 75'); // 하단 가로선
  medians.push([[25, 75], [75, 75]]);
  
  // 복잡도에 따라 추가 획 생성
  if (estimatedStrokes > 4) {
    strokes.push('M 25 50 L 75 50'); // 중앙 가로선
    medians.push([[25, 50], [75, 50]]);
  }
  
  if (estimatedStrokes > 5) {
    strokes.push('M 50 25 L 50 75'); // 중앙 세로선
    medians.push([[50, 25], [50, 75]]);
  }
  
  // 더 복잡한 한자인 경우 추가 구조
  if (estimatedStrokes > 7) {
    strokes.push('M 37.5 37.5 L 62.5 37.5'); // 상단 중앙 가로선
    medians.push([[37.5, 37.5], [62.5, 37.5]]);
    
    strokes.push('M 37.5 62.5 L 62.5 62.5'); // 하단 중앙 가로선
    medians.push([[37.5, 62.5], [62.5, 62.5]]);
  }
  
  if (estimatedStrokes > 9) {
    strokes.push('M 37.5 25 L 37.5 75'); // 좌중앙 세로선
    medians.push([[37.5, 25], [37.5, 75]]);
    
    strokes.push('M 62.5 25 L 62.5 75'); // 우중앙 세로선
    medians.push([[62.5, 25], [62.5, 75]]);
  }
  
  // 더 복잡한 한자인 경우 추가 사선
  if (estimatedStrokes > 12) {
    strokes.push('M 25 25 L 75 75'); // 우하향 사선
    medians.push([[25, 25], [75, 75]]);
    
    strokes.push('M 75 25 L 25 75'); // 좌하향 사선
    medians.push([[75, 25], [25, 75]]);
  }
  
  return {
    character: char,
    strokes: strokes,
    medians: medians,
    isGenerated: true
  };
};

interface HanziProps {
  character: string;
  width?: number;
  height?: number;
  delayBetweenStrokes?: number;
  strokeAnimationSpeed?: number;
  strokeSpeed?: number;
  showOutline?: boolean;
  showCharacter?: boolean;
  highlightColor?: string;
  outlineColor?: string;
  strokeColor?: string;
  radicalColor?: string;
  drawingWidth?: number;
  strokeWidth?: number;
  quizMode?: boolean;
  animateMode?: boolean;
  onLoad?: (character: string) => void;
  onError?: (error: Error) => void;
}

export default function HanziWriterComponent({
  character,
  width = 200,
  height = 200,
  delayBetweenStrokes = 1000,
  strokeAnimationSpeed = 1,
  strokeSpeed,
  showOutline = true,
  showCharacter = false,
  highlightColor = '#07F',
  outlineColor = '#ddd',
  strokeColor = '#333',
  radicalColor = '#337ab7',
  drawingWidth = 4,
  strokeWidth = 1,
  quizMode = false,
  animateMode = true,
  onLoad,
  onError
}: HanziProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [charDataLoaded, setCharDataLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(typeof window !== 'undefined' && !!window.HanziWriter);

  // 한자 데이터 로드 함수를 먼저 정의
  const loadHanjaData = (char: string, onComplete: (data: any) => void) => {
    console.log('[HanziWriterComponent] 한자 데이터 로딩 시작:', char);
    
    // 내장 데이터 확인 - 우선 사용
    if (BASIC_HANJA_DATA[char]) {
      console.log(`[HanziWriterComponent] 내장 데이터 사용: ${char}`);
      setCharDataLoaded(true);
      try {
        onComplete(BASIC_HANJA_DATA[char]);
      } catch (error) {
        console.error(`[HanziWriterComponent] 내장 데이터 처리 중 오류: ${error}`);
        const fallbackData = generateBasicHanjaPattern(char);
        setError(`내장 데이터 처리 중 오류가 발생했습니다. 기본 데이터를 사용합니다.`);
        onComplete(fallbackData);
      }
      return;
    }
    
    // 캐시된 데이터 확인
    if (window.HanziCache && window.HanziCache[char]) {
      console.log(`[HanziWriterComponent] 캐시에서 데이터 사용: ${char}`);
      setCharDataLoaded(true);
      try {
        onComplete(window.HanziCache[char]);
      } catch (error) {
        console.error(`[HanziWriterComponent] 캐시 데이터 처리 중 오류: ${error}`);
        const fallbackData = generateBasicHanjaPattern(char);
        setError(`캐시 데이터 처리 중 오류가 발생했습니다. 기본 데이터를 사용합니다.`);
        onComplete(fallbackData);
      }
      return;
    }
    
    // 전역 로더를 통한 데이터 로드 설정
    if (window.HanziWriterLoaders) {
      window.HanziWriterLoaders[char] = (data: any) => {
        console.log(`[HanziWriterComponent] 로더 콜백 실행: ${char}`);
        try {
          // 캐시에 저장
          if (window.HanziCache) {
            window.HanziCache[char] = data;
          }
          
          setCharDataLoaded(true);
          
          // 이미 컴포넌트가 마운트되어 있고 writer가 초기화되어 있다면 업데이트
          if (containerRef.current && writerRef.current) {
            try {
              // 기존 인스턴스 제거 후 다시 생성 (데이터 업데이트를 위해)
              const container = containerRef.current;
              // innerHTML 직접 사용 대신 안전한 방식으로 DOM 요소 제거
              while (container.firstChild) {
                try {
                  container.removeChild(container.firstChild);
                } catch (e) {
                  console.warn('[HanziWriterComponent] 로더 콜백 중 DOM 제거 오류:', e);
                  break;
                }
              }
              
              // writerRef 초기화
              if (writerRef.current) {
                try {
                  // 이전 인스턴스 정리
                  writerRef.current = null;
                } catch (e) {
                  console.warn('[HanziWriterComponent] 이전 인스턴스 정리 오류:', e);
                }
              }
              
              initializeWriter();
            } catch (e) {
              console.error('[HanziWriterComponent] 로더 콜백 후 재초기화 실패:', e);
            }
          } else {
            onComplete(data);
          }
        } catch (error) {
          console.error(`[HanziWriterComponent] 로더 콜백 처리 중 오류: ${error}`);
          const fallbackData = generateBasicHanjaPattern(char);
          setError(`로더 콜백 처리 중 오류가 발생했습니다. 기본 데이터를 사용합니다.`);
          onComplete(fallbackData);
        }
      };
    }
    
    // 글로벌 로더 사용
    if (typeof window !== 'undefined' && window.loadHanjaData) {
      console.log(`[HanziWriterComponent] 글로벌 로더 사용: ${char}`);
      try {
        window.loadHanjaData(char, (data: any) => {
          try {
            console.log(`[HanziWriterComponent] 글로벌 로더에서 데이터 수신: ${char}`);
            // 우선 기본 데이터로 표시
            onComplete(data);
          } catch (dataError) {
            console.error(`[HanziWriterComponent] 글로벌 로더 데이터 처리 오류: ${char}`, dataError);
            setIsLoading(false);
            setError(`${char} 한자 데이터 처리 오류`);
          }
        });
        return;
      } catch (callError) {
        console.error(`[HanziWriterComponent] 글로벌 로더 호출 오류: ${char}`, callError);
        setIsLoading(false);
        setError(`${char} 한자 데이터 로드 오류`);
      }
    }
    
    // 기본 생성 데이터 즉시 표시 (UX 향상)
    const generatedData = generateBasicHanjaPattern(char);
    setCharDataLoaded(true);
    console.log(`[HanziWriterComponent] 생성된 기본 데이터로 우선 표시: ${char}`);
    
    // 기본 데이터로 즉시 콜백
    try {
      onComplete(generatedData);
    } catch (error) {
      console.error(`[HanziWriterComponent] 생성 데이터 처리 중 오류: ${error}`);
      setError(`생성 데이터 처리 중 오류가 발생했습니다. 새로고침 해주세요.`);
      return;
    }
    
    // 로컬 API에서 실제 데이터 가져오기 시도
    const encodedChar = encodeURIComponent(char);
    console.log(`[HanziWriterComponent] API 요청 URL: /api/hanja/strokes?character=${encodedChar}`);
    
    fetch(`/api/hanja/strokes?character=${encodedChar}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8'
      }
    })
      .then(res => {
        console.log(`[HanziWriterComponent] API 응답 상태: ${res.status}`);
        if (!res.ok) {
          throw new Error(`API 실패: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log(`[HanziWriterComponent] API에서 한자 데이터 로드 성공: ${char}`);
        
        // 인코딩 문제 확인 및 수정
        if (data.character && data.character !== char) {
          console.warn(`[HanziWriterComponent] 문자 인코딩 오류 감지: API 반환 '${data.character}', 요청 '${char}'`);
          // 문자 수정
          data.character = char;
        }
        
        // 기본 데이터 검증
        if (!data || !data.character || !Array.isArray(data.strokes) || !Array.isArray(data.medians)) {
          console.error('[HanziWriterComponent] API 응답 데이터 형식 오류:', data);
          throw new Error('API 응답 데이터 형식 오류');
        }
        
        // 데이터 캐시에 저장
        if (typeof window !== 'undefined') {
          // 글로벌 캐시에 저장
          if (!window.HanziCache) window.HanziCache = {};
          window.HanziCache[char] = data;
          
          // 컴포넌트 캐시에도 저장
          BASIC_HANJA_DATA[char] = data;
        }
        
        // 로더가 있으면 로더에 데이터 전달
        if (window.HanziWriterLoaders && window.HanziWriterLoaders[char]) {
          try {
            console.log(`[HanziWriterComponent] 로더 콜백 실행: ${char}`);
            window.HanziWriterLoaders[char](data);
          } catch (e) {
            console.error('[HanziWriterComponent] 로더 콜백 실행 중 오류:', e);
          }
        }
        
        // 만약 컴포넌트가 아직 마운트되어 있다면 새 데이터로 업데이트
        if (containerRef.current && writerRef.current) {
          try {
            console.log(`[HanziWriterComponent] 새 데이터로 컴포넌트 업데이트: ${char}`);
            // 기존 인스턴스 제거 후 다시 생성 (데이터 업데이트를 위해)
            const container = containerRef.current;
            // innerHTML 직접 사용 대신 안전한 방식으로 DOM 요소 제거
            while (container.firstChild) {
              try {
                container.removeChild(container.firstChild);
              } catch (e) {
                console.warn('[HanziWriterComponent] 로더 콜백 중 DOM 제거 오류:', e);
                break;
              }
            }
            
            // writerRef 초기화
            if (writerRef.current) {
              try {
                // 이전 인스턴스 정리
                writerRef.current = null;
              } catch (e) {
                console.warn('[HanziWriterComponent] 이전 인스턴스 정리 오류:', e);
              }
            }
            
            initializeWriter();
          } catch (e) {
            console.error('[HanziWriterComponent] 데이터 업데이트 후 재초기화 실패:', e);
          }
        }
      })
      .catch(err => {
        console.warn(`[HanziWriterComponent] 로컬 API 로드 실패, CDN 시도: ${char}`, err);
        
        // CDN에서 시도
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodedChar}.json`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`CDN 실패: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log(`[HanziWriterComponent] CDN에서 한자 데이터 로드 성공: ${char}`);
            
            // 인코딩 문제 확인 및 수정
            if (data.character && data.character !== char) {
              console.warn(`[HanziWriterComponent] 문자 인코딩 오류 감지: CDN 반환 '${data.character}', 요청 '${char}'`);
              // 문자 수정
              data.character = char;
            }
            
            // 데이터 캐시에 저장
            if (typeof window !== 'undefined') {
              // 글로벌 캐시에 저장
              if (!window.HanziCache) window.HanziCache = {};
              window.HanziCache[char] = data;
              
              // 컴포넌트 캐시에도 저장
              BASIC_HANJA_DATA[char] = data;
            }
            
            // 로더가 있으면 로더에 데이터 전달
            if (window.HanziWriterLoaders && window.HanziWriterLoaders[char]) {
              try {
                window.HanziWriterLoaders[char](data);
              } catch (e) {
                console.error('[HanziWriterComponent] CDN 로더 콜백 실행 중 오류:', e);
              }
            }
            
            // 만약 컴포넌트가 아직 마운트되어 있다면 새 데이터로 업데이트
            if (containerRef.current && writerRef.current) {
              try {
                // 기존 인스턴스 제거 후 다시 생성 (데이터 업데이트를 위해)
                const container = containerRef.current;
                // innerHTML 직접 사용 대신 안전한 방식으로 DOM 요소 제거
                while (container.firstChild) {
                  try {
                    container.removeChild(container.firstChild);
                  } catch (e) {
                    console.warn('[HanziWriterComponent] 로더 콜백 중 DOM 제거 오류:', e);
                    break;
                  }
                }
                
                // writerRef 초기화
                if (writerRef.current) {
                  try {
                    // 이전 인스턴스 정리
                    writerRef.current = null;
                  } catch (e) {
                    console.warn('[HanziWriterComponent] 이전 인스턴스 정리 오류:', e);
                  }
                }
                
                initializeWriter();
              } catch (e) {
                console.error('[HanziWriterComponent] 데이터 업데이트 후 재초기화 실패:', e);
              }
            }
          })
          .catch(cdnErr => {
            console.error(`[HanziWriterComponent] CDN에서도 로드 실패, 기본 데이터 사용: ${char}`, cdnErr);
            
            // 이미 기본 데이터가 설정되어 있으므로 추가 조치는 필요 없음
          });
      });
  };

  // 스크립트 로드 함수 정의
  const loadScript = () => {
    // 이미 스크립트가 있는지 확인
    if (document.querySelector('script[src*="hanzi-writer"]')) {
      console.log('HanziWriter 스크립트가 이미 로드되고 있습니다');
      
      // 이미 로드 중이면 일정 시간 후 콜백 실행 시도
      setTimeout(() => {
        if (window.HanziWriter) {
          console.log('지연 후 HanziWriter 발견, 초기화 진행');
          scriptLoadedRef.current = true;
          setScriptLoaded(true);
          initializeWriter();
        } else {
          console.log('지연 후에도 HanziWriter 없음, 강제 스크립트 로드');
          forceLoadScript();
        }
      }, 1000);
      
      return;
    }
    
    forceLoadScript();
  };

  // 강제 스크립트 로드 함수
  const forceLoadScript = () => {
    console.log('HanziWriter 스크립트 강제 로드 시도');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('HanziWriter 스크립트 로드 완료 (직접 로드)');
      scriptLoadedRef.current = true;
      setScriptLoaded(true);
      
      // 약간의 지연 후 초기화
      setTimeout(initializeWriter, 100);
    };
    
    script.onerror = () => {
      console.error('HanziWriter 스크립트 로드 실패 (직접 로드), 대체 URL 시도');
      
      // 대체 URL 시도
      const backupScript = document.createElement('script');
      backupScript.src = 'https://unpkg.com/hanzi-writer@3.5/dist/hanzi-writer.min.js';
      backupScript.async = true;
      
      backupScript.onload = () => {
        console.log('HanziWriter 스크립트 로드 완료 (대체 URL)');
        scriptLoadedRef.current = true;
        setScriptLoaded(true);
        
        // 약간의 지연 후 초기화
        setTimeout(initializeWriter, 100);
      };
      
      backupScript.onerror = () => {
        setError('HanziWriter 라이브러리를 로드할 수 없습니다. 페이지를 새로고침 해주세요.');
      };
      
      document.head.appendChild(backupScript);
    };
    
    document.head.appendChild(script);
  };

  // 스크립트 로드 처리 함수
  const handleScriptLoad = () => {
    console.log('HanziWriter 스크립트 로드 완료');
    scriptLoadedRef.current = true;
    setScriptLoaded(true);
    
    // 스크립트 로드 후 즉시 초기화
    if (containerRef.current) {
      setTimeout(() => initializeWriter(), 100);
    }
  };

  // HanziWriter 초기화 함수
  const initializeWriter = () => {
    console.log('[HanziWriterComponent] initializeWriter 시작:', character);
    
    // 컨테이너가 없으면 초기화 중지
    if (!containerRef.current) {
      console.warn('[HanziWriterComponent] 컨테이너 DOM 참조 없음, 초기화 중지');
      return;
    }
    
    try {
      // 기존 인스턴스 정리
      if (writerRef.current) {
        cleanupWriter();
        // 기존 인스턴스가 정리되는 동안 약간의 지연 적용
        setTimeout(() => {
          createWriter();
        }, 20);
        return;
      }
      
      // 바로 writer 생성
      createWriter();
    } catch (error: any) {
      console.error('[HanziWriterComponent] HanziWriter 초기화 오류:', error);
      setIsLoading(false);
      setError(`${character} 한자를 표시할 수 없습니다. (${error?.message || 'DOM 오류'})`);
      if (onError) onError(new Error(error?.message || '한자 로드 오류'));
    }
  };
  
  // 실제 writer 생성 부분을 별도 함수로 분리
  const createWriter = () => {
    try {
      // 로딩 상태 업데이트
      setIsLoading(true);
      setError('');
      
      // HanziWriter가 로드되었는지 확인
      if (!window.HanziWriter) {
        console.error('[HanziWriterComponent] HanziWriter 라이브러리가 로드되지 않음');
        setError('HanziWriter 라이브러리 로드 실패');
        setIsLoading(false);
        return;
      }
      
      // DOM 요소 제거 로직을 초기화 함수에서 분리
      if (containerRef.current && containerRef.current.firstChild) {
        try {
          const container = containerRef.current;
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        } catch (e) {
          console.warn('[HanziWriterComponent] 기존 DOM 요소 제거 중 오류:', e);
          // 오류 발생 시 innerHTML 사용하여 강제 정리
          try {
            containerRef.current.innerHTML = '';
          } catch (innerError) {
            console.error('[HanziWriterComponent] 컨테이너 강제 정리 실패:', innerError);
          }
        }
      }
      
      // SVG 요소를 직접 생성하여 컨테이너에 추가
      const writer = window.HanziWriter.create(
        containerRef.current,
        character,
        {
          width: width || 200,
          height: height || 200,
          padding: 5,
          showOutline: typeof showOutline === 'boolean' ? showOutline : true,
          showCharacter: typeof showCharacter === 'boolean' ? showCharacter : false,
          delayBetweenStrokes: delayBetweenStrokes || 1000,
          strokeAnimationSpeed: strokeAnimationSpeed || 1,
          strokeColor: strokeColor || '#333',
          outlineColor: outlineColor || '#ddd',
          radicalColor: radicalColor || '#337ab7',
          highlightColor: highlightColor || '#07F',
          drawingWidth: drawingWidth || 4,
          strokeWidth: strokeWidth || 1,
          renderer: 'svg',
          onLoadCharDataSuccess: () => {
            console.log(`[HanziWriterComponent] 한자 ${character} 데이터 로드 성공`);
            setIsLoading(false);
            setError('');
            if (onLoad) onLoad(character);
          },
          onLoadCharDataError: (err: any) => {
            console.error(`[HanziWriterComponent] 한자 ${character} 데이터 로드 오류:`, err);
            setIsLoading(false);
            setError(`${character} 한자 데이터를 로드할 수 없습니다`);
            if (onError) onError(err);
          }
        }
      );
      
      // writer 참조 저장 및 상태 업데이트
      writerRef.current = writer;
      
      // quiz 모드가 활성화되어 있으면 퀴즈 시작
      if (quizMode && writer && writer.quiz) {
        setTimeout(() => {
          try {
            if (writerRef.current && writerRef.current.quiz) {
              writerRef.current.quiz.start();
            }
          } catch (e) {
            console.error('[HanziWriterComponent] 퀴즈 시작 오류:', e);
          }
        }, 500);
      }
      // 애니메이션 모드가 활성화되어 있으면 애니메이션 시작
      else if (animateMode && writer && writer.animateCharacter) {
        setTimeout(() => {
          try {
            if (writerRef.current && writerRef.current.animateCharacter) {
              writerRef.current.animateCharacter();
            }
          } catch (e) {
            console.error('[HanziWriterComponent] 애니메이션 시작 오류:', e);
          }
        }, 500);
      }
    } catch (error: any) {
      console.error('[HanziWriterComponent] HanziWriter 초기화 오류:', error);
      setIsLoading(false);
      setError(`${character} 한자를 표시할 수 없습니다. (${error?.message || 'DOM 오류'})`);
      if (onError) onError(new Error(error?.message || '한자 로드 오류'));
    }
  };

  // 한자 작성기 인스턴스 정리 함수
  const cleanupWriter = () => {
    console.log('HanziWriter 정리 시작');
    
    try {
      // 적용 중인 애니메이션 취소
      if (window.HanziWriterTimers) {
        Object.keys(window.HanziWriterTimers).forEach(key => {
          if (window.HanziWriterTimers && window.HanziWriterTimers[key]) {
            clearTimeout(window.HanziWriterTimers[key]);
            delete window.HanziWriterTimers[key];
          }
        });
      }
      
      // 전역 인스턴스 참조 제거
      if (writerRef.current === window.HanziWriterInstance) {
        window.HanziWriterInstance = null;
      }
      
      // 인스턴스 참조 제거
      writerRef.current = null;
      
      // 컨테이너 내용 안전하게 정리
      if (containerRef.current) {
        try {
          // innerHTML을 사용한 안전한 방식으로 컨테이너 비우기
          containerRef.current.innerHTML = '';
        } catch (e) {
          console.error('컨테이너 내용 정리 중 오류:', e);
        }
      }
      
      console.log('HanziWriter 정리 완료');
    } catch (e) {
      console.error('HanziWriter 정리 중 오류:', e);
    }
  };

  // 컴포넌트가 마운트 되었을 때 HanziWriter 초기화
  useEffect(() => {
    console.log('HanziWriter 컴포넌트 마운트됨');
    
    // 스크립트 로드 확인
    if (typeof window !== 'undefined') {
      if (window.HanziWriter) {
        console.log('이미 HanziWriter가 로드됨');
        setScriptLoaded(true);
        
        // 조금 지연시켜 DOM이 준비되었는지 확인
        setTimeout(() => {
          initializeWriter();
        }, 50);
      } else {
        loadScript();
      }
    }
    
    // 언마운트 시 정리
    return () => {
      // 컴포넌트 언마운트 시 사용 중인 리소스 정리
      console.log('HanziWriter 컴포넌트 언마운트 중');
      
      try {
        // 애니메이션 취소
        if (writerRef.current) {
          if (writerRef.current.isAnimating && writerRef.current.cancelAnimation) {
            writerRef.current.cancelAnimation();
          }
          
          // 퀴즈 취소
          if (writerRef.current.quiz && writerRef.current.quiz.isActive && writerRef.current.quiz.cancel) {
            writerRef.current.quiz.cancel();
          }
        }
        
        // 타이머 정리
        if (window.HanziWriterTimers) {
          Object.keys(window.HanziWriterTimers).forEach(key => {
            if (window.HanziWriterTimers && window.HanziWriterTimers[key]) {
              clearTimeout(window.HanziWriterTimers[key]);
            }
          });
        }
        
        // 전역 인스턴스 참조 제거
        if (writerRef.current === window.HanziWriterInstance) {
          window.HanziWriterInstance = null;
        }
        
        // 인스턴스 참조 제거
        writerRef.current = null;
        
        // 컨테이너에 남아있는 요소들 정리 (가장 안전한 방법)
        if (containerRef.current) {
          try {
            // innerHTML을 사용한 한번에 제거 (안전한 방법)
            containerRef.current.innerHTML = '';
          } catch (e) {
            console.error('컴포넌트 언마운트 시 정리 오류:', e);
          }
        }
      } catch (cleanupError) {
        console.error('정리 중 예외 발생:', cleanupError);
      }
      
      console.log('HanziWriter 컴포넌트 언마운트 완료');
    };
  }, [character]);

  // 모드 변경 감지 효과 추가
  useEffect(() => {
    // 컴포넌트가 마운트된 후와 모드가 변경된 후에만 실행
    if (writerRef.current) {
      try {
        // 퀴즈 모드 활성화
        if (quizMode && writerRef.current.quiz) {
          // 애니메이션 진행 중이면 정지
          if (writerRef.current.isAnimating && writerRef.current.cancelAnimation) {
            writerRef.current.cancelAnimation();
          }
          
          setTimeout(() => {
            try {
              if (writerRef.current && writerRef.current.quiz) {
                writerRef.current.quiz.start();
              }
            } catch (e) {
              console.error('[HanziWriterComponent] 퀴즈 시작 오류:', e);
            }
          }, 100);
        } 
        // 애니메이션 모드 활성화
        else if (animateMode && writerRef.current.animateCharacter) {
          // 퀴즈 진행 중이면 정지
          if (writerRef.current.quiz && writerRef.current.quiz.isActive && writerRef.current.quiz.cancel) {
            writerRef.current.quiz.cancel();
          }
          
          setTimeout(() => {
            try {
              if (writerRef.current && writerRef.current.animateCharacter) {
                writerRef.current.animateCharacter();
              }
            } catch (e) {
              console.error('[HanziWriterComponent] 애니메이션 시작 오류:', e);
            }
          }, 100);
        }
      } catch (e) {
        console.warn('[HanziWriterComponent] 모드 변경 처리 중 오류:', e);
      }
    }
  }, [quizMode, animateMode]);
  
  // 추가 안전 장치: 컴포넌트 언마운트 시 정리 함수 - 최소화하여 문제 방지
  useEffect(() => {
    return () => {
      // 로더 이벤트 참조 제거
      if (typeof window !== 'undefined' && window.HanziWriterLoaders && character) {
        try {
          delete window.HanziWriterLoaders[character];
        } catch (e) {
          console.warn('[HanziWriterComponent] 로더 참조 정리 중 오류:', e);
        }
      }
    };
  }, [character]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      {!scriptLoaded && (
        <Script 
          src="/static/hanzi-writer.min.js"
          strategy="beforeInteractive" 
          onLoad={handleScriptLoad}
          onError={() => console.error('HanziWriter 스크립트 로드 오류')}
        />
      )}
      
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">한자 로딩 중...</p>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500">한자 로드 오류</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      )}
      
      {/* 한자 작성 영역 컨테이너 - 크기 최적화 */}
      <div 
        ref={containerRef}
        className="flex items-center justify-center"
        style={{
          width: '100%',
          height: '100%',
          minWidth: width,
          minHeight: height,
          maxWidth: '100%',
          maxHeight: '100%',
          display: isLoading || error ? 'none' : 'flex',
          position: 'relative'
        }}
      />
    </div>
  );
} 