'use client';

import React from 'react';
import HanjaIcon from '@/components/HanjaIcon';

export default function HanjaIconsPage() {
  const hanjaExamples = ['水', '火', '木', '金', '土', '日', '月', '人', '山', '川'];
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">한자 아이콘 예제</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">기본 한자 아이콘</h2>
        <div className="flex flex-wrap gap-4">
          {hanjaExamples.map((hanja) => (
            <div key={hanja} className="flex flex-col items-center">
              <HanjaIcon hanja={hanja} size={60} />
              <span className="mt-2 text-sm">{hanja}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">다양한 크기의 아이콘</h2>
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center">
            <HanjaIcon hanja="水" size={30} />
            <span className="mt-2 text-xs">30px</span>
          </div>
          <div className="flex flex-col items-center">
            <HanjaIcon hanja="水" size={50} />
            <span className="mt-2 text-xs">50px</span>
          </div>
          <div className="flex flex-col items-center">
            <HanjaIcon hanja="水" size={80} />
            <span className="mt-2 text-xs">80px</span>
          </div>
          <div className="flex flex-col items-center">
            <HanjaIcon hanja="水" size={100} />
            <span className="mt-2 text-xs">100px</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">없는 아이콘 (기본값으로 대체)</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center">
            <HanjaIcon hanja="龍" size={60} />
            <span className="mt-2 text-sm">龍 (존재하지 않는 파일)</span>
          </div>
          <div className="flex flex-col items-center">
            <HanjaIcon hanja="鳳" size={60} />
            <span className="mt-2 text-sm">鳳 (존재하지 않는 파일)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 