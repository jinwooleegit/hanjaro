import Link from 'next/link';
import TAGS_DATA from '../../../../data/tags.json';

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

// 동적 메타데이터
export async function generateMetadata({ params }: { params: { category: string; tag: string } }) {
  const { category, tag } = params;
  
  // 해당 태그 정보 찾기
  const categoryData = TAGS_DATA.tag_categories.find((cat: TagCategory) => cat.id === category);
  const tagData = categoryData?.tags.find((t: Tag) => t.id === tag);
  
  if (!tagData) {
    return {
      title: '태그를 찾을 수 없습니다 - 한자로',
      description: '요청하신 태그를 찾을 수 없습니다.'
    };
  }
  
  return {
    title: `${tagData.name} 한자 - 한자로`,
    description: tagData.description
  };
}

// 태그 카테고리별 색상 매핑
const getCategoryStyles = (categoryId: string) => {
  const styles: Record<string, { bg: string, border: string, text: string }> = {
    'meaning': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    'difficulty': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    'radical': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    'usage': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
    'education': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  };
  
  return styles[categoryId] || styles['meaning'];
};

const TagPage = ({ params }: { params: { category: string; tag: string } }) => {
  const { category, tag } = params;
  
  // 해당 태그 정보 찾기
  const categoryData = TAGS_DATA.tag_categories.find((cat: TagCategory) => cat.id === category);
  const tagData = categoryData?.tags.find((t: Tag) => t.id === tag);
  
  // 태그를 찾을 수 없는 경우
  if (!tagData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">태그를 찾을 수 없습니다</h1>
          <p className="text-lg text-slate-600 mb-8">요청하신 태그 정보를 찾을 수 없습니다.</p>
          <Link 
            href="/tags" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition"
          >
            모든 태그 보기
          </Link>
        </div>
      </div>
    );
  }
  
  // 해당 카테고리 스타일 가져오기
  const styles = getCategoryStyles(category);
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/tags" 
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            모든 태그로 돌아가기
          </Link>
        </div>
        
        <div className="mb-12">
          <div className="flex items-center mb-2">
            <span className={`inline-block px-3 py-1 ${styles.bg} ${styles.text} rounded-full text-sm font-medium mr-2`}>
              {categoryData?.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-slate-800">{tagData.name} 한자</h1>
          <p className="text-lg text-slate-600 max-w-3xl">{tagData.description}</p>
        </div>
        
        {/* 한자 목록 섹션 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-200">
            {tagData.name} 관련 한자 <span className="text-sm font-normal text-slate-500">({tagData.examples.length}자)</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tagData.examples.map((character, idx) => (
              <Link
                key={idx}
                href={`/learn/hanja/${character}`}
                className="aspect-square flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition"
              >
                <span className="text-4xl mb-2">{character}</span>
                <span className="text-xs text-slate-500">자세히 보기</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* 다른 태그 탐색 섹션 */}
        {categoryData && categoryData.tags.length > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-200">
              다른 {categoryData.name} 태그 탐색하기
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {categoryData.tags.filter(t => t.id !== tag).map((otherTag) => (
                <Link
                  key={otherTag.id}
                  href={`/tags/${category}/${otherTag.id}`}
                  className={`inline-block px-4 py-2 ${styles.bg} ${styles.text} border ${styles.border} rounded-full hover:shadow-md transition`}
                >
                  {otherTag.name} <span className="text-xs">({otherTag.examples.length})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
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

export default TagPage; 