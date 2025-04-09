import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface LevelTestIntroProps {
  onStart: () => void;
}

const LevelTestIntro: React.FC<LevelTestIntroProps> = ({ onStart }) => {
  const router = useRouter();

  const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('LevelTestIntro: 테스트 시작하기 버튼 클릭됨');
    
    // onStart 함수가 정의되어 있으면 직접 호출, 아니면 라우팅
    if (typeof onStart === 'function') {
      onStart();
    } else {
      console.error('LevelTestIntro: onStart is not a function', onStart);
      // 콜백이 작동하지 않으면 수동으로 리디렉션
      router.push('/level-test?action=start');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">한자 레벨 테스트</h1>
      
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/images/level-test-illustration.png"
          alt="레벨 테스트 일러스트레이션"
          width={256}
          height={256}
          className="rounded-md"
          onError={(e) => {
            // 이미지가 없으면 기본 이미지로 대체
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
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
        <button
          onClick={handleStartClick}
          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition-colors"
        >
          수준 테스트 시작하기
        </button>
        
        <Link 
          href="/level-test?action=start" 
          prefetch={true}
          className="px-6 py-3 bg-secondary-600 text-white font-semibold rounded-lg shadow hover:bg-secondary-700 transition-colors flex items-center justify-center"
        >
          링크로 시작하기
        </Link>
      </div>
      
      {/* 대체 링크 버튼 - JavaScript가 작동하지 않을 경우 사용 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">버튼이 작동하지 않나요?</p>
        <Link href="/level-test?action=start" prefetch={true} className="text-blue-600 hover:text-blue-800 underline">
          여기를 클릭하여 테스트 시작하기
        </Link>
      </div>
    </div>
  );
};

export default LevelTestIntro; 