'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getHanjaCharacter } from '@/utils/hanjaUtils';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(
  () => import('../components/HanziWriterComponent'),
  { ssr: false }
);

export default function PracticePage() {
  const searchParams = useSearchParams();
  const character = searchParams?.get('char') || '大';
  
  const hanjaData = getHanjaCharacter(character);
  const [quizMode, setQuizMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writerRef = useRef<any>(null);
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [strokeHelp, setStrokeHelp] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  // 연습 모드 시작
  const startPractice = () => {
    setQuizMode(true);
    setSuccess(false);
    setFeedback('');
    setAttempts(0);
    
    // 연습 모드 초기화를 위한 약간의 지연
    setTimeout(() => {
      initPracticeMode();
    }, 500);
  };
  
  // HanziWriter 연습 모드 초기화
  const initPracticeMode = () => {
    if (!canvasRef.current) return;
    
    // 이전 인스턴스 제거
    if (writerRef.current) {
      writerRef.current = null;
    }
    
    // 캔버스 요소는 두 번째 인자로 전달하지만 HanziWriter가 
    // canvas 요소를 자체 생성하는 것이 기본 동작이므로 대상 요소만 지정
    const writer = window.HanziWriter.create(canvasRef.current, character, {
      width: 300,
      height: 300,
      padding: 5,
      strokeAnimationSpeed: strokeSpeed,
      delayBetweenStrokes: 300,
      showOutline: true,
      highlightColor: strokeHelp ? '#3498db' : 'transparent',
      outlineColor: '#333',
      drawingColor: '#333',
      strokeColor: '#555',
      showHintAfterMisses: 3,
      quizStartStrokeNum: 0,
    });
    
    writerRef.current = writer;
    
    // 잠시 후 연습 모드 시작
    setTimeout(() => {
      writer.quiz({
        onMistake: (strokeData: any) => {
          setAttempts(prev => prev + 1);
          setFeedback('조금 더 정확하게 그려보세요.');
        },
        onCorrectStroke: (strokeData: any) => {
          setFeedback('정확합니다! 계속 진행하세요.');
        },
        onComplete: () => {
          setSuccess(true);
          setFeedback('축하합니다! 성공적으로 한자를 완성했습니다.');
        }
      });
    }, 1000);
  };
  
  // 도움말 표시 설정 변경
  const toggleStrokeHelp = () => {
    setStrokeHelp(!strokeHelp);
  };
  
  // 연습 모드 재시작
  const restartPractice = () => {
    startPractice();
  };
  
  if (!hanjaData) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">한자 연습</h1>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="mb-4">요청하신 한자를 찾을 수 없습니다.</p>
            <Link href="/learn" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              학습 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href={`/learn/hanja/${encodeURIComponent(character)}`} className="text-blue-500 hover:underline">
            &larr; 한자 정보로 돌아가기
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-center">한자 필기 연습</h1>
        <p className="text-center text-gray-600 mb-6">
          한자: {hanjaData.character} | 의미: {hanjaData.meaning} | 음: {hanjaData.pronunciation}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 애니메이션 또는 연습 영역 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">
                {quizMode ? '필기 연습 모드' : '획순 애니메이션'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {quizMode 
                  ? '마우스 또는 터치를 이용해 한자를 따라 써보세요.' 
                  : '먼저 획순 애니메이션을 보고 한자 쓰는 법을 익혀보세요.'}
              </p>
            </div>
            
            <div className="flex justify-center mb-4">
              {quizMode ? (
                <div>
                  <canvas 
                    ref={canvasRef} 
                    width="300" 
                    height="300" 
                    className="border border-gray-200 rounded-md"
                  ></canvas>
                  
                  {feedback && (
                    <div className={`mt-2 p-2 text-center rounded-md ${
                      success 
                        ? 'bg-green-100 text-green-800' 
                        : attempts > 5 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-50 text-blue-800'
                    }`}>
                      {feedback}
                    </div>
                  )}
                </div>
              ) : (
                <div className="hanzi-writer-container">
                  <HanziWriterComponent 
                    character={hanjaData.character}
                    width={300}
                    height={300}
                    delayBetweenStrokes={500}
                    strokeAnimationSpeed={1}
                    showCharacter={false}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              {quizMode ? (
                <div className="space-x-3">
                  <button
                    onClick={restartPractice}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    다시 시작
                  </button>
                  <button
                    onClick={() => setQuizMode(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  >
                    애니메이션 모드로
                  </button>
                </div>
              ) : (
                <button
                  onClick={startPractice}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  필기 연습 시작하기
                </button>
              )}
            </div>
          </div>
          
          {/* 오른쪽: 한자 정보 및 설정 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">한자 정보</h2>
            
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p><span className="font-medium">한자:</span> {hanjaData.character}</p>
                <p><span className="font-medium">의미:</span> {hanjaData.meaning}</p>
                <p><span className="font-medium">음:</span> {hanjaData.pronunciation}</p>
                <p><span className="font-medium">부수:</span> {hanjaData.radical}</p>
                <p><span className="font-medium">획수:</span> {hanjaData.stroke_count}획</p>
              </div>
              
              <h3 className="font-semibold mb-2">관련 한자어</h3>
              <ul className="bg-gray-50 p-3 rounded-md space-y-2">
                {hanjaData.examples.slice(0, 3).map((example, index) => (
                  <li key={index}>
                    <strong>{example.word}</strong>: {example.meaning} ({example.pronunciation})
                  </li>
                ))}
              </ul>
            </div>
            
            {quizMode && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">연습 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="strokeHelp" 
                      checked={strokeHelp}
                      onChange={toggleStrokeHelp}
                      className="mr-2"
                    />
                    <label htmlFor="strokeHelp">획 위치 힌트 표시</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">획 속도 조절</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.5" 
                      value={strokeSpeed}
                      onChange={(e) => setStrokeSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="text-center mt-4">
                    <button
                      onClick={restartPractice}
                      className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                    >
                      설정 적용 및 다시 시작
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">한자 필기 연습 팁</h3>
          <div className="bg-white rounded-xl shadow-md p-6">
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center mr-3">1</span>
                <span>획순을 정확하게 따라 써보세요. 한자는 획순이 매우 중요합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center mr-3">2</span>
                <span>획의 방향과 길이에 주의하며 필기하세요.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center mr-3">3</span>
                <span>충분히 연습한 후에 다음 한자로 넘어가세요.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-blue-500 text-white flex-shrink-0 flex items-center justify-center mr-3">4</span>
                <span>반복 학습이 한자 습득의 핵심입니다. 여러 번 연습해보세요.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 