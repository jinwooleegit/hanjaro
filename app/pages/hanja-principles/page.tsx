'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
    <div className="flex flex-col items-center bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <h4 className="font-medium text-gray-800 mb-2 text-center">{character} {description}</h4>
      
      <div className="mb-3 w-full flex justify-center">
        <div className="text-7xl font-normal mb-2">{character}</div>
      </div>
      
      <div className="w-full">
        <ol className="list-decimal pl-6 text-sm text-gray-700">
          {strokes.map((stroke, index) => (
            <li key={index}>{stroke}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const HanjaPrinciplesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-gray-800"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        한자의 원리와 이해
      </motion.h1>

      <motion.div 
        className="mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">1. 한자의 구성 원리 (육서六書)</h2>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="mb-4 text-gray-700">
            한자는 오랜 역사 속에서 발전해 오면서 여러 가지 방식으로 만들어진 문자 체계입니다. 
            전통적으로 한자의 구성 원리를 설명할 때 '육서(六書)'라는 분류 방법이 자주 사용됩니다.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium mb-2 text-gray-800">1) 상형(象形)</h3>
              <p className="text-gray-700">사물의 모양을 본떠서 만든 글자</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">日 (해)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">月 (달)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">山 (산)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">水 (물)</span>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-medium mb-2 text-gray-800">2) 지사(指事)</h3>
              <p className="text-gray-700">추상적인 개념을 점이나 선 같은 간단한 기호를 이용해 직접 가리켜 만든 글자</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">上 (위)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">下 (아래)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">一 (하나)</span>
              </div>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-medium mb-2 text-gray-800">3) 회의(會意)</h3>
              <p className="text-gray-700">이미 존재하는 여러 한자를 결합하여 새로운 의미를 표현한 글자</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">休 (사람人 + 나무木 = 쉴 휴)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">明 (해日 + 달月 = 밝을 명)</span>
              </div>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-xl font-medium mb-2 text-gray-800">4) 형성(形聲)</h3>
              <p className="text-gray-700">한자의 '형(形)'과 '성(聲)', 즉 뜻을 나타내는 부분(形)과 소리를 나타내는 부분(聲)을 결합한 글자</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">江 (물氵 + 공工)</span>
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">晴 (해日 + 청靑)</span>
              </div>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="text-xl font-medium mb-2 text-gray-800">5) 전주(轉注)</h3>
              <p className="text-gray-700">이미 있는 글자를 조금 바꾸거나 음·의미가 서로 통하는 글자끼리 전환하여 생긴 글자</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">老 (늙을 로) → 考 (생각할 고)</span>
              </div>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-xl font-medium mb-2 text-gray-800">6) 가차(假借)</h3>
              <p className="text-gray-700">원래 글자가 지닌 뜻을 무시하고, 그 글자의 소리만 빌려서 새로운 의미를 표현한 글자</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-block px-3 py-2 bg-gray-100 rounded text-2xl">來 (벼를 심다 → 올 래)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">2. 필순(筆順)과 획순(劃順)</h2>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2 text-gray-800">필순과 획순의 개념</h3>
            <p className="mb-2 text-gray-700">
              <strong>필순(筆順)</strong>은 한자를 쓸 때 붓을 움직이는 순서를 의미합니다. 어떤 획을 먼저 쓰고, 어디서 붓을 떼어 다음 획으로 넘어가는지를 규정한 것입니다.
            </p>
            <p className="text-gray-700">
              <strong>획순(劃順)</strong>은 한자를 구성하는 획(stroke)의 나열 순서를 말하며, 필순과 유사한 의미로 사용됩니다.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2 text-gray-800">한자 필순·획순의 주요 원칙</h3>
            <div className="space-y-8 mt-4">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="font-bold text-blue-800">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">가로(ㅡ) 획 먼저, 세로(ㅣ) 획 나중에</h4>
                      <p className="text-gray-600 mb-3">예: 「十(십)」- 가로획(一) 먼저, 세로획(丨) 나중에</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <SimpleStrokeExample 
                    character="十" 
                    description="(십)"
                    strokes={["가로획(一) 먼저", "세로획(丨) 나중에"]}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="font-bold text-blue-800">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">위에서 아래로</h4>
                      <p className="text-gray-600 mb-3">예: 「三(삼)」- 맨 위 가로획 → 중간 가로획 → 맨 아래 가로획</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <SimpleStrokeExample 
                    character="三" 
                    description="(삼)"
                    strokes={["맨 위 가로획 먼저", "중간 가로획", "맨 아래 가로획 마지막"]}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="font-bold text-blue-800">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">왼쪽에서 오른쪽으로</h4>
                      <p className="text-gray-600 mb-3">예: 「川(천)」- 왼쪽 세로획이 오른쪽 세로획보다 먼저</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <SimpleStrokeExample 
                    character="川" 
                    description="(천)"
                    strokes={["왼쪽 세로획 먼저", "중간 세로획", "오른쪽 세로획 마지막"]}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="font-bold text-blue-800">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">바깥에서 안으로, 그리고 둘러싸는 획은 나중에 닫는다</h4>
                      <p className="text-gray-600 mb-3">예: 「日(일)」- 바깥 획 먼저, 안쪽 획 나중에</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <SimpleStrokeExample 
                    character="日" 
                    description="(일)"
                    strokes={["왼쪽 상단에서 오른쪽으로", "왼쪽에서 아래로", "하단 가로획", "오른쪽 세로획", "중앙 가로획 마지막"]}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 pr-0 md:pr-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="font-bold text-blue-800">5</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">대각선: 왼쪽 내리기는 획을 먼저, 오른쪽 내리기는 획을 나중에</h4>
                      <p className="text-gray-600 mb-3">예: 「人(인)」- 왼쪽 사선 '丿' 먼저, 오른쪽 사선 '㇏' 나중에</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <SimpleStrokeExample 
                    character="人" 
                    description="(인)"
                    strokes={["왼쪽 사선 '丿' 먼저", "오른쪽 사선 '㇏' 나중에"]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2 text-gray-800">간단한 필순 예시</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col">
                <h4 className="font-medium text-gray-800 mb-2 text-center">永 (길 영)</h4>
                <p className="text-gray-600 mb-4 text-center">팔법(八法)의 대표 예시 글자</p>
                
                <div className="flex justify-center mb-4">
                  <SimpleHanziWriter
                    character="永"
                    width={180}
                    height={180}
                  />
                </div>
                
                <ol className="list-decimal pl-8 text-gray-700">
                  <li>왼쪽 점 (丶)</li>
                  <li>가로 긋기 (一)</li>
                  <li>왼쪽 사선 (丿)</li>
                  <li>갈고리 달린 오른쪽 사선</li>
                  <li>아래로 긋고 꺾기</li>
                </ol>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col">
                <h4 className="font-medium text-gray-800 mb-2 text-center">國 (나라 국)</h4>
                <p className="text-gray-600 mb-4 text-center">복잡한 한자의 필순 원칙</p>
                
                <div className="flex justify-center mb-4">
                  <SimpleHanziWriter
                    character="國"
                    width={180}
                    height={180}
                  />
                </div>
                
                <p className="text-gray-700 text-center">
                  복잡한 한자일수록 원칙 순서가 중요합니다:
                  <br />1. 바깥부터 안쪽으로
                  <br />2. 왼쪽에서 오른쪽으로
                  <br />3. 위에서 아래로
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">필순의 중요성</h3>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li><strong>가독성과 미학:</strong> 올바른 필순으로 쓰면 글자의 균형이 안정되고 아름다워집니다.</li>
              <li><strong>학습 효율:</strong> 복잡한 한자라도 필순에 맞춰 익히면 체계적으로 암기할 수 있습니다.</li>
              <li><strong>디지털 응용:</strong> 디지털 서체 제작이나 필기 인식 기술에도 필순 개념이 활용됩니다.</li>
              <li><strong>문화적 가치:</strong> 동아시아 서예 문화의 중요한 요소로서 예술적 가치를 지닙니다.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="flex justify-center mt-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link 
          href="/learn"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
        >
          한자 학습 시작하기
        </Link>
      </motion.div>
    </div>
  );
};

export default HanjaPrinciplesPage; 