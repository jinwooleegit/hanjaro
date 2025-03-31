import { Hanja } from './types';

// ===== 레벨 1: 초급 한자 (일상생활에서 자주 사용되는 기본 한자) =====
export const level1HanjaData: Hanja[] = [
  // 기존 샘플 데이터의 6개 한자 포함
  {
    id: 1,
    character: '人',
    meaning: '사람 인',
    pronunciation: '인',
    strokes: 2,
    examples: ['人間(인간): 사람', '人格(인격): 인격', '外國人(외국인): 외국 사람', '人生(인생): 인생'],
    level: 1,
    story: '두 획이 서로 기대어 있는 모습이 사람이 두 다리로 서 있는 모습을 표현하고 있습니다. 사람의 측면을 단순화하여 나타낸 상형문자입니다.',
    strokePaths: [
      {
        path: 'M 35 30 L 50 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 65 30 L 50 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      }
    ],
    relatedHanja: [
      { character: '大', meaning: '큰 대' },
      { character: '天', meaning: '하늘 천' },
      { character: '仁', meaning: '어질 인' }
    ]
  },
  {
    id: 2,
    character: '山',
    meaning: '산 산',
    pronunciation: '산',
    strokes: 3,
    examples: ['山水(산수): 산과 물', '登山(등산): 산에 오름', '火山(화산): 화산', '山脈(산맥): 산맥'],
    level: 1,
    story: '봉우리가 있는 산의 형태를 단순화하여 나타낸 것입니다. 가운데 봉우리가 있고 산의 능선을 위아래로 표현했습니다.',
    strokePaths: [
      {
        path: 'M 30 30 L 70 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 50 30 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 30 80 L 70 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '岳', meaning: '큰 산 악' },
      { character: '峰', meaning: '봉우리 봉' },
      { character: '丘', meaning: '언덕 구' }
    ]
  },
  {
    id: 3,
    character: '水',
    meaning: '물 수',
    pronunciation: '수',
    strokes: 4,
    examples: ['水源(수원): 물의 근원', '水泳(수영): 물에서 헤엄침', '水曜日(수요일): 수성의 날'],
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
    meaning: '불 화, 빛, 불꽃',
    pronunciation: '화',
    strokes: 4,
    examples: ['火山(화산): 불을 뿜는 산', '火災(화재): 불로 인한 재해', '火曜日(화요일): 화성의 날', '火力(화력): 불의 힘'],
    level: 1,
    story: '불꽃이 타오르는 모습을 형상화했습니다. 중앙의 불꽃에서 사방으로 불이 튀는 모습을 표현한 상형문자입니다.',
    strokePaths: [
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 40 L 35 35',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 70 40 L 65 35',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 50 80 L 45 65',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '炎', meaning: '불꽃 염' },
      { character: '燃', meaning: '탈 연' },
      { character: '熱', meaning: '더울 열' }
    ]
  },
  {
    id: 5,
    character: '木',
    meaning: '나무 목',
    pronunciation: '목',
    strokes: 4,
    examples: ['木材(목재): 나무 재료', '木曜日(목요일): 목성의 날', '木星(목성): 목성'],
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
    meaning: '쇠 금, 황금, 금속',
    pronunciation: '금',
    strokes: 8,
    examples: ['金属(금속): 금속', '金曜日(금요일): 금성의 날', '金星(금성): 금성', '金額(금액): 금액'],
    level: 1,
    story: '땅 속에 묻힌 광석을 표현한 것으로, 광산에서 금속을 캐내는 모습에서 유래했습니다. 윗부분의 "王"은 왕관을 쓴 사람 모양으로 귀한 것을 의미합니다.',
    strokePaths: [
      // 네이버 한자 사전 필순에 맞춘 정확한 path - 베지어 곡선으로 개선
      {
        path: 'M 45 25 Q 43 45, 45 65',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 55 25 Q 57 45, 55 65',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 35 45 C 40 43, 60 43, 65 45',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 35 25 C 40 23, 60 23, 65 25',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 35 65 C 40 63, 60 63, 65 65',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '2s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 42 65 Q 40 75, 42 85',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '2.5s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 58 65 Q 60 75, 58 85',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '3s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      },
      {
        path: 'M 42 85 C 45 83, 55 83, 58 85',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '3.5s',
        strokeLinecap: 'round',
        strokeWidth: '2.5'
      }
    ],
    relatedHanja: [
      { character: '銀', meaning: '은 은' },
      { character: '銅', meaning: '구리 동' },
      { character: '錢', meaning: '돈 전' }
    ]
  },
  // 추가 한자 - 레벨 1 (초급)
  {
    id: 7,
    character: '日',
    meaning: '날 일, 태양',
    pronunciation: '일',
    strokes: 4,
    examples: ['日本(일본): 일본', '日曜日(일요일): 일요일', '日記(일기): 일기', '日常(일상): 일상'],
    level: 1,
    story: '태양의 모습을 사각형으로 단순화하여 표현한 것입니다. 매일 떠오르는 태양을 의미하며, 날짜와 관련된 뜻으로 확장되었습니다.',
    strokePaths: [
      {
        path: 'M 30 30 L 70 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 30 L 30 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 70 30 L 70 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 30 70 L 70 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '月', meaning: '달 월' },
      { character: '明', meaning: '밝을 명' },
      { character: '陽', meaning: '볕 양' }
    ]
  },
  {
    id: 8,
    character: '月',
    meaning: '달 월, 월(月)' ,
    pronunciation: '월',
    strokes: 4,
    examples: ['月曜日(월요일): 월요일', '月光(월광): 달빛', '来月(내월): 다음달', '月刊(월간): 월간지'],
    level: 1,
    story: '달의 모양을 단순화하여 표현한 것입니다. 달은 시간의 흐름을 측정하는 기준이 되어 달(月)과 관련된 시간 개념으로 의미가 확장되었습니다.',
    strokePaths: [
      {
        path: 'M 30 30 L 70 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 30 L 30 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 70 30 L 70 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      },
      {
        path: 'M 30 70 L 70 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1.5s'
      }
    ],
    relatedHanja: [
      { character: '日', meaning: '날 일' },
      { character: '朝', meaning: '아침 조' },
      { character: '暦', meaning: '달력 력' }
    ]
  },
  {
    id: 9,
    character: '土',
    meaning: '흙 토',
    pronunciation: '토',
    strokes: 3,
    examples: ['土曜日(토요일): 토요일', '土地(토지): 토지', '国土(국토): 국토'],
    level: 1,
    story: '땅에서 풀이 자라나는 모습을 표현한 것입니다.',
    strokePaths: [
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 50 L 70 50',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 30 80 L 70 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '地', meaning: '땅 지' },
      { character: '場', meaning: '마당 장' }
    ]
  },
  {
    id: 10,
    character: '大',
    meaning: '큰 대',
    pronunciation: '대',
    strokes: 3,
    examples: ['大学(대학): 대학', '大人(대인): 어른', '大統領(대통령): 대통령', '偉大(위대): 위대함'],
    level: 1,
    story: '양팔을 벌리고 서 있는 사람의 모습을 표현한 것으로, 사람이 팔을 벌리고 있는 모양에서 크다는 의미가 유래했습니다.',
    strokePaths: [
      {
        path: 'M 30 40 L 50 20',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 50 20 L 70 40',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '小', meaning: '작을 소' },
      { character: '太', meaning: '클 태' },
      { character: '巨', meaning: '클 거' }
    ]
  },
  {
    id: 11,
    character: '小',
    meaning: '작을 소',
    pronunciation: '소',
    strokes: 3,
    examples: ['小学校(소학교): 초등학교', '小説(소설): 소설', '大小(대소): 크고 작음', '小時(소시): 어린 시절'],
    level: 1,
    story: '두 개의 점과 그 아래로 내려가는 획으로 작은 것을 표현한 것입니다. 크기가 작은 모습을 형상화했습니다.',
    strokePaths: [
      {
        path: 'M 40 30 L 40 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 60 30 L 60 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '大', meaning: '클 대' },
      { character: '少', meaning: '적을 소' },
      { character: '微', meaning: '미세할 미' }
    ]
  },
  {
    id: 12,
    character: '中',
    meaning: '가운데 중',
    pronunciation: '중',
    strokes: 4,
    examples: ['中国(중국): 중국', '中心(중심): 중심', '集中(집중): 집중', '中間(중간): 중간'],
    level: 1,
    story: '세로획을 중심으로 위아래에 가로획이 있는 모양으로, 중심이나 가운데를 의미합니다. 무언가의 중앙을 관통하는 모습을 형상화했습니다.',
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
        path: 'M 30 70 L 70 70',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '内', meaning: '안 내' },
      { character: '外', meaning: '바깥 외' },
      { character: '央', meaning: '가운데 앙' }
    ]
  },
  // 레벨 1 추가 한자들은 계속 확장해 나갈 수 있습니다 (id: 13-50까지)
];

// ===== 레벨 2: 중급 초반 한자 =====
export const level2HanjaData: Hanja[] = [
  {
    id: 51,
    character: '学',
    meaning: '배울 학',
    pronunciation: '학',
    strokes: 8,
    examples: ['学校(학교): 학교', '学生(학생): 학생', '大学(대학): 대학교'],
    level: 2,
    story: '아이가 집에서 공부하는 모습을 표현한 것입니다.',
    strokePaths: [
      // 간략화된 필순
      {
        path: 'M 30 30 L 70 30',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      },
      {
        path: 'M 30 50 L 70 50',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0.5s'
      },
      {
        path: 'M 50 30 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '教', meaning: '가르칠 교' },
      { character: '習', meaning: '익힐 습' }
    ]
  },
  {
    id: 52,
    character: '生',
    meaning: '날 생',
    pronunciation: '생',
    strokes: 5,
    examples: ['学生(학생): 학생', '先生(선생): 선생님', '生活(생활): 생활'],
    level: 2,
    story: '땅에서 식물이 자라나는 모습을 표현한 것입니다.',
    strokePaths: [
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
        path: 'M 30 50 L 70 50',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '1s'
      }
    ],
    relatedHanja: [
      { character: '死', meaning: '죽을 사' },
      { character: '産', meaning: '낳을 산' }
    ]
  },
  // 레벨 2 추가 한자들... (id: 53-100까지)
];

// ===== 레벨 3: 중급 한자 =====
export const level3HanjaData: Hanja[] = [
  {
    id: 101,
    character: '語',
    meaning: '말씀 어',
    pronunciation: '어',
    strokes: 14,
    examples: ['言語(언어): 언어', '日本語(일본어): 일본어', '韓国語(한국어): 한국어'],
    level: 3,
    story: '말(言)과 오(五)가 결합된 형태로, 다섯 가지 말을 의미합니다.',
    strokePaths: [
      // 간략화된 필순
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
      }
    ],
    relatedHanja: [
      { character: '言', meaning: '말씀 언' },
      { character: '話', meaning: '말할 화' }
    ]
  },
  // 레벨 3 추가 한자들... (id: 102-150까지)
];

// ===== 레벨 4: 중고급 한자 =====
export const level4HanjaData: Hanja[] = [
  {
    id: 151,
    character: '漢',
    meaning: '한나라 한',
    pronunciation: '한',
    strokes: 13,
    examples: ['漢字(한자): 한자', '漢方(한방): 한방', '漢江(한강): 한강'],
    level: 4,
    story: '물(氵)과 한(艮)이 결합된 형태로, 한나라와 관련된 물이라는 의미에서 출발했습니다.',
    strokePaths: [
      // 간략화된 필순
      {
        path: 'M 30 50 L 70 50',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      }
    ],
    relatedHanja: [
      { character: '韓', meaning: '한국 한' },
      { character: '唐', meaning: '당나라 당' }
    ]
  },
  // 레벨 4 추가 한자들... (id: 152-200까지)
];

// ===== 레벨 5: 고급 한자 =====
export const level5HanjaData: Hanja[] = [
  {
    id: 201,
    character: '鬱',
    meaning: '울창할 울',
    pronunciation: '울',
    strokes: 29,
    examples: ['鬱陵島(울릉도): 울릉도', '鬱金香(울금향): 튤립', '憂鬱(우울): 우울함'],
    level: 5,
    story: '숲이 우거진 모습을 표현한 매우 복잡한 한자입니다.',
    strokePaths: [
      // 간략화된 필순
      {
        path: 'M 50 20 L 50 80',
        strokeDasharray: '100',
        strokeDashoffset: '100',
        animationDelay: '0s'
      }
    ],
    relatedHanja: [
      { character: '森', meaning: '수풀 삼' },
      { character: '林', meaning: '수풀 림' }
    ]
  },
  // 레벨 5 추가 한자들... (id: 202-250까지)
];

// 모든 한자 데이터를 합치는 함수
export const getAllHanjaData = (): Hanja[] => {
  return [
    ...level1HanjaData,
    ...level2HanjaData,
    ...level3HanjaData,
    ...level4HanjaData,
    ...level5HanjaData
  ];
};

// 레벨별 한자 데이터를 가져오는 함수
export const getHanjaByLevel = (level: number): Hanja[] => {
  switch (level) {
    case 1:
      return level1HanjaData;
    case 2:
      return level2HanjaData;
    case 3:
      return level3HanjaData;
    case 4:
      return level4HanjaData;
    case 5:
      return level5HanjaData;
    default:
      return [];
  }
};

// 특정 한자 데이터를 ID로 가져오는 함수
export const getHanjaById = (id: number): Hanja | undefined => {
  return getAllHanjaData().find(hanja => hanja.id === id);
};

// 한자 검색 함수 (문자, 발음, 의미로 검색)
export const searchHanja = (query: string): Hanja[] => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = query.trim().toLowerCase();
  
  return getAllHanjaData().filter(hanja => 
    hanja.character.includes(normalizedQuery) || 
    hanja.pronunciation.includes(normalizedQuery) || 
    hanja.meaning.toLowerCase().includes(normalizedQuery)
  );
};

// 연관 한자 찾기 함수
export const getRelatedHanja = (character: string): Hanja[] => {
  const hanja = getAllHanjaData().find(h => h.character === character);
  if (!hanja || !hanja.relatedHanja) return [];
  
  return hanja.relatedHanja.map(related => 
    getAllHanjaData().find(h => h.character === related.character)
  ).filter(Boolean) as Hanja[];
}; 