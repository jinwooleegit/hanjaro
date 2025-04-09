import React, { useState } from 'react';

export interface TestQuestion {
  id: string | number;
  level: number;
  question: string;
  questionType: 'hanja-to-meaning' | 'meaning-to-hanja' | 'pronunciation' | 'usage' | 'meaning' | 'reading' | 'character' | 'combination' | 'idiom' | 'vocabulary' | 'stroke' | 'radical';
  options: string[];
  correctAnswer: string;
  hanja?: string;
}

interface LevelTestQuestionProps {
  question: TestQuestion;
  onAnswerSubmit: (selectedAnswer: string) => void;
  onSkipQuestion: () => void;
}

const LevelTestQuestion: React.FC<LevelTestQuestionProps> = ({
  question,
  onAnswerSubmit,
  onSkipQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption) {
      onAnswerSubmit(selectedOption);
      setSelectedOption(null);
    }
  };

  const getQuestionTypeText = (type: string): string => {
    switch (type) {
      case 'hanja-to-meaning':
        return '한자의 뜻을 고르세요';
      case 'meaning-to-hanja':
        return '뜻에 맞는 한자를 고르세요';
      case 'pronunciation':
        return '한자의 음을 고르세요';
      case 'usage':
        return '한자의 용례를 고르세요';
      case 'meaning':
        return '한자의 뜻을 고르세요';
      case 'reading':
        return '한자의 음을 고르세요';
      case 'character':
        return '한글에 해당하는 한자를 고르세요';
      case 'combination':
        return '한자의 조합을 고르세요';
      case 'idiom':
        return '한자성어의 의미를 고르세요';
      case 'vocabulary':
        return '한자 어휘를 고르세요';
      case 'stroke':
        return '한자의 획수를 고르세요';
      case 'radical':
        return '한자의 부수를 고르세요';
      default:
        return '문제';
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg">
      <h2 className="text-lg text-gray-600 mb-2">{getQuestionTypeText(question.questionType)}</h2>
      
      {question.hanja && (
        <div className="text-center my-4">
          <span className="text-6xl font-semibold hanja-text" style={{ fontFamily: "var(--font-noto-serif-kr), 'Batang', serif" }}>{question.hanja}</span>
        </div>
      )}
      
      <p className="text-xl font-medium text-gray-800 mb-6">{question.question}</p>
      
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`w-full p-4 text-left rounded-lg border transition-colors ${
              selectedOption === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="inline-block w-6 h-6 mr-3 text-center rounded-full bg-gray-200">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="hanja-text" style={{ fontFamily: "var(--font-noto-serif-kr), 'Batang', serif" }}>{option}</span>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onSkipQuestion}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          건너뛰기
        </button>
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedOption}
          className={`px-6 py-2 rounded-lg transition-colors ${
            selectedOption
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음 문제
        </button>
      </div>
    </div>
  );
};

export default LevelTestQuestion; 