import React from 'react';
import { Hanja } from '@/data/types';

interface HanjaStrokeSequenceProps {
  hanja: Hanja;
  size?: number;
  gridColumns?: number;
}

const HanjaStrokeSequence: React.FC<HanjaStrokeSequenceProps> = ({
  hanja,
  size = 100,
  gridColumns = 5
}) => {
  const strokePaths = hanja.strokePaths || [];
  const totalStrokes = strokePaths.length;

  // 모든 단계를 표시하기 위한 배열 생성
  // 각 단계는 이전 단계의 획들을 모두 포함하고 현재 획을 추가합니다
  const strokeSequences = Array.from({ length: totalStrokes }, (_, index) => {
    return strokePaths.slice(0, index + 1);
  });

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">필순보기 {totalStrokes}획</h3>
      
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          width: `${(size + 20) * gridColumns}px`
        }}
      >
        {strokeSequences.map((sequence, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center"
          >
            <div className="relative" style={{ width: size, height: size }}>
              {/* SVG 애니메이션 */}
              <svg
                className="w-full h-full border border-gray-200 rounded-md bg-white"
                viewBox="0 0 100 100"
              >
                {sequence.map((stroke, strokeIndex) => (
                  <path
                    key={strokeIndex}
                    d={stroke.path}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fill-transparent stroke-primary stroke-2"
                  />
                ))}
              </svg>
              
              {/* 획 번호 표시 */}
              <div className="absolute bottom-1 right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HanjaStrokeSequence; 