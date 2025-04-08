import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'PDF 연습 자료 - 한자로',
  description: '인쇄하여 사용할 수 있는 한자 학습 워크시트',
};

export default function PdfPracticePage() {
  // 정적 서버 컴포넌트에서는 useState를 사용할 수 없으므로 제거
  // 대신 미리 정의된 레벨 옵션을 사용
  const levelOptions = [
    { value: 'elementary-level1', label: '초등학교 1단계' },
    { value: 'elementary-level2', label: '초등학교 2단계' },
    { value: 'middle-level1', label: '중학교 1단계' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <Link href="/learn" className="text-white/80 hover:text-white flex items-center transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              학습 메인으로
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-yellow-300">PDF 한자</span> 연습 자료
          </h1>
          <p className="text-xl text-green-100 mb-2">
            인쇄하여 사용할 수 있는 한자 학습 워크시트
          </p>
          </div>
      </div>

      <div className="container mx-auto p-4 pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">PDF 연습 자료 선택</h2>
            
            <div className="mb-6">
              <p className="block text-gray-700 mb-2">사용 가능한 학습 레벨:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levelOptions.map((option) => (
                  <Link 
                    key={option.value}
                    href={`/learn/level/${option.value}`}
                    className="block p-4 border border-gray-300 rounded-md hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-600 mb-4">
                PDF 자료는 현재 준비 중입니다. 
                위 레벨을 선택하면 해당 학습 페이지로 이동합니다.
              </p>
                </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">참고사항</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>PDF 자료는 A4 용지에 최적화되어 있습니다.</li>
                <li>한자의 획순, 음과 훈, 대표 단어를 포함하고 있습니다.</li>
                <li>연습용 한자는 점선으로 표시되어 따라 쓸 수 있습니다.</li>
                <li>향후 더 많은 레벨의 PDF 자료가 추가될 예정입니다.</li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 