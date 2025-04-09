'use client';

import React from 'react';
import Link from 'next/link';

export default function IconsGuidePage() {
  // 한자 아이콘 데이터
  const hanjaIcons = [
    { name: 'person', hanja: '人', meaning: '사람 인', className: 'icon-person', bgColor: '#3498db' },
    { name: 'mountain', hanja: '山', meaning: '산 산', className: 'icon-mountain', bgColor: '#2ecc71' },
    { name: 'water', hanja: '水', meaning: '물 수', className: 'icon-water', bgColor: '#1abc9c' },
    { name: 'fire', hanja: '火', meaning: '불 화', className: 'icon-fire', bgColor: '#e74c3c' },
    { name: 'tree', hanja: '木', meaning: '나무 목', className: 'icon-tree', bgColor: '#d35400' },
    { name: 'metal', hanja: '金', meaning: '쇠/금 금', className: 'icon-metal', bgColor: '#f1c40f' },
    { name: 'earth', hanja: '土', meaning: '흙 토', className: 'icon-earth', bgColor: '#e67e22' },
    { name: 'sun', hanja: '日', meaning: '날 일', className: 'icon-sun', bgColor: '#f9ca24' },
  ];

  // 배지 아이콘 데이터
  const badgeLevels = Array.from({ length: 15 }, (_, i) => i + 1);
  
  // 배지 색상 결정 함수
  const getBadgeColor = (level: number) => {
    if (level <= 3) return '#f59e0b'; // 금색 (1-3급)
    if (level <= 6) return '#ef4444'; // 빨간색 (4-6급) 
    if (level <= 9) return '#3b82f6'; // 파란색 (7-9급)
    if (level <= 12) return '#10b981'; // 초록색 (10-12급)
    return '#b45309'; // 청동색 (13-15급)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">한자로 아이콘 가이드</h1>
      
      <div className="mb-8 bg-yellow-50 border border-yellow-300 p-4 rounded-lg text-yellow-800">
        <p className="font-medium">⚠️ 주의: 아이콘 이미지 파일이 아직 업로드되지 않았습니다.</p>
        <p className="text-sm mt-2">
          현재 페이지는 이미지 없이 대체 UI를 표시합니다. 
          실제 아이콘 이미지가 <code className="bg-yellow-100 px-1 rounded">public/icons/hanja</code>와 
          <code className="bg-yellow-100 px-1 rounded">public/icons/badges</code> 폴더에 추가되면 
          CSS 스타일시트에 정의된 실제 이미지로 자동 전환됩니다.
        </p>
      </div>
      
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">한자 아이콘</h2>
        <p className="mb-6 text-gray-700">
          기본 한자 아이콘은 다음과 같이 사용할 수 있습니다. 한자 학습 카테고리와 태그에 활용됩니다.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {hanjaIcons.map((icon) => (
            <div key={icon.name} className="flex flex-col items-center">
              {/* CSS 클래스 대신 인라인 스타일로 대체 UI 제공 */}
              <div 
                className="w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: icon.bgColor }}
              >
                {icon.hanja}
              </div>
              <p className="mt-2 text-sm font-medium">{icon.hanja} - {icon.meaning}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">사용 방법:</h3>
          <code className="block bg-gray-800 text-white p-3 rounded mb-2 overflow-x-auto">
            {`<div className="hanja-icon icon-person" title="사람 인(人)"></div>`}
          </code>
          <p className="text-sm text-gray-600">
            CSS 클래스 <code className="bg-gray-100 px-1 rounded">hanja-icon</code>과 <code className="bg-gray-100 px-1 rounded">icon-[이름]</code> 형식으로 사용합니다.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>이미지 없을 때 대체 코드:</strong>
          </p>
          <code className="block bg-gray-800 text-white p-3 rounded mb-2 overflow-x-auto text-sm">
            {`<div className="w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#3498db' }}>人</div>`}
          </code>
        </div>
      </section>
      
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">레벨 배지 아이콘</h2>
        <p className="mb-6 text-gray-700">
          레벨 배지는 학습 진행도와 성취도를 표시하는 데 사용됩니다. 총 15단계의 배지가 제공됩니다.
        </p>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
          {badgeLevels.map((level) => (
            <div key={level} className="flex flex-col items-center">
              {/* CSS 클래스 대신 인라인 스타일로 대체 UI 제공 */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: getBadgeColor(level) }}
              >
                {level}
              </div>
              <p className="mt-2 text-sm font-medium">{level}급</p>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">사용 방법:</h3>
          <code className="block bg-gray-800 text-white p-3 rounded mb-2 overflow-x-auto">
            {`<div className="badge-icon badge-level1" title="1급"></div>`}
          </code>
          <p className="text-sm text-gray-600">
            CSS 클래스 <code className="bg-gray-100 px-1 rounded">badge-icon</code>과 <code className="bg-gray-100 px-1 rounded">badge-level[번호]</code> 형식으로 사용합니다.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>이미지 없을 때 대체 코드:</strong>
          </p>
          <code className="block bg-gray-800 text-white p-3 rounded mb-2 overflow-x-auto text-sm">
            {`<div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{ backgroundColor: '#f59e0b' }}>1</div>`}
          </code>
        </div>
      </section>
      
      <div className="text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 