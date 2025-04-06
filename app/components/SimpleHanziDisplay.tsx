'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SimpleHanziDisplayProps {
  character: string;
  width?: number;
  height?: number;
  fontSize?: number;
  showOutline?: boolean;
  showAnimation?: boolean;
  strokeColor?: string;
  animationSpeed?: number;
  onComplete?: () => void;
}

export default function SimpleHanziDisplay({
  character,
  width = 200,
  height = 200,
  fontSize = 150,
  showOutline = true,
  showAnimation = true,
  strokeColor = '#333333',
  animationSpeed = 1000,
  onComplete
}: SimpleHanziDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 한자 획수 데이터 (주요 한자)
  const strokeCountData: Record<string, number> = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 2,
    '人': 2, '大': 3, '中': 4, '小': 3, '上': 3,
    '下': 3, '山': 3, '川': 3, '水': 4, '火': 4,
    '木': 4, '土': 3, '金': 8, '石': 5, '日': 4,
    '月': 4, '年': 6, '時': 10, '分': 4, '口': 3,
    '目': 5, '耳': 6, '手': 4, '足': 7, '心': 4,
    '思': 9, '言': 7, '語': 14, '文': 4, '字': 6,
    '男': 7, '女': 3, '子': 3, '母': 5, '父': 4,
    '友': 4, '学': 8, '校': 10, '先': 6, '生': 5,
    '路': 16
  };

  // 한자 획수 가져오기
  useEffect(() => {
    // 기본 획수 데이터에서 찾기
    const strokes = strokeCountData[character] || 0;
    setStrokeCount(strokes);

    // 획수 정보가 없으면 API에서 가져오기 시도
    if (strokes === 0) {
      const fetchStrokeCount = async () => {
        try {
          const response = await fetch(`/api/hanja?character=${character}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].strokeCount) {
              setStrokeCount(data[0].strokeCount);
            }
          }
        } catch (error) {
          console.error("한자 획수 데이터 로드 실패:", error);
        }
      };

      fetchStrokeCount();
    }

    setIsLoaded(true);
  }, [character]);

  // 애니메이션 효과
  useEffect(() => {
    if (!isLoaded || !showAnimation || strokeCount === 0) return;

    const startAnimation = () => {
      setIsAnimating(true);
      
      // 애니메이션 완료 후 콜백 실행
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }, animationSpeed);
      
      return () => clearTimeout(timeout);
    };

    startAnimation();
  }, [isLoaded, showAnimation, strokeCount, animationSpeed, onComplete]);

  return (
    <div ref={containerRef} 
      className="relative flex items-center justify-center overflow-hidden"
      style={{ 
        width: width, 
        height: height, 
        border: showOutline ? '1px solid #ddd' : 'none',
        borderRadius: '4px',
        background: '#fff'
      }}
    >
      {/* 한자 표시 */}
      <div 
        className={`text-center transition-opacity ${isAnimating ? 'animate-pulse' : ''}`}
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          color: strokeColor,
          fontFamily: "'Noto Sans TC', 'Noto Sans SC', sans-serif"
        }}
      >
        {character}
      </div>
      
      {/* 획수 표시 */}
      {strokeCount > 0 && (
        <div className="absolute bottom-1 right-1 text-xs text-gray-500">
          {strokeCount}획
        </div>
      )}
    </div>
  );
} 