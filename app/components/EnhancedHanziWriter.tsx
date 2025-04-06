'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import Script from 'next/script';

// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    HanziWriter: any;
  }
}

// 스트로크 데이터 캐시
const strokeDataCache = new Map<string, any>();

interface EnhancedHanziProps {
  character: string;
  width?: number;
  height?: number;
  delayBetweenStrokes?: number;
  strokeAnimationSpeed?: number;
  showOutline?: boolean;
  showCharacter?: boolean;
  highlightColor?: string;
  outlineColor?: string;
  autoAnimate?: boolean;
  onLoadSuccess?: () => void;
  onLoadError?: (error: Error) => void;
  showHint?: boolean;
  quizMode?: boolean;
  onComplete?: (success: boolean) => void;
}

export default function EnhancedHanziWriter({
  character,
  width = 250,
  height = 250,
  delayBetweenStrokes = 500,
  strokeAnimationSpeed = 1,
  showOutline = true,
  showCharacter = false,
  highlightColor = '#ff0000',
  outlineColor = '#cccccc',
  autoAnimate = true,
  onLoadSuccess,
  onLoadError,
  showHint = true,
  quizMode = false,
  onComplete
}: EnhancedHanziProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 고유한 컨테이너 ID 생성 (여러 인스턴스가 충돌하지 않도록)
  const containerId = useMemo(() => `hanzi-writer-${Math.random().toString(36).substr(2, 9)}`, []);

  // 스트로크 데이터 로더 함수
  const loadStrokeData = async (char: string): Promise<any> => {
    // 캐시에서 먼저 확인
    if (strokeDataCache.has(char)) {
      return strokeDataCache.get(char);
    }

    try {
      // 다양한 CDN 소스를 시도합니다
      const cdnSources = [
        `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`,
        `https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/${char}.json`,
        `https://purejs.kr/hanzi-writer-data/${char}.json`
      ];

      // 소스를 순서대로 시도합니다
      for (const source of cdnSources) {
        try {
          console.log(`${char} 필순 데이터 로드 시도: ${source}`);
          const response = await fetch(source, { 
            cache: 'force-cache',
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`${char} 필순 데이터 로드 성공: ${source}`);
            strokeDataCache.set(char, data); // 캐시에 저장
            return data;
          }
        } catch (cdnError) {
          console.warn(`${source}에서 데이터 로드 실패:`, cdnError);
          // 계속 다음 소스 시도
        }
      }

      // 모든 CDN 소스가 실패하면 로컬 API를 시도합니다
      console.log(`${char} 필순 데이터 로컬 API 시도`);
      
      // API 경로 수정 - /api/stroke-data 대신 /api/hanja/strokes 사용
      const apiUrl = `/api/hanja/strokes?character=${encodeURIComponent(char)}`;
      const localResponse = await fetch(apiUrl, { cache: 'no-store' });
      
      if (localResponse.ok) {
        const data = await localResponse.json();
        console.log(`${char} 필순 데이터 로컬 API 로드 성공`);
        
        // API 응답에 오류가 포함되어 있는지 확인
        if (data.error) {
          throw new Error(data.error);
        }
        
        strokeDataCache.set(char, data); // 캐시에 저장
        return data;
      } else {
        // API 응답이 성공적이지 않을 경우
        const errorText = await localResponse.text();
        throw new Error(`API 응답 오류: ${localResponse.status} - ${errorText}`);
      }

    } catch (error: any) {
      console.error(`${char} 필순 데이터 로드 실패:`, error);
      onLoadError?.(error);
      setError(`한자 데이터 로드 실패: ${error.message}`);
      
      // 대체 SVG 데이터 반환 (기본 도형으로 대체)
      // 이렇게 하면 최소한 컴포넌트가 중단되지 않습니다
      return {
        character: char,
        strokes: ['M 0 0 L 100 100 M 100 0 L 0 100'],
        medians: [[[0, 0], [100, 100]], [[100, 0], [0, 100]]],
        isPlaceholder: true
      };
    }
  };

  // HanziWriter 초기화 함수
  const initializeWriter = async () => {
    if (!containerRef.current || !window.HanziWriter) {
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // 이전 인스턴스 정리
      if (writerRef.current) {
        writerRef.current = null;
      }
      
      // 컨테이너 준비
      containerRef.current.innerHTML = '';
      
      // 설정 객체
      const options = {
        width,
        height,
        padding: 5,
        delayBetweenStrokes,
        strokeAnimationSpeed,
        showOutline,
        showCharacter,
        highlightColor: showHint ? highlightColor : 'transparent',
        outlineColor,
        strokeColor: '#333333',
        charDataLoader: async (char: string, onComplete: (data: any) => void) => {
          const data = await loadStrokeData(char);
          onComplete(data);
        }
      };

      // HanziWriter 인스턴스 생성
      writerRef.current = window.HanziWriter.create(containerRef.current, character, options);
      
      // 애니메이션 자동 시작 (옵션에 따라)
      if (autoAnimate && !quizMode) {
        setTimeout(() => {
          writerRef.current?.animateCharacter();
        }, 100);
      }

      // 퀴즈 모드 시작
      if (quizMode && writerRef.current) {
        setTimeout(() => {
          writerRef.current.quiz({
            onComplete: (summary: any) => {
              if (onComplete) {
                // 모든 획을 성공적으로 완료했는지 확인
                const success = summary.totalMistakes === 0;
                onComplete(success);
              }
            }
          });
        }, 500);
      }

      setIsLoading(false);
      onLoadSuccess?.();
    } catch (error: any) {
      console.error('HanziWriter 초기화 오류:', error);
      setError(`초기화 오류: ${error.message}`);
      setIsLoading(false);
      onLoadError?.(error);
    }
  };

  // 공개 메서드
  const animateCharacter = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  const showHintFor = (strokeNum: number) => {
    if (writerRef.current) {
      writerRef.current.showHintForStroke(strokeNum);
    }
  };

  const quiz = () => {
    if (writerRef.current) {
      writerRef.current.quiz({
        onComplete: (summary: any) => {
          if (onComplete) {
            const success = summary.totalMistakes === 0;
            onComplete(success);
          }
        }
      });
    }
  };

  // 스크립트 로드 완료 핸들러
  const handleScriptLoad = () => {
    scriptLoadedRef.current = true;
    initializeWriter();
  };

  // 컴포넌트 마운트/업데이트 시 실행
  useEffect(() => {
    // 이미 스크립트가 로드되었다면 바로 초기화
    if (scriptLoadedRef.current && window.HanziWriter) {
      initializeWriter();
    }

    return () => {
      // 컴포넌트 언마운트 시 정리 작업
      writerRef.current = null;
    };
  }, [character, width, height, delayBetweenStrokes, strokeAnimationSpeed, showOutline, showCharacter, highlightColor, outlineColor, showHint, quizMode]);

  // 공개 메서드를 부모 컴포넌트에 노출
  useEffect(() => {
    if (!containerRef.current) return;

    // 공개 메서드를 DOM 요소에 추가
    const container = containerRef.current;
    (container as any).animateCharacter = animateCharacter;
    (container as any).showHintFor = showHintFor;
    (container as any).quiz = quiz;

    return () => {
      // 메서드 제거
      if (container) {
        (container as any).animateCharacter = undefined;
        (container as any).showHintFor = undefined;
        (container as any).quiz = undefined;
      }
    };
  }, []);

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      <div className="hanzi-writer-wrapper" style={{ position: 'relative', margin: '0 auto', width: `${width}px`, height: `${height}px` }}>
        <div id={containerId} ref={containerRef} style={{ width: '100%', height: '100%' }} />
        
        {isLoading && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.7)' }}>
            <div className="loading-spinner" />
          </div>
        )}
        
        {error && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.9)', padding: '10px', textAlign: 'center' }}>
            <div className="error-message">
              {error}
              <button 
                onClick={() => initializeWriter()}
                style={{ display: 'block', marginTop: '10px', padding: '5px 10px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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
