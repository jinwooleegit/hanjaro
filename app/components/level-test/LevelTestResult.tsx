import React from 'react';
import { useRouter } from 'next/navigation';
import { TestQuestion } from './LevelTestQuestion';
import Link from 'next/link';

interface LevelTestResultProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  recommendedLevel: number;
  answeredQuestions: {
    question: TestQuestion;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  onRetakeTest: () => void;
  testCategory?: string;
}

const LevelTestResult: React.FC<LevelTestResultProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  recommendedLevel,
  answeredQuestions,
  onRetakeTest,
  testCategory,
}) => {
  const router = useRouter();
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMessageByScore = (score: number): string => {
    if (score >= 80) return '탁월한 실력입니다!';
    if (score >= 60) return '좋은 실력입니다.';
    if (score >= 40) return '기본기가 있습니다.';
    return '아직 기초 단계입니다.';
  };

  // 실제 급수 계산 함수
  const getRankByLevel = (level: number): string => {
    // 15단계 순위 체계로 변환
    const adjustedRank = 16 - level; // 5급이 15-5=10급, 1급이 15-1=14급으로 변환
    
    // 레벨 구간별로 표시
    if (adjustedRank >= 12) {
      return `${adjustedRank}급 (초급)`;
    } else if (adjustedRank >= 9) {
      return `${adjustedRank}급 (중급)`;
    } else if (adjustedRank >= 6) {
      return `${adjustedRank}급 (고급)`;
    } else if (adjustedRank >= 3) {
      return `${adjustedRank}급 (전문가)`;
    } else {
      return `${adjustedRank}급 (명인)`;
    }
  };

  const getRecommendationByLevel = (level: number): string => {
    // 15단계 순위 체계 기준으로 추천 메시지 수정
    switch (level) {
      case 5:
        return '고급 과정을 학습하시는 것을 추천합니다.';
      case 4:
        return '중상급 과정을 학습하시는 것을 추천합니다.';
      case 3:
        return '중급 과정을 학습하시는 것을 추천합니다.';
      case 2:
        return '초중급 과정을 학습하시는 것을 추천합니다.';
      case 1:
      default:
        return '기초 과정부터 학습하시는 것을 추천합니다.';
    }
  };

  // 추천 학습 경로 생성 함수
  const getRecommendedPath = (): string => {
    // 테스트 카테고리를 확인하여 적절한 경로 추천
    const category = testCategory || 'basic'; // 기본값은 basic
    
    // 카테고리별 적절한 경로 매핑
    const categoryPathMap: Record<string, string> = {
      'basic': '/learn/level/elementary-level1', // 기본 테스트는 항상 초등 레벨로
      'intermediate': recommendedLevel >= 3 ? '/learn/level/middle-level1' : '/learn/level/elementary-level1',
      'advanced': recommendedLevel >= 3 ? '/learn/level/high-level1' : '/learn/level/middle-level1',
      'comprehensive': '/learn/level/' + (
        recommendedLevel >= 4 ? 'university-level1' : 
        recommendedLevel >= 3 ? 'high-level1' : 
        recommendedLevel >= 2 ? 'middle-level1' : 
        'elementary-level1'
      )
    };
    
    // 카테고리에 해당하는 경로 반환, 없으면 기본 경로
    return categoryPathMap[category] || '/learn/level/elementary-level1';
  };

  // 배지 이미지 선택
  const getBadgeImage = (): string => {
    // 실제 레벨에 따른 배지 이미지 경로 반환
    const adjustedRank = 16 - recommendedLevel; // 레벨을 순위로 변환
    return `/icons/badges/level${adjustedRank}.png`;
  };
  
  // 배지 CSS 클래스 선택
  const getBadgeClass = (): string => {
    const adjustedRank = 16 - recommendedLevel; // 레벨을 순위로 변환
    return `badge-level${adjustedRank}`;
  };
  
  // 배지 색상 선택 - 더 이상 필요 없음
  const getBadgeColor = (): string => {
    const adjustedRank = 16 - recommendedLevel;
    if (adjustedRank <= 3) return 'bg-yellow-500'; // 금색 (1-3급)
    if (adjustedRank <= 6) return 'bg-red-500';    // 빨간색 (4-6급) 
    if (adjustedRank <= 9) return 'bg-blue-500';   // 파란색 (7-9급)
    if (adjustedRank <= 12) return 'bg-green-500'; // 초록색 (10-12급)
    return 'bg-amber-700';                         // 청동색 (13-15급)
  };

  return (
    <div className="flex flex-col p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-8">테스트 결과</h1>
      
      <div className="flex justify-center items-center mb-10">
        <div className="w-40 h-40 rounded-full flex items-center justify-center border-8 border-blue-100">
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-xl mb-2">{getMessageByScore(score)}</p>
        <p className="text-lg font-medium">
          총 {totalQuestions}문제 중 {correctAnswers}문제 정답
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xl font-semibold mb-2">추천 레벨: {getRankByLevel(recommendedLevel)}</p>
          <p className="text-gray-700">{getRecommendationByLevel(recommendedLevel)}</p>
          
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-24 relative">
              {/* CSS 클래스를 사용하여 배지 표시 */}
              <div 
                className={`badge-icon ${getBadgeClass()} w-24 h-24`}
                title={`${getRankByLevel(recommendedLevel)} 배지`}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">답안 분석</h2>
        <div className="space-y-4">
          {answeredQuestions.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                item.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">문제 {index + 1}</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.isCorrect ? '정답' : '오답'}
                </span>
              </div>
              
              {item.question.hanja && (
                <p className="text-2xl mb-2">{item.question.hanja}</p>
              )}
              
              <p className="mb-2">{item.question.question}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                <span className="font-medium mr-2">내 답안:</span>
                <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {item.userAnswer}
                </span>
                
                {!item.isCorrect && (
                  <>
                    <span className="mx-2 hidden sm:inline">|</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">정답:</span>
                      <span className="text-green-600">{item.question.correctAnswer}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onRetakeTest}
          className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          다시 테스트하기
        </button>
        <Link
          href={getRecommendedPath()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          추천 레벨로 학습 시작하기
        </Link>
      </div>
    </div>
  );
};

export default LevelTestResult; 