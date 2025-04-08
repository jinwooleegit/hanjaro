'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';

interface HanjaCharacterProps {
  character: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  clickable?: boolean;
  className?: string;
  animateStroke?: boolean;
  onClick?: () => void;
}

/**
 * 한자 문자를 표시하는 최적화된 컴포넌트
 */
const HanjaCharacter = memo(({
  character,
  size = 'md',
  showBorder = true,
  clickable = true,
  className = '',
  animateStroke = false,
  onClick
}: HanjaCharacterProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 사이즈별 스타일 클래스
  const sizeClasses = {
    sm: 'text-2xl min-w-10 min-h-10 p-1',
    md: 'text-3xl min-w-14 min-h-14 p-2',
    lg: 'text-4xl min-w-20 min-h-20 p-3',
    xl: 'text-5xl min-w-24 min-h-24 p-3'
  };
  
  // 테두리 스타일
  const borderClass = showBorder 
    ? 'border-2 border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600' 
    : '';
  
  // 애니메이션 효과
  const animationClass = animateStroke
    ? 'animate-stroke-appear'
    : 'hover:scale-105 transition-transform';
  
  // 클릭 가능 여부에 따른 스타일
  const hoverClass = clickable
    ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800'
    : '';
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const renderContent = () => (
    <div 
      className={`
        ${sizeClasses[size]}
        ${borderClass}
        ${animationClass}
        ${hoverClass}
        ${className}
        flex items-center justify-center rounded-lg
        bg-white dark:bg-gray-900
        transition-all duration-300
      `}
      onClick={onClick}
    >
      {/* 한자 로딩 애니메이션 */}
      <div className={`
        font-hanja
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300
      `}>
        {character}
      </div>
    </div>
  );
  
  // 클릭 가능한 경우 Link로 감싸기
  if (clickable && !onClick) {
    return (
      <Link href={`/learn/character/${character}`}>
        {renderContent()}
      </Link>
    );
  }
  
  // 그 외의 경우 일반 div 반환
  return renderContent();
});

// 컴포넌트 디스플레이 이름 설정 (개발 디버깅용)
HanjaCharacter.displayName = 'HanjaCharacter';

export default HanjaCharacter; 