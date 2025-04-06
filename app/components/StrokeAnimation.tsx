'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stroke } from '@/types/hanja';

interface StrokeAnimationProps {
  character: string;
  strokes?: Stroke[];
  width?: number;
  height?: number;
  strokeColor?: string;
  backgroundColor?: string;
  animationSpeed?: number;
}

const StrokeAnimation: React.FC<StrokeAnimationProps> = ({
  character,
  strokes,
  width = 200,
  height = 200,
  strokeColor = '#000000',
  backgroundColor = '#ffffff',
  animationSpeed = 1000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);

  // 샘플 SVG 패스 데이터 (실제로는 DB에서 가져와야 함)
  const sampleStrokes: Stroke[] = strokes || [
    // 한자 '一'의 필순 (한 획)
    { path: 'M50,100 L150,100', order: 1 },
    
    // 한자 '人'의 필순 (두 획)
    // { path: 'M100,50 L60,150', order: 1 },
    // { path: 'M100,50 L140,150', order: 2 },
    
    // 한자 '山'의 필순 (세 획)
    // { path: 'M50,150 L150,150', order: 1 },
    // { path: 'M75,50 L75,150', order: 2 },
    // { path: 'M125,50 L125,150', order: 3 },
  ];

  // SVG 패스를 캔버스에 그리는 함수
  const drawPath = (path: string, context: CanvasRenderingContext2D) => {
    const svgPath = new Path2D(path);
    context.stroke(svgPath);
  };

  // 캔버스 초기화
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // 현재까지의 획을 그리는 함수
  const drawStrokes = (upToStroke: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    clearCanvas();

    context.strokeStyle = strokeColor;
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // 현재까지의 획을 모두 그림
    const strokesToRender = sampleStrokes.filter(stroke => stroke.order <= upToStroke);
    strokesToRender.forEach(stroke => {
      drawPath(stroke.path, context);
    });
  };

  // 애니메이션 재생 함수
  const playAnimation = () => {
    setIsPlaying(true);
    setIsComplete(false);
    setCurrentStroke(0);
  };

  // 애니메이션 일시 정지 함수
  const pauseAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // 애니메이션 리셋 함수
  const resetAnimation = () => {
    setIsPlaying(false);
    setIsComplete(false);
    setCurrentStroke(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    clearCanvas();
  };

  // 속도 변경 함수
  const changeSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    // 필요한 경우 속도 조절 로직 추가
  };

  // 현재 획 변경 시 화면 업데이트
  useEffect(() => {
    drawStrokes(currentStroke);
  }, [currentStroke]);

  // 애니메이션 재생 상태 관리
  useEffect(() => {
    if (isPlaying && currentStroke < sampleStrokes.length) {
      const timer = setTimeout(() => {
        setCurrentStroke(prev => prev + 1);
        if (currentStroke === sampleStrokes.length - 1) {
          setIsPlaying(false);
          setIsComplete(true);
        }
      }, animationSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStroke, sampleStrokes.length, animationSpeed]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    clearCanvas();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="stroke-animation">
      <h3 className="text-lg font-semibold mb-2">필순 애니메이션: {character}</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-300 rounded"
        />
        {!strokes || strokes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-70">
            <p className="text-gray-700 mb-2">필순 데이터가 준비 중입니다</p>
            <p className="text-xs text-gray-500">실제 한자 필순을 표현하는 데이터가 곧 제공될 예정입니다</p>
          </div>
        ) : strokes.length < 2 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-70">
            <p className="text-gray-700 mb-2">정확한 필순 데이터가 아닙니다</p>
            <p className="text-xs text-gray-500">현재 임시 데이터로 표시하고 있습니다</p>
          </div>
        ) : null}
      </div>
      
      <div className="controls mt-3 flex gap-2">
        <button
          onClick={playAnimation}
          disabled={isPlaying || !strokes || strokes.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          재생
        </button>
        <button
          onClick={pauseAnimation}
          disabled={!isPlaying || !strokes || strokes.length === 0}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          일시정지
        </button>
        <button
          onClick={resetAnimation}
          disabled={!strokes || strokes.length === 0}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
        >
          다시하기
        </button>
      </div>
      
      <div className="speed-control mt-2">
        <label className="block text-sm mb-1">애니메이션 속도</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          defaultValue="1"
          disabled={!strokes || strokes.length === 0}
          onChange={changeSpeed}
          className="w-full"
        />
      </div>
      
      <div className="stroke-info mt-2">
        <p className="text-sm">현재 획: {currentStroke}/{sampleStrokes.length}</p>
      </div>
    </div>
  );
};

export default StrokeAnimation; 