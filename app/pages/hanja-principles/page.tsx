'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 간소화된 한자 애니메이션 컴포넌트 - SSR 비활성화
const SimpleHanziWriter = dynamic(() => import('../../components/SimpleHanziWriter'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

// 애니메이션 설정
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// 간소화된 필순 예시 컴포넌트
const SimpleStrokeExample = ({ 
  character, 
  description,
  strokes
}: { 
  character: string; 
  description: string;
  strokes: string[];
}) => {
  return (
    <div className="flex flex-col items-center bg-white rounded-xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h4 className="font-medium text-gray-800 mb-2 text-center">{character} {description}</h4>
      
      <div className="mb-3 w-full flex justify-center">
        <div className="text-7xl font-normal mb-2 text-gray-900">{character}</div>
      </div>
      
      <div className="w-full">
        <ol className="list-decimal pl-6 text-sm text-gray-700">
          {strokes.map((stroke, index) => (
            <li key={index} className="mb-1">{stroke}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// 목차 항목 타입 정의
interface TocItem {
  id: string;
  title: string;
}

const HanjaPrinciplesPage = () => {
  // 활성화된 섹션 추적을 위한 상태
  const [activeSection, setActiveSection] = useState<string>("");
  
  // 스크롤 진행률 애니메이션
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // 목차 항목
  const tocItems: TocItem[] = [
    { id: "section-1", title: "한자의 구성 원리 (육서六書)" },
    { id: "section-2", title: "필순(筆順)과 획순(劃順)" },
    { id: "section-3", title: "한자 부수(部首)" },
    { id: "section-4", title: "한자 학습 방법" }
  ];
  
  // 스크롤 시 섹션 활성화 감지
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });
    
    return () => {
      sectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      {/* 스크롤 진행률 표시기 */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50 origin-left" 
        style={{ scaleX }}
      />
      
      {/* 상단 히어로 헤더 */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/2">
            <div className="w-72 h-72 rounded-full bg-gray-500"></div>
          </div>
          <div className="absolute left-0 bottom-0 transform -translate-x-1/4 translate-y-1/2">
            <div className="w-72 h-72 rounded-full bg-gray-600"></div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">한자의 원리와 이해</h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                한자의 기본 구성 원리부터 필순, 부수, 효과적인 학습 방법까지 체계적으로 알아봅니다.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-4 md:gap-6"
            >
              <a href="#section-1" className="btn bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-md font-medium">
                원리 알아보기
              </a>
              <Link href="/learn" className="btn bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium">
                한자 학습하기
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 콘텐츠 및 사이드바 레이아웃 */}
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
              <motion.section 
                id="section-1"
                ref={(el) => { sectionRefs.current[0] = el; }}
                className="mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">1. 한자의 구성 원리 (육서六書)</h2>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    한자는 오랜 역사 속에서 발전해 오면서 여러 가지 방식으로 만들어진 문자 체계입니다. 
                    전통적으로 한자의 구성 원리를 설명할 때 '육서(六書)'라는 분류 방법이 자주 사용됩니다.
                  </p>
                  
                  <motion.div 
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <motion.div variants={fadeIn} className="border-l-4 border-gray-700 pl-6 py-3 bg-gray-50 rounded-r-lg">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">1) 상형(象形)</h3>
                      <p className="text-gray-700 mb-3">사물의 모양을 본떠서 만든 글자</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">日 (해)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">月 (달)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">山 (산)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">水 (물)</span>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={fadeIn} className="border-l-4 border-gray-600 pl-6 py-3 bg-gray-50 rounded-r-lg">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">2) 지사(指事)</h3>
                      <p className="text-gray-700 mb-3">추상적인 개념을 점이나 선 같은 간단한 기호를 이용해 직접 가리켜 만든 글자</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">上 (위)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">下 (아래)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">一 (하나)</span>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={fadeIn} className="border-l-4 border-gray-500 pl-6 py-3 bg-gray-50 rounded-r-lg">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">3) 회의(會意)</h3>
                      <p className="text-gray-700 mb-3">이미 존재하는 여러 한자를 결합하여 새로운 의미를 표현한 글자</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">休 (사람人 + 나무木 = 쉴 휴)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">明 (해日 + 달月 = 밝을 명)</span>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={fadeIn} className="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">4) 형성(形聲)</h3>
                      <p className="text-gray-700 mb-3">한자의 '형(形)'과 '성(聲)', 즉 뜻을 나타내는 부분(形)과 소리를 나타내는 부분(聲)을 결합한 글자</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">江 (물氵 + 공工)</span>
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">晴 (해日 + 청靑)</span>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={fadeIn} className="border-l-4 border-gray-500 pl-6 py-3 bg-gray-50 rounded-r-lg">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">5) 전주(轉注)</h3>
                      <p className="text-gray-700 mb-3">이미 있는 글자를 조금 바꾸거나 음·의미가 서로 통하는 글자끼리 전환하여 생긴 글자</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">老 (늙을 로) → 考 (생각할 고)</span>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={fadeIn} className="border-l-4 border-gray-600 pl-6 py-3 bg-gray-50 rounded-r-lg">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">6) 가차(假借)</h3>
                      <p className="text-gray-700 mb-3">원래 글자가 지닌 뜻을 무시하고, 그 글자의 소리만 빌려서 새로운 의미를 표현한 글자</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="inline-block px-4 py-3 bg-white rounded-xl shadow-sm text-2xl border border-gray-200 hover:shadow-md transition-shadow">來 (벼를 심다 → 올 래)</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>

              <motion.section 
                id="section-2"
                ref={(el) => { sectionRefs.current[1] = el; }}
                className="mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
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

                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">한자 필순·획순의 주요 원칙</h3>
                    <div className="space-y-8 mt-6">
                      <div className="flex flex-col md:flex-row bg-gray-50 rounded-xl overflow-hidden shadow-md">
                        <div className="w-full md:w-2/3 p-6">
                          <div className="flex items-start">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-md">
                              <span className="font-bold text-white text-lg">1</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold text-gray-800 mb-2">가로(ㅡ) 획 먼저, 세로(ㅣ) 획 나중에</h4>
                              <p className="text-gray-700 mb-3 leading-relaxed">가로획이 세로획보다 먼저 그려지는 것이 기본 원칙입니다. 「十(십)」의 경우 가로획(一)을 먼저 쓰고, 그 후 세로획(丨)을 씁니다.</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 bg-white p-4 flex items-center justify-center">
                          <SimpleStrokeExample 
                            character="十" 
                            description="(십)"
                            strokes={["가로획(一) 먼저", "세로획(丨) 나중에"]}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row bg-gray-50 rounded-xl overflow-hidden shadow-md">
                        <div className="w-full md:w-2/3 p-6">
                          <div className="flex items-start">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-md">
                              <span className="font-bold text-white text-lg">2</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold text-gray-800 mb-2">위에서 아래로</h4>
                              <p className="text-gray-700 mb-3 leading-relaxed">한자의 필순은 기본적으로 위에서 아래로의 방향성을 갖습니다. 「三(삼)」의 경우, 맨 위 가로획부터 시작하여 중간, 맨 아래 순서로 써 내려갑니다.</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 bg-white p-4 flex items-center justify-center">
                          <SimpleStrokeExample 
                            character="三" 
                            description="(삼)"
                            strokes={["맨 위 가로획 먼저", "중간 가로획", "맨 아래 가로획 마지막"]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
                
              <motion.section 
                id="section-3" 
                ref={(el) => { sectionRefs.current[2] = el; }}
                className="mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">3. 한자 부수(部首)</h2>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    부수(部首)는 한자를 구성하는 기본 요소로, 한자 사전에서 특정 글자를 찾을 때 중요한 분류 기준이 됩니다.
                    부수는 한자의 의미를 나타내는 경우가 많아 해당 한자의 의미를 유추하는 데 도움이 됩니다.
                  </p>
                  
                  <div className="mb-6 bg-gray-50 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">주요 부수 예시</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">氵 (삼수변)</h4>
                        <p className="text-gray-700 mb-3">물과 관련된 한자에 사용됩니다.</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-50 rounded text-lg">海 (바다 해)</span>
                          <span className="px-3 py-1 bg-gray-50 rounded text-lg">河 (물 하)</span>
                          <span className="px-3 py-1 bg-gray-50 rounded text-lg">湖 (호수 호)</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">木 (목)</h4>
                        <p className="text-gray-700 mb-3">나무와 관련된 한자에 사용됩니다.</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-50 rounded text-lg">林 (수풀 림)</span>
                          <span className="px-3 py-1 bg-gray-50 rounded text-lg">森 (수풀 삼)</span>
                          <span className="px-3 py-1 bg-gray-50 rounded text-lg">果 (열매 과)</span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">부수의 중요성</h3>
                    <ul className="space-y-3 pl-6 list-disc text-gray-700">
                      <li><span className="font-medium text-gray-900">한자 분류:</span> 사전에서 한자를 찾기 위한 기준이 됩니다.</li>
                      <li><span className="font-medium text-gray-900">의미 파악:</span> 부수를 통해 한자의 대략적인 의미를 유추할 수 있습니다.</li>
                      <li><span className="font-medium text-gray-900">학습 효율:</span> 같은 부수를 가진 한자들을 함께 학습하면 연관성을 통해 기억하기 쉽습니다.</li>
                      <li><span className="font-medium text-gray-900">문화적 이해:</span> 부수의 발전 과정은 동아시아 문화와 사고방식의 이해를 돕습니다.</li>
                    </ul>
                  </div>
                </div>
              </motion.section>
              
              <motion.section 
                id="section-4" 
                ref={(el) => { sectionRefs.current[3] = el; }}
                className="mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">4. 한자 학습 방법</h2>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    한자는 체계적인 학습 방법으로 접근하면 효과적으로 익힐 수 있습니다. 한자의 구성 원리와 필순을 이해하는 것은 학습의 기초가 됩니다.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4 shadow-md">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">단계별 학습</h3>
                      </div>
                      <p className="text-gray-700 mb-4">초급, 중급, 고급 단계로 나누어 학습하는 것이 효과적입니다. 각 단계에 맞는 한자를 선별하여 학습하세요.</p>
                      <ul className="pl-6 list-disc text-gray-700 space-y-1">
                        <li>기초 한자부터 시작하여 난이도를 점차 높여갑니다.</li>
                        <li>같은 부수나 구성 원리를 가진 한자를 함께 학습합니다.</li>
                        <li>학습한 한자를 실제 문장에서 활용해 봅니다.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4 shadow-md">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">반복과 복습</h3>
                      </div>
                      <p className="text-gray-700 mb-4">한자 학습에는 규칙적인 반복이 중요합니다. 장기 기억으로 전환하기 위한 복습 전략을 세우세요.</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
                          <span className="text-gray-800 font-medium mr-2">•</span>
                          <span className="text-gray-700">간격을 두고 복습하는 간격 반복 학습법</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
                          <span className="text-gray-800 font-medium mr-2">•</span>
                          <span className="text-gray-700">플래시카드를 활용한 빠른 복습</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
                          <span className="text-gray-800 font-medium mr-2">•</span>
                          <span className="text-gray-700">퀴즈와 테스트로 기억 강화</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">효과적인 한자 학습 도구</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-2 bg-gray-800"></div>
                        <div className="p-5">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">필기 연습</h4>
                          <p className="text-gray-700">직접 손으로 쓰면서 필순과 구조를 익히는 것이 가장 효과적입니다.</p>
                          <div className="mt-4">
                            <Link href="/writing-practice" className="text-gray-800 font-medium hover:text-gray-900 inline-flex items-center">
                              필기 연습 도구 사용하기
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-2 bg-gray-700"></div>
                        <div className="p-5">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">퀴즈와 테스트</h4>
                          <p className="text-gray-700">자신의 학습 상태를 확인하고 기억을 강화하는 데 효과적입니다.</p>
                          <div className="mt-4">
                            <Link href="/quiz" className="text-gray-800 font-medium hover:text-gray-900 inline-flex items-center">
                              퀴즈 풀어보기
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-2 bg-gray-600"></div>
                        <div className="p-5">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">학습 통계</h4>
                          <p className="text-gray-700">자신의 학습 진행 상황을 추적하고 개선할 부분을 파악합니다.</p>
                          <div className="mt-4">
                            <Link href="/dashboard" className="text-gray-800 font-medium hover:text-gray-900 inline-flex items-center">
                              학습 통계 보기
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 CTA 섹션 */}
      <motion.div 
        className="bg-gray-900 text-white py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 바로 한자 학습을 시작하세요</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            육서와 필순의 원리를 이해하고 체계적인 한자 학습을 통해 한자 실력을 향상시켜 보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn" className="btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
              한자 학습 시작하기
            </Link>
            <Link href="/writing-practice" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-medium rounded-lg transition-all">
              필기 연습 도구 사용하기
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HanjaPrinciplesPage;