'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 간단한 목차 아이템 인터페이스
interface TocItem {
  id: string;
  title: string;
}

// 한자 원리 페이지 컴포넌트
const HanjaPrinciplesPage = () => {
  // 활성화된 섹션 상태
  const [activeSection, setActiveSection] = useState<string>("section-1");
  
  // 목차 항목
  const tocItems: TocItem[] = [
    { id: "section-1", title: "한자의 구성 원리 (육서六書)" },
    { id: "section-2", title: "필순(筆順)과 획순(劃順)" },
    { id: "section-3", title: "한자 부수(部首)" },
    { id: "section-4", title: "한자 학습 방법" },
    { id: "section-5", title: "한자 급수와 수준별 학습 체계" }
  ];
  
  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  return (
    <div className="bg-white">
      {/* 상단 히어로 헤더 */}
      <div className="relative bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">한자의 원리와 이해</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              한자의 기본 구성 원리부터 필순, 부수, 효과적인 학습 방법까지 체계적으로 알아봅니다.
            </p>
            
            <div className="flex gap-4 md:gap-6">
              <a href="#section-1" className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-md font-medium">
                원리 알아보기
              </a>
              <Link href="/learn" className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium">
                한자 학습하기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 콘텐츠 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 / 목차 */}
          <div className="md:w-1/4">
            <div className="sticky top-10 bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">목차</h3>
              <nav>
                <ul className="space-y-3">
                  {tocItems.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={`#${item.id}`}
                        className={`block py-2 px-3 rounded-lg transition-colors ${
                          activeSection === item.id 
                            ? "bg-gray-100 text-gray-800 font-medium" 
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="md:w-3/4">
            {/* 섹션 1: 한자의 구성 원리 */}
            <section id="section-1" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">1. 한자의 구성 원리 (육서六書)</h2>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <p className="mb-6 text-gray-700 leading-relaxed">
                  한자는 오랜 역사 속에서 발전해 오면서 여러 가지 방식으로 만들어진 문자 체계입니다. 
                  전통적으로 한자의 구성 원리를 설명할 때 '육서(六書)'라는 분류 방법이 자주 사용됩니다.
                </p>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-gray-700 pl-6 py-3 bg-gray-50 rounded-r-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">1) 상형(象形)</h3>
                    <p className="text-gray-700 mb-3">사물의 모양을 본떠서 만든 글자</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">日 (해)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">月 (달)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">山 (산)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">水 (물)</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-600 pl-6 py-3 bg-gray-50 rounded-r-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">2) 지사(指事)</h3>
                    <p className="text-gray-700 mb-3">추상적인 개념을 점이나 선 같은 간단한 기호를 이용해 직접 가리켜 만든 글자</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">上 (위)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">下 (아래)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">一 (하나)</span>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-500 pl-6 py-3 bg-gray-50 rounded-r-lg">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">3) 회의(會意)</h3>
                    <p className="text-gray-700 mb-3">이미 존재하는 여러 한자를 결합하여 새로운 의미를 표현한 글자</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">休 (사람人 + 나무木 = 쉴 휴)</span>
                      <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200">明 (해日 + 달月 = 밝을 명)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 2: 필순과 획순 */}
            <section id="section-2" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">2. 필순(筆順)과 획순(劃順)</h2>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">필순과 획순의 개념</h3>
                  <div className="p-5 bg-gray-50 rounded-xl mb-6">
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">필순(筆順)</strong>은 한자를 쓸 때 붓을 움직이는 순서를 의미합니다. 어떤 획을 먼저 쓰고, 어디서 붓을 떼어 다음 획으로 넘어가는지를 규정한 것입니다.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">획순(劃順)</strong>은 한자를 구성하는 획(stroke)의 나열 순서를 말하며, 필순과 유사한 의미로 사용됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 3: 한자 부수 */}
            <section id="section-3" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">3. 한자 부수(部首)</h2>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <p className="mb-6 text-gray-700 leading-relaxed">
                  부수(部首)는 한자를 구성하는 기본 요소로, 한자 사전에서 특정 글자를 찾을 때 중요한 분류 기준이 됩니다.
                  부수는 한자의 의미를 나타내는 경우가 많아 해당 한자의 의미를 유추하는 데 도움이 됩니다.
                </p>
                
                <div className="mb-6 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">주요 부수 예시</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">氵 (삼수변)</h4>
                      <p className="text-gray-700 mb-3">물과 관련된 한자에 사용됩니다.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">海 (바다 해)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">河 (물 하)</span>
                        <span className="px-3 py-1 bg-gray-50 rounded text-lg">湖 (호수 호)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 4: 한자 학습 방법 */}
            <section id="section-4" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">4. 한자 학습 방법</h2>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <p className="mb-6 text-gray-700 leading-relaxed">
                  한자는 체계적인 학습 방법으로 접근하면 효과적으로 익힐 수 있습니다. 한자의 구성 원리와 필순을 이해하는 것은 학습의 기초가 됩니다.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">단계별 학습</h3>
                    <p className="text-gray-700 mb-4">초급, 중급, 고급 단계로 나누어 학습하는 것이 효과적입니다. 각 단계에 맞는 한자를 선별하여 학습하세요.</p>
                    <ul className="pl-6 list-disc text-gray-700 space-y-1">
                      <li>기초 한자부터 시작하여 난이도를 점차 높여갑니다.</li>
                      <li>같은 부수나 구성 원리를 가진 한자를 함께 학습합니다.</li>
                      <li>학습한 한자를 실제 문장에서 활용해 봅니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 섹션 5: 한자 급수와 수준별 학습 체계 */}
            <section id="section-5" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">5. 한자 급수와 수준별 학습 체계</h2>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
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
                  <Link href="/level-test" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
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
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 바로 한자 학습을 시작하세요</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            육서와 필순의 원리를 이해하고 체계적인 한자 학습을 통해 한자 실력을 향상시켜 보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
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