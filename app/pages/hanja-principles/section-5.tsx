import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CustomButton from '../../components/CustomButton';

// 레벨 배지 컴포넌트
const LevelBadge = ({ level, color }: { level: number, color: string }) => {
  const getSize = () => {
    return "w-16 h-16 md:w-20 md:h-20";
  };

  return (
    <div className={`${getSize()} ${color} rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-md`}>
      {level}
    </div>
  );
};

// 페이드인 애니메이션 설정
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HanjaLevelsSection = () => {
  return (
    <div id="section-5" className="mb-16 scroll-mt-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">한자 급수와 수준별 학습 체계</h2>
      
      <motion.section
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">한자 급수 체계와 학습 수준</h3>
          <p className="text-lg text-gray-700 mb-8">
            한자 급수는 학습자의 한자 실력을 체계적으로 구분하여 단계별 학습을 가능하게 합니다. 
            한국에서는 한자능력검정시험(한검)과 한국어문회 한자급수 등 여러 기관에서 급수 체계를 운영하고 있습니다.
          </p>
          
          <div className="overflow-x-auto mb-10">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">한자급수</th>
                  <th className="py-3 px-4 text-left">학습 수준</th>
                  <th className="py-3 px-4 text-left">한자 수</th>
                  <th className="py-3 px-4 text-left">해당 학년</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">1급</td>
                  <td className="py-3 px-4">고급</td>
                  <td className="py-3 px-4">약 3,000자 이상</td>
                  <td className="py-3 px-4">대학 ~ 전문가</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">준1급</td>
                  <td className="py-3 px-4">고급</td>
                  <td className="py-3 px-4">약 2,500자</td>
                  <td className="py-3 px-4">대학</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">2급</td>
                  <td className="py-3 px-4">고급</td>
                  <td className="py-3 px-4">약 2,000자</td>
                  <td className="py-3 px-4">고등학교 ~ 대학</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">준2급</td>
                  <td className="py-3 px-4">상급</td>
                  <td className="py-3 px-4">약 1,800자</td>
                  <td className="py-3 px-4">고등학교</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">3급</td>
                  <td className="py-3 px-4">중급</td>
                  <td className="py-3 px-4">약 1,500자</td>
                  <td className="py-3 px-4">중학교 ~ 고등학교</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">4급</td>
                  <td className="py-3 px-4">중급</td>
                  <td className="py-3 px-4">약 1,200자</td>
                  <td className="py-3 px-4">중학교</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">5급</td>
                  <td className="py-3 px-4">초중급</td>
                  <td className="py-3 px-4">약 800자</td>
                  <td className="py-3 px-4">초등학교 고학년 ~ 중학교</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">6급</td>
                  <td className="py-3 px-4">초급</td>
                  <td className="py-3 px-4">약 500자</td>
                  <td className="py-3 px-4">초등학교 중고학년</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">7급</td>
                  <td className="py-3 px-4">초급</td>
                  <td className="py-3 px-4">약 300자</td>
                  <td className="py-3 px-4">초등학교 저학년</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">8급</td>
                  <td className="py-3 px-4">초급</td>
                  <td className="py-3 px-4">약 200자</td>
                  <td className="py-3 px-4">초등학교 저학년</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">9급</td>
                  <td className="py-3 px-4">초급</td>
                  <td className="py-3 px-4">약 100자</td>
                  <td className="py-3 px-4">초등학교 저학년</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">10급</td>
                  <td className="py-3 px-4">입문</td>
                  <td className="py-3 px-4">약 50자</td>
                  <td className="py-3 px-4">입문자</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-2xl font-bold mb-6 text-gray-800">급수별 배지 시스템</h3>
          <p className="text-lg text-gray-700 mb-6">
            각 급수에 따라 다른 색상의 배지가 부여됩니다. 높은 급수일수록 더 빛나는 배지를 획득할 수 있습니다.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <LevelBadge level={1} color="bg-yellow-500" />
              <p className="mt-3 font-medium text-gray-800">1급 (고급)</p>
              <p className="text-sm text-gray-600">금색 배지</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <LevelBadge level={3} color="bg-yellow-500" />
              <p className="mt-3 font-medium text-gray-800">3급 (중급)</p>
              <p className="text-sm text-gray-600">금색 배지</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <LevelBadge level={5} color="bg-red-500" />
              <p className="mt-3 font-medium text-gray-800">5급 (초중급)</p>
              <p className="text-sm text-gray-600">빨간색 배지</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <LevelBadge level={7} color="bg-blue-500" />
              <p className="mt-3 font-medium text-gray-800">7급 (초급)</p>
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
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">급수별 학습 전략</h3>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">초급 (8급-6급)</h4>
              <ul className="space-y-3 pl-6 list-disc text-gray-700">
                <li>기초 한자와 일상생활에서 많이 사용되는 한자 중심 학습</li>
                <li>부수와 획순에 중점을 두고 정확한 쓰기 연습</li>
                <li>한자의 기본 의미와 발음 익히기</li>
                <li>기초 한자로 구성된 단어 학습 (2자 한자어 중심)</li>
                <li>플래시카드와 반복 학습으로 기초 다지기</li>
              </ul>
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">추천 학습 방법</h5>
                <p className="text-gray-700">매일 5-10개의 한자를 목표로 꾸준히 학습하고, 쓰기 연습을 통해 한자의 형태를 익히세요.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">중급 (5급-3급)</h4>
              <ul className="space-y-3 pl-6 list-disc text-gray-700">
                <li>상형, 회의, 형성자 등 한자의 구성 원리 이해하기</li>
                <li>한자의 의미 확장과 파생 의미 학습</li>
                <li>3-4자 한자어와 관용 표현 익히기</li>
                <li>한자 문장 읽기와 해석 연습</li>
                <li>교과서에 등장하는 한자어 중심 학습</li>
              </ul>
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">추천 학습 방법</h5>
                <p className="text-gray-700">단어 중심의 학습으로 확장하고, 한자의 의미 관계를 이해하며 연관 한자를 함께 학습하세요.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">고급 (준2급-1급)</h4>
              <ul className="space-y-3 pl-6 list-disc text-gray-700">
                <li>전문 분야의 한자어 학습 (의학, 법률, 경제 등)</li>
                <li>고전 문헌에 등장하는 한자와 한문 구절 이해</li>
                <li>한자어의 어원과 역사적 변천 과정 학습</li>
                <li>한문 문법과 문장 구조 이해</li>
                <li>한자 관련 깊이 있는 지식 습득</li>
              </ul>
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">추천 학습 방법</h5>
                <p className="text-gray-700">문맥 속에서 한자의 용법을 이해하고, 관심 분야의 전문 용어를 중심으로 학습의 깊이를 더하세요.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">맞춤형 학습 계획</h4>
              <p className="text-gray-700 mb-4">
                자신의 현재 한자 수준과 학습 목표에 맞는 맞춤형 학습 계획을 수립하는 것이 중요합니다.
              </p>
              <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">나의 학습 계획 세우기</h5>
                <ol className="pl-6 list-decimal text-gray-700 space-y-2">
                  <li>레벨 테스트로 현재 수준 확인하기</li>
                  <li>목표 급수 설정하기</li>
                  <li>주/월 단위 학습 계획 수립하기</li>
                  <li>정기적인 복습과 테스트로 진도 체크하기</li>
                </ol>
                <div className="mt-4">
                  <Link href="/level-test">
                    <CustomButton text="레벨 테스트 시작하기" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="text-right mt-8">
        <Link href="/level-test" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          한자 레벨 테스트 바로가기
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default HanjaLevelsSection; 