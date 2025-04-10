import React from 'react';
import Link from 'next/link';

type LearningPathProps = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  targetAudience: string;
  estimatedDuration: string;
  stageCount: number;
  progress?: number;
  showProgress?: boolean;
};

const difficultyColors = {
  beginner: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  intermediate: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  advanced: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200'
  },
  expert: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  }
};

const LearningPathCard: React.FC<LearningPathProps> = ({
  id,
  name,
  description,
  difficulty,
  targetAudience,
  estimatedDuration,
  stageCount,
  progress = 0,
  showProgress = false
}) => {
  const colorScheme = difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;
  
  return (
    <div className={`border ${colorScheme.border} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div className={`${colorScheme.bg} px-4 py-3 border-b ${colorScheme.border}`}>
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      
      <div className="p-4">
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <span className="text-sm text-gray-500 block">대상</span>
            <span className="font-medium">{targetAudience}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">난이도</span>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorScheme.bg} ${colorScheme.text}`}>
              {difficulty === 'beginner' ? '초급' : 
               difficulty === 'intermediate' ? '중급' : 
               difficulty === 'advanced' ? '고급' : '전문가'}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">예상 소요 시간</span>
            <span className="font-medium">{estimatedDuration}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">학습 단계</span>
            <span className="font-medium">{stageCount}단계</span>
          </div>
        </div>
        
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">진행 상황</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  progress < 30 ? 'bg-red-500' : 
                  progress < 70 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <Link 
            href={`/learn/path/${id}`}
            className={`block w-full text-center px-4 py-2 rounded-md ${colorScheme.bg} ${colorScheme.text} hover:opacity-90 transition-opacity`}
          >
            {showProgress && progress > 0 ? '학습 계속하기' : '학습 시작하기'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard; 