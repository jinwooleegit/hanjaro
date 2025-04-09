import React, { useEffect, useRef } from 'react';

export interface LevelCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LevelCategorySelectorProps {
  categories: LevelCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const LevelCategorySelector: React.FC<LevelCategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  // 각 버튼에 대한 refs 생성
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 직접 DOM에 접근해 이벤트 추가
  useEffect(() => {
    // 버튼이 마운트된 후 실행
    console.log("LevelCategorySelector useEffect - 버튼 refs:", buttonRefs.current);
    
    buttonRefs.current.forEach((buttonRef, index) => {
      if (buttonRef) {
        const categoryId = categories[index]?.id;
        console.log(`버튼 ${index} (${categoryId}) DOM 요소에 직접 이벤트 리스너 등록`);
        
        // 기존 이벤트 리스너 제거
        const clonedButton = buttonRef.cloneNode(true) as HTMLButtonElement;
        if (buttonRef.parentNode) {
          buttonRef.parentNode.replaceChild(clonedButton, buttonRef);
          buttonRefs.current[index] = clonedButton;
        }
        
        // 새 DOM 이벤트 리스너 추가
        clonedButton.addEventListener('click', () => {
          console.log(`버튼 ${categoryId} 직접 DOM 클릭 이벤트 발생`);
          if (categoryId) {
            onCategorySelect(categoryId);
          }
        });
      }
    });
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      buttonRefs.current.forEach((buttonRef) => {
        if (buttonRef) {
          // 정리 로직 (필요 시)
        }
      });
    };
  }, [categories, onCategorySelect]);

  // Get difficulty class for styling
  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-200 bg-green-50';
      case 'intermediate':
        return 'border-blue-200 bg-blue-50';
      case 'advanced':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Get difficulty label for display
  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return '기본';
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">테스트 유형 선택</h2>
      <p className="text-gray-600 mb-6">
        자신의 목표와 현재 실력에 맞는 테스트 유형을 선택하세요.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <button
            key={category.id}
            ref={(el: HTMLButtonElement | null) => { buttonRefs.current[index] = el; }}
            data-category-id={category.id}
            type="button"
            className={`flex items-start p-4 border-2 rounded-lg transition-all ${
              selectedCategory === category.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex-shrink-0 mr-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getDifficultyClass(category.difficulty)}`}>
                <span className="text-lg">{category.icon}</span>
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{category.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  category.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  category.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {getDifficultyLabel(category.difficulty)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{category.description}</p>
              <p className="mt-2 font-bold text-red-500">클릭하세요!</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelCategorySelector; 