import { Hanja } from './types';

// 기초 한자 샘플 데이터
export const basicHanjaData: Hanja[] = [
  {
    id: 1,
    character: '人',
    meaning: '사람 인',
    pronunciation: '인',
    strokes: 2,
    examples: ['人間(인간): 사람', '人格(인격): 인격'],
    level: 1,
    story: '두 획이 서로 기대어 있는 모습이 사람이 두 다리로 서 있는 모습을 표현하고 있습니다.',
    strokePaths: [
      {
        path: 'M 30 20 L 50 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 50 70 L 70 20',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '大', meaning: '큰 대' },
      { character: '天', meaning: '하늘 천' }
    ]
  },
  {
    id: 2,
    character: '山',
    meaning: '산 산',
    pronunciation: '산',
    strokes: 3,
    examples: ['山水(산수): 산과 물', '登山(등산): 산에 오름'],
    level: 1,
    story: '세 개의 봉우리가 있는 모습이 산의 형태를 나타냅니다.',
    strokePaths: [
      {
        path: 'M 30 20 L 50 40',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 50 40 L 70 20',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 50 40 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '岳', meaning: '큰 산 악' },
      { character: '峰', meaning: '봉우리 봉' }
    ]
  },
  {
    id: 3,
    character: '水',
    meaning: '물 수',
    pronunciation: '수',
    strokes: 4,
    examples: ['水源(수원): 물의 근원', '水泳(수영): 물에서 헤엄침'],
    level: 1,
    story: '물이 흐르는 모습을 형상화했습니다.',
    strokePaths: [
      {
        path: 'M 40 20 L 40 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 30 L 50 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 30 50 L 50 50',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 30 70 L 50 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '江', meaning: '강 강' },
      { character: '河', meaning: '물 하' },
      { character: '海', meaning: '바다 해' }
    ]
  },
  {
    id: 4,
    character: '火',
    meaning: '불 화',
    pronunciation: '화',
    strokes: 4,
    examples: ['火山(화산): 불을 뿜는 산', '火災(화재): 불로 인한 재해'],
    level: 1,
    story: '불꽃이 타오르는 모습을 형상화했습니다.',
    strokePaths: [
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 30 L 70 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 40 50 L 60 50',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 45 70 L 55 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '炎', meaning: '불꽃 염' },
      { character: '燃', meaning: '탈 연' }
    ]
  },
  {
    id: 5,
    character: '木',
    meaning: '나무 목',
    pronunciation: '목',
    strokes: 4,
    examples: ['木材(목재): 나무 재료', '木曜日(목요일): 목성의 날'],
    level: 1,
    story: '나무의 줄기와 가지를 형상화했습니다.',
    strokePaths: [
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 40 L 70 40',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 30 60 L 45 25',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 70 60 L 55 25',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '林', meaning: '수풀 림' },
      { character: '森', meaning: '빽빽할 삼' }
    ]
  },
  {
    id: 6,
    character: '金',
    meaning: '쇠 금',
    pronunciation: '금',
    strokes: 8,
    examples: ['金属(금속): 금속', '金曜日(금요일): 금성의 날'],
    level: 1,
    story: '땅 속에 묻힌 광석을 표현한 것으로 보입니다.',
    strokePaths: [
      // 간략화된 필순 경로
      {
        path: 'M 30 20 L 70 20',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 30 40 L 70 40',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 30 60 L 70 60',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '銀', meaning: '은 은' },
      { character: '銅', meaning: '구리 동' }
    ]
  }
];

// 레벨별 한자 데이터를 가져오는 함수
export const getHanjaByLevel = (level: number): Hanja[] => {
  return basicHanjaData.filter(hanja => hanja.level === level);
};

// 특정 한자 데이터를 ID로 가져오는 함수
export const getHanjaById = (id: number): Hanja | undefined => {
  return basicHanjaData.find(hanja => hanja.id === id);
}; 