'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getHanjaByGrade, initializeHanjaSystem } from '@/utils/idBasedHanjaUtils';
import PageContainer from '@/app/components/PageContainer';
import PageHeader from '@/app/components/PageHeader';
import ContentCard from '@/app/components/ContentCard';

// 급수 정보
const GRADES = [
  // 초급 (쉬움) - 15급에서 시작
  { grade: 15, name: '15급', description: '기초 일상 관련 한자' },
  { grade: 14, name: '14급', description: '기초 숫자 및 방향 관련 한자' },
  { grade: 9, name: '기초 한자', description: '기초적인 한자 학습' },
  
  // 중급 
  { grade: 8, name: '8급', description: '초등학교 3학년 수준' },
  { grade: 7, name: '7급', description: '초등학교 4학년 수준' },
  { grade: 6, name: '6급', description: '초등학교 5~6학년 수준' },
  
  // 고급
  { grade: 5, name: '5급', description: '중학교 1학년 수준' },
  { grade: 10, name: '준3급', description: '진학예정 학생 등이 배우는 한자' },
  { grade: 4, name: '4급', description: '중학교 2~3학년 수준' },
  { grade: 3, name: '3급', description: '고등학교 1학년 수준' },
  
  // 기타 중급 및 고급 한자
  { grade: 11, name: '준2급', description: '중급 이상의 한자' },
  { grade: 12, name: '준1급', description: '고급 한자' },
  { grade: 13, name: '특급', description: '전문적인 한자' },
];

export default function LearnPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [hanjaList, setHanjaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 한자 시스템 초기화
    const initialize = async () => {
      await initializeHanjaSystem();
    };
    initialize();
  }, []);

  const handleGradeSelect = async (grade: number) => {
    setIsLoading(true);
    setSelectedGrade(grade);

    try {
      const hanjaData = await getHanjaByGrade(grade);
      setHanjaList(hanjaData);
    } catch (error) {
      console.error('Error fetching hanja data:', error);
      setHanjaList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHanjaDetail = (id: string) => {
    router.push(`/hanja/${id}`);
  };

  return (
    <PageContainer maxWidth="max-w-7xl">
      <PageHeader
        title="한자 학습"
        description="급수별 한자를 학습하고 상세 정보를 확인하세요."
        navButtons={[
          {
            href: '/dashboard',
            label: '대시보드',
            colorClass: 'btn-primary'
          },
          {
            href: '/practice',
            label: '한자 연습',
            colorClass: 'btn-secondary'
          }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 왼쪽 사이드바 - 급수 선택 */}
        <div className="md:col-span-3">
          <ContentCard className="sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-gray-800">급수 선택</h2>
            <div className="space-y-2">
              {GRADES.map((gradeInfo) => (
                <button
                  key={gradeInfo.grade}
                  onClick={() => handleGradeSelect(gradeInfo.grade)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    selectedGrade === gradeInfo.grade
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{gradeInfo.name}</div>
                  <div className="text-sm text-gray-600">{gradeInfo.description}</div>
                </button>
              ))}
            </div>
          </ContentCard>
        </div>

        {/* 오른쪽 콘텐츠 영역 - 한자 목록 */}
        <div className="md:col-span-9">
          <ContentCard>
            {selectedGrade === null ? (
              <div className="p-6 text-center">
                <div className="text-4xl mb-4 opacity-50">📚</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">학습할 급수를 선택하세요</h3>
                <p className="text-gray-500">
                  왼쪽 메뉴에서 학습하고 싶은 한자 급수를 선택하면 해당 급수의 한자 목록이 표시됩니다.
                </p>
              </div>
            ) : isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-gray-600">한자 데이터를 로드 중입니다...</p>
              </div>
            ) : hanjaList.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                  {GRADES.find(g => g.grade === selectedGrade)?.name} 한자 목록
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {hanjaList.map((hanja) => (
                    <div
                      key={hanja.id}
                      className="bg-white border rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 transform hover:-translate-y-1"
                      onClick={() => navigateToHanjaDetail(hanja.id)}
                    >
                      <div className="text-4xl mb-2 font-serif">{hanja.character}</div>
                      <div className="font-medium text-gray-800">{hanja.meaning}</div>
                      <div className="text-sm text-gray-500">{hanja.pronunciation}</div>
                      <div className="mt-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full inline-block">
                        {hanja.stroke_count}획
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-4xl mb-4 opacity-50">🔍</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">한자 데이터를 찾을 수 없습니다</h3>
                <p className="text-gray-500">
                  선택한 급수에 해당하는 한자 데이터가 없습니다. 다른 급수를 선택해보세요.
                </p>
              </div>
            )}
          </ContentCard>
        </div>
      </div>
    </PageContainer>
  );
} 