'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stroke } from '@/types/hanja';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedStrokePracticeProps {
  character: string;
  strokes?: Stroke[];
  width?: number;
  height?: number;
  strokeColor?: string;
  backgroundColor?: string;
  guideColor?: string;
  onComplete?: (score: number) => void;
  onProgress?: (progress: number) => void;
}

const EnhancedStrokePractice: React.FC<EnhancedStrokePracticeProps> = ({
  character,
  strokes,
  width = 300,
  height = 300,
  strokeColor = '#000000',
  backgroundColor = '#ffffff',
  guideColor = '#dddddd',
  onComplete,
  onProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('첫 번째 획을 따라 그려보세요.');
  const [userPaths, setUserPaths] = useState<{ [key: number]: Array<[number, number]> }>({});
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [animateHint, setAnimateHint] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [practiceMode, setPracticeMode] = useState<'guided' | 'free'>('guided');

  // 샘플 SVG 패스 데이터 (실제로는 strokes prop에서 가져옴)
  const sampleStrokes: Stroke[] = strokes || [
    // 한자 '一'의 필순 (한 획)
    { path: 'M50,150 L250,150', order: 1 },
  ];

  // 캔버스 초기화
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [backgroundColor]);

  // 모든 가이드 획 그리기 (배경)
  const drawAllGuideStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 모든 가이드 획 스타일 설정 (더 연한 색상)
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // 모든 획의 가이드를 그림
    sampleStrokes.forEach(stroke => {
      const svgPath = new Path2D(stroke.path);
      context.stroke(svgPath);
    });
  }, [sampleStrokes]);

  // 현재 가이드 획 그리기
  const drawCurrentGuideStroke = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    if (currentStroke < sampleStrokes.length) {
      // 현재 가이드 획 스타일 설정
      context.strokeStyle = guideColor;
      context.lineWidth = 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      // 현재 획의 가이드를 그림
      const currentPath = sampleStrokes[currentStroke].path;
      const svgPath = new Path2D(currentPath);
      context.stroke(svgPath);
    }
  }, [currentStroke, guideColor, sampleStrokes]);

  // 힌트 애니메이션 그리기
  const drawHintAnimation = useCallback(() => {
    if (!animateHint || currentStroke >= sampleStrokes.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 애니메이션 획 스타일 설정
    context.strokeStyle = 'rgba(255, 0, 0, 0.7)';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // SVG 패스를 점으로 변환 (간단한 구현 - 실제로는 더 정교한 알고리즘 필요)
    const currentPath = sampleStrokes[currentStroke].path;
    const points = parsePathToPoints(currentPath, 30); // 30개 점으로 분할

    // 애니메이션 구현
    let currentPointIndex = 0;
    const animationInterval = setInterval(() => {
      if (currentPointIndex >= points.length - 1) {
        clearInterval(animationInterval);
        setAnimateHint(false);
        return;
      }

      // 점 사이에 선 그리기
      context.beginPath();
      context.moveTo(points[currentPointIndex][0], points[currentPointIndex][1]);
      context.lineTo(points[currentPointIndex + 1][0], points[currentPointIndex + 1][1]);
      context.stroke();

      currentPointIndex++;
    }, 50);

    return () => clearInterval(animationInterval);
  }, [animateHint, currentStroke, sampleStrokes]);

  // SVG 패스를 점 배열로 변환하는 간단한 함수
  const parsePathToPoints = (path: string, numPoints: number): Array<[number, number]> => {
    // 예: "M50,100 L150,100" -> [[50,100], [점들...], [150,100]]
    // 간단한 직선 패스 파싱 (실제로는 더 복잡한 SVG 패스 파서가 필요)
    const parts = path.split(' ');
    if (parts.length < 2) return [[0, 0]];

    const startPart = parts[0].substring(1).split(',');
    const endPart = parts[1].substring(1).split(',');

    const startX = parseFloat(startPart[0]);
    const startY = parseFloat(startPart[1]);
    const endX = parseFloat(endPart[0]);
    const endY = parseFloat(endPart[1]);

    const points: Array<[number, number]> = [];
    for (let i = 0; i < numPoints; i++) {
      const ratio = i / (numPoints - 1);
      const x = startX + (endX - startX) * ratio;
      const y = startY + (endY - startY) * ratio;
      points.push([x, y]);
    }

    return points;
  };

  // 사용자가 그린 획 그리기
  const drawUserStrokes = useCallback(() => {
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
  }, [strokeColor, userPaths, currentStroke]);

  // 사용자 입력에 따라 캔버스 업데이트
  const updateCanvas = useCallback(() => {
    clearCanvas();
    
    if (practiceMode === 'guided') {
      drawAllGuideStrokes();
      drawCurrentGuideStroke();
    }
    
    drawUserStrokes();
  }, [clearCanvas, drawAllGuideStrokes, drawCurrentGuideStroke, drawUserStrokes, practiceMode]);

  // 컴포넌트 마운트/업데이트 시 캔버스 업데이트
  useEffect(() => {
    updateCanvas();
  }, [updateCanvas]);

  // 힌트 애니메이션 효과
  useEffect(() => {
    if (showHint) {
      setAnimateHint(true);
      const timeoutId = setTimeout(() => {
        setShowHint(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showHint]);

  // 힌트 애니메이션 그리기
  useEffect(() => {
    if (animateHint) {
      updateCanvas(); // 캔버스 초기화
      const cleanup = drawHintAnimation();
      return cleanup;
    }
  }, [animateHint, drawHintAnimation, updateCanvas]);

  // 마우스/터치 이벤트 핸들러
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (currentStroke >= sampleStrokes.length || completed) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setUserPaths(prev => ({
      ...prev,
      [currentStroke]: [[x, y]]
    }));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || completed) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setUserPaths(prev => {
      const currentPoints = [...(prev[currentStroke] || [])];
      currentPoints.push([x, y]);
      return {
        ...prev,
        [currentStroke]: currentPoints
      };
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing || completed) return;
    
    setIsDrawing(false);
    evaluateStroke();
  };

  const handlePointerLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      evaluateStroke();
    }
  };

  // 획 평가 함수
  const evaluateStroke = () => {
    const userStroke = userPaths[currentStroke];
    if (!userStroke || userStroke.length < 10) {
      setFeedback('획이 너무 짧습니다. 다시 시도해보세요.');
      return;
    }

    // 현재 획의 정확도 계산 (간단한 구현 - 실제로는 더 정교한 알고리즘 필요)
    const currentAccuracy = calculateAccuracy(userStroke, sampleStrokes[currentStroke].path);
    const newAccuracy = [...accuracy, currentAccuracy];
    setAccuracy(newAccuracy);

    // 정확도에 기반한 피드백
    let feedbackMsg = '';
    if (currentAccuracy >= 90) {
      feedbackMsg = '완벽해요! 정확하게 그렸습니다.';
    } else if (currentAccuracy >= 70) {
      feedbackMsg = '좋아요! 거의 정확합니다.';
    } else if (currentAccuracy >= 50) {
      feedbackMsg = '괜찮아요. 조금만 더 주의해서 그려보세요.';
    } else {
      feedbackMsg = '다시 시도해보세요. 획의 방향과 길이에 주의하세요.';
    }

    // 마지막 획인 경우
    if (currentStroke === sampleStrokes.length - 1) {
      // 전체 점수 계산
      const totalScore = Math.round(newAccuracy.reduce((sum, acc) => sum + acc, 0) / newAccuracy.length);
      setScore(totalScore);
      setFeedback(`완성했습니다! 총점: ${totalScore}점`);
      setCompleted(true);
      
      // 콜백 호출
      onComplete?.(totalScore);
    } else {
      // 다음 획으로 이동
      setCurrentStroke(prev => {
        const next = prev + 1;
        // 진행도 콜백
        const progress = (next / sampleStrokes.length) * 100;
        onProgress?.(progress);
        
        setFeedback(`${feedbackMsg} ${next + 1}번째 획을 그려보세요.`);
        return next;
      });
    }
  };

  // 획 정확도 계산 함수 (간단한 구현)
  const calculateAccuracy = (userStroke: Array<[number, number]>, samplePath: string): number => {
    // 실제로는 더 정교한 알고리즘을 사용해야 함
    // 이 예제에서는 임의의 점수를 반환
    return Math.floor(Math.random() * 30) + 70; // 70-100 사이의 임의 점수
  };

  // 연습 재시작
  const resetPractice = () => {
    setCurrentStroke(0);
    setUserPaths({});
    setAccuracy([]);
    setScore(0);
    setFeedback('첫 번째 획을 따라 그려보세요.');
    setCompleted(false);
    updateCanvas();
  };

  // 힌트 보기
  const showHintAnimation = () => {
    if (!showHint && !animateHint) {
      setShowHint(true);
    }
  };

  // 연습 모드 변경
  const togglePracticeMode = () => {
    setPracticeMode(prev => prev === 'guided' ? 'free' : 'guided');
    resetPractice();
  };

  return (
    <div className="enhanced-stroke-practice w-full max-w-lg mx-auto">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-300 rounded-lg shadow-sm mx-auto bg-white touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          style={{ touchAction: 'none' }}
        />
        
        {/* 진행 상태 표시 */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded text-sm font-medium">
          {currentStroke + 1} / {sampleStrokes.length}
        </div>
      </div>

      {/* 피드백 메시지 */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={feedback}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4 p-3 bg-blue-50 rounded-lg text-center"
        >
          {feedback}
        </motion.div>
      </AnimatePresence>

      {/* 컨트롤 버튼 */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={resetPractice}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors text-sm"
        >
          다시 쓰기
        </button>
        <button
          onClick={showHintAnimation}
          disabled={animateHint || completed}
          className={`px-4 py-2 ${animateHint ? 'bg-gray-100 text-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'} rounded-md transition-colors text-sm`}
        >
          힌트 보기
        </button>
        <button
          onClick={togglePracticeMode}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors text-sm"
        >
          {practiceMode === 'guided' ? '자유 연습 모드' : '가이드 연습 모드'}
        </button>
      </div>

      {/* 완료 시 점수 및 재시작 버튼 */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
        >
          <h3 className="text-xl font-bold mb-2">연습 완료!</h3>
          <p className="text-lg mb-4">점수: <span className="font-bold text-green-600">{score}점</span></p>
          <button
            onClick={resetPractice}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            다시 연습하기
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedStrokePractice; 