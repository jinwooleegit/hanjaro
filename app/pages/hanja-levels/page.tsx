'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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

// 급수 배지 컴포넌트
const LevelBadge = ({ level, color }: { level: number; color: string }) => {
  return (
    <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center shadow-md`}>
      <span className="text-white font-bold text-xl">{level}급</span>
    </div>
  );
};

const HanjaLevelsPage = () => {
  // 스크롤 진행률 애니메이션
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
              <h1 className="text-5xl md:text-6xl font-bold mb-4">한자 급수와 학습 체계</h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                한자 급수별 난이도와 학습 방법, 시험 정보를 체계적으로 알아봅니다.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-4 md:gap-6"
            >
              <a href="#level-system" className="btn bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-md font-medium">
                급수 체계 보기
              </a>
              <Link href="/level-test" className="btn bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium">
                레벨 테스트 하기
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
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.section 
            id="level-system"
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">한자 급수 체계</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-200">
              <p className="mb-6 text-gray-700 leading-relaxed">
                한자 급수는 한자의 난이도와 활용도에 따라 구분된 체계로, 한국에서는 한자능력검정시험, 상공회의소 한자, KBS 한자급수시험 등 다양한 시험이 있습니다.
                일반적으로 숫자가 작을수록 고급 수준을 의미합니다. (예: 1급이 가장 높은 수준)
              </p>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">대표적인 한자 급수 체계</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 border-b text-left text-gray-800 font-semibold">급수</th>
                        <th className="py-3 px-4 border-b text-left text-gray-800 font-semibold">학습 수준</th>
                        <th className="py-3 px-4 border-b text-left text-gray-800 font-semibold">한자 수</th>
                        <th className="py-3 px-4 border-b text-left text-gray-800 font-semibold">해당 학년</th>
                        <th className="py-3 px-4 border-b text-left text-gray-800 font-semibold">참고 사항</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">8급</td>
                        <td className="py-3 px-4 text-gray-700">초급</td>
                        <td className="py-3 px-4 text-gray-700">100자</td>
                        <td className="py-3 px-4 text-gray-700">초등 1-2학년</td>
                        <td className="py-3 px-4 text-gray-700">기초 한자, 일상생활에서 자주 사용되는 한자</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">7급</td>
                        <td className="py-3 px-4 text-gray-700">초급</td>
                        <td className="py-3 px-4 text-gray-700">200자</td>
                        <td className="py-3 px-4 text-gray-700">초등 2-3학년</td>
                        <td className="py-3 px-4 text-gray-700">기초 한자와 초등 교육과정 한자</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">6급</td>
                        <td className="py-3 px-4 text-gray-700">초급-중급</td>
                        <td className="py-3 px-4 text-gray-700">300자</td>
                        <td className="py-3 px-4 text-gray-700">초등 3-4학년</td>
                        <td className="py-3 px-4 text-gray-700">일상 생활용 한자</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">5급</td>
                        <td className="py-3 px-4 text-gray-700">중급</td>
                        <td className="py-3 px-4 text-gray-700">500자</td>
                        <td className="py-3 px-4 text-gray-700">초등 4-5학년</td>
                        <td className="py-3 px-4 text-gray-700">교과서 수준의 한자</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">4급</td>
                        <td className="py-3 px-4 text-gray-700">중급</td>
                        <td className="py-3 px-4 text-gray-700">800자</td>
                        <td className="py-3 px-4 text-gray-700">초등 5-6학년</td>
                        <td className="py-3 px-4 text-gray-700">일상 한자와 교과서 한자 포함</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">3급</td>
                        <td className="py-3 px-4 text-gray-700">중급-고급</td>
                        <td className="py-3 px-4 text-gray-700">1,500자</td>
                        <td className="py-3 px-4 text-gray-700">중학교</td>
                        <td className="py-3 px-4 text-gray-700">중학교 수준 한자어 활용</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">준2급</td>
                        <td className="py-3 px-4 text-gray-700">고급</td>
                        <td className="py-3 px-4 text-gray-700">2,000자</td>
                        <td className="py-3 px-4 text-gray-700">고등학교</td>
                        <td className="py-3 px-4 text-gray-700">고교 교육과정 수준</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">2급</td>
                        <td className="py-3 px-4 text-gray-700">고급</td>
                        <td className="py-3 px-4 text-gray-700">2,500자</td>
                        <td className="py-3 px-4 text-gray-700">고등학교-대학교</td>
                        <td className="py-3 px-4 text-gray-700">전문적 한자어 이해</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">1급</td>
                        <td className="py-3 px-4 text-gray-700">최고급</td>
                        <td className="py-3 px-4 text-gray-700">3,000자 이상</td>
                        <td className="py-3 px-4 text-gray-700">대학교</td>
                        <td className="py-3 px-4 text-gray-700">전문 분야 및 고전 문헌 이해 수준</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section 
            id="level-badges"
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">급수별 배지</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-200">
              <p className="mb-6 text-gray-700 leading-relaxed">
                한자로 앱에서는 사용자의 급수에 따라 다른 색상의 배지를 제공합니다. 
                레벨 테스트를 통과하거나 특정 학습 목표를 달성하면 해당 급수의 배지를 획득할 수 있습니다.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={1} color="bg-yellow-500" />
                  <p className="mt-3 font-medium text-gray-800">1급 (최고급)</p>
                  <p className="text-sm text-gray-600">금색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={2} color="bg-yellow-500" />
                  <p className="mt-3 font-medium text-gray-800">2급 (고급)</p>
                  <p className="text-sm text-gray-600">금색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={3} color="bg-yellow-500" />
                  <p className="mt-3 font-medium text-gray-800">3급 (중고급)</p>
                  <p className="text-sm text-gray-600">금색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={4} color="bg-red-500" />
                  <p className="mt-3 font-medium text-gray-800">4급 (중급)</p>
                  <p className="text-sm text-gray-600">빨간색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={5} color="bg-red-500" />
                  <p className="mt-3 font-medium text-gray-800">5급 (중급)</p>
                  <p className="text-sm text-gray-600">빨간색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={6} color="bg-red-500" />
                  <p className="mt-3 font-medium text-gray-800">6급 (초중급)</p>
                  <p className="text-sm text-gray-600">빨간색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={7} color="bg-blue-500" />
                  <p className="mt-3 font-medium text-gray-800">7급 (초급)</p>
                  <p className="text-sm text-gray-600">파란색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={8} color="bg-blue-500" />
                  <p className="mt-3 font-medium text-gray-800">8급 (초급)</p>
                  <p className="text-sm text-gray-600">파란색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={9} color="bg-blue-500" />
                  <p className="mt-3 font-medium text-gray-800">9급 (초급)</p>
                  <p className="text-sm text-gray-600">파란색 배지</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <LevelBadge level={10} color="bg-green-500" />
                  <p className="mt-3 font-medium text-gray-800">10급 (입문)</p>
                  <p className="text-sm text-gray-600">초록색 배지</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section 
            id="study-strategy"
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">급수별 학습 전략</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">초급 (8급-6급)</h3>
                  <ul className="space-y-3 pl-6 list-disc text-gray-700">
                    <li>기초 한자와 일상생활에서 많이 사용되는 한자 중심 학습</li>
                    <li>부수와 획순에 중점을 두고 정확한 쓰기 연습</li>
                    <li>한자의 기본 의미와 발음 익히기</li>
                    <li>기초 한자로 구성된 단어 학습 (2자 한자어 중심)</li>
                    <li>플래시카드와 반복 학습으로 기초 다지기</li>
                  </ul>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">추천 학습 방법</h4>
                    <p className="text-gray-700">매일 5-10개의 한자를 목표로 꾸준히 학습하고, 쓰기 연습을 통해 한자의 형태를 익히세요.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">중급 (5급-3급)</h3>
                  <ul className="space-y-3 pl-6 list-disc text-gray-700">
                    <li>상형, 회의, 형성자 등 한자의 구성 원리 이해하기</li>
                    <li>한자의 의미 확장과 파생 의미 학습</li>
                    <li>3-4자 한자어와 관용 표현 익히기</li>
                    <li>한자 문장 읽기와 해석 연습</li>
                    <li>교과서에 등장하는 한자어 중심 학습</li>
                  </ul>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">추천 학습 방법</h4>
                    <p className="text-gray-700">단어 중심의 학습으로 확장하고, 한자의 의미 관계를 이해하며 연관 한자를 함께 학습하세요.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">고급 (준2급-1급)</h3>
                  <ul className="space-y-3 pl-6 list-disc text-gray-700">
                    <li>전문 분야의 한자어 학습 (의학, 법률, 경제 등)</li>
                    <li>고전 문헌에 등장하는 한자와 한문 구절 이해</li>
                    <li>한자어의 어원과 역사적 변천 과정 학습</li>
                    <li>한문 문법과 문장 구조 이해</li>
                    <li>한자 관련 깊이 있는 지식 습득</li>
                  </ul>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">추천 학습 방법</h4>
                    <p className="text-gray-700">문맥 속에서 한자의 용법을 이해하고, 관심 분야의 전문 용어를 중심으로 학습의 깊이를 더하세요.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">맞춤형 학습 계획</h3>
                  <p className="text-gray-700 mb-4">
                    자신의 현재 한자 수준과 학습 목표에 맞는 맞춤형 학습 계획을 수립하는 것이 중요합니다.
                  </p>
                  <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">나의 학습 계획 세우기</h4>
                    <ol className="pl-6 list-decimal text-gray-700 space-y-2">
                      <li>레벨 테스트로 현재 수준 확인하기</li>
                      <li>목표 급수 설정하기</li>
                      <li>주/월 단위 학습 계획 수립하기</li>
                      <li>정기적인 복습과 테스트로 진도 체크하기</li>
                    </ol>
                    <div className="mt-4">
                      <Link href="/level-test" className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        레벨 테스트 시작하기
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">나의 한자 급수 확인하기</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            한자 레벨 테스트를 통해 현재 자신의 한자 수준을 확인하고, 맞춤형 학습 계획을 세워보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/level-test" className="btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
              레벨 테스트 시작하기
            </Link>
            <Link href="/learn" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-medium rounded-lg transition-all">
              한자 학습 시작하기
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HanjaLevelsPage;