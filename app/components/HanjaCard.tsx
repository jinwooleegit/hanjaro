'use client';

import { memo } from 'react';
import Link from 'next/link';
import HanjaCharacter from './HanjaCharacter';

interface HanjaCardProps {
  character: string;
  meaning?: string;
  pronunciation?: string;
  level?: string;
  levelName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  category?: string;
  id?: string;
}

/**
 * 한자 카드 컴포넌트 - 한자와 관련 정보를 보여주는 카드
 */
const HanjaCard = memo(({
  character,
  meaning = '',
  pronunciation = '',
  level = '',
  levelName = '',
  size = 'md',
  className = '',
  onClick,
  category = 'basic',
  id,
}: HanjaCardProps) => {
  // 사이즈별 스타일 설정
  const sizeConfig = {
    sm: {
      card: 'p-3 max-w-[120px]',
      title: 'text-lg',
      subtitle: 'text-xs',
      hasDetails: false
    },
    md: {
      card: 'p-4 max-w-[180px]',
      title: 'text-xl',
      subtitle: 'text-sm',
      hasDetails: true
    },
    lg: {
      card: 'p-5 max-w-[240px]',
      title: 'text-2xl',
      subtitle: 'text-base',
      hasDetails: true
    }
  };
  
  const config = sizeConfig[size];
  
  const cardContent = (
    <div 
      className={`
        ${config.card}
        ${className}
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-sm hover:shadow-md
        transition-all duration-300
        flex flex-col items-center
        cursor-pointer
      `}
      onClick={onClick}
    >
      {/* 한자 문자 */}
      <div className="mb-2">
        <HanjaCharacter 
          character={character} 
          size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} 
          showBorder={false}
          clickable={false}
        />
      </div>
      
      {/* 한자 의미 */}
      {meaning && (
        <h3 className={`${config.title} font-bold text-gray-800 dark:text-gray-200 text-center`}>
          {meaning}
        </h3>
      )}
      
      {/* 한자 발음 */}
      {pronunciation && (
        <p className={`${config.subtitle} text-gray-600 dark:text-gray-400 text-center`}>
          {pronunciation}
        </p>
      )}
      
      {/* 레벨 정보 (중간 이상 사이즈에서만 표시) */}
      {config.hasDetails && levelName && (
        <div className="mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs text-blue-800 dark:text-blue-200">
          {levelName}
        </div>
      )}
    </div>
  );
  
  // 링크가 필요하고 onClick이 없는 경우에만 Link로 감싸기
  if (!onClick) {
    // ID가 있으면 ID 기반 경로 사용, 없으면 문자 자체를 ID로 사용
    const hanjaId = id || character;
    return (
      <Link href={`/hanja/${hanjaId}?category=${category}&level=${level || 'level1'}`}>
        {cardContent}
      </Link>
    );
  }
  
  return cardContent;
});

// 컴포넌트 디스플레이 이름 설정 (개발 디버깅용)
HanjaCard.displayName = 'HanjaCard';

export default HanjaCard; 