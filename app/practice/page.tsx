'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';
import PageContainer from '@/app/components/PageContainer';
import ContentCard from '@/app/components/ContentCard';

export default function Practice() {
  const router = useRouter();
  
  // 주요 연습 모드 옵션
  const practiceOptions = [
    { 
      id: 'direct', 
      name: '직접 폰트로 보는 한자 연습', 
      description: '한자의 기본 형태와 획수를 확인하며 연습합니다.', 
      icon: '📝', 
      path: '/practice/direct'
    },
    { 
      id: 'enhanced', 
      name: '향상된 필순 애니메이션 연습', 
      description: '한자의 정확한 필순을 애니메이션으로 배우고 연습합니다.', 
      icon: '✏️', 
      path: '/practice/enhanced'
    },
    { 
      id: 'advanced', 
      name: '고급 한자 필기 연습', 
      description: '다양한 기능을 활용하여 한자 필기를 연습합니다.', 
      icon: '🖌️', 
      path: '/practice/advanced'
    },
    { 
      id: 'pdf', 
      name: 'PDF 연습 자료 다운로드', 
      description: '인쇄하여 사용할 수 있는 한자 학습 워크시트', 
      icon: '📄', 
      path: '/pdf-practice'
    }
  ];

  return (
    <PageContainer maxWidth="max-w-6xl">
      <PageHeader
        title="한자 연습 센터"
        description="다양한 방식으로 한자 쓰기와 필순을 연습해보세요."
        navButtons={[
          {
            href: '/learn',
            label: '한자 학습',
            colorClass: 'btn-secondary'
          },
          {
            href: '/dashboard',
            label: '대시보드',
            colorClass: 'btn-primary'
          }
        ]}
      />

      <div className="space-y-6">
        {/* 모드 소개 */}
        <ContentCard>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">연습 모드 선택</h2>
          <p className="text-gray-600 mb-6">
            아래에서 원하는 연습 모드를 선택하여 한자 학습을 시작하세요. 각 모드는 다른 방식으로 한자 학습을 도와줍니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceOptions.map(option => (
              <Link 
                key={option.id}
                href={option.path}
                className="block p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{option.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{option.name}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ContentCard>
        
        {/* 학습 팁 */}
        <ContentCard>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">한자 학습 팁</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>한자의 기본 획순을 익히는 것이 중요합니다.</li>
            <li>같은 한자를 반복해서 쓰며 근육 기억을 형성하세요.</li>
            <li>관련된 한자들을 함께 학습하면 기억하기 쉽습니다.</li>
            <li>한자의 의미와 어원을 이해하면 더 효과적으로 학습할 수 있습니다.</li>
            <li>정기적인 복습으로 장기 기억으로 전환하세요.</li>
          </ul>
        </ContentCard>
      </div>
    </PageContainer>
  );
} 