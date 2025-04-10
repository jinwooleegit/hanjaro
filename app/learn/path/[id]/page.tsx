'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import ContentCard from '@/app/components/ContentCard';

// 난이도별 색상 스타일
const difficultyColors = {
  beginner: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    button: 'bg-green-500 hover:bg-green-600 text-white'
  },
  intermediate: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    button: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  advanced: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    button: 'bg-purple-500 hover:bg-purple-600 text-white'
  },
  expert: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    button: 'bg-red-500 hover:bg-red-600 text-white'
  }
};

type Stage = {
  stage_id: string;
  name: string;
  description: string;
  grade: number;
  character_ids: string[];
  activities: {
    activity_id: string;
    type: string;
    name: string;
    description: string;
  }[];
};

type LearningPath = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  targetAudience: string;
  estimatedDuration: string;
  stages: Stage[];
  progress?: number;
};

export default function LearningPathDetailPage() {
  const params = useParams() || {};
  const router = useRouter();
  const pathId = params.id ? String(params.id) : '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  
  useEffect(() => {
    async function loadLearningPath() {
      try {
        setIsLoading(true);
        
        // 실제로는 API 호출이나 데이터 로드 로직이 들어갈 것입니다
        // 지금은 샘플 데이터로 대체합니다
        
        // 1초 타이머로 로딩 시뮬레이션
        setTimeout(() => {
          // 샘플 경로 데이터
          const samplePaths: Record<string, LearningPath> = {
            'LP001': {
              id: 'LP001',
              name: '기초 한자 마스터',
              description: '한자를 처음 접하는 사용자를 위한 입문 과정입니다. 15급부터 시작하여 기초적인 한자를 학습합니다.',
              difficulty: 'beginner',
              targetAudience: '한자 입문자',
              estimatedDuration: '4주',
              progress: 35,
              stages: [
                {
                  stage_id: 'LP001-S01',
                  name: '15급 한자 기초',
                  description: '가장 기본적인 한자 20자를 학습합니다.',
                  grade: 15,
                  character_ids: [
                    'HJ-15-0001-4E00',
                    'HJ-15-0002-4E8C',
                    'HJ-15-0003-4E09',
                    'HJ-15-0004-56DB',
                    'HJ-15-0005-4E94'
                  ],
                  activities: [
                    {
                      activity_id: 'LP001-S01-A01',
                      type: 'recognition',
                      name: '한자 인식하기',
                      description: '기본 한자의 모양을 익히고 인식합니다.'
                    },
                    {
                      activity_id: 'LP001-S01-A02',
                      type: 'writing',
                      name: '한자 쓰기 연습',
                      description: '기본 한자의 획순을 익히고 쓰는 연습을 합니다.'
                    },
                    {
                      activity_id: 'LP001-S01-A03',
                      type: 'meaning',
                      name: '한자 의미 학습',
                      description: '한자의 기본 의미를 학습합니다.'
                    },
                    {
                      activity_id: 'LP001-S01-A04',
                      type: 'quiz',
                      name: '기초 퀴즈',
                      description: '학습한 한자에 대한 기초 퀴즈를 풉니다.'
                    }
                  ]
                },
                {
                  stage_id: 'LP001-S02',
                  name: '14급 한자 기초',
                  description: '기초 한자를 확장하여 학습합니다.',
                  grade: 14,
                  character_ids: [
                    'HJ-14-0001-516D',
                    'HJ-14-0002-4E03',
                    'HJ-14-0003-516B',
                    'HJ-14-0004-4E5D',
                    'HJ-14-0005-5341'
                  ],
                  activities: [
                    {
                      activity_id: 'LP001-S02-A01',
                      type: 'recognition',
                      name: '한자 인식하기',
                      description: '14급 한자의 모양을 익히고 인식합니다.'
                    },
                    {
                      activity_id: 'LP001-S02-A02',
                      type: 'writing',
                      name: '한자 쓰기 연습',
                      description: '14급 한자의 획순을 익히고 쓰는 연습을 합니다.'
                    }
                  ]
                }
              ]
            },
            'LP002': {
              id: 'LP002',
              name: '한자 강화 과정',
              description: '기초 한자를 학습한 후 중급 수준으로 나아가는 과정입니다. 13급부터 11급까지의 한자를 학습합니다.',
              difficulty: 'intermediate',
              targetAudience: '기초 한자 학습자',
              estimatedDuration: '6주',
              progress: 0,
              stages: [
                {
                  stage_id: 'LP002-S01',
                  name: '13급 한자 학습',
                  description: '13급 한자를 중심으로 학습합니다.',
                  grade: 13,
                  character_ids: [
                    'HJ-13-0001-767E',
                    'HJ-13-0002-5343',
                    'HJ-13-0003-4E07',
                    'HJ-13-0004-6708',
                    'HJ-13-0005-65E5'
                  ],
                  activities: [
                    {
                      activity_id: 'LP002-S01-A01',
                      type: 'recognition',
                      name: '한자 인식하기',
                      description: '13급 한자의 모양을 익히고 인식합니다.'
                    }
                  ]
                }
              ]
            }
          };
          
          // 현재 경로 ID에 해당하는 데이터 가져오기
          const pathData = samplePaths[pathId];
          
          if (pathData) {
            setLearningPath(pathData);
          }
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('학습 경로 데이터 로드 오류:', error);
        setIsLoading(false);
      }
    }
    
    if (pathId) {
      loadLearningPath();
    }
  }, [pathId]);
  
  // 시작하기/계속하기 버튼 클릭 핸들러
  const handleStartLearning = (stageId: string, activityId: string) => {
    router.push(`/learn/activity/${stageId}/${activityId}`);
  };
  
  // 활성 단계 변경 핸들러
  const handleStageChange = (index: number) => {
    setActiveStageIndex(index);
  };
  
  const colorScheme = learningPath
    ? difficultyColors[learningPath.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner
    : difficultyColors.beginner;
  
  return (
    <PageContainer maxWidth="max-w-6xl">
      <PageHeader
        title={learningPath ? learningPath.name : '학습 경로 상세'}
        description={learningPath ? learningPath.description : '학습 경로 정보를 로드하고 있습니다...'}
        navButtons={[
          {
            href: '/learn/path',
            label: '모든 학습 경로',
            colorClass: 'btn-secondary'
          },
          {
            href: '/dashboard',
            label: '대시보드',
            colorClass: 'btn-primary'
          }
        ]}
      />
      
      {isLoading ? (
        <ContentCard>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">학습 경로 데이터를 로드 중입니다...</span>
          </div>
        </ContentCard>
      ) : !learningPath ? (
        <ContentCard>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>요청하신 학습 경로를 찾을 수 없습니다.</p>
          </div>
          <div className="mt-4">
            <Link href="/learn/path" className="text-blue-500 hover:underline">
              다른 학습 경로 살펴보기
            </Link>
          </div>
        </ContentCard>
      ) : (
        <>
          {/* 경로 정보 요약 */}
          <ContentCard className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-2">경로 요약</h2>
                <p className="text-gray-700 mb-4">{learningPath.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <span className="text-sm text-gray-500 block">대상</span>
                    <span className="font-medium">{learningPath.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">난이도</span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorScheme.bg} ${colorScheme.text}`}>
                      {learningPath.difficulty === 'beginner' ? '초급' : 
                      learningPath.difficulty === 'intermediate' ? '중급' : 
                      learningPath.difficulty === 'advanced' ? '고급' : '전문가'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">예상 소요 시간</span>
                    <span className="font-medium">{learningPath.estimatedDuration}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">학습 단계</span>
                    <span className="font-medium">{learningPath.stages.length}단계</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">진행 상황</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">전체 진행률</span>
                    <span className="font-medium">{learningPath.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        (learningPath.progress || 0) < 30 ? 'bg-red-500' : 
                        (learningPath.progress || 0) < 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} 
                      style={{ width: `${learningPath.progress || 0}%` }}
                    />
                  </div>
                </div>
                
                <button 
                  className={`w-full py-2 px-4 rounded ${colorScheme.button}`}
                  onClick={() => {
                    const activeStage = learningPath.stages[activeStageIndex];
                    if (activeStage && activeStage.activities.length > 0) {
                      handleStartLearning(activeStage.stage_id, activeStage.activities[0].activity_id);
                    }
                  }}
                >
                  {(learningPath.progress || 0) > 0 ? '학습 계속하기' : '학습 시작하기'}
                </button>
              </div>
            </div>
          </ContentCard>
          
          {/* 학습 단계 */}
          <ContentCard className="mb-6">
            <h2 className="text-xl font-bold mb-4">학습 단계</h2>
            
            <div className="border-b mb-4">
              <div className="flex flex-nowrap overflow-x-auto pb-2">
                {learningPath.stages.map((stage, index) => (
                  <button
                    key={stage.stage_id}
                    className={`px-4 py-2 whitespace-nowrap mr-2 rounded-t-lg ${
                      activeStageIndex === index 
                        ? `${colorScheme.bg} ${colorScheme.text} border-b-2 ${colorScheme.border}` 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleStageChange(index)}
                  >
                    {stage.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 활성 단계 내용 */}
            {learningPath.stages[activeStageIndex] && (
              <div className="py-2">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{learningPath.stages[activeStageIndex].name}</h3>
                  <p className="text-gray-700">{learningPath.stages[activeStageIndex].description}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">학습 활동</h4>
                  <div className="space-y-3">
                    {learningPath.stages[activeStageIndex].activities.map((activity) => (
                      <div key={activity.activity_id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{activity.name}</h5>
                          <button 
                            className={`px-3 py-1 rounded text-sm ${colorScheme.button}`}
                            onClick={() => handleStartLearning(learningPath.stages[activeStageIndex].stage_id, activity.activity_id)}
                          >
                            시작하기
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            activity.type === 'recognition' ? 'bg-blue-100 text-blue-800' :
                            activity.type === 'writing' ? 'bg-green-100 text-green-800' :
                            activity.type === 'meaning' ? 'bg-yellow-100 text-yellow-800' :
                            activity.type === 'quiz' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.type === 'recognition' ? '인식' :
                             activity.type === 'writing' ? '쓰기' :
                             activity.type === 'meaning' ? '의미' :
                             activity.type === 'quiz' ? '퀴즈' :
                             activity.type === 'etymology' ? '어원' :
                             activity.type === 'compound' ? '복합어' :
                             activity.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">학습 한자</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {learningPath.stages[activeStageIndex].character_ids.map((id) => (
                      <div key={id} className="border rounded-lg p-2 text-center">
                        <div className="text-2xl mb-1">{id.split('-')[3]}</div>
                        <div className="text-xs text-gray-500">{id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ContentCard>
          
          {/* 학습 경로 추천 */}
          <ContentCard>
            <h2 className="text-xl font-bold mb-4">추천 학습 자료</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">한자 쓰기 연습</h3>
                <p className="text-gray-600 text-sm mb-3">
                  한자 필순을 익히고 쓰기 연습을 할 수 있는 페이지입니다.
                </p>
                <Link href="/writing-practice" className="text-blue-500 hover:underline text-sm">
                  쓰기 연습 바로가기 →
                </Link>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">한자 퀴즈</h3>
                <p className="text-gray-600 text-sm mb-3">
                  학습한 한자를 퀴즈로 복습할 수 있는 페이지입니다.
                </p>
                <Link href="/quiz" className="text-blue-500 hover:underline text-sm">
                  퀴즈 풀기 바로가기 →
                </Link>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">부수별 한자 탐색</h3>
                <p className="text-gray-600 text-sm mb-3">
                  부수별로 한자를 탐색하고 학습할 수 있는 페이지입니다.
                </p>
                <Link href="/new-hanja" className="text-blue-500 hover:underline text-sm">
                  한자 탐색 바로가기 →
                </Link>
              </div>
            </div>
          </ContentCard>
        </>
      )}
    </PageContainer>
  );
} 