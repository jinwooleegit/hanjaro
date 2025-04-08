'use client';

import { useRef, useEffect, useState } from 'react';
import Script from 'next/script';

// HanziWriter 옵션 타입 정의
interface HanziWriterOptions {
  width: number;
  height: number;
  padding: number;
  strokeColor: string;
  outlineColor: string;
  highlightColor: string;
  drawingWidth: number;
  showOutline: boolean;
  showHintAfterMisses: number;
  delayBetweenStrokes: number;
  strokeAnimationSpeed: number;
  renderer: string;
  charDataLoader?: () => Promise<any>;
  onLoadCharDataSuccess?: () => void;
  onLoadCharDataError?: (error: any) => void;
}

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

// window 타입 확장 - 전역 객체에 추가되는 속성들을 정의
declare global {
  interface Window {
    HanziWriter: any;
    HanziWriterInstance: any | null;
    HanziWriterLoaders?: Record<string, (callback: any) => void>;
    HanziCache?: Record<string, any>;
    HanziWriterTimers?: Record<string, number>;
  }
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

  // 한자 초기화 함수 개선
  const initializeWriter = () => {
    if (!containerRef.current || typeof window === 'undefined' || !window.HanziWriter) {
      console.error('HanziWriter 초기화 불가: DOM 또는 라이브러리 없음');
      return;
    }
    
    try {
      console.log(`SimpleHanziWriter 초기화 시작: ${character}`);
      
      // 먼저 전역 인스턴스 확인 및 정리
      if (window.HanziWriterInstance) {
        console.log('이전 전역 HanziWriter 인스턴스 정리');
        try {
          // 애니메이션 취소
          if (window.HanziWriterInstance.isAnimating && window.HanziWriterInstance.cancelAnimation) {
            window.HanziWriterInstance.cancelAnimation();
          }
          
          // 퀴즈 취소
          if (window.HanziWriterInstance.quiz && 
              window.HanziWriterInstance.quiz.isActive && 
              window.HanziWriterInstance.quiz.cancel) {
            window.HanziWriterInstance.quiz.cancel();
          }
        } catch (e) {
          console.warn('전역 인스턴스 정리 중 오류:', e);
        }
        
        // 전역 참조 제거
        window.HanziWriterInstance = null;
      }
      
      // 기존 인스턴스 정리
      if (writerInstanceRef.current) {
        try {
          // 인스턴스 참조 제거
          writerInstanceRef.current = null;
          
          // 컨테이너 안전하게 비우기
          if (containerRef.current) {
            try {
              // 최대한 안전하게 컨테이너 비우기
              containerRef.current.innerHTML = '';
            } catch (e) {
              console.error('컨테이너 비우기 오류:', e);
            }
          }
        } catch (e) {
          console.error('한자 인스턴스 정리 중 오류:', e);
        }
      }
      
      // 새 작성기를 위한 안전한 접근법
      setTimeout(() => {
        try {
          if (!containerRef.current) {
            console.error('컨테이너가 존재하지 않음');
            return;
          }
          
          // HanziWriter 옵션 설정
          const options: HanziWriterOptions = {
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
            
            // 타이머 정리를 위한 전역 객체 초기화
            if (!window.HanziWriterTimers) {
              window.HanziWriterTimers = {};
            }
            
            // 퀴즈 모드가 아닐 경우 애니메이션 실행
            if (!quizMode) {
              const animationTimerId = window.setTimeout(() => {
                try {
                  if (writerInstanceRef.current && writerInstanceRef.current.animateCharacter) {
                    console.log('애니메이션 실행:', character);
                    writerInstanceRef.current.animateCharacter();
                  }
                } catch (animError) {
                  console.error('애니메이션 실행 오류:', animError);
                }
              }, 500);
              
              // 타이머 추적
              window.HanziWriterTimers[`anim_${character}`] = animationTimerId;
            } else {
              // 퀴즈 모드일 경우 퀴즈 시작
              const quizTimerId = window.setTimeout(() => {
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
              
              // 타이머 추적
              window.HanziWriterTimers[`quiz_${character}`] = quizTimerId;
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
          console.error('새 HanziWriter 인스턴스 생성 중 오류:', e);
          setIsLoading(false);
          setIsError(true);
        }
      }, 50); // 약간의 지연으로 DOM 업데이트 확보
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
      }, 50); // 약간의 지연을 추가하여 DOM이 완전히 준비되도록 함
    }
    
    // 컴포넌트 언마운트 시 안전한 정리 함수
    return () => {
      console.log('SimpleHanziWriter 정리 시작');
      
      // 인스턴스가 있을 경우에만 정리 시도
      if (writerInstanceRef.current) {
        try {
          // 애니메이션 또는 퀴즈 취소
          try {
            const writer = writerInstanceRef.current;
            
            if (writer.isAnimating && writer.cancelAnimation) {
              writer.cancelAnimation();
            }
            
            if (writer.quiz && writer.quiz.isActive && writer.quiz.cancel) {
              writer.quiz.cancel();
            }
          } catch (e) {
            console.error('애니메이션/퀴즈 취소 중 오류:', e);
          }
          
          // 참조 제거
          writerInstanceRef.current = null;
          
          // 컨테이너가 존재하는지 확인하고 내용 비우기
          if (containerRef.current) {
            try {
              // 가장 안전한 방법으로 내용 비우기
              containerRef.current.innerHTML = '';
            } catch (e) {
              console.error('컨테이너 정리 중 오류:', e);
            }
          }
        } catch (e) {
          console.error('SimpleHanziWriter 정리 중 오류:', e);
        }
      }
      
      console.log('SimpleHanziWriter 정리 완료');
    };
  }, [character, quizMode, showHint, showOutline]);

  // 컴포넌트 반환 - quizMode에 맞게 컨테이너 스타일 최적화
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Script 
        src="/static/hanzi-writer.min.js"
        strategy="beforeInteractive" 
        onLoad={handleScriptLoad}
        onError={() => setIsError(true)}
      />
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">한자 로딩 중...</p>
        </div>
      )}
      
      {isError && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500">한자 로드 오류</p>
          <p className="text-sm text-gray-500 mt-2">해당 한자({character})를 불러올 수 없습니다.</p>
        </div>
      )}
      
      {/* 퀴즈 모드일 때 컨테이너 크기 최적화 */}
      <div 
        ref={containerRef} 
        className="flex items-center justify-center"
        style={{
          width: quizMode ? '100%' : width,
          height: quizMode ? '100%' : height,
          minWidth: width,
          minHeight: height,
          maxWidth: '100%',
          maxHeight: '100%',
          display: isLoading || isError ? 'none' : 'flex'
        }}
      ></div>
    </div>
  );
} 