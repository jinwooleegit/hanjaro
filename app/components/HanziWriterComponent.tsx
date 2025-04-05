'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    HanziWriter: any;
    HanziWriterInstance: any;
    HanziWriterLoaders?: Record<string, (callback: Function) => void>;
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
  onLoad?: (writer: any) => void;
  onError?: (error: Error) => void;
}

export default function HanziWriterComponent({
  character,
  width = 250,
  height = 250,
  delayBetweenStrokes = 800,
  strokeAnimationSpeed = 1,
  strokeSpeed,
  showOutline = true,
  showCharacter = false,
  highlightColor = '#ff0000',
  outlineColor = '#333333',
  onLoad,
  onError
}: HanziProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [charDataLoaded, setCharDataLoaded] = useState(false);

  // HanziWriter 초기화 함수
  const initializeWriter = () => {
    if (!containerRef.current) {
      console.warn('컨테이너가 준비되지 않았습니다');
      return;
    }
    
    if (!window.HanziWriter) {
      console.warn('HanziWriter가 로드되지 않았습니다, 스크립트 로드 중...');
      // 스크립트 로드 시도
      loadScript();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setCharDataLoaded(false);
    
    // 컨테이너를 비웁니다
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // 설정 객체
    const options = {
      width,
      height,
      padding: 10,
      delayBetweenStrokes, // 획 사이의 지연 시간
      strokeAnimationSpeed: strokeSpeed || strokeAnimationSpeed, // strokeSpeed 우선 사용
      showOutline, // 외곽선 표시 여부
      showCharacter, // 전체 한자 표시 여부
      highlightColor, // 현재 그려지는 획의 색상
      outlineColor, // 외곽선 색상
      strokeColor: '#333333', // 획의 기본 색상
      strokeWidth: 8, // 획 두께 증가
      outlineWidth: 2, // 윤곽선 두께
      drawingWidth: 4, // 획 두께
      rendererOverride: {
        strokeColor: (strokeArgs: any) => {
          return '#333';
        },
        radicalColor: (strokeArgs: any) => {
          return highlightColor;
        }
      },
      charDataLoader: enhancedCharDataLoader
    };

    try {
      // HanziWriter 인스턴스 생성
      writerRef.current = window.HanziWriter.create(containerRef.current, character, options);
      
      // onLoad 콜백이 있으면 호출
      if (onLoad && typeof onLoad === 'function') {
        onLoad(writerRef.current);
      }
      
      // 애니메이션 자동 시작
      setTimeout(() => {
        if (writerRef.current) {
          console.log(`애니메이션 시작: ${character}`);
          setIsLoading(false); // 애니메이션 시작 전에 로딩 상태 해제
          
          try {
            // 애니메이션 시작 - 한 획씩 그리기
            writerRef.current.animateCharacter({
              onComplete: () => {
                console.log('애니메이션 완료');
                // 완료 후 모든 획 표시 유지
                if (writerRef.current) {
                  writerRef.current.showOutline();
                  
                  // 모든 획 유지하고 첫 획부터 마지막 획까지 다시 한번 강조
                  setTimeout(() => {
                    if (writerRef.current) {
                      for (let i = 0; i < (writerRef.current._character?.strokes?.length || 0); i++) {
                        setTimeout(() => {
                          if (writerRef.current) {
                            writerRef.current.highlightStroke(i);
                          }
                        }, i * 300);
                      }
                    }
                  }, 500);
                }
              }
            });
          } catch (animError) {
            console.error('애니메이션 시작 오류:', animError);
            setError('애니메이션을 시작할 수 없습니다. 새로고침 해주세요.');
            setIsLoading(false);
            // onError 콜백이 있으면 호출
            if (onError && typeof onError === 'function') {
              onError(animError instanceof Error ? animError : new Error('애니메이션 시작 실패'));
            }
          }
        }
      }, 300); // 300ms 지연 추가
    } catch (error) {
      console.error('HanziWriter 초기화 오류:', error);
      setError('한자 렌더링 중 오류가 발생했습니다.');
      setIsLoading(false);
      // onError 콜백이 있으면 호출
      if (onError && typeof onError === 'function') {
        onError(error instanceof Error ? error : new Error('HanziWriter 초기화 실패'));
      }
    }
  };

  // 스크립트 로드 방식 개선
  const loadScript = () => {
    // 이미 스크립트가 있는지 확인
    if (document.querySelector('script[src*="hanzi-writer"]')) {
      console.log('HanziWriter 스크립트가 이미 로드되고 있습니다');
      
      // 이미 로드 중이면 일정 시간 후 콜백 실행 시도
      setTimeout(() => {
        if (window.HanziWriter) {
          console.log('지연 후 HanziWriter 발견, 초기화 진행');
          scriptLoadedRef.current = true;
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

  // 강제 스크립트 로드 함수 추가
  const forceLoadScript = () => {
    console.log('HanziWriter 스크립트 강제 로드 시도');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js';
    script.async = false; // async를 false로 설정하여 즉시 로드
    
    script.onload = () => {
      console.log('HanziWriter 스크립트 로드 완료 (직접 로드)');
      scriptLoadedRef.current = true;
      
      // 약간의 지연 후 초기화
      setTimeout(initializeWriter, 100);
    };
    
    script.onerror = () => {
      console.error('HanziWriter 스크립트 로드 실패 (직접 로드), 대체 URL 시도');
      
      // 대체 URL 시도
      const backupScript = document.createElement('script');
      backupScript.src = 'https://unpkg.com/hanzi-writer@3.5/dist/hanzi-writer.min.js';
      backupScript.async = false; // async를 false로 설정
      
      backupScript.onload = () => {
        console.log('HanziWriter 스크립트 로드 완료 (대체 URL)');
        scriptLoadedRef.current = true;
        
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
  const handleScriptLoad = useCallback(() => {
    console.log('HanziWriter 스크립트 로드 완료');
    scriptLoadedRef.current = true;
    
    // 스크립트 로드 후 즉시 초기화
    if (containerRef.current) {
      setTimeout(() => initializeWriter(), 100);
    }
  }, []);

  // 화면에 마운트될 때 스크립트 로드 및 초기화
  useEffect(() => {
    console.log(`HanziWriter 컴포넌트 마운트: ${character}`);
    
    // 이미 스크립트가 로드되었을 경우
    if (typeof window !== 'undefined' && window.HanziWriter) {
      console.log('HanziWriter 이미 로드됨, 초기화 진행');
      scriptLoadedRef.current = true;
      initializeWriter();
    }
    
    return () => {
      // 클린업 - 기존 인스턴스 정리
      if (writerRef.current) {
        try {
          writerRef.current = null;
        } catch (e) {
          console.error('HanziWriter 인스턴스 제거 오류:', e);
        }
      }
    };
  }, [character, width, height, delayBetweenStrokes, strokeAnimationSpeed, showOutline, showCharacter, highlightColor, outlineColor]);

  // charDataLoader 함수 개선 - 더 간단하고 안정적인 버전
  const enhancedCharDataLoader = (char: string, onComplete: (data: any) => void) => {
    console.log('한자 데이터 로딩 시작:', char);
    
    // 내장 데이터 확인 - 우선 사용
    if (BASIC_HANJA_DATA[char]) {
      console.log(`내장 데이터 사용: ${char}`);
      setCharDataLoaded(true);
      onComplete(BASIC_HANJA_DATA[char]);
      return;
    }
    
    // 항상 기본 생성된 데이터를 즉시 표시 (UX 향상)
    const generatedData = generateBasicHanjaPattern(char);
    setCharDataLoaded(true);
    console.log(`생성된 기본 데이터로 우선 표시: ${char}`);
    onComplete(generatedData);
    
    // CDN 또는 API에서 실제 데이터 가져오기 시도
    const encodedChar = encodeURIComponent(char);
    
    // 단순화된 로딩 방식: CDN → API → 기본값 유지
    fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodedChar}.json`)
      .then(res => res.ok ? res.json() : Promise.reject('CDN 실패'))
      .then(data => {
        console.log(`CDN에서 한자 데이터 로드 성공: ${char}`);
        // 캐시에 저장
        BASIC_HANJA_DATA[char] = data;
        // 실제 데이터를 가져왔지만 이미 렌더링된 경우 업데이트하지 않음
      })
      .catch(() => {
        // CDN 실패 시 API 시도
        console.log(`CDN 실패, API 시도: ${char}`);
        return fetch(`/api/hanja/strokes?character=${encodedChar}`)
          .then(res => res.ok ? res.json() : Promise.reject('API 실패'))
          .then(data => {
            console.log(`API에서 한자 데이터 로드 성공: ${char}`);
            // 캐시에 저장
            BASIC_HANJA_DATA[char] = data;
          });
      })
      .catch(() => {
        // 모든 로드 실패 시 생성된 데이터 유지
        console.warn(`한자 데이터 로드 모두 실패, 생성된 기본 데이터 유지: ${char}`);
        // 생성된 데이터를 캐시에 저장
        if (!BASIC_HANJA_DATA[char]) {
          BASIC_HANJA_DATA[char] = generatedData;
        }
      });
  };

  return (
    <>
      <Script 
        id="hanzi-writer-script"
        src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"
        onLoad={handleScriptLoad}
        onError={() => {
          console.error('HanziWriter 스크립트 로드 실패 (Next/Script), 직접 로드 시도');
          // 대체 URL로 재시도
          const backupScript = document.createElement('script');
          backupScript.src = 'https://unpkg.com/hanzi-writer@3.5/dist/hanzi-writer.min.js';
          backupScript.async = false;
          backupScript.onload = () => {
            console.log('HanziWriter 스크립트 대체 URL에서 로드 성공');
            handleScriptLoad();
          };
          backupScript.onerror = () => {
            console.error('HanziWriter 스크립트 대체 URL에서도 로드 실패');
            setError('한자 표시 라이브러리를 로드할 수 없습니다. 인터넷 연결을 확인해 주세요.');
          };
          document.head.appendChild(backupScript);
        }}
        strategy="beforeInteractive"
      />
      <div className="relative">
        <div 
          ref={containerRef} 
          className="hanzi-writer-container" 
          style={{ 
            margin: '0 auto', 
            width: `${width}px`, 
            height: `${height}px`,
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            backgroundColor: '#ffffff'
          }} 
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-600">
                {charDataLoaded ? '애니메이션 준비 중...' : '필순 데이터 로딩 중...'}
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => initializeWriter(), 100);
                }}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 