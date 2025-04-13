'use client';

import React, { useRef, useState, useEffect } from 'react';
import Script from 'next/script';
import { HanjaCharacter } from './types';
import SimpleHanziWriter from '@/app/components/SimpleHanziWriter';

interface WritingPracticeProps {
  character: string;
  strokeCount: number;
}

// 통합된 필기연습 컴포넌트
export function WritingPractice({ character, strokeCount }: WritingPracticeProps) {
  const [feedback, setFeedback] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [quizMode, setQuizMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [writerReady, setWriterReady] = useState(false);
  const writerRef = useRef<HTMLDivElement>(null);

  // writer 인스턴스 접근 함수
  const getWriter = () => {
    if (typeof window === 'undefined') return null;
    return window.HanziWriterInstance || null;
  };

  // writer 준비 상태 체크
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (window.HanziWriterInstance) {
        setWriterReady(true);
        clearInterval(checkInterval);
      }
    }, 200);
    
    // 5초 후 타임아웃
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!writerReady) {
        console.warn('한자 인스턴스 대기 시간 초과');
      }
    }, 5000);
    
    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  // HanziWriter 퀴즈 완료 핸들러
  const handleQuizComplete = (success: boolean) => {
    setAttempts(prev => prev + 1);
    setQuizMode(false);
    
    if (success) {
      setFeedback('잘 쓰셨습니다! 👍');
    } else {
      setFeedback('다시 시도해보세요');
    }
  };

  // 애니메이션 속도 변경 핸들러
  const handleSpeedChange = (newSpeed: number) => {
    setAnimationSpeed(newSpeed);
    // 속도 조절은 현재 구현에서는 지원되지 않음
  };

  // 애니메이션 재생
  const playAnimation = () => {
    if (!writerReady) return;
    
    setIsPlaying(true);
    setQuizMode(false);
    setFeedback('');
    
    const writer = getWriter();
    if (writer) {
      try {
        // 필요시 퀴즈 취소
        if (writer.quiz && writer.quiz.isActive && typeof writer.quiz.isActive === 'function' && writer.quiz.isActive()) {
          if (typeof writer.quiz.cancel === 'function') {
            writer.quiz.cancel();
          }
        }
        
        if (typeof writer.animateCharacter === 'function') {
          writer.animateCharacter({
            onComplete: () => {
              setIsPlaying(false);
            }
          });
        } else {
          console.warn('animateCharacter 메서드가 함수가 아닙니다');
          setIsPlaying(false);
          setFeedback('애니메이션을 재생할 수 없습니다');
        }
      } catch (e) {
        console.error('애니메이션 재생 오류:', e);
        setIsPlaying(false);
        setFeedback('애니메이션 재생 실패');
      }
    } else {
      setIsPlaying(false);
      setFeedback('한자 렌더링 인스턴스를 찾을 수 없습니다');
    }
  };

  // 애니메이션 재설정
  const resetAnimation = () => {
    if (!writerReady) return;
    
    setIsPlaying(false);
    setQuizMode(false);
    setFeedback('');
    
    const writer = getWriter();
    if (writer) {
      try {
        // 애니메이션 취소
        if (writer.cancelAnimation && typeof writer.cancelAnimation === 'function') {
          writer.cancelAnimation();
        }
        
        // 퀴즈 취소
        if (writer.quiz && writer.quiz.isActive && typeof writer.quiz.isActive === 'function' && writer.quiz.isActive()) {
          if (typeof writer.quiz.cancel === 'function') {
            writer.quiz.cancel();
          }
        }
        
        // 한자 시각화 리셋
        if (writer.setCharacter && typeof writer.setCharacter === 'function') {
          writer.setCharacter(character);
        } else {
          console.warn('setCharacter 메서드가 함수가 아닙니다');
        }
      } catch (e) {
        console.error('재설정 오류:', e);
        setFeedback('재설정 실패');
      }
    } else {
      setFeedback('한자 렌더링 인스턴스를 찾을 수 없습니다');
    }
  };

  // 필기 연습 모드 시작
  const startQuizMode = () => {
    if (!writerReady) return;
    
    setQuizMode(true);
    setIsPlaying(false);
    setFeedback('');
    
    const writer = getWriter();
    
    if (writer) {
      try {
        // 애니메이션 취소
        if (writer.cancelAnimation && typeof writer.cancelAnimation === 'function') {
          writer.cancelAnimation();
        }
        
        // quiz 메서드가 함수인지 확인
        if (writer.quiz && typeof writer.quiz === 'function') {
          setTimeout(() => {
            try {
              const quizInstance = writer.quiz({
                onComplete: (summary: any) => {
                  const success = true; // 항상 성공으로 처리
                  handleQuizComplete(success);
                }
              });
              
              // 인스턴스 저장 (없을 경우 추가)
              if (!writer.quizInstance) {
                writer.quizInstance = quizInstance;
              }
            } catch (e) {
              console.error('퀴즈 모드 시작 오류:', e);
              setFeedback('퀴즈 모드 초기화 실패');
              setQuizMode(false);
            }
          }, 100);
        } else {
          console.warn('quiz 메서드가 함수가 아닙니다');
          setFeedback('퀴즈 모드를 시작할 수 없습니다');
          setQuizMode(false);
        }
      } catch (e) {
        console.error('퀴즈 모드 초기화 오류:', e);
        setFeedback('퀴즈 모드 초기화 실패');
        setQuizMode(false);
      }
    }
  };

  // 자동완성
  const autoComplete = () => {
    if (!writerReady) return;
    
    const writer = getWriter();
    
    try {
      // 퀴즈 인스턴스 또는 quiz 객체에 접근
      const quizObj = writer?.quizInstance || (writer?.quiz?.isActive ? writer.quiz : null);
      
      if (quizMode && quizObj && typeof quizObj.giveUp === 'function') {
        quizObj.giveUp();
        setFeedback('정답이 표시됩니다');
        setQuizMode(false);
      } else {
        console.warn('giveUp 메서드를 찾을 수 없습니다');
        setFeedback('자동완성할 수 없습니다');
      }
    } catch (e) {
      console.error('자동완성 오류:', e);
      setFeedback('자동완성 실패');
    }
  };

  return (
    <div className="writing-practice-container mt-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100">
      <div className="practice-header mb-4">
        <h3 className="text-xl font-bold text-blue-700 mb-2">한자 필기 연습</h3>
        <p className="text-gray-600 text-sm mb-3">
          {isPlaying ? '획순을 보고 있습니다...' : '아래 영역에서 한자를 직접 써보세요.'}
        </p>
        <div className="character-info flex items-center gap-3 mb-2">
          <span className="stroke-count bg-gray-100 px-2 py-1 rounded text-sm">{strokeCount}획</span>
          <span className="character-display text-2xl font-bold">{character}</span>
        </div>
      </div>
      
      <div className="canvas-wrapper border rounded-lg p-2 bg-gray-50" ref={writerRef}>
        <SimpleHanziWriter
          character={character}
          width={300}
          height={300}
          strokeColor="#333"
          outlineColor="#ddd"
          highlightColor="#07F"
          showOutline={true}
          showHint={quizMode}
          quizMode={quizMode}
          onQuizComplete={handleQuizComplete}
          hideLeftCharacter={quizMode}
        />
      </div>
      
      <div className="practice-controls mt-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <button 
            onClick={playAnimation} 
            className={`px-3 py-1 rounded text-white ${isPlaying ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} ${quizMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPlaying || quizMode || !writerReady}
          >
            {isPlaying ? '재생 중...' : '획순 보기'}
          </button>
          
          <button 
            onClick={startQuizMode} 
            className={`px-3 py-1 rounded text-white ${quizMode ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPlaying || quizMode || !writerReady}
          >
            필기 연습
          </button>
          
          <button 
            onClick={resetAnimation} 
            className={`px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 ${!writerReady ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!writerReady}
          >
            초기화
          </button>
          
          {quizMode && (
            <button 
              onClick={autoComplete} 
              className={`px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800 ${!writerReady ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!writerReady}
            >
              자동완성
            </button>
          )}
        </div>
        
        {feedback && (
          <div className={`p-2 rounded ${feedback.includes('잘') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} mb-3`}>
            {feedback}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm">속도:</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.5"
            value={animationSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-24"
            disabled={quizMode || !writerReady}
          />
          <span className="text-sm">{animationSpeed}x</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientComponents({ hanjaData }: { hanjaData: HanjaCharacter }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-4">
        <WritingPractice
          character={hanjaData.character}
          strokeCount={hanjaData.stroke_count}
        />
      </div>
    </div>
  );
}