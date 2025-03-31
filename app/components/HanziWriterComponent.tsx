'use client';

import { useRef, useEffect } from 'react';
import Script from 'next/script';

// 전역 Window 인터페이스 확장
declare global {
  interface Window {
    HanziWriter: any;
  }
}

interface HanziProps {
  character: string;
  width?: number;
  height?: number;
  delayBetweenStrokes?: number;
  strokeAnimationSpeed?: number;
  showOutline?: boolean;
  showCharacter?: boolean;
  highlightColor?: string;
  outlineColor?: string;
}

export default function HanziWriterComponent({
  character,
  width = 250,
  height = 250,
  delayBetweenStrokes = 500,
  strokeAnimationSpeed = 1,
  showOutline = true,
  showCharacter = false,
  highlightColor = '#ff0000',
  outlineColor = '#cccccc'
}: HanziProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const scriptLoadedRef = useRef<boolean>(false);

  // HanziWriter 초기화 함수
  const initializeWriter = () => {
    if (!containerRef.current || !window.HanziWriter) return;
    
    // 컨테이너를 비웁니다
    containerRef.current.innerHTML = '';

    // 설정 객체
    const options = {
      width,
      height,
      padding: 5,
      delayBetweenStrokes,
      strokeAnimationSpeed,
      showOutline,
      showCharacter,
      highlightColor,
      outlineColor,
      strokeColor: '#333333',
      charDataLoader: function(char: string, onComplete: (data: any) => void) {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`)
          .then(res => res.json())
          .then(data => onComplete(data))
          .catch(err => {
            console.error('한자 데이터 로드 오류:', err);
            onComplete(null);
          });
      }
    };

    try {
      // HanziWriter 인스턴스 생성
      writerRef.current = window.HanziWriter.create(containerRef.current, character, options);
      
      // 애니메이션 자동 시작
      writerRef.current.animateCharacter();
    } catch (error) {
      console.error('HanziWriter 초기화 오류:', error);
    }
  };

  // 스크립트 로드 완료 핸들러
  const handleScriptLoad = () => {
    scriptLoadedRef.current = true;
    initializeWriter();
  };

  // 컴포넌트 마운트/업데이트 시 실행
  useEffect(() => {
    // 이미 스크립트가 로드되었다면 바로 초기화
    if (scriptLoadedRef.current && window.HanziWriter) {
      initializeWriter();
    }

    return () => {
      // 컴포넌트 언마운트 시 정리 작업
      writerRef.current = null;
    };
  }, [character, width, height, delayBetweenStrokes, strokeAnimationSpeed, showOutline, showCharacter, highlightColor, outlineColor]);

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="hanzi-writer-container" style={{ margin: '0 auto', width: `${width}px`, height: `${height}px` }} />
    </>
  );
} 