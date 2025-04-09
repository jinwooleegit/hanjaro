'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LearningPathSelector from '../components/LearningPathSelector';
import PopularHanjaList from '../components/PopularHanjaList';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import ContentCard from '../components/ContentCard';

// 카테고리 데이터
const categories = [
  {
    id: 'difficulty',
    name: '난이도별 분류',
    tags: [
      { id: 'beginner', name: '초급 (1-4획)' },
      { id: 'intermediate', name: '중급 (5-9획)' },
      { id: 'advanced', name: '고급 (10획 이상)' }
    ]
  },
  {
    id: 'education',
    name: '교육 과정별 분류',
    tags: [
      { id: 'elementary', name: '초등학교' },
      { id: 'middle', name: '중학교' },
      { id: 'high', name: '고등학교' },
      { id: 'university', name: '대학' },
      { id: 'expert', name: '전문가' }
    ]
  }
];

export default function LearnPage() {
  return (
    <PageContainer maxWidth="max-w-5xl">
      <PageHeader
        title="한자 학습 센터"
        description="한자의 의미와 필순을 배우고, 쓰기 연습과 퀴즈를 통해 한자 실력을 향상시켜보세요."
        navButtons={[
          {
            href: '/tags',
            label: '태그별 탐색',
            colorClass: 'btn-light'
          },
          {
            href: '/quiz',
            label: '퀴즈 풀기',
            colorClass: 'btn-accent'
          },
          {
            href: '/dashboard',
            label: '학습 현황',
            colorClass: 'btn-secondary'
          }
        ]}
      />
      
      <div className="max-w-5xl mx-auto space-y-12">
        <section>
            <LearningPathSelector />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">인기 한자</h2>
          <PopularHanjaList />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">학습 카테고리</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCard
              gradient
              gradientColors="from-blue-50 to-blue-100"
              className="border-blue-200"
              title="초급 한자"
              titleSize="lg"
              description="초보자를 위한 기초 한자와 간단한 구조의 한자를 학습합니다. 일상생활에서 자주 사용되는 기본 한자들이 포함됩니다."
            >
              <p className="text-sm text-blue-600 mb-4"><span className="font-medium">난이도:</span> 15급-11급</p>
              <Link href="/learn/level/beginner-level1">
                <button className="btn-primary w-full">
                  초급 학습 시작하기
                </button>
              </Link>
            </ContentCard>
            
            <ContentCard
              gradient
              gradientColors="from-green-50 to-green-100"
              className="border-green-200"
              title="중급 한자"
              titleSize="lg"
              description="중간 수준의 한자와 조금 더 복잡한 구조의 한자를 학습합니다. 더 많은 부수와 결합된 한자들이 포함됩니다."
            >
              <p className="text-sm text-green-600 mb-4"><span className="font-medium">난이도:</span> 10급-6급</p>
              <Link href="/learn/level/intermediate-level1">
                <button className="btn-success w-full">
                  중급 학습 시작하기
                </button>
              </Link>
            </ContentCard>
            
            <ContentCard
              gradient
              gradientColors="from-yellow-50 to-yellow-100"
              className="border-yellow-200"
              title="고급 한자"
              titleSize="lg"
              description="복잡한 구조와 의미를 가진 한자를 학습합니다. 전문 분야에서 사용되는 한자들이 포함됩니다."
            >
              <p className="text-sm text-yellow-600 mb-4"><span className="font-medium">난이도:</span> 5급-3급</p>
              <Link href="/learn/level/advanced-level1">
                <button className="btn-warning w-full">
                  고급 학습 시작하기
                </button>
              </Link>
            </ContentCard>
            
            <ContentCard
              gradient
              gradientColors="from-pink-50 to-pink-100"
              className="border-pink-200"
              title="전문가 한자"
              titleSize="lg"
              description="가장 높은 수준의 한자와 희귀 한자를 학습합니다. 고전 문헌과 전문 서적에서 사용되는 한자들이 포함됩니다."
            >
              <p className="text-sm text-pink-600 mb-4"><span className="font-medium">난이도:</span> 2급-1급</p>
              <Link href="/learn/level/expert-level1">
                <button className="btn-danger w-full">
                  전문가 학습 시작하기
                </button>
            </Link>
            </ContentCard>
          </div>
        </section>
      </div>
    </PageContainer>
  );
} 