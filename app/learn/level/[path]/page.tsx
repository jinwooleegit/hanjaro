import { getHanjaLevel, getCharactersForLevel } from '@/utils/hanjaUtils';
import HanjaList from '../../../components/HanjaList';
import Link from 'next/link';

type LevelPageProps = {
  params: {
    path: string;
  };
};

export default function LevelPage({ params }: LevelPageProps) {
  // path는 'category-level' 형식 (예: 'elementary-level1')
  const pathParts = params.path.split('-');
  const categoryId = pathParts[0];
  const levelId = pathParts.length > 1 ? pathParts.slice(1).join('-') : '';
  
  const level = getHanjaLevel(categoryId, levelId);
  const characters = getCharactersForLevel(categoryId, levelId);

  // 카테고리별 색상 정의
  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'elementary':
        return {
          gradient: 'from-blue-600 to-blue-800',
          lightGradient: 'from-blue-50 to-blue-100',
          text: 'text-blue-100',
          highlight: 'text-yellow-300',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'middle':
        return {
          gradient: 'from-green-600 to-green-800',
          lightGradient: 'from-green-50 to-green-100',
          text: 'text-green-100',
          highlight: 'text-yellow-300',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'high':
        return {
          gradient: 'from-yellow-600 to-yellow-800',
          lightGradient: 'from-yellow-50 to-yellow-100',
          text: 'text-yellow-100',
          highlight: 'text-white',
          border: 'border-yellow-200',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'university':
        return {
          gradient: 'from-pink-600 to-pink-800',
          lightGradient: 'from-pink-50 to-pink-100',
          text: 'text-pink-100',
          highlight: 'text-yellow-300',
          border: 'border-pink-200',
          button: 'bg-pink-600 hover:bg-pink-700'
        };
      case 'expert':
        return {
          gradient: 'from-purple-600 to-purple-800',
          lightGradient: 'from-purple-50 to-purple-100',
          text: 'text-purple-100',
          highlight: 'text-yellow-300',
          border: 'border-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          gradient: 'from-blue-600 to-blue-800',
          lightGradient: 'from-blue-50 to-blue-100',
          text: 'text-blue-100',
          highlight: 'text-yellow-300',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getCategoryColor(categoryId);

  // 카테고리 이름 매핑
  const getCategoryName = (catId: string) => {
    switch (catId) {
      case 'elementary': return '초등학교';
      case 'middle': return '중학교';
      case 'high': return '고등학교';
      case 'university': return '대학';
      case 'expert': return '전문가';
      default: return '';
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className={`bg-gradient-to-r from-red-600 to-red-800 text-white py-12 px-4`}>
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">존재하지 않는 레벨</h1>
            <p className="text-xl text-white/80 mb-6">
              요청하신 레벨을 찾을 수 없습니다.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto p-4 pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="mb-6 text-lg text-gray-600">
                입력하신 경로 "{params.path}"에 해당하는 레벨 정보가 없습니다.<br />
                올바른 카테고리와 레벨을 선택해주세요.
              </p>
              <Link 
                href="/learn" 
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
              >
                학습 메인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 헤더 섹션 */}
      <div className={`bg-gradient-to-r ${colors.gradient} text-white py-12 px-4`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <Link href="/learn" className="text-white/80 hover:text-white flex items-center transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              학습 메인으로
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-3">
            <span className={colors.highlight}>{getCategoryName(categoryId)}</span> {level.name}
          </h1>
          <p className={`text-xl ${colors.text} mb-2`}>{level.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              카테고리: {getCategoryName(categoryId)}
            </span>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              레벨: {level.name}
            </span>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              한자 수: {characters.length}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-8">
        <div className="max-w-5xl mx-auto">
          <HanjaList 
            characters={characters} 
            categoryId={categoryId} 
            levelId={levelId} 
          />
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link 
              href="/learn" 
              className="inline-block px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-full shadow-md transition transform hover:scale-105"
            >
              다른 레벨 선택하기
            </Link>
            
            <Link 
              href="/quiz" 
              className={`inline-block px-8 py-3 ${colors.button} text-white font-semibold rounded-full shadow-md transition transform hover:scale-105`}
            >
              퀴즈로 복습하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 