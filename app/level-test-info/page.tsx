'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LevelTestInfoPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">한자 레벨 테스트 안내</h1>
        
        <div className="relative w-64 h-64 mb-6">
          <Image
            src="/images/level-test-illustration.png"
            alt="레벨 테스트 일러스트레이션"
            width={256}
            height={256}
            className="rounded-md"
            onError={(e) => {
              e.currentTarget.src = '/images/default-illustration.png';
              e.currentTarget.onerror = null;
            }}
          />
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4">
            이 테스트는 당신의 한자 실력을 평가하여 가장 적합한 학습 경로를 제안합니다.
          </p>
          <p className="text-md text-gray-600 mb-2">
            • 약 5-10분 소요됩니다
          </p>
          <p className="text-md text-gray-600 mb-2">
            • 다양한 수준의 한자 문제가 출제됩니다
          </p>
          <p className="text-md text-gray-600 mb-2">
            • 모르는 문제는 건너뛰어도 됩니다
          </p>
          <p className="text-md text-gray-600 mb-2">
            • 테스트 결과에 따라 1-15급 중 적절한 레벨이 추천됩니다
          </p>
          <p className="text-md text-gray-600 mb-6">
            • 급수는 초급(15-11급), 중급(10-7급), 고급(6-3급), 명인(2-1급)으로 구분됩니다
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link 
            href="/level-test?action=start" 
            prefetch={true}
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition-colors"
          >
            테스트 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LevelTestInfoPage; 