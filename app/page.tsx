import Link from 'next/link';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import hanjaDataManager, { Category } from '../data';
import TodayRecommendedHanja from './components/TodayRecommendedHanja';
import SearchBar from './components/SearchBar';

// 태그 데이터는 클라이언트 컴포넌트에서만 필요할 때 로딩하도록 변경
// import TAGS_DATA from '../data/tags.json';

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

interface TagCloudItem {
  id: string;
  name: string;
  category: string;
  weight: number;
  color: string;
}

// 미리 정의된 태그 데이터 (정적)
const precomputedTags: TagCloudItem[] = [
  // 의미 태그 (정적 가중치로 변경)
  { id: 'nature', name: '자연', category: 'meaning', weight: 4, color: 'text-blue-700' },
  { id: 'human', name: '인간', category: 'meaning', weight: 3, color: 'text-blue-600' },
  { id: 'body', name: '신체', category: 'meaning', weight: 5, color: 'text-blue-800' },
  { id: 'time', name: '시간', category: 'meaning', weight: 2, color: 'text-blue-700' },
  { id: 'place', name: '장소', category: 'meaning', weight: 3, color: 'text-blue-600' },
  { id: 'action', name: '행동', category: 'meaning', weight: 4, color: 'text-blue-800' },
  { id: 'attribute', name: '속성', category: 'meaning', weight: 2, color: 'text-blue-700' },
  
  // 난이도 태그
  { id: 'beginner', name: '초급 (1-4획)', category: 'difficulty', weight: 4, color: 'text-yellow-600' },
  { id: 'intermediate', name: '중급 (5-9획)', category: 'difficulty', weight: 3, color: 'text-yellow-700' },
  { id: 'advanced', name: '고급 (10획 이상)', category: 'difficulty', weight: 3, color: 'text-yellow-800' }
];

// 태그 구름용 태그 데이터 준비 - 간소화된 버전
const getTagsForCloud = (): TagCloudItem[] => {
  return precomputedTags;
};

// 카테고리별 색상 설정 - 정적 할당으로 변경
const getTagColor = (category: string): string => {
  const colors: Record<string, string> = {
    'meaning': 'text-blue-700',
    'difficulty': 'text-yellow-700',
    'radical': 'text-green-700',
    'usage': 'text-purple-700',
    'education': 'text-red-700',
  };
  
  return colors[category] || colors['meaning'];
};

// 학교급별 스타일 매핑
const gradeStyles: Record<string, { bgColor: string; borderColor: string; textColor: string }> = {
  '초등학교': {
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  '중학교': {
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  },
  '고등학교': {
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800'
  },
  '대학교': {
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-800'
  }
};

// 카테고리 데이터를 학교급별 데이터로 변환하는 함수
function transformCategoryToGrades(categories: Category[]) {
  const basicCategory = categories.find(cat => cat.id === 'basic');
  if (!basicCategory) return [];
  
  // 학교급별 레벨 그룹화
  const gradeMap: Record<string, any> = {
    '초등학교': { grade: '초등학교', levels: [] },
    '중학교': { grade: '중학교', levels: [] },
    '고등학교': { grade: '고등학교', levels: [] },
    '대학교': { grade: '대학교', levels: [] }
  };
  
  // 레벨 ID 접두사에 따라 분류
  basicCategory.levels.forEach(level => {
    let grade: string | undefined;
    let levelNumber: number;
    
    if (level.id.startsWith('level')) {
      levelNumber = parseInt(level.id.replace('level', ''));
      if (levelNumber <= 4) {
        grade = '초등학교';
      } else if (levelNumber <= 6) {
        grade = '중학교';
      }
    } else if (level.id.startsWith('advanced-level')) {
      levelNumber = parseInt(level.id.replace('advanced-level', ''));
      if (levelNumber <= 3) {
        grade = '고등학교';
      }
    } else if (level.id.startsWith('university-level')) {
      grade = '대학교';
    }
    
    if (grade && gradeMap[grade]) {
      const style = gradeStyles[grade];
      
      gradeMap[grade].levels.push({
        level: level.name,
        description: level.description,
        characters: level.characters.slice(0, 5), // 최대 5개만 표시
        levelPath: level.id,
        ...style
      });
    }
  });
  
  // 빈 배열 제거 후 반환
  return Object.values(gradeMap).filter(item => item.levels.length > 0);
}

// 가상의 학습 진행도 데이터 (실제로는 API나 상태 관리에서 가져와야 함)
const progressData = {
  daily: {
    target: 5, // 하루 목표 한자 수
    completed: 8, // 오늘 학습한 한자 수
    percentage: 160 // 목표 대비 달성률 (%)
  },
  weekly: {
    target: 25, // 주간 목표 한자 수
    completed: 20, // 이번 주 학습한 한자 수
    percentage: 80 // 목표 대비 달성률 (%)
  }
};

export default async function Home() {
  const session = await getServerSession();
  
  // 카테고리 데이터 가져오기
  const categories = await hanjaDataManager.getAllCategories();
  
  // 카테고리 데이터를 학교급별 데이터로 변환
  const gradeData = transformCategoryToGrades(categories);
  
  // 진행 데이터 (임시 데이터 - 실제로는 DB에서 가져옴)
  const progressData = {
    daily: {
      completed: 15,
      target: 20,
      percentage: 75
    },
    weekly: {
      completed: 85,
      target: 100,
      percentage: 85
    }
  };
  
  // 태그 클라우드 데이터 가져오기
  const tagCloudData = getTagsForCloud();
  
  // 오늘의 랜덤 한자 선택
  const allCharacters = gradeData.flatMap(grade => 
    grade.levels.flatMap((level: { characters: string[] }) => level.characters)
  );
  
  // 랜덤으로 5개 선택
  const getRandomChars = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const randomChars = getRandomChars(allCharacters, 5);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-14 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              한자로
              <span className="text-yellow-300"> 배우는 세상</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl">
              체계적인 학습 과정과 다양한 연습 기능으로 한자 마스터하기
            </p>
            
            {/* 검색 컴포넌트 */}
            <div className="w-full max-w-2xl">
              <SearchBar placeholder="한자, 뜻, 음으로 검색하기" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 오늘의 추천 한자 */}
        <TodayRecommendedHanja characters={randomChars.slice(0, 3)} />
        
        {/* 가입/로그인 유도 섹션 (비로그인 사용자만) */}
        {!session && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-10 shadow-md border border-purple-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  학습 진행 상황을 추적하고 싶으신가요?
                </h3>
                <p className="text-purple-700">
                  회원가입 후 학습 진행 상황을 저장하고, 개인화된 학습 계획을 세워보세요.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/api/auth/signin"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition transform hover:scale-105"
                >
                  로그인
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="px-6 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-full font-medium transition transform hover:scale-105"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* 학습 진행 상황 (로그인 사용자만) */}
        {session && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">학습 진행 상황</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 일일 진행 상황 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-blue-800">오늘의 학습</h3>
                  <span className="text-sm text-blue-600 font-medium">
                    {progressData.daily.completed}/{progressData.daily.target} 한자
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(progressData.daily.percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  목표 달성률: {progressData.daily.percentage}%
                  {progressData.daily.percentage >= 100 && " 🎉"}
                </p>
              </div>
              
              {/* 주간 진행 상황 */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-green-800">이번 주 학습</h3>
                  <span className="text-sm text-green-600 font-medium">
                    {progressData.weekly.completed}/{progressData.weekly.target} 한자
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(progressData.weekly.percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  목표 달성률: {progressData.weekly.percentage}%
                  {progressData.weekly.percentage >= 100 && " 🎉"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 학습 과정 섹션 */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">학습 커리큘럼</h2>
            <Link 
              href="/learn" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              전체 보기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gradeData.map((grade) => (
              <div 
                key={grade.grade}
                className={`${grade.bgColor} p-5 rounded-xl border ${grade.borderColor} shadow-sm hover:shadow-md transition duration-300`}
              >
                <h3 className={`text-lg font-bold mb-3 ${grade.textColor}`}>{grade.grade}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {grade.grade === '초등학교' && '쉬운 기초 한자부터 단계별 학습'}
                  {grade.grade === '중학교' && '중등 교과 과정에 필요한 한자 학습'}
                  {grade.grade === '고등학교' && '고교 수준의 심화 한자 학습'}
                  {grade.grade === '대학교' && '전문 분야별 한자 학습'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {grade.levels.slice(0, 3).map((level: any, index: number) => (
                    <span 
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${grade.textColor} bg-white bg-opacity-50`}
                    >
                      {level.level}
                    </span>
                  ))}
                  {grade.levels.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full text-gray-600 bg-white bg-opacity-50">
                      +{grade.levels.length - 3}
                    </span>
                  )}
                </div>
                
                <Link
                  href={`/learn?grade=${encodeURIComponent(grade.grade)}`}
                  className={`block text-center py-2 px-4 rounded-lg ${grade.textColor.replace('text', 'bg')} text-white text-sm font-medium hover:opacity-90 transition`}
                >
                  학습 시작하기
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* 학습 기능 소개 섹션 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">다양한 학습 기능</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 기능 1: 한자 쓰기 연습 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg text-blue-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">한자 쓰기 연습</h3>
              <p className="text-gray-600 text-sm mb-4">
                획순과 함께 한자 쓰기를 연습하고 자동으로 평가받을 수 있습니다.
              </p>
              <Link
                href="/writing-practice"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                시작하기 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* 기능 2: 퀴즈로 배우기 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg text-green-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">퀴즈로 배우기</h3>
              <p className="text-gray-600 text-sm mb-4">
                다양한 유형의 퀴즈를 통해 재미있게 한자를 익히고 복습할 수 있습니다.
              </p>
              <Link
                href="/quiz"
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
              >
                시작하기 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* 기능 3: 한자 카드 복습 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg text-purple-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">한자 카드 복습</h3>
              <p className="text-gray-600 text-sm mb-4">
                플래시 카드 형식으로 효율적인 학습과 주기적 복습을 진행할 수 있습니다.
              </p>
              <Link
                href="/review"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
              >
                시작하기 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* 학습 팁 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-12 border border-blue-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">한자 학습 팁</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">규칙적인 학습</h3>
                <p className="text-sm text-gray-600">매일 조금씩 꾸준히 학습하는 것이 가장 효과적입니다.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">맥락 속에서 학습</h3>
                <p className="text-sm text-gray-600">단일 한자보다 한자어나 문장 속에서 학습하면 기억에 오래 남습니다.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">부수 학습</h3>
                <p className="text-sm text-gray-600">부수를 먼저 익히면 새로운 한자를 더 쉽게 배울 수 있습니다.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">손으로 직접 쓰기</h3>
                <p className="text-sm text-gray-600">한자를 손으로 직접 쓰면 뇌에 더 깊이 각인됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 