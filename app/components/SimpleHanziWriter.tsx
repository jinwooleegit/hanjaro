'use client';

import React, { useRef, useEffect, useState } from 'react';

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
  hideLeftCharacter?: boolean;
}

// 글로벌 인스턴스 저장용 타입 정의
declare global {
  interface Window {
    HanziWriterInstance: any;
  }
}

// 한자의 기본 획순 데이터를 가져오는 함수
function getBasicStrokeData(character: string, width: number, height: number) {
  // 단순한 한자 기본 획순 데이터
  // 한글, 영문 등에는 단순 대각선 두 개로 구성
  if (character.charCodeAt(0) < 0x4E00 || character.charCodeAt(0) > 0x9FFF) {
    return [
      [{ x: width * 0.2, y: height * 0.2 }, { x: width * 0.8, y: height * 0.8 }],
      [{ x: width * 0.8, y: height * 0.2 }, { x: width * 0.2, y: height * 0.8 }]
    ];
  }

  // 기본적인 한자 패턴 생성 (실제와 다르지만 데모용)
  // 실제 구현에서는 서버나 데이터베이스에서 획 데이터를 가져와야 함
  const charCode = character.charCodeAt(0);
  const strokeCount = Math.max(2, Math.min(12, (charCode % 10) + 2));
  
  const strokes = [];
  
  // 수평선 (가로획)
  strokes.push([
    { x: width * 0.2, y: height * 0.3 }, 
    { x: width * 0.8, y: height * 0.3 }
  ]);
  
  // 수직선 (세로획)
  strokes.push([
    { x: width * 0.5, y: height * 0.2 }, 
    { x: width * 0.5, y: height * 0.8 }
  ]);
  
  // 추가 획 생성
  if (strokeCount > 2) {
    // 왼쪽 수직선
    strokes.push([
      { x: width * 0.3, y: height * 0.4 }, 
      { x: width * 0.3, y: height * 0.8 }
    ]);
  }
  
  if (strokeCount > 3) {
    // 오른쪽 수직선
    strokes.push([
      { x: width * 0.7, y: height * 0.4 }, 
      { x: width * 0.7, y: height * 0.8 }
    ]);
  }
  
  if (strokeCount > 4) {
    // 아래 수평선
    strokes.push([
      { x: width * 0.2, y: height * 0.6 }, 
      { x: width * 0.8, y: height * 0.6 }
    ]);
  }
  
  if (strokeCount > 5) {
    // 대각선
    strokes.push([
      { x: width * 0.2, y: height * 0.2 }, 
      { x: width * 0.8, y: height * 0.8 }
    ]);
  }
  
  // 나머지 획 추가
  for (let i = 6; i < strokeCount; i++) {
    const yPos = 0.2 + (i * 0.1);
    strokes.push([
      { x: width * 0.3, y: height * yPos },
      { x: width * 0.7, y: height * yPos }
    ]);
  }
  
  return strokes;
}

export default function SimpleHanziWriter({
  character,
  width = 300,
  height = 300,
  strokeColor = '#333',
  outlineColor = '#ddd',
  highlightColor = '#07F',
  showOutline = true,
  showHint = false,
  quizMode = false,
  onQuizComplete,
  hideLeftCharacter = false
}: SimpleHanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // 상태 관리
  const [error, setError] = useState<string | null>(null);
  const [strokeIndex, setStrokeIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [userStrokes, setUserStrokes] = useState<any[]>([]);
  
  const strokeDataRef = useRef<any[]>([]);
  
  // 초기화 및 인스턴스 설정
  useEffect(() => {
    // 기본 스트로크 데이터 생성
    strokeDataRef.current = getBasicStrokeData(character, width, height);
    
    // 인스턴스 초기화
    initializeWriter();
    
    // 글로벌 인스턴스 설정
    window.HanziWriterInstance = {
      isAnimating: () => isAnimating,
      cancelAnimation: cancelAnimation,
      animateCharacter: (options: any) => {
        animateCharacter(options);
        return true;
      },
      quiz: function(options: any) {
        // quiz 함수 구현
        const activateQuiz = () => {
          setIsQuizActive(true);
          clearCanvas();
          
          // 드로잉 이벤트 설정 및 콜백 등록
          const drawingHandler = setupDrawingEvents();
          
          // 콜백 설정
          if (drawingHandler && options?.onComplete) {
            drawingHandler.setCompleteCallback(options.onComplete);
          }
          
          // quiz 객체 반환
          return {
            isActive: () => isQuizActive,
            cancel: () => cancelQuiz(),
            giveUp: () => {
              cancelQuiz();
              if (onQuizComplete) onQuizComplete(false);
            }
          };
        };
        
        return activateQuiz();
      },
      setCharacter: () => {
        clearCanvas();
        drawCharacter();
      },
      setSpeed: (speed: number) => {
        // 애니메이션 속도 처리는 animateCharacter 내에서 직접 구현
      }
    };
    
    return () => {
      // 클린업
      // @ts-ignore - 타입 오류 무시
      window.HanziWriterInstance = null;
    };
  }, [character, width, height]);
  
  // 캔버스 초기화 함수
  const initializeWriter = () => {
    if (!containerRef.current) return;
    
    try {
      // 기존 내용 지우기
      containerRef.current.innerHTML = '';
      
      // 컨테이너 설정
      containerRef.current.style.position = 'relative';
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.height = `${height}px`;
      
      // 디스플레이 캔버스 생성 (한자 표시용)
      const displayCanvas = document.createElement('canvas');
      displayCanvas.width = width;
      displayCanvas.height = height;
      displayCanvas.style.position = 'absolute';
      displayCanvas.style.top = '0';
      displayCanvas.style.left = '0';
      containerRef.current.appendChild(displayCanvas);
      displayCanvasRef.current = displayCanvas;
      
      // 드로잉 캔버스 생성 (사용자 입력용)
      const drawingCanvas = document.createElement('canvas');
      drawingCanvas.width = width;
      drawingCanvas.height = height;
      drawingCanvas.style.position = 'absolute';
      drawingCanvas.style.top = '0';
      drawingCanvas.style.left = '0';
      drawingCanvas.style.zIndex = '10';
      containerRef.current.appendChild(drawingCanvas);
      drawingCanvasRef.current = drawingCanvas;
      
      // 초기 렌더링
      clearCanvas();
      drawCharacter();
      
      // 퀴즈 모드 설정
      if (quizMode) {
        setupDrawingEvents();
      }
      
      setError(null);
    } catch (err) {
      console.error('한자 렌더링 초기화 오류:', err);
      setError('한자 렌더링 초기화에 실패했습니다');
    }
  };
  
  // 캔버스 지우기
  const clearCanvas = () => {
    if (displayCanvasRef.current) {
      const ctx = displayCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        // 테두리 그리기
        if (showOutline) {
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(10, 10, width - 20, height - 20);
        }
      }
    }
    
    if (drawingCanvasRef.current) {
      const ctx = drawingCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    }
  };
  
  // 한자 기본 렌더링
  const drawCharacter = () => {
    if (!displayCanvasRef.current || hideLeftCharacter) return;
    
    const ctx = displayCanvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.font = `${Math.floor(height * 0.8)}px serif`;
    ctx.fillStyle = strokeColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, width / 2, height / 2);
  };
  
  // 획 그리기
  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: any, color: string = strokeColor) => {
    if (!stroke || stroke.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };
  
  // 애니메이션 취소
  const cancelAnimation = () => {
    setIsAnimating(false);
    setStrokeIndex(-1);
  };
  
  // 퀴즈 모드 취소
  const cancelQuiz = () => {
    setIsQuizActive(false);
    setUserStrokes([]);
    clearCanvas();
    drawCharacter();
  };
  
  // 애니메이션 실행
  const animateCharacter = (options?: any) => {
    if (!displayCanvasRef.current) return;
    
    // 퀴즈 모드인 경우 취소
    if (isQuizActive) {
      cancelQuiz();
    }
    
    // 애니메이션 시작
    setIsAnimating(true);
    setStrokeIndex(-1);
    clearCanvas();
    
    // 한자 숨기기 (애니메이션 시)
    if (hideLeftCharacter) {
      const ctx = displayCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    }
    
    // 획 애니메이션 시작
    let currentStrokeIndex = 0;
    const strokes = strokeDataRef.current;
    
    const animateNextStroke = () => {
      if (currentStrokeIndex >= strokes.length || !isAnimating) {
        setIsAnimating(false);
        if (options?.onComplete) {
          setTimeout(() => options.onComplete(), 500);
        }
        return;
      }
      
      const ctx = displayCanvasRef.current?.getContext('2d');
      if (!ctx) return;
      
      setStrokeIndex(currentStrokeIndex);
      drawStroke(ctx, strokes[currentStrokeIndex], highlightColor);
      
      currentStrokeIndex++;
      setTimeout(animateNextStroke, 800); // 획 간 딜레이
    };
    
    // 애니메이션 시작
    animateNextStroke();
  };
  
  // 드로잉 이벤트 설정
  const setupDrawingEvents = () => {
    if (!drawingCanvasRef.current) return;
    
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let isDrawing = false;
    let currentStroke: any[] = [];
    let currentStrokeIndex = 0;
    let quizCompleteCallback: ((summary: any) => void) | null = null;
    
    // 외부에서 콜백 설정할 수 있도록
    const setCompleteCallback = (callback: (summary: any) => void) => {
      quizCompleteCallback = callback;
    };
    
    // 스트로크 평가
    const evaluateStroke = () => {
      // 단순 성공 처리
      return true;
    };
    
    // 다음 퀴즈 스트로크 힌트 표시
    const showStrokeHint = () => {
      if (!showHint || currentStrokeIndex >= strokeDataRef.current.length) return;
      
      // 힌트 표시 (점선으로)
      if (displayCanvasRef.current) {
        const hintCtx = displayCanvasRef.current.getContext('2d');
        if (hintCtx) {
          const stroke = strokeDataRef.current[currentStrokeIndex];
          hintCtx.setLineDash([5, 5]);
          hintCtx.beginPath();
          hintCtx.moveTo(stroke[0].x, stroke[0].y);
          
          for (let i = 1; i < stroke.length; i++) {
            hintCtx.lineTo(stroke[i].x, stroke[i].y);
          }
          
          hintCtx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
          hintCtx.lineWidth = 4;
          hintCtx.stroke();
          hintCtx.setLineDash([]);
        }
      }
    };
    
    // 이벤트 핸들러
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      if (!isQuizActive) {
        setIsQuizActive(true);
        clearCanvas();
      }
      
      isDrawing = true;
      currentStroke = [];
      
      const pos = getEventPosition(e, canvas);
      currentStroke.push(pos);
      
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = highlightColor;
    };
    
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      
      const pos = getEventPosition(e, canvas);
      currentStroke.push(pos);
      
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };
    
    const endDrawing = () => {
      if (!isDrawing) return;
      
      isDrawing = false;
      ctx.closePath();
      
      // 사용자 스트로크 저장
      if (currentStroke.length > 3) {
        setUserStrokes([...userStrokes, currentStroke]);
        
        // 스트로크 평가
        const success = evaluateStroke();
        
        // 다음 스트로크로 이동 또는 완료
        if (success) {
          currentStrokeIndex++;
          
          // 모든 스트로크 완료
          if (currentStrokeIndex >= strokeDataRef.current.length) {
            // 성공 처리
            setTimeout(() => {
              if (quizCompleteCallback) {
                // 수동으로 설정된 콜백 호출
                quizCompleteCallback({ totalMistakes: 0, totalCorrect: currentStrokeIndex });
              } else if (onQuizComplete) {
                // 기본 콜백 호출
                onQuizComplete(true);
              }
              setIsQuizActive(false);
            }, 500);
          } else {
            // 다음 힌트 표시
            setTimeout(() => {
              showStrokeHint();
            }, 300);
          }
        }
      }
      
      // 스트로크가 너무 짧으면 지우기
      else {
        ctx.clearRect(0, 0, width, height);
      }
    };
    
    // 이벤트 리스너 등록
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseleave', endDrawing);
    
    // 터치 이벤트
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e);
    });
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      endDrawing();
    });
    
    // 초기 힌트 표시
    if (showHint) {
      showStrokeHint();
    }
    
    // 콜백 설정 함수 반환
    return { setCompleteCallback };
  };
  
  // 이벤트 위치 계산 함수
  const getEventPosition = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top
      };
    }
  };
  
  // 오류 표시
  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="text-center p-4">
          <div className="text-5xl mb-2">{character}</div>
          <p className="text-sm text-red-500 mb-1">렌더링 실패</p>
          <p className="text-xs text-gray-500">{error}</p>
          <button 
            className="mt-3 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            onClick={() => {
              setError(null);
              initializeWriter();
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  
  // 일반 렌더링
  return <div ref={containerRef} style={{ width, height }} />;
} 