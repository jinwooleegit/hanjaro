'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './HanjaIcon.module.css';

interface HanjaIconProps {
  hanja: string;
  size?: number;
  className?: string;
}

export default function HanjaIcon({ hanja, size = 50, className = '' }: HanjaIconProps) {
  const [error, setError] = useState(false);
  
  // 아이콘 경로
  const iconPath = `/images/hanja/${hanja}.svg`;
  const defaultIcon = '/images/hanja/default.svg';

  // fallback 처리 함수
  const handleError = () => {
    console.warn(`한자 아이콘을 불러올 수 없습니다: ${hanja}`);
    setError(true);
  };

  return (
    <div 
      className={`${styles.hanjaIcon} ${className}`} 
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {error ? (
        // 오류 발생 시 기본 아이콘 또는 텍스트로 표시
        <>
          <Image
            src={defaultIcon}
            alt={`한자 ${hanja}`}
            width={size}
            height={size}
            onError={handleError}
          />
          <div className={styles.textOverlay}>{hanja}</div>
        </>
      ) : (
        // 실제 아이콘 표시 시도
        <Image
          src={iconPath}
          alt={`한자 ${hanja}`}
          width={size}
          height={size}
          onError={handleError}
        />
      )}
    </div>
  );
} 