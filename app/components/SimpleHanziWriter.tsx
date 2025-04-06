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
  onQuizComplete = () => {}
}: SimpleHanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const writerInstanceRef = useRef<any>(null);

  // HanziWriter 스크립트 로드 처리
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    initializeWriter();
  };

  // 한자 초기화 함수
  const initializeWriter = () => {
    if (!containerRef.current || typeof window === 'undefined' || !window.HanziWriter) return;
    
    try {
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
      
      // 새 인스턴스 생성
      const writer = window.HanziWriter.create(
        containerRef.current,
        character,
        {
          width,
          height,
          padding: 5,
          strokeColor,
          outlineColor,
          highlightColor,
          drawingWidth: 3,
          showOutline: showOutline,
          showHintAfterMisses: showHint ? 1 : 999, // 힌트 보여주기 설정
          delayBetweenStrokes: 800,
          strokeAnimationSpeed: 1,
          renderer: 'svg',
          onLoadCharDataSuccess: () => {
            setIsLoading(false);
            
            // 퀴즈 모드가 아닐 경우 애니메이션 실행
            if (!quizMode) {
              setTimeout(() => {
                if (writer && writer.animateCharacter) {
                  writer.animateCharacter();
                }
              }, 500);
            } else {
              // 퀴즈 모드일 경우 퀴즈 시작
              setTimeout(() => {
                if (writer && writer.quiz) {
                  writer.quiz({
                    onMistake: () => {
                      // 실패 처리
                    },
                    onCorrectStroke: () => {
                      // 정확한 획 처리
                    },
                    onComplete: () => {
                      // 퀴즈 완료 처리
                      if (onQuizComplete) {
                        onQuizComplete(true);
                      }
                    }
                  });
                }
              }, 500);
            }
          },
          onLoadCharDataError: () => {
            setIsLoading(false);
            setIsError(true);
            if (quizMode && onQuizComplete) {
              onQuizComplete(false);
            }
          }
        }
      );
      
      writerInstanceRef.current = writer;
    } catch (e) {
      console.error('한자 애니메이션 초기화 중 오류:', e);
      setIsLoading(false);
      setIsError(true);
      if (quizMode && onQuizComplete) {
        onQuizComplete(false);
      }
    }
  };

  // 컴포넌트 마운트 시 스크립트 로드 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && window.HanziWriter) {
      setScriptLoaded(true);
      initializeWriter();
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
  }, [character, quizMode, showHint, showOutline]);

  return (
    <div className="relative">
      <Script 
        src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      
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
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {isError && (
          <div className="text-center">
            <div className="text-4xl font-normal mb-1">{character}</div>
            <p className="text-xs text-gray-500">필순 데이터 없음</p>
          </div>
        )}
      </div>
    </div>
  );
} 