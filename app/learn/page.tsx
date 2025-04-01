'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LearningPathSelector from '../components/LearningPathSelector';

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
const HanziWriterComponent = dynamic(() => import('../components/HanziWriterComponent'), {
  ssr: false,
});

// 한자 데이터 확장 - 부수, 음독, 관련 단어 추가
const popularHanjaList = [
  { 
    character: '人', 
    meaning: '사람 인', 
    korean: '사람',
    radical: '사람 인(人)', 
    stroke_count: 2,
    pronunciation: '인',
    related_words: ['인간(人間)', '인류(人類)', '타인(他人)'],
    examples: ['인생(人生)', '인재(人才)', '인물(人物)']
  },
  { 
    character: '永', 
    meaning: '영원할 영', 
    korean: '영원',
    radical: '영원할 영(永)', 
    stroke_count: 5,
    pronunciation: '영',
    related_words: ['영원(永遠)', '영구(永久)', '영속(永續)'],
    examples: ['영원히(永遠히)', '영생(永生)', '만년(萬年)']
  },
  { 
    character: '水', 
    meaning: '물 수', 
    korean: '물',
    radical: '삼수변(氵)', 
    stroke_count: 4,
    pronunciation: '수',
    related_words: ['수도(水道)', '수분(水分)', '수정(水晶)'],
    examples: ['물(水)', '수영(水泳)', '해수(海水)']
  },
  { 
    character: '火', 
    meaning: '불 화', 
    korean: '불',
    radical: '불 화(火)', 
    stroke_count: 4,
    pronunciation: '화',
    related_words: ['화재(火災)', '화력(火力)', '화산(火山)'],
    examples: ['화염(火焰)', '화상(火傷)', '불꽃(火花)']
  },
  { 
    character: '山', 
    meaning: '산 산', 
    korean: '산',
    radical: '산 산(山)', 
    stroke_count: 3,
    pronunciation: '산',
    related_words: ['산악(山岳)', '산맥(山脈)', '고산(高山)'],
    examples: ['산수(山水)', '등산(登山)', '산골(山谷)']
  },
  { 
    character: '學', 
    meaning: '배울 학', 
    korean: '배움',
    radical: '배울 학(學)', 
    stroke_count: 16,
    pronunciation: '학',
    related_words: ['학교(學校)', '학생(學生)', '학습(學習)'],
    examples: ['학문(學問)', '학위(學位)', '학자(學者)']
  },
  { 
    character: '道', 
    meaning: '길 도', 
    korean: '길',
    radical: '달릴 주(走)', 
    stroke_count: 12,
    pronunciation: '도',
    related_words: ['도로(道路)', '도덕(道德)', '도리(道理)'],
    examples: ['도시(都市)', '도장(道場)', '철도(鐵道)']
  }
];

type LearnTab = '필순' | '의미' | '예문';

export default function LearnPage() {
  const [selectedHanja, setSelectedHanja] = useState(popularHanjaList[0]);
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<LearnTab>('필순');
  
  // 옵션 상태 관리
  const [strokeSpeed, setStrokeSpeed] = useState(1);
  const [showCharacter, setShowCharacter] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#ff0000');
  const [outlineColor, setOutlineColor] = useState('#cccccc');

  const resetAnimation = () => {
    // 같은 한자를 강제로 다시 로드하는 효과
    const current = selectedHanja;
    setSelectedHanja({...current});
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">한자 학습</h1>
        
        <div className="mb-8">
          <LearningPathSelector />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">학습 방법</h2>
          <div className="space-y-4">
            <p>
              한자 학습은 단계별로 체계적으로 진행됩니다. 초등학생, 중고등학생, 대학생 수준으로 나누어 
              난이도에 맞게 학습할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>위에서 자신에게 맞는 학습 단계를 선택합니다.</li>
              <li>해당 단계에서 제공하는 한자 목록을 확인합니다.</li>
              <li>각 한자를 클릭하여 자세한 정보와 획순을 학습합니다.</li>
              <li>연습 모드를 통해 직접 한자를 써보며 익힙니다.</li>
              <li>퀴즈를 통해 학습 성취도를 확인합니다.</li>
            </ol>
            <p className="mt-4 text-gray-600 italic">
              처음 학습하시는 분들은 초등학생용 기초 한자부터 시작하는 것을 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 