import Link from 'next/link';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import TAGS_DATA from '../data/tags.json';

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

// 태그 구름용 태그 데이터 준비
const getTagsForCloud = (): TagCloudItem[] => {
  // 의미 카테고리의 태그만 우선 사용
  const meaningTags = TAGS_DATA.tag_categories.find((cat: TagCategory) => cat.id === 'meaning')?.tags || [];
  
  // 난이도 태그 추가
  const difficultyTags = TAGS_DATA.tag_categories.find((cat: TagCategory) => cat.id === 'difficulty')?.tags || [];
  
  // 필요한 태그 속성만 추출하여 가중치(weight)를 무작위로 부여
  return [
    ...meaningTags.map((tag: Tag) => ({
      id: tag.id,
      name: tag.name,
      category: 'meaning',
      weight: Math.floor(Math.random() * 5) + 1, // 1-5 사이의 가중치
      color: getTagColor('meaning'),
    })),
    ...difficultyTags.map((tag: Tag) => ({
      id: tag.id,
      name: tag.name,
      category: 'difficulty',
      weight: Math.floor(Math.random() * 3) + 2, // 2-4 사이의 가중치
      color: getTagColor('difficulty'),
    }))
  ];
};

// 카테고리별 색상 설정
const getTagColor = (category: string): string => {
  const colors: Record<string, string[]> = {
    'meaning': ['text-blue-600', 'text-blue-700', 'text-blue-800'],
    'difficulty': ['text-yellow-600', 'text-yellow-700', 'text-yellow-800'],
    'radical': ['text-green-600', 'text-green-700', 'text-green-800'],
    'usage': ['text-purple-600', 'text-purple-700', 'text-purple-800'],
    'education': ['text-red-600', 'text-red-700', 'text-red-800'],
  };
  
  const categoryColors = colors[category] || colors['meaning'];
  const randomIndex = Math.floor(Math.random() * categoryColors.length);
  return categoryColors[randomIndex];
};

// 학교급별 한자 레벨 데이터
const levelData = [
  {
    grade: '초등학교',
    levels: [
      {
        level: '초등 1단계',
        description: '기초 한자 5글자',
        characters: ['大', '小', '中', '山', '水'],
        levelPath: 'elementary-level1',
        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      },
      {
        level: '초등 2단계',
        description: '기초 한자 5글자',
        characters: ['人', '木', '火', '土', '日'],
        levelPath: 'elementary-level2',
        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
        borderColor: 'border-blue-200', 
        textColor: 'text-blue-800'
      },
      {
        level: '초등 3단계',
        description: '기초 한자 5글자',
        characters: ['月', '金', '石', '田', '白'],
        levelPath: 'elementary-level3',
        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      },
      {
        level: '초등 4단계',
        description: '기초 한자 5글자',
        characters: ['天', '地', '學', '生', '先'],
        levelPath: 'elementary-level4',
        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      }
    ]
  },
  {
    grade: '중학교',
    levels: [
      {
        level: '중등 1단계',
        description: '중급 한자 5글자',
        characters: ['力', '刀', '門', '米', '竹'],
        levelPath: 'middle-level1',
        bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      {
        level: '중등 2단계',
        description: '중급 한자 5글자',
        characters: ['貝', '車', '雨', '足', '音'],
        levelPath: 'middle-level2',
        bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      {
        level: '중등 3단계',
        description: '중급 한자 5글자',
        characters: ['心', '手', '口', '目', '耳'],
        levelPath: 'middle-level3',
        bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      }
    ]
  },
  {
    grade: '고등학교',
    levels: [
      {
        level: '고등 1단계',
        description: '고급 한자 5글자',
        characters: ['義', '知', '理', '信', '勇'],
        levelPath: 'high-level1',
        bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800'
      },
      {
        level: '고등 2단계',
        description: '고급 한자 5글자',
        characters: ['德', '愛', '美', '善', '誠'],
        levelPath: 'high-level2',
        bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800'
      },
      {
        level: '고등 3단계',
        description: '고급 한자 5글자',
        characters: ['智', '勤', '敬', '謙', '和'],
        levelPath: 'high-level3',
        bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800'
      }
    ]
  },
  {
    grade: '대학교',
    levels: [
      {
        level: '대학 1단계',
        description: '심화 한자 5글자',
        characters: ['境', '憂', '滅', '腫', '儀'],
        levelPath: 'university-level1',
        bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-800'
      },
      {
        level: '대학 2단계',
        description: '심화 한자 5글자',
        characters: ['鑑', '競', '徹', '醫', '薦'],
        levelPath: 'university-level2',
        bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-800'
      },
      {
        level: '대학 3단계',
        description: '심화 한자 5글자',
        characters: ['操', '燦', '穩', '購', '舊'],
        levelPath: 'university-level3',
        bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-800'
      },
      {
        level: '대학 4단계',
        description: '심화 한자 5글자',
        characters: ['黨', '權', '警', '護', '續'],
        levelPath: 'university-level4',
        bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-800'
      }
    ]
  }
];

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
  // 간단한 세션 확인 (authOptions 없이)
  const session = await getServerSession();
  
  // 태그 구름용 데이터 가져오기
  const tagCloudData = getTagsForCloud();
  
  // 오늘의 랜덤 한자 선택
  const allCharacters = levelData.flatMap(grade => 
    grade.levels.flatMap(level => level.characters)
  );
  
  // 랜덤으로 5개 선택
  const getRandomChars = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const randomChars = getRandomChars(allCharacters, 5);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-24 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              한자로 <span className="text-yellow-300">배움</span>의 즐거움
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              하루 5글자씩, 단계별로 쉽게 배우는 한자 학습
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/learn" className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold rounded-full shadow-lg transition transform hover:scale-105">
                지금 시작하기
              </Link>
              <Link href="#levels" className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold rounded-full transition transform hover:scale-105">
                학습 단계 보기
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-3 transition hover:rotate-0">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-8">
                {['大', '人', '水', '火', '山', '木', '日', '月', '心'].map((char, idx) => (
                  <div key={idx} className="flex items-center justify-center">
                    <span className="text-5xl md:text-6xl text-blue-900">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 오늘의 추천 한자 섹션 */}
      <div className="bg-white py-12 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">오늘의 추천 한자</h2>
            <p className="text-lg text-slate-600 mt-2">매일 다른 한자를 통해 새로운 단어를 배워보세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {randomChars.map((char, idx) => {
              // 한자가 속한 레벨 찾기
              let foundLevel = '';
              let foundCategory = '';
              
              levelDataLoop:
              for (const grade of levelData) {
                for (const level of grade.levels) {
                  if (level.characters.includes(char)) {
                    foundLevel = level.levelPath;
                    foundCategory = grade.grade;
                    break levelDataLoop;
                  }
                }
              }
              
              return (
                <Link 
                  key={idx} 
                  href={`/learn/hanja/${encodeURIComponent(char)}?category=${encodeURIComponent(foundCategory)}&level=${encodeURIComponent(foundLevel)}`}
                  className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center transform transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-5xl md:text-6xl mb-3 text-blue-800">{char}</div>
                  <div className="text-sm text-slate-500">자세히 보기</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 소개 섹션 */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
            초등학생부터 성인까지 누구나 쉽게 한자 학습
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            매일 5개 한자만 공부해도 1년이면 놀라운 변화가 찾아옵니다.
            단계별로 체계적인 학습과 다양한 연습 방법으로 한자 실력을 키워보세요!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 transform transition hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              체계적인 학습 과정
            </h3>
            <p className="text-slate-600">
              초등, 중등, 고등 수준별로 구성된 한자 학습 과정으로 기초부터 차근차근 배울 수 있습니다. 각 단계는 일상생활에서 자주 사용되는 한자 5개로 구성되어 있습니다.
            </p>
          </div>
          
          {/* 학습 진행도 카드 */}
          {session && (
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500 transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                오늘의 학습 진행도
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600">오늘의 목표: {progressData.daily.target}자</span>
                  <span className="text-sm font-medium text-green-600">{progressData.daily.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${Math.min(progressData.daily.percentage, 100)}%` }}
                  ></div>
                </div>
                {progressData.daily.percentage > 100 && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    목표를 초과 달성했습니다! (+{progressData.daily.percentage - 100}%)
                  </div>
                )}
              </div>
              
            <Link 
                href="/dashboard"
                className="block w-full py-2 px-4 text-center rounded-lg bg-yellow-500 bg-opacity-10 hover:bg-opacity-20 text-yellow-800 font-medium transition"
              >
                학습 현황 자세히 보기
              </Link>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 transform transition hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              필기 연습 및 복습
            </h3>
            <p className="text-slate-600">
              학습한 한자를 직접 쓰면서 복습하는 것이 가장 효과적인 학습 방법입니다. 올바른 획순으로 한자를 쓰는 방법을 마스터하고 반복 연습을 통해 기억을 강화하세요.
            </p>
            
            <Link 
              href="/learn" 
                className="block w-full mt-4 py-2 px-4 text-center rounded-lg bg-green-500 bg-opacity-10 hover:bg-opacity-20 text-green-800 font-medium transition"
              >
                한자 학습하기
              </Link>
          </div>
          
          {!session && (
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500 transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                퀴즈와 테스트
              </h3>
              <p className="text-slate-600">
                학습한 한자를 재미있는, 다양한 퀴즈로 복습하세요. 발음, 의미, 쓰기 등 다양한 형태의 퀴즈로 한자 실력을 검증할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* 새로운 기능 소개 섹션 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">새로운 기능</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
              더욱 강화된 한자 학습 경험
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              사용자의 피드백을 반영한 새로운 기능으로 더 효과적인 한자 학습이 가능해졌습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                대학교 수준 한자 추가
              </h3>
              <p className="text-slate-600 mb-4">
                대학 수준의 심화 한자를 4단계로 나누어 추가했습니다. 
                고급 한자까지 체계적으로 학습하세요.
              </p>
              <Link 
                href="/learn/level/university-level1" 
                className="text-blue-600 font-medium hover:text-blue-800 transition"
              >
                대학 한자 학습하기 →
            </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                향상된 태그 시스템
              </h3>
              <p className="text-slate-600 mb-4">
                한자를 다양한 카테고리와 태그로 분류하여 더 직관적으로 탐색할 수 있습니다.
                관심 있는 주제별로 한자를 학습해보세요.
              </p>
            <Link 
                href="/tags" 
                className="text-yellow-600 font-medium hover:text-yellow-800 transition"
              >
                태그로 탐색하기 →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                PDF 연습장 추가
              </h3>
              <p className="text-slate-600 mb-4">
                학습한 한자를 반복 연습할 수 있는 PDF 연습장 기능이 추가되었습니다.
                인쇄하여 필기 연습을 해보세요.
              </p>
              <Link 
                href="/pdf-practice" 
                className="text-green-600 font-medium hover:text-green-800 transition"
              >
                연습장 만들기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 태그 구름 섹션 추가 */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
              다양한 분류로 한자 탐색하기
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              의미, 난이도, 부수별로 한자를 탐색하고 원하는 주제별로 학습해보세요.
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-inner">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {tagCloudData.map((tag, idx) => (
                <Link 
                  key={idx} 
                  href={`/tags/${tag.category}/${tag.id}`} 
                  className={`inline-block px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 ${tag.color} border border-gray-100`}
                  style={{ 
                    fontSize: `${0.9 + tag.weight * 0.15}rem`,
                    opacity: 0.7 + tag.weight * 0.05,
                  }}
                >
                  {tag.name}
            </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
            <Link 
                href="/tags" 
                className="inline-block px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm transition"
              >
                모든 태그 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 레벨별 한자 카드 섹션 */}
      <div id="levels" className="bg-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
              단계별 한자 학습
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              초등부터 고등까지, 하루 5개씩 배우는 단계별 한자 학습으로 체계적인 실력을 쌓아보세요.
              각 학년별 단계를 차근차근 완료하며 한자 마스터가 되어보세요!
            </p>
          </div>
          
          {/* 학교급별 탭 */}
          <div className="mb-12">
            {levelData.map((gradeData, gradeIdx) => (
              <div key={gradeIdx} className="mb-16">
                <h3 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-slate-200">
                  {gradeData.grade} <span className="text-lg font-normal text-slate-500">({gradeData.levels.length} 단계)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gradeData.levels.map((level, levelIdx) => (
                    <div 
                      key={levelIdx} 
                      className={`rounded-xl shadow-md overflow-hidden border ${level.borderColor} ${level.bgColor} transform transition duration-300 hover:shadow-xl hover:-translate-y-1`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className={`text-xl font-bold ${level.textColor}`}>
                            {level.level}
                          </h4>
                          {/* 하루에 배워야 할 5자를 완료한 경우 표시하는 뱃지 */}
                          <span className="inline-block px-2 py-1 bg-white text-xs font-medium rounded-full border border-slate-200">
                            5자/일
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{level.description}</p>
                        
                        <div className="grid grid-cols-5 gap-2 mb-6">
                          {level.characters.map((char, charIdx) => (
                            <Link
                              key={charIdx}
                              href={`/learn/hanja/${char}`}
                              className="aspect-square flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 transition transform hover:scale-110"
                            >
                              <span className="text-3xl">{char}</span>
                            </Link>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/learn/level/${level.levelPath}`}
                            className={`block w-full py-2 px-4 text-center rounded-lg ${level.textColor.replace('text', 'bg')} bg-opacity-10 hover:bg-opacity-20 font-medium transition`}
                          >
                            {level.level} 학습하기
            </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/learn" 
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
            >
              전체 한자 단계 보기
            </Link>
          </div>
        </div>
      </div>
      
      {/* 시작하기 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 한자 학습을 시작하세요!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            하루 5분, 5개 한자로 시작하는 새로운 습관
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/learn" 
              className="px-8 py-3 bg-white text-blue-800 font-semibold rounded-full shadow-lg transform transition hover:scale-105"
            >
              학습 시작하기
            </Link>
            {!session && (
              <Link 
                href="/api/auth/signin" 
                className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold rounded-full transform transition hover:scale-105"
              >
                회원가입 / 로그인
              </Link>
            )}
          </div>
        </div>
          </div>
          
      {/* 푸터 */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">한자로</h3>
              <p className="text-slate-300 max-w-md">
                체계적인 단계별 한자 학습 플랫폼. 
                하루 5글자씩, 누구나 쉽게 한자를 배울 수 있습니다.
              </p>
          </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-slate-200">학습하기</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="/learn" className="hover:text-white">단계별 학습</Link></li>
                  <li><Link href="/quiz" className="hover:text-white">한자 퀴즈</Link></li>
                  <li><Link href="/search" className="hover:text-white">한자 검색</Link></li>
            </ul>
          </div>
          
              <div>
                <h4 className="text-lg font-semibold mb-3 text-slate-200">내 계정</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="/dashboard" className="hover:text-white">학습 대시보드</Link></li>
                  <li><Link href="/profile" className="hover:text-white">프로필 설정</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-slate-200">도움말</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="/faq" className="hover:text-white">자주 묻는 질문</Link></li>
                  <li><Link href="/contact" className="hover:text-white">문의하기</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} 한자로. 모든 권리 보유.</p>
          </div>
      </div>
      </footer>
    </main>
  )
} 