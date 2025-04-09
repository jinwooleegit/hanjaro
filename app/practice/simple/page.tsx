'use client';

import React, { useState } from 'react';
import SimpleHanziWriter from '../../components/SimpleHanziWriter';
import Link from 'next/link';

// 기본 한자 리스트 (가장 기본적인 한자들)
const basicHanjaList = ['一', '二', '三', '大', '中', '人', '口', '日', '月', '水'];

export default function SimpleHanjaPracticePage() {
  const [currentCharacter, setCurrentCharacter] = useState('一');
  const [showHint, setShowHint] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  // 다음 문자로 이동
  const handleNext = () => {
    const currentIndex = basicHanjaList.indexOf(currentCharacter);
    const nextIndex = (currentIndex + 1) % basicHanjaList.length;
    setCurrentCharacter(basicHanjaList[nextIndex]);
    setFeedback('');
  };
  
  // 이전 문자로 이동
  const handlePrev = () => {
    const currentIndex = basicHanjaList.indexOf(currentCharacter);
    const prevIndex = (currentIndex - 1 + basicHanjaList.length) % basicHanjaList.length;
    setCurrentCharacter(basicHanjaList[prevIndex]);
    setFeedback('');
  };
  
  // 애니메이션 모드와 퀴즈 모드 토글
  const toggleQuizMode = () => {
    setQuizMode(!quizMode);
    setFeedback('');
  };
  
  // 힌트 표시 토글
  const toggleHint = () => {
    setShowHint(!showHint);
  };
  
  // 퀴즈 완료 핸들러
  const handleQuizComplete = (success: boolean) => {
    setFeedback(success ? '잘했어요! 다음 문자로 넘어가세요.' : '다시 시도해보세요.');
  };
  
  // 사용자 정의 한자 검색
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentCharacter(searchTerm.trim().charAt(0));
      setSearchTerm('');
      setFeedback('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">한자 필기 연습 (간편 모드)</h1>
      
      <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-lg text-center">
        <p className="mb-2 font-medium">더 정확한 필순 애니메이션과 예시가 포함된 향상된 버전을 사용해 보세요!</p>
        <Link href="/practice/enhanced" className="text-blue-600 font-bold hover:underline">
          향상된 필순 연습 페이지로 이동하기 →
        </Link>
      </div>
      
      <div className="mb-8 text-center">
        <p className="text-gray-600 mb-2">
          이 페이지는 외부 라이브러리 없이 동작하는 가벼운 한자 연습 도구입니다.
        </p>
        <p className="text-gray-600">
          한자를 선택하고 획순에 따라 그려보세요.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            이전
          </button>
          
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-2">{currentCharacter}</h2>
            <p className="text-sm text-gray-500">
              {basicHanjaList.indexOf(currentCharacter) + 1} / {basicHanjaList.length}
            </p>
          </div>
          
          <button 
            onClick={handleNext}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            다음
          </button>
        </div>
        
        <div className="flex justify-center mb-6">
          <SimpleHanziWriter 
            character={currentCharacter}
            width={250}
            height={250}
            showOutline={true}
            showHint={showHint}
            quizMode={quizMode}
            onQuizComplete={handleQuizComplete}
            hideLeftCharacter={quizMode}
          />
        </div>
        
        {feedback && (
          <div className="mb-4 p-3 text-center rounded bg-blue-50 text-blue-800">
            {feedback}
          </div>
        )}
        
        <div className="flex justify-center space-x-3 mb-6">
          <button 
            onClick={toggleQuizMode}
            className={`px-4 py-2 rounded ${
              !quizMode 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {!quizMode ? '획순 보기' : '쓰기 연습'}
          </button>
          
          <button 
            onClick={toggleHint}
            className={`px-4 py-2 rounded ${
              showHint 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {showHint ? '힌트 끄기' : '힌트 켜기'}
          </button>
        </div>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="연습할 한자 입력"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            >
              검색
            </button>
          </div>
        </form>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {basicHanjaList.map((char) => (
            <button
              key={char}
              onClick={() => setCurrentCharacter(char)}
              className={`p-2 text-lg rounded ${
                currentCharacter === char
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link href="/practice" className="text-blue-500 hover:text-blue-700">
            기존 연습 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 