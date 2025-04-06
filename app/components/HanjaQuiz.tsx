'use client';

import React, { useState, useEffect } from 'react';
import { Hanja } from '@/types/hanja';

interface HanjaQuizProps {
  hanjaList: Hanja[];
  quizType: 'multiple-choice' | 'writing';
  questionCount: number;
}

interface Question {
  id: number;
  character: Hanja;
  options?: Hanja[];
  userAnswer: string | null;
  isCorrect: boolean | null;
}

const HanjaQuiz: React.FC<HanjaQuizProps> = ({ hanjaList, quizType, questionCount }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');

  // 퀴즈 문제 생성
  useEffect(() => {
    if (!hanjaList || hanjaList.length === 0) {
      console.error('한자 데이터가 없습니다:', hanjaList);
      setError('한자 데이터를 불러오지 못했습니다');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('퀴즈 생성 시작, 한자 목록:', hanjaList);

      // 문제 수가 한자 개수보다 많으면 한자 개수로 제한
      const actualQuestionCount = Math.min(questionCount, hanjaList.length);
      console.log(`실제 문제 수: ${actualQuestionCount}`);

      // 한자 데이터 검증
      const validHanjaList = hanjaList.filter(hanja =>
        hanja &&
        typeof hanja === 'object' &&
        hanja.character &&
        hanja.meaning && 
        hanja.pronunciation
      );

      if (validHanjaList.length === 0) {
        console.error('유효한 한자 데이터가 없습니다:', hanjaList);
        setError('유효한 한자 데이터가 없습니다. 다른 레벨을 선택해주세요.');
        setLoading(false);
        return;
      }

      console.log(`유효한 한자 수: ${validHanjaList.length}`);

      // 한자 셔플
      const shuffledHanja = [...validHanjaList].sort(() => Math.random() - 0.5);

      // 문제 생성
      const generatedQuestions: Question[] = [];

      for (let i = 0; i < actualQuestionCount && i < shuffledHanja.length; i++) {
        const character = shuffledHanja[i];

        let options;
        if (quizType === 'multiple-choice') {
          // 객관식 문제에 4개의 보기 생성 (정답 + 3개 오답)
          // 충분한 오답 선택지가 없을 경우 처리
          const otherOptions = shuffledHanja
            .filter(h => h.character !== character.character)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3); // 최대 3개의 오답 후보
          
          options = [character, ...otherOptions].sort(() => Math.random() - 0.5);
          
          if (options.length < 2) {
            console.warn('충분한 선택지가 없습니다. 최소 2개의 선택지가 필요합니다.');
            // 가짜 선택지 추가 (실제 구현에서는 더 나은 방식으로 처리해야 함)
            if (options.length === 1) {
              options.push({
                character: '無',
                meaning: '없을 무',
                pronunciation: '무',
                stroke_count: 12,
                radical: '灬',
                examples: [],
                level: 0,
                order: 0
              });
            }
          }
        }

        generatedQuestions.push({
          id: i,
          character,
          options,
          userAnswer: null,
          isCorrect: null
        });
      }

      console.log(`생성된 문제 수: ${generatedQuestions.length}`);

      if (generatedQuestions.length === 0) {
        setError('문제를 생성할 수 없습니다. 다른 레벨을 선택해주세요.');
        setLoading(false);
        return;
      }

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setQuizComplete(false);
      setScore(0);
      setLoading(false);
    } catch (err) {
      console.error('퀴즈 생성 중 오류 발생:', err);
      setError('퀴즈를 생성하는 중 오류가 발생했습니다. 다른 레벨을 선택해보세요.');
      setLoading(false);
    }
  }, [hanjaList, quizType, questionCount]);

  // 현재 문제
  const currentQuestion = questions[currentQuestionIndex];

  // 답변 제출
  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    // 이미 답변한 문제면 무시
    if (currentQuestion.userAnswer !== null) return;

    const isCorrect = quizType === 'multiple-choice'
      ? answer === currentQuestion.character.character
      : answer.trim().toLowerCase() === currentQuestion.character.pronunciation.trim().toLowerCase();


    // 현재 문제 업데이트
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect
    };

    setQuestions(updatedQuestions);

    // 점수 업데이트
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // 다음 문제로 이동
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextAnswer('');
    } else {
      // 퀴즈 완료
      setQuizComplete(true);
    }
  };

  // 주관식 답변 제출
  const handleSubmitText = () => {
    if (!textAnswer.trim()) return;
    handleAnswer(textAnswer);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-300">퀴즈 생성 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-300">
        <p className="font-medium">오류</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (quizComplete) {
    // 퀴즈 결과 화면
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">퀴즈 결과</h2>

        <div className="flex justify-center mb-8">
          <div className={`w-36 h-36 rounded-full flex items-center justify-center border-8 transition-all ${
            percentage >= 80 ? 'border-green-500' : 
            percentage >= 60 ? 'border-yellow-500' : 
            'border-red-500'
          }`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{score}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">/ {questions.length}</div>
              <div className="text-lg font-medium mt-1">{percentage}%</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          {percentage === 100 ? (
            <p className="text-xl text-green-600 dark:text-green-400 font-semibold">완벽합니다! 모든 문제를 맞혔습니다.</p>
          ) : percentage >= 80 ? (
            <p className="text-xl text-green-600 dark:text-green-400 font-semibold">훌륭합니다! 대부분의 문제를 맞혔습니다.</p>
          ) : percentage >= 60 ? (
            <p className="text-xl text-yellow-600 dark:text-yellow-400 font-semibold">좋습니다! 많은 문제를 맞혔습니다.</p>
          ) : (
            <p className="text-xl text-red-600 dark:text-red-400 font-semibold">더 많은 연습이 필요합니다. 한자 학습을 계속해보세요.</p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">문제 리뷰</h3>
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-3 rounded-lg border transition-all ${
                  q.isCorrect 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{idx + 1}. </span>
                    <span className="text-xl hanja-display">{q.character.character}</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">({q.character.meaning})</span>
                  </div>
                  <div className={q.isCorrect 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                  }>
                    {q.isCorrect ? '정답' : '오답'}
                  </div>
                </div>
                <div className="text-sm">
                  <div>정답: <span className="font-medium">{
                    quizType === 'multiple-choice' 
                      ? q.character.character 
                      : q.character.pronunciation
                  }</span></div>
                  {q.userAnswer && !q.isCorrect && (
                    <div className="text-red-600 dark:text-red-400">
                      입력한 답: <span className="font-medium">{q.userAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 퀴즈 문제 화면
  if (!currentQuestion) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-yellow-700 dark:text-yellow-300">
        <p>문제를 생성하지 못했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg">
      {/* 진행 상황 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>문제 {currentQuestionIndex + 1} / {questions.length}</span>
          <span>점수: {score}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 문제 */}
      <div className="mb-8">
        {quizType === 'multiple-choice' ? (
          <div className="text-center mb-4">
            <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">다음 한자의 뜻은 무엇인가요?</p>
            <div className="text-5xl sm:text-6xl hanja-display mb-4 text-gray-900 dark:text-white">
              {currentQuestion.character.character}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ({currentQuestion.character.pronunciation})
            </p>
          </div>
        ) : (
          <div className="text-center mb-4">
            <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">다음 한자의 발음은 무엇인가요?</p>
            <div className="text-5xl sm:text-6xl hanja-display mb-4 text-gray-900 dark:text-white">
              {currentQuestion.character.character}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ({currentQuestion.character.meaning})
            </p>
          </div>
        )}

        {/* 답변 영역 */}
        <div className="mt-6">
          {quizType === 'multiple-choice' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.character}
                  onClick={() => currentQuestion.userAnswer === null && handleAnswer(option.character)}
                  disabled={currentQuestion.userAnswer !== null}
                  className={`py-3 px-4 rounded-lg text-left transition-all ${
                    currentQuestion.userAnswer === null
                      ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                      : currentQuestion.userAnswer === option.character
                        ? currentQuestion.isCorrect
                          ? 'bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-800 dark:text-red-200'
                        : option.character === currentQuestion.character.character && !currentQuestion.isCorrect
                          ? 'bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 opacity-70'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg font-medium">{option.meaning}</span>
                    {currentQuestion.userAnswer !== null && (
                      currentQuestion.userAnswer === option.character ? (
                        currentQuestion.isCorrect ? (
                          <span className="ml-auto text-green-600 dark:text-green-400">✓</span>
                        ) : (
                          <span className="ml-auto text-red-600 dark:text-red-400">✗</span>
                        )
                      ) : option.character === currentQuestion.character.character && !currentQuestion.isCorrect ? (
                        <span className="ml-auto text-green-600 dark:text-green-400">✓</span>
                      ) : null
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="발음을 입력하세요"
                  disabled={currentQuestion.userAnswer !== null}
                  className={`flex-grow p-3 rounded-lg border ${
                    currentQuestion.userAnswer === null
                      ? 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      : currentQuestion.isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  } focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentQuestion.userAnswer === null) {
                      handleSubmitText();
                    }
                  }}
                />
                <button
                  onClick={handleSubmitText}
                  disabled={currentQuestion.userAnswer !== null || !textAnswer.trim()}
                  className="ml-2 btn-primary disabled:bg-gray-300 disabled:text-gray-500"
                >
                  제출
                </button>
              </div>
              
              {currentQuestion.userAnswer !== null && (
                <div className={`p-3 rounded-lg text-sm ${
                  currentQuestion.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  {currentQuestion.isCorrect ? (
                    <p>정답입니다! - {currentQuestion.character.pronunciation}</p>
                  ) : (
                    <p>오답입니다. 정답은 <span className="font-bold">{currentQuestion.character.pronunciation}</span>입니다.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
        {currentQuestion.userAnswer !== null && (
          <button
            onClick={goToNextQuestion}
            className="btn-primary px-6"
          >
            {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  );
};

export default HanjaQuiz; 