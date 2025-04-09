'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 질문 타입 정의
interface TestQuestion {
  id: number;
  level: number;
  question: string;
  questionType: string;
  hanja?: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard'; // 난이도 추가
}

// 샘플 테스트 문제 데이터 확장
const sampleQuestions: Record<string, TestQuestion[]> = {
  basic: [
    {
      id: 1,
      level: 1,
      question: '다음 한자의 의미는 무엇인가요?',
      questionType: 'meaning',
      hanja: '人',
      options: ['사람', '하늘', '땅', '바다'],
      correctAnswer: '사람',
      difficulty: 'easy'
    },
    {
      id: 2,
      level: 1,
      question: '다음 한자의 음은 무엇인가요?',
      questionType: 'reading',
      hanja: '日',
      options: ['일', '월', '화', '수'],
      correctAnswer: '일',
      difficulty: 'easy'
    },
    {
      id: 3,
      level: 1,
      question: '"높은 땅이나 지형"을 의미하는 한자는 무엇인가요?',
      questionType: 'character',
      options: ['川', '山', '木', '石'],
      correctAnswer: '山',
      difficulty: 'easy'
    },
    {
      id: 4,
      level: 1,
      question: '다음 한자의 의미는 무엇인가요?',
      questionType: 'meaning',
      hanja: '水',
      options: ['불', '물', '나무', '돌'],
      correctAnswer: '물',
      difficulty: 'easy'
    },
    {
      id: 5,
      level: 1,
      question: '다음 한자의 음은 무엇인가요?',
      questionType: 'reading',
      hanja: '木',
      options: ['목', '석', '수', '토'],
      correctAnswer: '목',
      difficulty: 'easy'
    },
    {
      id: 6,
      level: 1,
      question: '다음 한자의 의미는 무엇인가요?',
      questionType: 'meaning',
      hanja: '月',
      options: ['달', '별', '해', '하늘'],
      correctAnswer: '달',
      difficulty: 'easy'
    },
    {
      id: 7,
      level: 1,
      question: '다음 한자의 음은 무엇인가요?',
      questionType: 'reading',
      hanja: '火',
      options: ['화', '수', '금', '토'],
      correctAnswer: '화',
      difficulty: 'easy'
    },
    {
      id: 8,
      level: 1,
      question: '"위에 있는 넓은 공간"을 의미하는 한자는 무엇인가요?',
      questionType: 'character',
      options: ['天', '地', '空', '雲'],
      correctAnswer: '天',
      difficulty: 'easy'
    },
    {
      id: 9,
      level: 1,
      question: '다음 한자의 의미는 무엇인가요?',
      questionType: 'meaning',
      hanja: '大',
      options: ['크다', '작다', '높다', '낮다'],
      correctAnswer: '크다',
      difficulty: 'easy'
    },
    {
      id: 10,
      level: 1,
      question: '다음 한자의 음은 무엇인가요?',
      questionType: 'reading',
      hanja: '小',
      options: ['소', '대', '고', '저'],
      correctAnswer: '소',
      difficulty: 'easy'
    }
  ],
  intermediate: [
    {
      id: 1,
      level: 3,
      question: '"사람"과 "큰"의 의미를 가진 두 한자가 결합된 글자는?',
      questionType: 'combination',
      options: ['休', '天', '大', '夫'],
      correctAnswer: '夫',
      difficulty: 'medium'
    },
    {
      id: 2,
      level: 3,
      question: '다음 한자의 뜻은 무엇인가요?',
      questionType: 'meaning',
      hanja: '明',
      options: ['밝을', '어두울', '넓을', '좁을'],
      correctAnswer: '밝을',
      difficulty: 'medium'
    },
    {
      id: 3,
      level: 3,
      question: '"한 돌로 두 마리 새를 잡는다"는 뜻의 한자성어의 의미로 알맞은 것은?',
      questionType: 'idiom',
      options: ['한 번 실패하고 두 번 성공함', '한 가지 일로 두 가지 이득을 봄', '첫 시도에서 성공함', '두 마리 토끼를 한 번에 잡음'],
      correctAnswer: '한 가지 일로 두 가지 이득을 봄',
      difficulty: 'medium'
    },
    {
      id: 4,
      level: 3,
      question: '"나무"와 "날"의 의미를 가진 두 한자가 결합된 글자의 의미는?',
      questionType: 'vocabulary',
      options: ['종이', '밝을', '맑을', '나뭇잎'],
      correctAnswer: '맑을',
      difficulty: 'medium'
    },
    {
      id: 5,
      level: 3,
      question: '다음 한자의 음과 뜻이 모두 바른 것은?',
      questionType: 'reading',
      hanja: '學',
      options: ['학: 배울', '화: 그릴', '학: 가르칠', '문: 들을'],
      correctAnswer: '학: 배울',
      difficulty: 'medium'
    },
    {
      id: 6,
      level: 3,
      question: '한자 "門"의 부수는?',
      questionType: 'radical',
      options: ['門', '木', '月', '水'],
      correctAnswer: '門',
      difficulty: 'medium'
    },
    {
      id: 7,
      level: 3,
      question: '다음 중 "밝다"는 의미를 가진 한자가 들어가는 단어는?',
      questionType: 'vocabulary',
      options: ['문명(文明)', '명확(明確)', '명령(命令)', '명예(名譽)'],
      correctAnswer: '명확(明確)',
      difficulty: 'medium'
    },
    {
      id: 8,
      level: 3,
      question: '한자어 "一心同體"의 의미로 가장 적절한 것은?',
      questionType: 'idiom',
      options: ['한 마음 한 몸', '처음부터 끝까지', '한 번에 성공함', '첫 마음을 잃지 않음'],
      correctAnswer: '한 마음 한 몸',
      difficulty: 'medium'
    },
    {
      id: 9,
      level: 3,
      question: '다음 한자성어 중 "열심히 노력하는 모습"을 의미하는 것은?',
      questionType: 'idiom',
      options: ['日就月將', '朝三暮四', '草長莪行', '脣亡齒寒'],
      correctAnswer: '日就月將',
      difficulty: 'medium'
    },
    {
      id: 10,
      level: 3,
      question: '"불"과 "산"의 의미를 가진 두 한자로 구성된 단어는?',
      questionType: 'vocabulary',
      options: ['화산(火山)', '산불(山火)', '화력(火力)', '산악(山岳)'],
      correctAnswer: '화산(火山)',
      difficulty: 'medium'
    }
  ],
  advanced: [
    {
      id: 1,
      level: 5,
      question: '다음 중 "변할"의 의미를 가진 한자가 들어가지 않는 단어는?',
      questionType: 'vocabulary',
      options: ['문화(文化)', '변화(變化)', '동화(同化)', '회화(繪畫)'],
      correctAnswer: '회화(繪畫)',
      difficulty: 'hard'
    },
    {
      id: 2,
      level: 5,
      question: '다음 한자의 획순으로 알맞은 것은?',
      questionType: 'stroke',
      hanja: '永',
      options: ['5획', '6획', '7획', '8획'],
      correctAnswer: '5획',
      difficulty: 'hard'
    },
    {
      id: 3,
      level: 5,
      question: '다음 한자성어 "背水陣"의 의미는?',
      questionType: 'idiom',
      options: ['물을 등지고 선 진영', '물에 빠진 사람', '배를 타고 물을 건너다', '물고기가 헤엄치는 모습'],
      correctAnswer: '물을 등지고 선 진영',
      difficulty: 'hard'
    },
    {
      id: 4,
      level: 5,
      question: '한자 "讀"의 올바른 부수는?',
      questionType: 'radical',
      options: ['言', '心', '手', '目'],
      correctAnswer: '言',
      difficulty: 'hard'
    },
    {
      id: 5,
      level: 5,
      question: '다음 한자의 의미로 알맞은 것은?',
      questionType: 'meaning',
      hanja: '顧',
      options: ['돌아볼', '고칠', '온전할', '물을'],
      correctAnswer: '돌아볼',
      difficulty: 'hard'
    },
    {
      id: 6,
      level: 5,
      question: '다음 중 "경계하다"의 의미를 가진 한자가 들어가는 단어는?',
      questionType: 'vocabulary',
      options: ['경찰(警察)', '경관(景觀)', '경제(經濟)', '경험(經驗)'],
      correctAnswer: '경찰(警察)',
      difficulty: 'hard'
    },
    {
      id: 7,
      level: 5,
      question: '한자성어 "脣亡齒寒"의 올바른 해석은?',
      questionType: 'idiom',
      options: ['입술이 없으면 이가 시리다', '이가 없으면 음식을 씹을 수 없다', '입술을 물어 참다', '이가 시려 먹지 못하다'],
      correctAnswer: '입술이 없으면 이가 시리다',
      difficulty: 'hard'
    },
    {
      id: 8,
      level: 5,
      question: '다음 한자의 올바른 전서체는?',
      questionType: 'ancient',
      hanja: '龍',
      options: ['龒', '龍', '龓', '龑'],
      correctAnswer: '龍',
      difficulty: 'hard'
    },
    {
      id: 9,
      level: 5,
      question: '다음 한자의 음훈이 올바르게 짝지어진 것은?',
      questionType: 'reading',
      hanja: '德',
      options: ['덕: 덕', '득: 덕', '텍: 덕', '덕: 바를'],
      correctAnswer: '덕: 덕',
      difficulty: 'hard'
    },
    {
      id: 10,
      level: 5,
      question: '다음 중 "귀신, 혼"과 관련된 의미를 가진 한자는?',
      questionType: 'vocabulary',
      options: ['魂', '神', '靈', '怪'],
      correctAnswer: '魂',
      difficulty: 'hard'
    }
  ],
  comprehensive: [
    {
      id: 1,
      level: 1,
      question: '다음 한자 "學"의 부수는?',
      questionType: 'radical',
      options: ['子', '宀', '冖', '爻'],
      correctAnswer: '子',
      difficulty: 'easy'
    },
    {
      id: 2,
      level: 1,
      question: '다음 한자의 의미는 무엇인가요?',
      questionType: 'meaning',
      hanja: '月',
      options: ['달', '별', '해', '하늘'],
      correctAnswer: '달',
      difficulty: 'easy'
    },
    {
      id: 3,
      level: 3,
      question: '다음 한자성어 "一石二鳥"의 올바른 독음은?',
      questionType: 'reading',
      options: ['일석이조', '일석이비', '일돌이조', '일석이새'],
      correctAnswer: '일석이조',
      difficulty: 'medium'
    },
    {
      id: 4,
      level: 3,
      question: '"높을"과 "빛날"의 의미를 가진 두 한자로 이루어진 단어는?',
      questionType: 'vocabulary',
      options: ['고휘(高輝)', '고양(高揚)', '고조(高調)', '고명(高明)'],
      correctAnswer: '고휘(高輝)',
      difficulty: 'medium'
    },
    {
      id: 5,
      level: 3,
      question: '다음 한자의 음과 뜻이 올바르게 짝지어진 것은?',
      questionType: 'reading',
      hanja: '海',
      options: ['해: 물', '해: 바다', '수: 물', '천: 하늘'],
      correctAnswer: '해: 바다',
      difficulty: 'medium'
    },
    {
      id: 6,
      level: 3,
      question: '다음 중 "감정, 정서"와 관련된 부수가 들어간 한자는?',
      questionType: 'vocabulary',
      options: ['愛', '想', '情', '이상 모두'],
      correctAnswer: '이상 모두',
      difficulty: 'medium'
    },
    {
      id: 7,
      level: 5,
      question: '다음 한자성어 "聞一知十"의 의미는?',
      questionType: 'idiom',
      options: ['하나를 듣고 열을 앎', '첫 번째가 가장 중요함', '하나를 보고 열을 생각함', '열에 하나도 모름'],
      correctAnswer: '하나를 듣고 열을 앎',
      difficulty: 'hard'
    },
    {
      id: 8,
      level: 5,
      question: '다음 한자 "藝"의 부수는?',
      questionType: 'radical',
      options: ['艹', '世', '木', '辶'],
      correctAnswer: '艹',
      difficulty: 'hard'
    },
    {
      id: 9,
      level: 5,
      question: '한자 "釋"의 올바른 음은?',
      questionType: 'reading',
      options: ['석', '적', '택', '역'],
      correctAnswer: '석',
      difficulty: 'hard'
    },
    {
      id: 10,
      level: 5,
      question: '한자성어 "馬耳東風"의 의미는?',
      questionType: 'idiom',
      options: ['말귀에 동풍', '천천히 나아감', '충고를 새겨듣지 않음', '말이 바람처럼 빠름'],
      correctAnswer: '충고를 새겨듣지 않음',
      difficulty: 'hard'
    }
  ]
};

// 카테고리 정보
const categoryInfo: Record<string, {
  name: string;
  description: string;
  icon: string;
  difficulty: string;
}> = {
  basic: {
    name: '기본 한자 테스트',
    description: '한자의 기본적인 의미와 읽기를 중심으로 평가합니다.',
    icon: '基',
    difficulty: 'beginner'
  },
  intermediate: {
    name: '중급 한자 테스트',
    description: '일상에서 자주 사용되는 한자어와 한자성어를 포함합니다.',
    icon: '中',
    difficulty: 'intermediate'
  },
  advanced: {
    name: '고급 한자 테스트',
    description: '한자의 부수, 획순, 고급 한자성어 등의 지식을 평가합니다.',
    icon: '高',
    difficulty: 'advanced'
  },
  comprehensive: {
    name: '종합 한자 테스트',
    description: '다양한 난이도의 문제를 통해 전반적인 한자 실력을 평가합니다.',
    icon: '綜',
    difficulty: 'intermediate'
  }
};

// 난이도에 따른 색상 및 클래스 정의
const difficultyClasses = {
  easy: {
    badge: 'bg-green-100 text-green-800 border-green-200',
    text: 'text-green-700',
    progressBar: 'bg-green-500'
  },
  medium: {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    text: 'text-yellow-700',
    progressBar: 'bg-yellow-500'
  },
  hard: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    text: 'text-red-700',
    progressBar: 'bg-red-500'
  }
};

export default function CategoryTestPage() {
  const params = useParams();
  const category = params?.category as string || 'basic';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<TestQuestion[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // 60초 타이머
  const [testActive, setTestActive] = useState<boolean>(true);
  
  // 안전하게 질문 가져오기
  const questions = sampleQuestions[category] || sampleQuestions.basic;
  
  // 유효하지 않은 카테고리인 경우 기본 카테고리로 리디렉션
  useEffect(() => {
    try {
      if (!sampleQuestions[category]) {
        console.error(`유효하지 않은 카테고리: ${category}`);
        setError(`유효하지 않은 카테고리: ${category}`);
        window.location.href = '/level-test-static/basic';
        return;
      }
      
      // 질문 섞기 (랜덤 출제)
      const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
      setShuffledQuestions(shuffled);
    } catch (err) {
      console.error('카테고리 확인 중 오류 발생:', err);
      setError('카테고리 확인 중 오류 발생');
    }
  }, [category, questions]);
  
  // 타이머 설정
  useEffect(() => {
    if (!testActive) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // 시간이 다 되면 결과 페이지로 이동
          if (currentQuestionIndex === shuffledQuestions.length - 1) {
            window.location.href = `/level-test-static/result?score=${userScore}&total=${shuffledQuestions.length}&category=${category}`;
          } else {
            // 다음 문제로 이동
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            return 60; // 타이머 리셋
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, userScore, shuffledQuestions.length, testActive, category]);
  
  // 현재 질문 안전하게 가져오기
  const getCurrentQuestion = () => {
    try {
      if (!shuffledQuestions || shuffledQuestions.length === 0) {
        return questions[0];
      }
      if (currentQuestionIndex >= shuffledQuestions.length) {
        return shuffledQuestions[0];
      }
      return shuffledQuestions[currentQuestionIndex];
    } catch (err) {
      console.error('질문 가져오기 오류:', err);
      return questions[0];
    }
  };
  
  const currentQuestion = getCurrentQuestion();
  
  // 현재 문제의 난이도 클래스 가져오기
  const getDifficultyClasses = () => {
    if (!currentQuestion) return difficultyClasses.easy;
    return difficultyClasses[currentQuestion.difficulty || 'easy'];
  };
  
  // 정답 제출 처리
  const handleAnswerSubmit = (answer: string) => {
    try {
      console.log('답변 제출: ', answer);
      setSelectedAnswer(answer);
      
      // 정답 확인
      if (answer === currentQuestion.correctAnswer) {
        console.log('정답입니다!');
        setUserScore(prevScore => prevScore + 1);
      } else {
        console.log('오답입니다. 정답은:', currentQuestion.correctAnswer);
      }
      
      // 다음 문제로 이동 또는 결과 페이지로 이동
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        // setTimeout 사용하여 지연 실행
        setTimeout(() => {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setSelectedAnswer(null);
          setTimeRemaining(60); // 타이머 리셋
        }, 1200); // 피드백을 보여주기 위해 약간의 지연 추가
      } else {
        // 마지막 문제인 경우
        setTestActive(false);
        setTimeout(() => {
          try {
            // 결과 페이지로 이동하는 로직
            const finalScore = userScore + (answer === currentQuestion.correctAnswer ? 1 : 0);
            window.location.href = `/level-test-static/result?score=${finalScore}&total=${shuffledQuestions.length}&category=${category}`;
          } catch (error) {
            console.error('결과 페이지로 이동 중 오류 발생:', error);
            // 오류 발생 시 메인 페이지로 이동
            window.location.href = '/level-test-static';
          }
        }, 1500);
      }
    } catch (err) {
      console.error('답변 제출 중 오류 발생:', err);
      setError('답변 제출 중 오류가 발생했습니다');
    }
  };

  // 오류가 있는 경우 오류 메시지 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link 
            href="/level-test-static"
            className="px-5 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            테스트 선택 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  // 카테고리 없거나 문제 없는 경우
  if (!shuffledQuestions.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">문제를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{categoryInfo[category]?.name || '한자 테스트'}</h1>
            <p className="text-sm text-gray-600">{categoryInfo[category]?.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm bg-blue-100 px-3 py-1 rounded-full mb-2">
              문제 {currentQuestionIndex + 1} / {shuffledQuestions.length}
            </div>
            <div className={`text-sm px-3 py-1 rounded-full ${getDifficultyClasses().badge}`}>
              난이도: {currentQuestion?.difficulty === 'easy' ? '쉬움' : currentQuestion?.difficulty === 'medium' ? '보통' : '어려움'}
            </div>
          </div>
        </div>
        
        {/* 진행 상태 바 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">진행도: {Math.round((currentQuestionIndex / shuffledQuestions.length) * 100)}%</span>
            <span className={`font-medium ${timeRemaining < 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
              남은 시간: {timeRemaining}초
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${getDifficultyClasses().progressBar}`}
              style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row items-start justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <span className={`inline-block px-3 py-1.5 text-sm rounded-md mr-3 ${getDifficultyClasses().badge} font-medium`}>
                난이도: {currentQuestion?.difficulty === 'easy' ? '쉬움' : currentQuestion?.difficulty === 'medium' ? '보통' : '어려움'}
              </span>
              <h2 className="text-xl font-medium text-gray-800">{currentQuestion?.question}</h2>
            </div>
            <div className="text-sm bg-blue-100 px-3 py-1.5 rounded-full md:ml-4">
              문제 {currentQuestionIndex + 1} / {shuffledQuestions.length}
            </div>
          </div>
          
          {currentQuestion?.hanja && (
            <div className="my-6 flex justify-center">
              <div className="text-7xl md:text-8xl font-serif border-2 border-gray-300 bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105" style={{ fontFamily: "var(--font-noto-serif-kr), 'Batang', serif" }}>
                {currentQuestion.hanja}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault(); // 이벤트 기본 동작 방지
                  if (selectedAnswer !== null) return; // 이미 답변 선택된 경우 무시
                  console.log(`옵션 클릭: ${option}`);
                  handleAnswerSubmit(option);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500 shadow-md'
                      : 'bg-red-100 border-red-500 shadow-md'
                    : selectedAnswer !== null && option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500 shadow-md' // 다른 답을 선택했을 때 정답 표시
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-start">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    selectedAnswer === option 
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                      : selectedAnswer !== null && option === currentQuestion.correctAnswer
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                  } mr-3 font-bold transition-all duration-300`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg mt-1 hanja-text" style={{ fontFamily: "var(--font-noto-serif-kr), 'Batang', serif" }}>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Link
            href="/level-test-static"
            className="px-5 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-300"
          >
            테스트 중단
          </Link>
          
          {selectedAnswer === null ? (
            <button
              onClick={(e) => {
                e.preventDefault(); // 이벤트 기본 동작 방지
                console.log('문제 건너뛰기 버튼 클릭');
                if (currentQuestionIndex < shuffledQuestions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setTimeRemaining(60); // 타이머 리셋
                } else {
                  // 마지막 문제에서 건너뛰기시 결과 페이지로
                  window.location.href = `/level-test-static/result?score=${userScore}&total=${shuffledQuestions.length}&category=${category}`;
                }
              }}
              className="px-5 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors duration-300"
            >
              문제 건너뛰기
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault(); // 이벤트 기본 동작 방지
                console.log('다음 문제 버튼 클릭');
                if (currentQuestionIndex < shuffledQuestions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setSelectedAnswer(null);
                  setTimeRemaining(60); // 타이머 리셋
                } else {
                  // 마지막 문제는 결과 페이지로
                  window.location.href = `/level-test-static/result?score=${userScore + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)}&total=${shuffledQuestions.length}&category=${category}`;
                }
              }}
              className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              다음 문제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}