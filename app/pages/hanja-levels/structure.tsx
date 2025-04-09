import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaGraduationCap, FaRegLightbulb, FaLayerGroup } from 'react-icons/fa';

const HanjaLevelStructurePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">한자 급수와 수준별 학습 체계</h1>
      
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
          <FaLayerGroup className="mr-2 text-primary-600" /> 
          한자 급수 체계 개요
        </h2>
        
        <p className="mb-4 text-gray-700">
          한자 학습은 학습자의 수준과 목적에 맞게 단계적으로 진행됩니다. 우리 앱에서는 한자 급수를 1급부터 15급까지 분류하여, 
          초급부터 명인 수준까지 체계적인 학습 경로를 제공합니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-lg mb-2 text-amber-800">초급 (15-11급)</h3>
            <p className="text-gray-700">
              기초 한자 약 500자를 학습하며, 일상생활에서 자주 접하는 간단한 한자어를 이해하고 읽을 수 있는 수준입니다.
              획순, 부수, 기본 음훈 등 한자 학습의 기초를 다집니다.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg mb-2 text-blue-800">중급 (10-7급)</h3>
            <p className="text-gray-700">
              중급 한자 약 1,000자를 추가로 학습하며, 중등교육 과정에서 배우는 한자어와 기초 문장을 이해하고 활용할 수 있는 수준입니다.
              한자의 조어법과 확장된 의미를 학습합니다.
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-bold text-lg mb-2 text-red-800">고급 (6-3급)</h3>
            <p className="text-gray-700">
              고급 한자 약 1,500자를 추가로 학습하며, 고등교육 과정과 전문 분야에서 사용되는 한자어를 이해하고 활용할 수 있는 수준입니다.
              한문 독해의 기초와 전문 용어의 이해에 필요한 지식을 습득합니다.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-lg mb-2 text-yellow-800">명인 (2-1급)</h3>
            <p className="text-gray-700">
              최상위 한자 약 1,000자를 추가로 학습하며, 한문 고전과 전문 서적을 원문으로 이해할 수 있는 수준입니다.
              한자와 한문에 대한 깊은 이해와 응용 능력을 갖추게 됩니다.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
          <FaGraduationCap className="mr-2 text-primary-600" /> 
          단계별 학습 방법
        </h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="font-bold text-lg mb-2">초급 학습자 (15-11급)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>기초 한자의 획순과 부수에 집중하며 정확한 쓰기 연습</li>
              <li>일상생활에서 자주 사용되는 한자어 중심의 어휘 확장</li>
              <li>간단한 한자 조합을 통한 단어 만들기 연습</li>
              <li>그림과 연상법을 활용한 한자 기억하기</li>
              <li>매일 10-20자 정도의 새로운 한자 학습 권장</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-lg mb-2">중급 학습자 (10-7급)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>한자의 형태소 분석과 의미 파악 능력 강화</li>
              <li>유사 한자의 구별과 한자 패턴 인식 훈련</li>
              <li>중급 수준의 한자어를 활용한 문장 만들기</li>
              <li>한자의 음훈 활용법과 다양한 읽기 방법 학습</li>
              <li>매일 15-25자 정도의 새로운 한자 학습 권장</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold text-lg mb-2">고급 학습자 (6-3급)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>전문 분야별 한자어 습득과 활용</li>
              <li>한문 문법의 기초와 간단한 한문 독해</li>
              <li>한자 성어와 고사성어의 의미와 유래 학습</li>
              <li>한자의 역사적 변천과 문화적 배경 이해</li>
              <li>매일 20-30자 정도의 새로운 한자 학습 권장</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-bold text-lg mb-2">명인 학습자 (2-1급)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>고전 한문 원문 독해와 해석 능력 개발</li>
              <li>한자의 어원학적 연구와 깊은 의미 파악</li>
              <li>한자 문화권의 문헌 자료 이해 및 활용</li>
              <li>전통 문화와 철학에 담긴, 한자의 상징적 의미 탐구</li>
              <li>창작적 한자 활용과 응용 능력 계발</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
          <FaRegLightbulb className="mr-2 text-primary-600" /> 
          효과적인 한자 학습 전략
        </h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            한자 학습은 체계적이고 지속적인 접근이 중요합니다. 다음은 급수에 상관없이 한자 학습에 도움이 되는 전략들입니다:
          </p>
          
          <ol className="list-decimal list-inside space-y-3 ml-2">
            <li>
              <strong>규칙적인 학습 습관:</strong> 매일 일정 시간을 한자 학습에 할애하여 꾸준히 공부하는 것이 가장 중요합니다.
            </li>
            <li>
              <strong>반복 학습:</strong> 학습한 한자를 주기적으로 복습하여 장기 기억으로 전환하세요.
            </li>
            <li>
              <strong>연상법 활용:</strong> 한자의 모양과 의미를 연결하는 이야기나 그림을 만들어 기억을 돕습니다.
            </li>
            <li>
              <strong>문맥 속 학습:</strong> 개별 한자보다 실제 문장과 단어 속에서 한자를 학습하면 더 효과적입니다.
            </li>
            <li>
              <strong>쓰기 연습:</strong> 한자를 직접 쓰는 연습은 기억력 향상과 한자의 구조 이해에 큰 도움이 됩니다.
            </li>
            <li>
              <strong>한자 부수 익히기:</strong> 214개의 한자 부수를 먼저 익히면 새로운 한자 학습이 용이해집니다.
            </li>
            <li>
              <strong>실생활 적용:</strong> 배운 한자를 일상생활에서 찾아보고 활용해 보세요.
            </li>
          </ol>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary-100 to-secondary-100 p-6 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          내 한자 레벨 확인하기
        </h3>
        <p className="mb-4 text-gray-700">
          지금 바로 레벨 테스트를 통해 자신의 한자 실력을 확인하고, 맞춤형 학습 경로를 추천받으세요.
        </p>
        <Link 
          href="/level-test" 
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition-colors"
        >
          레벨 테스트 시작하기 <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default HanjaLevelStructurePage; 