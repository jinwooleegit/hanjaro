import Link from 'next/link';
import TAGS_DATA from '../../data/tags.json';

// 메타데이터
export const metadata = {
  title: '한자 태그 목록 - 한자로',
  description: '다양한 분류로 한자를 탐색하고 학습해보세요.',
};

// 태그 데이터 타입 정의
interface Tag {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
}

interface TagData {
  tag_categories: TagCategory[];
}

// 카테고리별 색상 설정
const getCategoryColor = (category: string): string => {
  const colors: Record<string, { bg: string, border: string, text: string }> = {
    'meaning': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    'difficulty': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    'radical': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    'usage': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
    'education': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  };
  
  return colors[category] ? colors[category].bg : 'bg-gray-50';
};

// 카테고리별 텍스트 색상 설정
const getCategoryTextColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'text-blue-800',
    'difficulty': 'text-yellow-800',
    'radical': 'text-green-800',
    'usage': 'text-purple-800',
    'education': 'text-red-800',
  };
  
  return colors[category] || 'text-gray-800';
};

// 카테고리별 테두리 색상 설정
const getCategoryBorderColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'border-blue-200',
    'difficulty': 'border-yellow-200',
    'radical': 'border-green-200',
    'usage': 'border-purple-200',
    'education': 'border-red-200',
  };
  
  return colors[category] || 'border-gray-200';
};

// 카테고리별 호버 색상 설정
const getCategoryHoverColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'hover:bg-blue-100',
    'difficulty': 'hover:bg-yellow-100',
    'radical': 'hover:bg-green-100',
    'usage': 'hover:bg-purple-100',
    'education': 'hover:bg-red-100',
  };
  
  return colors[category] || 'hover:bg-gray-100';
};

const TagsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">다양한 분류로 한자 탐색하기</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            의미, 난이도, 부수별로 한자를 탐색하고 원하는 주제별로 학습해보세요.
          </p>
        </div>
        
        {TAGS_DATA.tag_categories.map((category: TagCategory) => (
          <div key={category.id} className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{category.name}</h2>
              <span className="text-slate-500 text-sm">{category.tags.length}개 태그</span>
            </div>
            <p className="mb-6 text-slate-600">{category.description}</p>
            
            {/* 태그 클라우드 형태로 표시 */}
            <div className={`${getCategoryColor(category.id)} rounded-3xl p-8 shadow-inner border ${getCategoryBorderColor(category.id)}`}>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {category.tags.map((tag: Tag) => {
                  // 태그의 크기와 중요도는 예제 수에 비례
                  const importance = Math.min(Math.max(tag.examples.length, 5) / 20, 1); // 0.25 ~ 1 범위로 정규화
                  const fontSize = 0.8 + importance * 0.6; // 0.8rem ~ 1.4rem
                  const fontWeight = importance > 0.7 ? 'font-semibold' : importance > 0.4 ? 'font-medium' : 'font-normal';
                  const opacity = 0.7 + importance * 0.3; // 0.7 ~ 1.0
                  
                  return (
                    <Link 
                      key={tag.id} 
                      href={`/tags/${category.id}/${tag.id}`}
                      className={`inline-block px-4 py-2 rounded-full bg-white shadow-sm 
                                 hover:shadow-md transition transform hover:-translate-y-1
                                 ${getCategoryTextColor(category.id)} border ${getCategoryBorderColor(category.id)}
                                 ${getCategoryHoverColor(category.id)}`}
                      style={{ 
                        fontSize: `${fontSize}rem`,
                        opacity: opacity,
                      }}
                    >
                      <div className="flex items-center">
                        <span className={fontWeight}>{tag.name}</span>
                        <span className="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {tag.examples.length}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center mt-12">
          <Link 
            href="/learn" 
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
          >
            한자 학습 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TagsPage; 