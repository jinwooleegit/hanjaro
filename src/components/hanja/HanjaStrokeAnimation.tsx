import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hanja, StrokePath } from '@/data/types';

interface HanjaStrokeAnimationProps {
  hanja: Hanja;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
  showBackground?: boolean;
}

const HanjaStrokeAnimation: React.FC<HanjaStrokeAnimationProps> = ({
  hanja,
  size = 200,
  loop = false,
  autoPlay = true,
  showBackground = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  const strokePaths = hanja.strokePaths || [];

  useEffect(() => {
    if (!isPlaying) return;

    let timeouts: NodeJS.Timeout[] = [];
    
    // 애니메이션 시작
    setCurrentStrokeIndex(-1);
    setIsCompleted(false);
    
    // 각 획마다 순차적으로 보여주기
    strokePaths.forEach((stroke, index) => {
      const delay = parseFloat(stroke.animationDelay || '0') * 1000;
      
      const timeout = setTimeout(() => {
        setCurrentStrokeIndex(index);
        
        // 마지막 획이 완성되면 애니메이션 완료 상태로 설정
        if (index === strokePaths.length - 1) {
          setTimeout(() => {
            setIsCompleted(true);
            
            // 반복 설정이 되어 있으면 1.5초 후 다시 시작
            if (loop) {
              setTimeout(() => {
                setIsPlaying(true);
              }, 1500);
            } else {
              setIsPlaying(false);
            }
          }, 1000); // 마지막 획 애니메이션이 완료되는데 필요한 대략적인 시간
        }
      }, delay);
      
      timeouts.push(timeout);
    });
    
    return () => {
      // 컴포넌트가 언마운트되거나 isPlaying이 변경될 때 타임아웃 정리
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isPlaying, loop, strokePaths]);

  // 애니메이션 재생/일시정지 토글
  const togglePlay = () => {
    if (isCompleted) {
      // 완료된 상태에서는 처음부터 다시 시작
      setIsPlaying(true);
    } else {
      // 아직 진행 중이면 일시정지/재생 토글
      setIsPlaying(!isPlaying);
    }
  };

  // 처음부터 다시 시작
  const restart = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 배경 한자 (흐릿하게 표시) */}
      {showBackground && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-6xl">{hanja.character}</span>
        </div>
      )}
      
      {/* SVG 애니메이션 */}
      <svg
        className="w-full h-full stroke-animation"
        viewBox="0 0 100 100"
        style={{ backgroundColor: showBackground ? 'transparent' : 'white' }}
      >
        {strokePaths.map((stroke, index) => (
          <motion.path
            key={index}
            d={stroke.path}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: currentStrokeIndex >= index ? 1 : 0 
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
            className="fill-transparent stroke-primary stroke-2"
          />
        ))}
      </svg>
      
      {/* 컨트롤 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
        <button
          onClick={togglePlay}
          className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={restart}
          className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="다시 시작"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HanjaStrokeAnimation; 