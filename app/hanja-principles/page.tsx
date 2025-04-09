'use client';

import React from 'react';
import Link from 'next/link';

// 한자 원리 페이지 컴포넌트
const HanjaPrinciplesPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 상단 히어로 헤더 */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">한자의 원리와 이해</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 text-center">
            한자의 기본 구성 원리부터 필순, 부수, 효과적인 학습 방법까지 체계적으로 알아봅니다.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#section-1" className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg shadow font-medium">
              원리 알아보기
            </a>
            <Link href="/learn" className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium">
              한자 학습하기
            </Link>
          </div>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 / 목차 */}
          <div className="md:w-1/4">
            <div className="sticky top-10 bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">목차</h3>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <a href="#section-1" className="block py-2 px-3 rounded-lg bg-gray-100 text-gray-800 font-medium">
                      1. 한자의 구성 원리 (육서六書)
                    </a>
                  </li>
                  <li>
                    <a href="#section-2" className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      2. 필순(筆順)과 획순(劃順)
                    </a>
                  </li>
                  <li>
                    <a href="#section-3" className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      3. 한자 부수(部首)
                    </a>
                  </li>
                  <li>
                    <a href="#section-4" className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      4. 한자 학습 방법
                    </a>
                  </li>
                  <li>
                    <a href="#section-5" className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50">
                      5. 한자 급수와 수준별 학습 체계
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* 콘텐츠 영역 */}
          <div className="md:w-3/4">
            {/* 섹션 1: 한자의 구성 원리 */}
            <section id="section-1" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">1. 한자의 구성 원리 (육서六書)</h2>
              <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
                <p className="mb-6 text-gray-700">
                  한자는 오랜 역사 속에서 발전해 오면서 여러 가지 방식으로 만들어진 문자 체계입니다. 
                  전통적으로 한자의 구성 원리를 설명할 때 '육서(六書)'라는 분류 방법이 자주 사용됩니다.
                </p>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-gray-700 pl-6 py-3 bg-gray-50 rounded-r-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">1) 상형(象形)</h3>
                    <p className="text-gray-700 mb-3">사물의 모양을 본떠서 만든 글자</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">日 (해)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">月 (달)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">山 (산)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">水 (물)</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-600 pl-6 py-3 bg-gray-50 rounded-r-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">2) 지사(指事)</h3>
                    <p className="text-gray-700 mb-3">추상적인 개념을 점이나 선 같은 간단한 기호를 이용해 직접 가리켜 만든 글자</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">上 (위)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">下 (아래)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">一 (하나)</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-500 pl-6 py-3 bg-gray-50 rounded-r-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">3) 회의(會意)</h3>
                    <p className="text-gray-700 mb-3">이미 존재하는 여러 한자를 결합하여 새로운 의미를 표현한 글자</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">休 (사람人 + 나무木 = 쉴 휴)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-lg shadow-sm text-2xl border border-gray-200">明 (해日 + 달月 = 밝을 명)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 2: 필순과 획순 */}
            <section id="section-2" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">2. 필순(筆順)과 획순(劃順)</h2>
              <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">필순과 획순의 개념</h3>
                  <div className="p-5 bg-gray-50 rounded-lg mb-6">
                    <p className="mb-4 text-gray-700">
                      <strong className="text-gray-900">필순(筆順)</strong>은 한자를 쓸 때 붓을 움직이는 순서를 의미합니다. 어떤 획을 먼저 쓰고, 어디서 붓을 떼어 다음 획으로 넘어가는지를 규정한 것입니다.
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">획순(劃順)</strong>은 한자를 구성하는 획(stroke)의 나열 순서를 말하며, 필순과 유사한 의미로 사용됩니다.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">한자 필순·획순의 주요 원칙</h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">가로(ㅡ) 획 먼저, 세로(ㅣ) 획 나중에</h4>
                    <p className="text-gray-700">가로획이 세로획보다 먼저 그려지는 것이 기본 원칙입니다. 「十(십)」의 경우 가로획(一)을 먼저 쓰고, 그 후 세로획(丨)을 씁니다.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">위에서 아래로</h4>
                    <p className="text-gray-700">한자의 필순은 기본적으로 위에서 아래로의 방향성을 갖습니다. 「三(삼)」의 경우, 맨 위 가로획부터 시작하여 중간, 맨 아래 순서로 써 내려갑니다.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 3: 한자 부수 */}
            <section id="section-3" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">3. 한자 부수(部首)</h2>
              <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
                <p className="mb-6 text-gray-700">
                  부수(部首)는 한자를 구성하는 기본 요소로, 한자 사전에서 특정 글자를 찾을 때 중요한 분류 기준이 됩니다.
                  부수는 한자의 의미를 나타내는 경우가 많아 해당 한자의 의미를 유추하는 데 도움이 됩니다.
                </p>
                
                <div className="mb-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">주요 부수 예시</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">氵 (삼수변)</h4>
                      <p className="text-gray-700 mb-3">물과 관련된 한자에 사용됩니다.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">海 (바다 해)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">河 (물 하)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">湖 (호수 호)</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">木 (목)</h4>
                      <p className="text-gray-700 mb-3">나무와 관련된 한자에 사용됩니다.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">林 (수풀 림)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">森 (수풀 삼)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">果 (열매 과)</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">火 (화)</h4>
                      <p className="text-gray-700 mb-3">불과 관련된 한자에 사용됩니다.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">炎 (불꽃 염)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">煙 (연기 연)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">燈 (등불 등)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 4: 한자 학습 방법 */}
            <section id="section-4" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">4. 한자 학습 방법</h2>
              <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
                <p className="mb-6 text-gray-700">
                  한자는 체계적인 학습 방법으로 접근하면 효과적으로 익힐 수 있습니다. 한자의 구성 원리와 필순을 이해하는 것은 학습의 기초가 됩니다.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">단계별 학습</h3>
                    <p className="text-gray-700 mb-4">초급, 중급, 고급 단계로 나누어 학습하는 것이 효과적입니다. 각 단계에 맞는 한자를 선별하여 학습하세요.</p>
                    <ul className="pl-6 list-disc text-gray-700 space-y-1">
                      <li>기초 한자부터 시작하여 난이도를 점차 높여갑니다.</li>
                      <li>같은 부수나 구성 원리를 가진 한자를 함께 학습합니다.</li>
                      <li>학습한 한자를 실제 문장에서 활용해 봅니다.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">반복과 복습</h3>
                    <p className="text-gray-700 mb-4">한자 학습에는 규칙적인 반복이 중요합니다. 장기 기억으로 전환하기 위한 복습 전략을 세우세요.</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-lg">
                        <span className="text-gray-700">간격을 두고 복습하는 간격 반복 학습법</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <span className="text-gray-700">플래시카드를 활용한 빠른 복습</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <span className="text-gray-700">퀴즈와 테스트로 기억 강화</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 5: 한자 급수와 수준별 학습 체계 */}
            <section id="section-5" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">5. 한자 급수와 수준별 학습 체계</h2>
              <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
                <p className="text-lg text-gray-700 mb-4">
                  한자는 체계적인 급수 시스템으로 분류되어 있어 학습자의 수준에 맞는 단계별 학습이 가능합니다. 
                  한자 급수는 일반적으로 15급부터 1급까지 나뉘며, 숫자가 낮을수록 높은 수준을 의미합니다.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">한자 급수별 특징</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <h4 className="font-medium text-gray-800 mb-2">초급 (15급-11급)</h4>
                      <p className="text-gray-700">기초 한자와 간단한 구조의 한자를 학습합니다. 일상생활에서 자주 사용되는 기본 한자들이 포함됩니다.</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-gray-800 mb-2">중급 (10급-6급)</h4>
                      <p className="text-gray-700">중간 수준의 한자와 조금 더 복잡한 구조의 한자를 학습합니다. 더 많은 부수와 결합된 한자들이 포함됩니다.</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <h4 className="font-medium text-gray-800 mb-2">고급 (5급-3급)</h4>
                      <p className="text-gray-700">복잡한 구조와 의미를 가진 한자를 학습합니다. 전문 분야에서 사용되는 한자들이 포함됩니다.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <h4 className="font-medium text-gray-800 mb-2">전문가 (2급-1급)</h4>
                      <p className="text-gray-700">가장 높은 수준의 한자와 희귀 한자를 학습합니다. 고전 문헌과 전문 서적에서 사용되는 한자들이 포함됩니다.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">자신의 수준에 맞는 학습 경로</h3>
                  <p className="text-gray-700 mb-4">
                    효과적인 한자 학습을 위해서는 자신의 현재 수준을 파악하고, 그에 맞는 학습 경로를 설정하는 것이 중요합니다. 
                    저희 플랫폼에서는 사용자의 수준을 진단하고 맞춤형 학습 경로를 제공하는 레벨 테스트를 제공합니다.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-700 mb-4">더 자세한 한자 급수 체계와 수준별 학습 방법에 대해 알아보세요.</p>
                    <Link href="/hanja-levels/structure" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mb-2">
                      한자 급수 체계 상세보기
                    </Link>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-gray-700 mb-4">나의 한자 레벨을 확인하고 맞춤형 학습 경로를 시작하세요.</p>
                  <Link href="/level-test" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow">
                    레벨 테스트 시작하기
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* 하단 CTA 섹션 */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">지금 바로 한자 학습을 시작하세요</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            육서와 필순의 원리를 이해하고 체계적인 한자 학습을 통해 한자 실력을 향상시켜 보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-lg shadow transition-all">
              한자 학습 시작하기
            </Link>
            <Link href="/writing-practice" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-medium rounded-lg transition-all">
              필기 연습 도구 사용하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HanjaPrinciplesPage; 