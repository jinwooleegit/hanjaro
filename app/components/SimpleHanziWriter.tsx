'use client';

import { useRef, useEffect, useState } from 'react';
import Script from 'next/script';

interface SimpleHanziWriterProps {
  character: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  outlineColor?: string;
  highlightColor?: string;
  showOutline?: boolean;
  showHint?: boolean;
  quizMode?: boolean;
  onQuizComplete?: (success: boolean) => void;
  strokeData?: any;
}

// 간소화된 한자 필순 표시 컴포넌트
export default function SimpleHanziWriter({
  character,
  width = 180,
  height = 180,
  strokeColor = '#333',
  outlineColor = '#ddd',
  highlightColor = '#07F',
  showOutline = true,
  showHint = true,
  quizMode = false,
  onQuizComplete = () => {},
  strokeData = null
}: SimpleHanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const writerInstanceRef = useRef<any>(null);

  // HanziWriter 스크립트 로드 처리
  const handleScriptLoad = () => {
    console.log('HanziWriter 스크립트 로드됨');
    setScriptLoaded(true);
    initializeWriter();
  };

  // 한자 초기화 함수
  const initializeWriter = () => {
    if (!containerRef.current || typeof window === 'undefined' || !window.HanziWriter) {
      console.error('HanziWriter 초기화 불가: DOM 또는 라이브러리 없음');
      return;
    }
    
    try {
      console.log(`HanziWriter 초기화 시작: ${character}`);
      
      // 기존 인스턴스 정리
      if (writerInstanceRef.current) {
        try {
          // 인스턴스 참조 제거
          writerInstanceRef.current = null;
          
          // 컨테이너 비우기
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        } catch (e) {
          console.error('한자 인스턴스 정리 중 오류:', e);
        }
      }
      
      // HanziWriter 옵션 설정
      const options: any = {
        width,
        height,
        padding: 5,
        strokeColor,
        outlineColor,
        highlightColor,
        drawingWidth: 4,
        showOutline: showOutline,
        showHintAfterMisses: showHint ? 1 : 999, // 힌트 보여주기 설정
        delayBetweenStrokes: 800,
        strokeAnimationSpeed: 1,
        renderer: 'svg'
      };
      
      // 스트로크 데이터가 있으면 사용
      if (strokeData) {
        console.log('로컬 스트로크 데이터 사용:', character);
        options.charDataLoader = () => Promise.resolve(strokeData);
      }
      
      // 콜백 이벤트 추가
      options.onLoadCharDataSuccess = () => {
        console.log('한자 데이터 로드 성공:', character);
        setIsLoading(false);
        
        // 퀴즈 모드가 아닐 경우 애니메이션 실행
        if (!quizMode) {
          setTimeout(() => {
            try {
              if (writerInstanceRef.current && writerInstanceRef.current.animateCharacter) {
                console.log('애니메이션 실행:', character);
                writerInstanceRef.current.animateCharacter();
              }
            } catch (animError) {
              console.error('애니메이션 실행 오류:', animError);
            }
          }, 500);
        } else {
          // 퀴즈 모드일 경우 퀴즈 시작
          setTimeout(() => {
            try {
              if (writerInstanceRef.current && writerInstanceRef.current.quiz) {
                console.log('퀴즈 모드 시작:', character);
                writerInstanceRef.current.quiz({
                  onMistake: (strokeData: any) => {
                    console.log('획 실수 발생:', character);
                  },
                  onCorrectStroke: (strokeNum: number, totalStrokes: number) => {
                    console.log(`정확한 획: ${strokeNum}/${totalStrokes}`, character);
                  },
                  onComplete: () => {
                    console.log('퀴즈 완료:', character);
                    if (onQuizComplete) {
                      onQuizComplete(true);
                    }
                  }
                });
              } else {
                console.error('퀴즈 메서드 없음:', character);
                setIsError(true);
              }
            } catch (quizError) {
              console.error('퀴즈 시작 오류:', quizError);
              setIsError(true);
            }
          }, 500);
        }
      };
      
      options.onLoadCharDataError = (error: any) => {
        console.error('한자 데이터 로드 오류:', character, error);
        setIsLoading(false);
        setIsError(true);
        if (quizMode && onQuizComplete) {
          onQuizComplete(false);
        }
      };
      
      // 새 인스턴스 생성
      console.log('HanziWriter 인스턴스 생성 시도:', character);
      const writer = window.HanziWriter.create(
        containerRef.current,
        character,
        options
      );
      
      console.log('HanziWriter 인스턴스 생성 성공:', character);
      writerInstanceRef.current = writer;
    } catch (e) {
      console.error('한자 애니메이션 초기화 중 오류:', character, e);
      setIsLoading(false);
      setIsError(true);
      if (quizMode && onQuizComplete) {
        onQuizComplete(false);
      }
    }
  };

  // 컴포넌트 마운트 시 스크립트 로드 확인
  useEffect(() => {
    // 이미 스크립트가 로드되었는지 확인
    if (typeof window !== 'undefined' && window.HanziWriter) {
      console.log('HanziWriter 이미 로드됨');
      setScriptLoaded(true);
      
      // 다음 렌더 사이클에 초기화 (상태 업데이트 후)
      setTimeout(() => {
        initializeWriter();
      }, 0);
    }
    
    return () => {
      // 컴포넌트 언마운트 시 정리
      if (writerInstanceRef.current) {
        try {
          writerInstanceRef.current = null;
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        } catch (e) {
          console.error('정리 중 오류:', e);
        }
      }
    };
  }, [character, quizMode, showHint, showOutline, strokeData]);

  return (
    <div className="relative">
      {!scriptLoaded && (
        <Script 
          src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={() => {
            console.error('HanziWriter 스크립트 로드 오류');
            setIsError(true);
          }}
        />
      )}
      
      <div 
        ref={containerRef}
        className="w-full flex items-center justify-center bg-white"
        style={{ 
          width, 
          height,
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '4px'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-10">
            <div className="text-center p-4">
              <div className="text-4xl font-normal mb-2">{character}</div>
              <p className="text-sm text-red-500">필순 데이터를 불러올 수 없습니다</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 