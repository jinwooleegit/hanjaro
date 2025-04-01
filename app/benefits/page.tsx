import React from 'react';
import Link from 'next/link';

export default function BenefitsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">한자 학습의 이점</h1>
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">한자를 배우면 좋은 점</h2>
          <p className="mb-4 text-lg">
            한자는 우리 언어 생활에 깊이 뿌리내리고 있는 중요한 문자 체계입니다. 
            한국어 어휘의 약 70%가 한자어에서 유래했으며, 한자 학습은 다양한 측면에서 큰 이점을 제공합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">어휘력 향상</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-blue-800">어휘 확장</h3>
              <p>한자의 기본 의미를 알면 수많은 한자어의 의미를 유추할 수 있습니다. 한자를 이해하면 새로운 단어를 만났을 때 그 의미를 쉽게 파악할 수 있어 어휘력이 크게 향상됩니다.</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-blue-800">전문용어 이해</h3>
              <p>의학, 법률, 경제, 철학 등 전문 분야의 용어 대부분이 한자어로 이루어져 있습니다. 한자를 알면 전문 지식을 습득하는 데 큰 도움이 됩니다.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">사고력과 언어능력 발달</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-green-800">논리적 사고력</h3>
              <p>한자는 의미를 담은 형태소로 이루어져 있어, 한자를 학습하면서 단어의 구조와 의미를 분석하는 능력이 길러집니다. 이는 논리적 사고력 향상에 도움이 됩니다.</p>
            </div>
            <div className="bg-green-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-green-800">언어 분석력</h3>
              <p>한자어의 구조를 이해하면 언어를 더 깊이 있게 분석할 수 있습니다. 이는 국어 능력은 물론, 외국어 학습에도 긍정적인 영향을 미칩니다.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">학습 능력 향상</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-purple-800">교과목 학습 능력</h3>
              <p>국어, 사회, 과학 등 다양한 교과목에서 한자어가 자주 등장합니다. 한자 지식은 교과서 내용을 이해하는 데 도움이 되어 전반적인 학습 능력을 향상시킵니다.</p>
            </div>
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-purple-800">기억력 증진</h3>
              <p>한자는 형태와 의미가 연결되어 있어, 시각적 기억과 의미적 기억을 동시에 활용합니다. 이러한 학습 과정은 전반적인 기억력 증진에 도움이 됩니다.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">문화적 이해 확장</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-yellow-800">문화유산 이해</h3>
              <p>우리나라의 고전 문헌과 문화유산은 대부분 한자로 기록되어 있습니다. 한자를 알면 우리 역사와 문화를 직접 접할 수 있는 기회가 늘어납니다.</p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-yellow-800">동아시아 문화권 이해</h3>
              <p>한자는 한국뿐만 아니라 중국, 일본 등 동아시아 국가들이 공유하는 문화적 자산입니다. 한자 지식은 이들 국가의 문화와 언어를 이해하는 데 도움이 됩니다.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">실용적 혜택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-red-800">시험 대비</h3>
              <p>대학수학능력시험을 비롯한 다양한 시험에서 한자 지식이 요구됩니다. 한자를 알면 문제 이해와 풀이에 큰 도움이 됩니다.</p>
            </div>
            <div className="bg-red-50 p-5 rounded-lg">
              <h3 className="text-xl font-medium mb-2 text-red-800">직업 역량 강화</h3>
              <p>많은 전문직에서 한자어 기반의 용어를 사용합니다. 법률, 의료, 행정 등의 분야에서 한자 지식은 업무 능력 향상에 기여합니다.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">한자 학습을 시작해보세요</h2>
          <p className="mb-4">
            우리 사이트는 초등학교부터 대학교까지 수준별로 정리된 한자 학습 자료를 제공합니다. 
            체계적인 학습을 통해 한자의 다양한 이점을 경험해보세요.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/learn" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
              한자 학습 시작하기
            </Link>
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-600 text-center">
            한자 학습은 평생의 자산이 됩니다. 지금 시작하세요!
          </p>
        </div>
      </div>
    </div>
  );
} 