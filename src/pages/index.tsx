import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>한자로(韓字路) - 당신만의 한자 학습 여정</title>
        <meta name="description" content="개인화된 한자 학습 경험을 제공하는 한자로(韓字路)에서 재미있고 효과적으로 한자를 배워보세요." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  한자 학습의 <br />
                  <span className="text-yellow-300">새로운 길</span>을 <br />
                  발견하세요
                </h1>
                <p className="text-lg mb-8 text-gray-100">
                  개인화된 학습 경로, 인터랙티브 필순 학습, 게임화 요소로 <br />
                  효과적이고 재미있게 한자를 마스터하세요.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/learn" className="btn-secondary">
                    무료로 시작하기
                  </Link>
                  <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                    자세히 알아보기
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block"
              >
                <div className="relative h-[400px] w-full">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-6 flex items-center justify-center h-full">
                      <svg className="w-64 h-64 stroke-animation" viewBox="0 0 100 100">
                        {/* 사람 인(人) 한자 SVG 경로 - 단순화된 버전 */}
                        <path
                          d="M 30 20 L 50 70 L 70 20"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-stroke-draw"
                        />
                        <text x="40" y="90" className="text-4xl fill-white">人</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">왜 한자로(韓字路)인가?</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                AI 기반 개인화 학습과 다감각 접근법으로 한자 학습의 재미와 효율을 극대화합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md"
              >
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">개인화된 학습 경로</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI가 사용자의 학습 패턴과 강점/약점을 분석하여 최적화된 학습 경로를 제시합니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md"
              >
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">인터랙티브 필순 학습</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  직접 따라 그리며 한자의 구조와 필순을 체득하는 인터랙티브 방식으로 학습 효과를 높입니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md"
              >
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">게임화 학습 시스템</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  포인트, 배지, 랭킹 등 게임화 요소를 통해 학습 동기를 부여하고 지속적인 학습을 유도합니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">어떻게 작동하나요?</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                한자로(韓字路)는 체계적인 단계별 접근법으로 한자 학습을 안내합니다.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-bold mb-2">레벨 테스트</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  간단한 테스트로 현재 한자 지식 수준을 평가합니다.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-bold mb-2">맞춤형 학습 경로</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  개인 수준과 목표에 맞는 학습 계획을
                  제시합니다.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-bold mb-2">인터랙티브 학습</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  필순 연습, 퀴즈, 게임으로 다양하게 학습합니다.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="font-bold mb-2">성취 및 복습</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  진행 상황 추적 및 간격 반복 학습으로 기억을 강화합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">지금 한자 학습을 시작하세요</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              매일 5분의 학습으로 1000자 한자 마스터의 꿈을 실현하세요.
            </p>
            <Link href="/register" className="btn-secondary px-8 py-3 text-lg">
              무료 계정 만들기
            </Link>
          </div>
        </section>
      </main>
    </>
  );
} 