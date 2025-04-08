'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 한자 데이터 (예시)
const hanjaData = [
  { 
    character: '人', 
    meaning: '사람 인', 
    korean: '사람',
    related_words: ['인간(人間)', '인류(人類)', '인생(人生)'],
    stroke_count: 2
  },
  { 
    character: '永', 
    meaning: '영원할 영', 
    korean: '영원',
    related_words: ['영원(永遠)', '영구(永久)', '영속(永續)'],
    stroke_count: 5
  },
  { 
    character: '水', 
    meaning: '물 수', 
    korean: '물',
    related_words: ['수분(水分)', '수정(水晶)', '수영(水泳)'],
    stroke_count: 4
  },
  { 
    character: '火', 
    meaning: '불 화', 
    korean: '불',
    related_words: ['화재(火災)', '화력(火力)', '화상(火傷)'],
    stroke_count: 4
  },
  { 
    character: '山', 
    meaning: '산 산', 
    korean: '산',
    related_words: ['산악(山岳)', '산맥(山脈)', '등산(登山)'],
    stroke_count: 3
  },
  { 
    character: '木', 
    meaning: '나무 목', 
    korean: '나무',
    related_words: ['목재(木材)', '목공(木工)', '수목(樹木)'],
    stroke_count: 4
  },
  { 
    character: '日', 
    meaning: '날 일', 
    korean: '날',
    related_words: ['일요일(日曜日)', '일출(日出)', '일식(日食)'],
    stroke_count: 4
  },
];

// 퀴즈 타입 정의
type QuizType = 'meaning' | 'character' | 'stroke';

// 퀴즈 문제 생성 함수
const generateQuiz = (type: QuizType, data: typeof hanjaData) => {
  // 문제 수
  const questionCount = 5;
  const questions = [];
  
  // 사용할 한자 랜덤 선택 (중복 없이)
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, questionCount);
  
  for (let i = 0; i < questionCount; i++) {
    const correctHanja = selected[i];
    
    // 보기 생성 (정답 + 3개 오답)
    let options = [correctHanja];
    let otherOptions = shuffled.filter(h => h.character !== correctHanja.character);
    otherOptions = otherOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    options = [...options, ...otherOptions].sort(() => 0.5 - Math.random());
    
    let question = {
      id: i,
      type,
      options,
      correctAnswer: correctHanja.character,
    };
    
    questions.push(question);
  }
  
  return questions;
};

export default function QuizPage() {
  const [quizType, setQuizType] = useState<QuizType>('meaning');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // 퀴즈 시작
  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    setQuestions(generateQuiz(type, hanjaData));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setQuizStarted(true);
    setQuizFinished(false);
    setShowResult(false);
  };
  
  // 정답 제출
  const submitAnswer = () => {
    if (selectedAnswer === '') return;
    
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };
  
  // 다음 문제로 이동
  const nextQuestion = () => {
    setSelectedAnswer('');
    setShowResult(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };
  
  // 퀴즈 다시 시작
  const restartQuiz = () => {
    startQuiz(quizType);
  };
  
  return (
    <div className="container mx-auto pt-12 px-4 pb-16">
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">한자 퀴즈</h1>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link href="/learn">
              <button className="btn-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                학습하기
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                대시보드
              </button>
            </Link>
          </div>
        </div>
        
        {!quizStarted && !quizFinished && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">퀴즈 유형 선택</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                풀고 싶은 퀴즈 유형을 선택하세요. 각 퀴즈는 5문제로 구성되어 있습니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className="card-highlight rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => startQuiz('meaning')}
                >
                  <div className="p-6">
                    <div className="text-5xl mb-4 font-serif text-center text-blue-800 dark:text-blue-300">漢 ?</div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">한자 의미 맞추기</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      한자를 보고 해당 한자의 뜻을 맞추는 퀴즈입니다.
                    </p>
                  </div>
                  <div className="bg-blue-500 text-white py-2 px-4 text-center font-medium">
                    시작하기
                  </div>
                </div>
                
                <div 
                  className="card-highlight rounded-xl overflow-hidden border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => startQuiz('character')}
                >
                  <div className="p-6">
                    <div className="text-5xl mb-4 font-serif text-center text-purple-800 dark:text-purple-300">? 水</div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">한자 맞추기</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      한자의 뜻을 보고 해당하는 한자를 맞추는 퀴즈입니다.
                    </p>
                  </div>
                  <div className="bg-purple-500 text-white py-2 px-4 text-center font-medium">
                    시작하기
                  </div>
                </div>
                
                <div 
                  className="card-highlight rounded-xl overflow-hidden border border-green-100 dark:border-green-900 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => startQuiz('stroke')}
                >
                  <div className="p-6">
                    <div className="text-5xl mb-4 font-serif text-center text-green-800 dark:text-green-300">一 二 ?</div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">획수 맞추기</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      한자를 보고 해당 한자의 총 획수를 맞추는 퀴즈입니다.
                    </p>
                  </div>
                  <div className="bg-green-500 text-white py-2 px-4 text-center font-medium">
                    시작하기
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {quizStarted && !quizFinished && questions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 py-3 px-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  문제 {currentQuestion + 1} / {questions.length}
                </span>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  점수: {score} / {currentQuestion}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="px-6 py-8">
              {quizType === 'meaning' && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">이 한자의 의미는 무엇인가요?</h2>
                  <div className="text-9xl text-center my-8 font-serif hanja-display mx-auto max-w-xs">
                    {questions[currentQuestion].correctAnswer}
                  </div>
                </>
              )}
              
              {quizType === 'character' && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">다음 의미에 해당하는 한자는 무엇인가요?</h2>
                  <div className="text-3xl text-center my-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl font-medium text-gray-800 dark:text-white">
                    {hanjaData.find(h => h.character === questions[currentQuestion].correctAnswer)?.meaning}
                  </div>
                </>
              )}
              
              {quizType === 'stroke' && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">이 한자의 총 획수는 몇 획인가요?</h2>
                  <div className="text-9xl text-center my-8 font-serif hanja-display mx-auto max-w-xs">
                    {questions[currentQuestion].correctAnswer}
                  </div>
                </>
              )}
            </div>
            
            <div className="px-6 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {quizType === 'stroke' ? (
                  // 획수 퀴즈일 경우 1~10 보기 제시
                  <div className="grid grid-cols-5 sm:grid-cols-5 col-span-2 gap-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        className={`aspect-square flex items-center justify-center text-xl font-medium rounded-lg transition-all duration-200 ${
                          selectedAnswer === num.toString() 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } ${
                          showResult && num.toString() === hanjaData.find(h => h.character === questions[currentQuestion].correctAnswer)?.stroke_count.toString() 
                            ? 'bg-green-500 text-white shadow-md ring-2 ring-green-200' 
                            : showResult && selectedAnswer === num.toString() && selectedAnswer !== hanjaData.find(h => h.character === questions[currentQuestion].correctAnswer)?.stroke_count.toString()
                              ? 'bg-red-500 text-white shadow-md' 
                              : ''
                        }`}
                        onClick={() => !showResult && setSelectedAnswer(num.toString())}
                        disabled={showResult}
                      >
                        {num}획
                      </button>
                    ))}
                  </div>
                ) : (
                  // 일반 퀴즈의 경우 한자 또는 의미 보기 제시
                  questions[currentQuestion].options.map((option: any) => (
                    <button
                      key={option.character}
                      className={`p-5 rounded-xl text-center transition-all duration-200 text-lg ${
                        selectedAnswer === option.character 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } ${
                        showResult && option.character === questions[currentQuestion].correctAnswer 
                          ? 'bg-green-500 text-white shadow-md ring-2 ring-green-200' 
                          : showResult && selectedAnswer === option.character && option.character !== questions[currentQuestion].correctAnswer 
                            ? 'bg-red-500 text-white shadow-md' 
                            : ''
                      }`}
                      onClick={() => !showResult && setSelectedAnswer(option.character)}
                      disabled={showResult}
                    >
                      {quizType === 'meaning' ? option.meaning : option.character}
                    </button>
                  ))
                )}
              </div>
              
              {showResult ? (
                <div className="flex justify-center">
                  <button
                    className="btn-primary min-w-40 flex items-center justify-center gap-2"
                    onClick={nextQuestion}
                  >
                    <span>다음 문제</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    className={`btn-primary min-w-40 flex items-center justify-center gap-2 ${
                      selectedAnswer ? '' : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                  >
                    <span>정답 확인</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {quizFinished && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white py-6 px-8">
              <h2 className="text-2xl font-bold text-center">퀴즈 결과</h2>
            </div>
            
            <div className="px-8 py-10">
              <div className="flex justify-center items-center mb-10">
                <div className="relative">
                  <div className="w-48 h-48 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-8 border-blue-500">
                    <span className="text-5xl font-bold text-blue-600 dark:text-blue-300">
                      {score}/{questions.length}
                    </span>
                  </div>
                  {score === questions.length && (
                    <div className="absolute -top-5 -right-5 bg-yellow-400 text-yellow-800 text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center animate-bounce">
                      100%
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center mb-10">
                <p className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {score === questions.length 
                    ? '완벽합니다! 모든 문제를 맞히셨습니다.' 
                    : score >= questions.length * 0.8 
                      ? '훌륭합니다! 대부분의 문제를 맞히셨습니다.' 
                      : score >= questions.length * 0.6 
                        ? '좋습니다! 많은 문제를 맞히셨습니다.' 
                        : '더 많은 연습이 필요합니다. 한자 학습을 계속해보세요.'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {quizType === 'meaning' 
                    ? '한자의 의미를 익히는 것은 한자 학습의 기본입니다.' 
                    : quizType === 'character' 
                      ? '한자와 의미를 연결하는 것은 활용 능력을 높입니다.' 
                      : '획수를 아는 것은 한자 쓰기의 기본입니다.'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn-primary flex items-center justify-center gap-2"
                  onClick={restartQuiz}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  다시 풀기
                </button>
                
                <a
                  href="/api/generate-pdf?type=quiz-review"
                  target="_blank"
                  className="btn-success flex items-center justify-center gap-2"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  복습자료 다운로드
                </a>
                
                <Link href="/learn">
                  <button className="btn-accent flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    학습으로 돌아가기
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                    대시보드로 이동
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 