'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stroke } from '@/types/hanja';

interface StrokePracticeProps {
  character: string;
  strokes?: Stroke[];
  width?: number;
  height?: number;
  strokeColor?: string;
  backgroundColor?: string;
  guideColor?: string;
}

const StrokePractice: React.FC<StrokePracticeProps> = ({
  character,
  strokes,
  width = 200,
  height = 200,
  strokeColor = '#000000',
  backgroundColor = '#ffffff',
  guideColor = '#dddddd',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [userPaths, setUserPaths] = useState<{ [key: number]: Array<[number, number]> }>({});
  const [score, setScore] = useState<number>(0);

  // 샘플 SVG 패스 데이터 (실제로는 DB에서 가져와야 함)
  const sampleStrokes: Stroke[] = strokes || [
    // 한자 '一'의 필순 (한 획)
    { path: 'M50,100 L150,100', order: 1 },
    
    // 한자 '人'의 필순 (두 획)
    // { path: 'M100,50 L60,150', order: 1 },
    // { path: 'M100,50 L140,150', order: 2 },
  ];

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

  // 가이드 획 그리기
  const drawGuideStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 가이드 획 스타일 설정
    context.strokeStyle = guideColor;
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // 현재 획의 가이드를 그림
    if (currentStroke < sampleStrokes.length) {
      const currentPath = sampleStrokes[currentStroke].path;
      const svgPath = new Path2D(currentPath);
      context.stroke(svgPath);
    }
  };

  // 사용자가 그린 획 그리기
  const drawUserStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 사용자 획 스타일 설정
    context.strokeStyle = strokeColor;
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // 이전에 그린 모든 획을 그림
    Object.keys(userPaths).forEach((strokeKey) => {
      const strokeNum = parseInt(strokeKey);
      if (strokeNum < currentStroke) {
        const points = userPaths[strokeNum];
        if (points.length > 1) {
          context.beginPath();
          context.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i][0], points[i][1]);
          }
          context.stroke();
        }
      }
    });

    // 현재 그리고 있는 획을 그림
    const currentPoints = userPaths[currentStroke];
    if (currentPoints && currentPoints.length > 1) {
      context.beginPath();
      context.moveTo(currentPoints[0][0], currentPoints[0][1]);
      for (let i = 1; i < currentPoints.length; i++) {
        context.lineTo(currentPoints[i][0], currentPoints[i][1]);
      }
      context.stroke();
    }
  };

  // 사용자 입력에 따라 캔버스 업데이트
  const updateCanvas = () => {
    clearCanvas();
    drawGuideStrokes();
    drawUserStrokes();
  };

  // 마우스 다운 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStroke >= sampleStrokes.length) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setUserPaths(prev => ({
      ...prev,
      [currentStroke]: [[x, y]]
    }));
  };

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setUserPaths(prev => {
      const currentPoints = [...(prev[currentStroke] || [])];
      currentPoints.push([x, y]);
      return {
        ...prev,
        [currentStroke]: currentPoints
      };
    });
  };

  // 마우스 업 이벤트 핸들러
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    evaluateStroke();
  };

  // 마우스 캔버스 이탈 이벤트 핸들러
  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      evaluateStroke();
    }
  };

  // 획 평가 함수 (간단한 구현)
  const evaluateStroke = () => {
    // 실제로는 더 복잡한 평가 로직이 필요
    // 여기서는 단순히 스트로크를 완료했다고 가정
    
    if (userPaths[currentStroke]?.length > 10) {
      // 마지막 획이면 완료 메시지 표시
      if (currentStroke === sampleStrokes.length - 1) {
        setFeedback('모든 획을 완성했습니다! 잘 했어요!');
        setScore(100); // 예시 점수
      } else {
        // 다음 획으로 이동
        setCurrentStroke(prev => prev + 1);
        setFeedback(`${currentStroke + 1}번째 획 완료! 다음 획을 그려보세요.`);
      }
    } else {
      setFeedback('획이 너무 짧습니다. 다시 시도해보세요.');
    }
  };

  // 다시 시작 함수
  const resetPractice = () => {
    setUserPaths({});
    setCurrentStroke(0);
    setFeedback('첫 번째 획을 따라 그려보세요.');
    setScore(0);
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    clearCanvas();
    drawGuideStrokes();
    setFeedback('첫 번째 획을 따라 그려보세요.');
  }, []);

  // 현재 획이 변경될 때마다 캔버스 업데이트
  useEffect(() => {
    updateCanvas();
  }, [currentStroke, userPaths]);

  return (
    <div className="stroke-practice">
      <h3 className="text-lg font-semibold mb-2">따라쓰기 연습: {character}</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={!strokes || strokes.length === 0 ? undefined : handleMouseDown}
          onMouseMove={!strokes || strokes.length === 0 ? undefined : handleMouseMove}
          onMouseUp={!strokes || strokes.length === 0 ? undefined : handleMouseUp}
          onMouseLeave={!strokes || strokes.length === 0 ? undefined : handleMouseLeave}
          className={`border border-gray-300 rounded ${strokes && strokes.length > 0 ? 'cursor-crosshair' : 'cursor-default'}`}
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
      
      <div className="feedback mt-2">
        <p className="text-sm">{feedback}</p>
        {currentStroke >= sampleStrokes.length && (
          <p className="text-sm font-semibold">점수: {score}/100</p>
        )}
      </div>
      
      <div className="controls mt-3">
        <button
          onClick={resetPractice}
          disabled={!strokes || strokes.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
        >
          다시 시작
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>* 획을 따라 그리며 필순을 연습해보세요.</p>
        <p>* 각 획을 그릴 때 가이드 선을 따라가세요.</p>
      </div>
    </div>
  );
};

export default StrokePractice; 