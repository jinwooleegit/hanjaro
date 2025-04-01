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
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold">한자 퀴즈</h1>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link href="/learn">
              <button className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition">
                학습하기
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 rounded-md transition">
                대시보드
              </button>
            </Link>
          </div>
        </div>
        
        {!quizStarted && !quizFinished && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">퀴즈 유형 선택</h2>
            <p className="text-gray-600 mb-6">
              풀고 싶은 퀴즈 유형을 선택하세요. 각 퀴즈는 5문제로 구성되어 있습니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="border rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                onClick={() => startQuiz('meaning')}
              >
                <div className="text-4xl mb-3">漢 ?</div>
                <h3 className="text-lg font-semibold mb-2">한자 의미 맞추기</h3>
                <p className="text-sm text-gray-500">
                  한자를 보고 해당 한자의 뜻을 맞추는 퀴즈입니다.
                </p>
              </div>
              
              <div 
                className="border rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                onClick={() => startQuiz('character')}
              >
                <div className="text-4xl mb-3">? 水</div>
                <h3 className="text-lg font-semibold mb-2">한자 맞추기</h3>
                <p className="text-sm text-gray-500">
                  한자의 뜻을 보고 해당하는 한자를 맞추는 퀴즈입니다.
                </p>
              </div>
              
              <div 
                className="border rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                onClick={() => startQuiz('stroke')}
              >
                <div className="text-4xl mb-3">一 二 ?</div>
                <h3 className="text-lg font-semibold mb-2">획수 맞추기</h3>
                <p className="text-sm text-gray-500">
                  한자를 보고 해당 한자의 총 획수를 맞추는 퀴즈입니다.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {quizStarted && !quizFinished && questions.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                문제 {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                점수: {score} / {questions.length}
              </span>
            </div>
            
            <div className="mb-8">
              {quizType === 'meaning' && (
                <>
                  <h2 className="text-xl font-semibold mb-2">이 한자의 의미는 무엇인가요?</h2>
                  <div className="text-9xl text-center my-6">
                    {questions[currentQuestion].correctAnswer}
                  </div>
                </>
              )}
              
              {quizType === 'character' && (
                <>
                  <h2 className="text-xl font-semibold mb-2">다음 의미에 해당하는 한자는 무엇인가요?</h2>
                  <div className="text-3xl text-center my-8">
                    {hanjaData.find(h => h.character === questions[currentQuestion].correctAnswer)?.meaning}
                  </div>
                </>
              )}
              
              {quizType === 'stroke' && (
                <>
                  <h2 className="text-xl font-semibold mb-2">이 한자의 총 획수는 몇 획인가요?</h2>
                  <div className="text-9xl text-center my-6">
                    {questions[currentQuestion].correctAnswer}
                  </div>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {quizType === 'stroke' ? (
                // 획수 퀴즈일 경우 1~10 보기 제시
                Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    className={`p-4 border rounded-md text-center hover:bg-gray-50 transition ${
                      selectedAnswer === num.toString() 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    } ${
                      showResult && num.toString() === hanjaData.find(h => h.character === questions[currentQuestion].correctAnswer)?.stroke_count.toString() 
                        ? 'border-green-500 bg-green-50' 
                        : showResult && selectedAnswer === num.toString() 
                          ? 'border-red-500 bg-red-50' 
                          : ''
                    }`}
                    onClick={() => !showResult && setSelectedAnswer(num.toString())}
                    disabled={showResult}
                  >
                    {num}획
                  </button>
                ))
              ) : (
                // 일반 퀴즈의 경우 한자 또는 의미 보기 제시
                questions[currentQuestion].options.map((option: any) => (
                  <button
                    key={option.character}
                    className={`p-4 border rounded-md text-center hover:bg-gray-50 transition ${
                      selectedAnswer === option.character 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    } ${
                      showResult && option.character === questions[currentQuestion].correctAnswer 
                        ? 'border-green-500 bg-green-50' 
                        : showResult && selectedAnswer === option.character && option.character !== questions[currentQuestion].correctAnswer 
                          ? 'border-red-500 bg-red-50' 
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
                  className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition"
                  onClick={nextQuestion}
                >
                  다음 문제
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  className={`px-6 py-3 bg-blue-500 text-white rounded-md transition ${
                    selectedAnswer ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                >
                  정답 확인
                </button>
              </div>
            )}
          </div>
        )}
        
        {quizFinished && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center mb-2">퀴즈 결과</h2>
            <div className="flex justify-center items-center my-8">
              <div className="w-32 h-32 flex items-center justify-center rounded-full border-8 border-blue-500">
                <span className="text-4xl font-bold">
                  {score}/{questions.length}
                </span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-xl">
                {score === questions.length 
                  ? '완벽합니다! 모든 문제를 맞히셨습니다.' 
                  : score >= questions.length * 0.8 
                    ? '훌륭합니다! 대부분의 문제를 맞히셨습니다.' 
                    : score >= questions.length * 0.6 
                      ? '좋습니다! 많은 문제를 맞히셨습니다.' 
                      : '더 많은 연습이 필요합니다. 한자 학습을 계속해보세요.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition"
                onClick={restartQuiz}
              >
                다시 풀기
              </button>
              <Link href="/learn">
                <button className="px-6 py-3 bg-green-500 text-white hover:bg-green-600 rounded-md transition">
                  학습으로 돌아가기
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-6 py-3 bg-gray-500 text-white hover:bg-gray-600 rounded-md transition">
                  대시보드로 이동
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 