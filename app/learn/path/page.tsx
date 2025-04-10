'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import ContentCard from '@/app/components/ContentCard';
import LearningPathCard from '@/app/components/LearningPathCard';

export default function LearningPathPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  
  useEffect(() => {
    async function loadLearningPaths() {
      try {
        setIsLoading(true);
        // 실제로는 API 호출이나 데이터 로드 로직이 들어갈 것입니다
        // 지금은 샘플 데이터로 대체합니다
        
        // 1초 타이머로 로딩 시뮬레이션
        setTimeout(() => {
          const samplePaths = [
            {
              id: 'LP001',
              name: '기초 한자 마스터',
              description: '한자를 처음 접하는 사용자를 위한 입문 과정입니다. 15급부터 시작하여 기초적인 한자를 학습합니다.',
              difficulty: 'beginner',
              targetAudience: '한자 입문자',
              estimatedDuration: '4주',
              stageCount: 2,
              progress: 35
            },
            {
              id: 'LP002',
              name: '한자 강화 과정',
              description: '기초 한자를 학습한 후 중급 수준으로 나아가는 과정입니다. 13급부터 11급까지의 한자를 학습합니다.',
              difficulty: 'intermediate',
              targetAudience: '기초 한자 학습자',
              estimatedDuration: '6주',
              stageCount: 3,
              progress: 0
            },
            {
              id: 'LP003',
              name: '부수별 한자 학습',
              description: '부수를 중심으로 한자를 그룹화하여 체계적으로 학습하는 과정입니다.',
              difficulty: 'intermediate',
              targetAudience: '기초 한자 학습자',
              estimatedDuration: '8주',
              stageCount: 5,
              progress: 0
            }
          ];
          
          setLearningPaths(samplePaths);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('학습 경로 데이터 로드 오류:', error);
        setIsLoading(false);
      }
    }
    
    loadLearningPaths();
  }, []);
  
  return (
    <PageContainer maxWidth="max-w-6xl">
      <PageHeader
        title="한자 학습 경로"
        description="단계별로 체계적인 한자 학습을 시작해보세요."
        navButtons={[
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
      ) : (
        <>
          {/* 추천 학습 경로 */}
          <ContentCard className="mb-6">
            <h2 className="text-xl font-bold mb-4">맞춤 학습 경로</h2>
            <p className="text-gray-600 mb-6">
              현재 학습 상태와 목표에 맞는 추천 학습 경로입니다. 
              자신에게 맞는 경로를 선택하여 학습을 시작하세요.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  id={path.id}
                  name={path.name}
                  description={path.description}
                  difficulty={path.difficulty}
                  targetAudience={path.targetAudience}
                  estimatedDuration={path.estimatedDuration}
                  stageCount={path.stageCount}
                  progress={path.progress}
                  showProgress={true}
                />
              ))}
            </div>
          </ContentCard>
          
          {/* 학습 안내 */}
          <ContentCard>
            <h2 className="text-xl font-bold mb-4">학습 가이드</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-4xl text-blue-500 mb-2">1</div>
                <h3 className="text-lg font-semibold mb-2">학습 경로 선택</h3>
                <p className="text-gray-600">
                  자신의 수준과 목표에 맞는 학습 경로를 선택합니다.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-4xl text-blue-500 mb-2">2</div>
                <h3 className="text-lg font-semibold mb-2">단계별 학습</h3>
                <p className="text-gray-600">
                  각 단계별로 한자를 학습하고 퀴즈와 쓰기 연습을 통해 익힙니다.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-4xl text-blue-500 mb-2">3</div>
                <h3 className="text-lg font-semibold mb-2">복습 및 평가</h3>
                <p className="text-gray-600">
                  정기적인 복습과 평가를 통해 학습 성과를 확인합니다.
                </p>
              </div>
            </div>
          </ContentCard>
        </>
      )}
    </PageContainer>
  );
} 