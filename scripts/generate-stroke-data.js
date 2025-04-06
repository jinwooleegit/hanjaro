/**
 * 한자 스트로크 데이터 생성 스크립트
 * 
 * 이 스크립트는 다음 소스에서 데이터를 가져와 통합된 스트로크 데이터를 생성합니다:
 * 1. data/hanja_database.json - 한자 목록
 * 2. data/hanja_stroke_index.json - 기존 스트로크 데이터
 * 3. data/stroke_data/*.json - 개별 스트로크 데이터 파일
 * 
 * 생성된 데이터는 다음 위치에 저장됩니다:
 * - data/strokes/[character].json - 개별 파일
 * - data/all_strokes.json - 모든 한자의 통합 데이터
 */

const fs = require('fs');
const path = require('path');

// 디렉토리 경로
const DATA_DIR = path.join(process.cwd(), 'data');
const STROKE_DATA_DIR = path.join(DATA_DIR, 'stroke_data');
const OUTPUT_DIR = path.join(DATA_DIR, 'strokes');

// 파일 경로
const HANJA_DB_PATH = path.join(DATA_DIR, 'hanja_database.json');
const STROKE_INDEX_PATH = path.join(DATA_DIR, 'hanja_stroke_index.json');
const OUTPUT_ALL_PATH = path.join(DATA_DIR, 'all_strokes.json');

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`출력 디렉토리 생성: ${OUTPUT_DIR}`);
}

// 한자 기본 패턴 생성 함수
function generateBasicPattern(char) {
  console.log(`기본 패턴 생성: ${char}`);
  
  // 유니코드 코드포인트 확인
  const codePoint = char.codePointAt(0) || 0;
  
  // 한자의 복잡도에 따라 획수 추정 (간단한 알고리즘)
  const isHanja = codePoint >= 0x4E00 && codePoint <= 0x9FFF;
  
  if (!isHanja) {
    // 한자가 아닌 경우 X 표시
    return {
      character: char,
      strokes: ['M 25 25 L 75 75', 'M 75 25 L 25 75'],
      medians: [[[25, 25], [75, 75]], [[75, 25], [25, 75]]],
      isGenerated: true
    };
  }
  
  // 한자의 복잡도에 따라 획수 추정 - 더 세밀한 로직 적용
  // 유니코드 영역에 따른 대략적인 획수 추정 (CJK 영역 특성 활용)
  let estimatedStrokes = 5; // 기본값
  
  // 일반적인 한자 영역별 평균 획수 특성 반영
  if (codePoint < 0x4E00 + 1000) {
    // 기본 한자 (숫자, 간단한 부수 등)
    estimatedStrokes = Math.max(2, Math.min(8, 
      Math.floor((codePoint - 0x4E00) / 1000 * 6) + 2
    ));
  } else if (codePoint < 0x6000) {
    // 중간 복잡도 한자
    estimatedStrokes = Math.max(4, Math.min(12, 
      Math.floor((codePoint - 0x4E00) / 2000 * 8) + 4
    ));
  } else {
    // 복잡한 한자
    estimatedStrokes = Math.max(6, Math.min(20, 
      Math.floor((codePoint - 0x6000) / 3000 * 14) + 6
    ));
  }
  
  // 한자의 구조 추정 (간략화된 방식)
  const structure = estimateHanjaStructure(char, codePoint);
  
  // 추정된 구조에 따라 획 생성
  return generateStrokesBasedOnStructure(char, structure, estimatedStrokes);
}

// 한자 구조 추정 함수
function estimateHanjaStructure(char, codePoint) {
  // 기본 구조 - 단일 구조
  let structure = 'single';
  
  // 형성자(形聲) 구조 추정: 많은 한자가 좌/우 또는 상/하로 분리된 구조
  // 좌우 구조(左右) - 行, 好, 松, 林 등
  // 상하 구조(上下) - 草, 熱, 題 등
  // 내외 구조(內外) - 国, 回, 困 등
  
  // 좌우 구조의 특징을 가진 일부 한자 (완벽한 추정은 어렵지만 대략적인 패턴 제공)
  const leftRightPattern = [
    0x597D, // 好
    0x6797, // 林
    0x677E, // 松
    0x6821, // 校
    0x6C5F, // 江
    0x6E56, // 湖
    0x6D77, // 海
    0x6CE2, // 波
    // 많은 형성자가 이 구조를 가짐
  ];
  
  // 상하 구조의 특징을 가진 일부 한자
  const topBottomPattern = [
    0x8349, // 草
    0x71B1, // 熱
    0x984C, // 題
    0x5BD2, // 寒
    0x5B57, // 子
    0x5B66, // 学
    // 많은 독립형 한자가 이 구조를 가짐
  ];
  
  // 내외 구조(둘러싸는 구조)의 특징을 가진 일부 한자
  const surroundingPattern = [
    0x56FD, // 国
    0x56DE, // 回
    0x56F0, // 困
    0x56E3, // 団
    0x56ED, // 园
    0x56E0, // 因
    0x56DB, // 四
    // 많은 경우 특정 부수가 외부를 둘러싸는 형태
  ];
  
  // 상형자 구조 - 단일 형태지만 의미 중심의 특별한 획 구조
  const pictographicPattern = [
    0x65E5, // 日
    0x6708, // 月
    0x6C34, // 水
    0x5C71, // 山
    0x6728, // 木
    0x706B, // 火
    0x571F, // 土
    0x4EBA, // 人
    // 자연물이나 기본 개념을 표현하는 한자들
  ];
  
  // 각 구조에 해당하는지 점검
  if (leftRightPattern.includes(codePoint)) {
    structure = 'left-right';
  } else if (topBottomPattern.includes(codePoint)) {
    structure = 'top-bottom';
  } else if (surroundingPattern.includes(codePoint)) {
    structure = 'surrounding';
  } else if (pictographicPattern.includes(codePoint)) {
    structure = 'pictographic';
  } else {
    // 그 외의 경우 코드포인트 범위에 따라 대략적 분류
    // 이 부분은 통계적 근사치일 뿐, 정확한 한자 분석은 아님
    if (codePoint >= 0x4E00 && codePoint < 0x5100) {
      structure = Math.random() > 0.6 ? 'pictographic' : 'single';
    } else if (codePoint >= 0x5100 && codePoint < 0x6000) {
      structure = Math.random() > 0.5 ? 'left-right' : 'top-bottom';
    } else if (codePoint >= 0x6000 && codePoint < 0x7000) {
      structure = Math.random() > 0.7 ? 'left-right' : 'surrounding';
    } else {
      structure = Math.random() > 0.5 ? 'left-right' : 'top-bottom';
    }
  }
  
  return structure;
}

// 구조에 따른 획 생성 함수
function generateStrokesBasedOnStructure(char, structure, estimatedStrokes) {
  const strokes = [];
  const medians = [];
  
  // 획순 원칙에 따라 생성:
  // 1. 가로 먼저, 세로 나중
  // 2. 위에서 아래로
  // 3. 왼쪽에서 오른쪽으로
  // 4. 바깥에서 안으로
  // 5. 사선은 왼쪽 먼저, 오른쪽 나중
  
  switch (structure) {
    case 'left-right':
      // 좌우 구조 - 왼쪽 부분 먼저, 오른쪽 부분 나중
      generateLeftSideStrokes(strokes, medians, estimatedStrokes);
      generateRightSideStrokes(strokes, medians, estimatedStrokes);
      break;
      
    case 'top-bottom':
      // 상하 구조 - 위쪽 부분 먼저, 아래쪽 부분 나중
      generateTopSideStrokes(strokes, medians, estimatedStrokes);
      generateBottomSideStrokes(strokes, medians, estimatedStrokes);
      break;
      
    case 'surrounding':
      // 내외 구조 - 바깥 테두리(왼쪽, 위, 오른쪽 일부), 안쪽 내용, 닫는 획
      generateSurroundingStrokes(strokes, medians, estimatedStrokes);
      break;
      
    case 'pictographic':
      // 상형자 구조 - 그림 형태에 맞는 특별한 구조
      generatePictographicStrokes(strokes, medians, estimatedStrokes);
      break;
      
    case 'single':
    default:
      // 단일 구조 - 기본 획들
      generateBasicStrokes(strokes, medians, estimatedStrokes);
      break;
  }
  
  return {
    character: char,
    strokes: strokes,
    medians: medians,
    isGenerated: true,
    structure: structure // 구조 정보 추가 (디버깅용)
  };
}

// 왼쪽 부분 획 생성 (좌우 구조용)
function generateLeftSideStrokes(strokes, medians, totalStrokes) {
  // 왼쪽 영역에 할당할 획 수 (약 40~50%)
  const leftStrokes = Math.max(2, Math.floor(totalStrokes * 0.45));
  
  // 왼쪽 영역 (전체 폭의 약 40%)
  const leftBound = 40;
  
  // 기본 수직 획
  strokes.push(`M 20 25 L 20 75`);
  medians.push([[20, 25], [20, 75]]);
  
  // 가로 획 (필순 원칙 1: 가로 먼저, 세로 나중)
  strokes.push(`M 10 35 L ${leftBound} 35`);
  medians.push([[10, 35], [leftBound, 35]]);
  
  // 추가 획 (남은 획수에 따라)
  if (leftStrokes > 2) {
    strokes.push(`M 10 55 L ${leftBound} 55`);
    medians.push([[10, 55], [leftBound, 55]]);
  }
  
  if (leftStrokes > 3) {
    strokes.push(`M 10 75 L ${leftBound} 75`);
    medians.push([[10, 75], [leftBound, 75]]);
  }
  
  if (leftStrokes > 4) {
    // 보조 수직선
    strokes.push(`M 35 25 L 35 75`);
    medians.push([[35, 25], [35, 75]]);
  }
}

// 오른쪽 부분 획 생성 (좌우 구조용)
function generateRightSideStrokes(strokes, medians, totalStrokes) {
  // 오른쪽 영역에 할당할 획 수 (약 50~60%)
  const rightStrokes = Math.max(3, Math.floor(totalStrokes * 0.55));
  
  // 오른쪽 영역 시작점 (전체 폭의 약 45%부터)
  const rightStart = 45;
  
  // 주요 수직 획
  strokes.push(`M 70 25 L 70 75`);
  medians.push([[70, 25], [70, 75]]);
  
  // 가로 획들 (위에서 아래로)
  strokes.push(`M ${rightStart} 35 L 90 35`);
  medians.push([[rightStart, 35], [90, 35]]);
  
  strokes.push(`M ${rightStart} 55 L 90 55`);
  medians.push([[rightStart, 55], [90, 55]]);
  
  // 추가 획
  if (rightStrokes > 3) {
    strokes.push(`M ${rightStart} 75 L 90 75`);
    medians.push([[rightStart, 75], [90, 75]]);
  }
  
  if (rightStrokes > 4) {
    // 보조 수직선
    strokes.push(`M 55 25 L 55 75`);
    medians.push([[55, 25], [55, 75]]);
  }
  
  if (rightStrokes > 5) {
    // 사선 (필순 원칙 5: 왼쪽 사선 먼저, 오른쪽 사선 나중)
    strokes.push(`M 50 30 L 65 50`);
    medians.push([[50, 30], [65, 50]]);
    
    strokes.push(`M 75 30 L 60 50`);
    medians.push([[75, 30], [60, 50]]);
  }
}

// 위쪽 부분 획 생성 (상하 구조용)
function generateTopSideStrokes(strokes, medians, totalStrokes) {
  // 위쪽 영역에 할당할 획 수 (약 40~50%)
  const topStrokes = Math.max(2, Math.floor(totalStrokes * 0.45));
  
  // 위쪽 영역 (전체 높이의 약 45%까지)
  const topBound = 45;
  
  // 주요 가로 획 (필순 원칙 1: 가로 먼저)
  strokes.push(`M 25 20 L 75 20`);
  medians.push([[25, 20], [75, 20]]);
  
  strokes.push(`M 25 35 L 75 35`);
  medians.push([[25, 35], [75, 35]]);
  
  // 추가 획
  if (topStrokes > 2) {
    // 세로 획 (필순 원칙 1: 가로 다음 세로)
    strokes.push(`M 50 15 L 50 ${topBound}`);
    medians.push([[50, 15], [50, topBound]]);
  }
  
  if (topStrokes > 3) {
    // 보조 세로 획
    strokes.push(`M 35 15 L 35 ${topBound}`);
    medians.push([[35, 15], [35, topBound]]);
    
    strokes.push(`M 65 15 L 65 ${topBound}`);
    medians.push([[65, 15], [65, topBound]]);
  }
}

// 아래쪽 부분 획 생성 (상하 구조용)
function generateBottomSideStrokes(strokes, medians, totalStrokes) {
  // 아래쪽 영역에 할당할 획 수 (약 50~60%)
  const bottomStrokes = Math.max(3, Math.floor(totalStrokes * 0.55));
  
  // 아래쪽 영역 시작점 (전체 높이의 약 50%부터)
  const bottomStart = 50;
  
  // 주요 가로 획 (위에서 아래로)
  strokes.push(`M 25 60 L 75 60`);
  medians.push([[25, 60], [75, 60]]);
  
  strokes.push(`M 25 80 L 75 80`);
  medians.push([[25, 80], [75, 80]]);
  
  // 세로 획
  if (bottomStrokes > 2) {
    strokes.push(`M 50 ${bottomStart} L 50 85`);
    medians.push([[50, bottomStart], [50, 85]]);
  }
  
  if (bottomStrokes > 3) {
    // 보조 세로 획
    strokes.push(`M 35 ${bottomStart} L 35 85`);
    medians.push([[35, bottomStart], [35, 85]]);
    
    strokes.push(`M 65 ${bottomStart} L 65 85`);
    medians.push([[65, bottomStart], [65, 85]]);
  }
  
  if (bottomStrokes > 5) {
    // 사선
    strokes.push(`M 40 55 L 60 75`);
    medians.push([[40, 55], [60, 75]]);
    
    strokes.push(`M 60 55 L 40 75`);
    medians.push([[60, 55], [40, 75]]);
  }
}

// 내외 구조용 획 생성 (둘러싸는 구조)
function generateSurroundingStrokes(strokes, medians, totalStrokes) {
  // 내외 구조는 필순 원칙 4: 바깥에서 안으로, 둘러싸는 획은 나중에 닫음
  
  // 바깥 테두리 - 왼쪽 세로선
  strokes.push(`M 25 25 L 25 75`);
  medians.push([[25, 25], [25, 75]]);
  
  // 바깥 테두리 - 위쪽 가로선
  strokes.push(`M 25 25 L 75 25`);
  medians.push([[25, 25], [75, 25]]);
  
  // 바깥 테두리 - 아래쪽 가로선
  strokes.push(`M 25 75 L 75 75`);
  medians.push([[25, 75], [75, 75]]);
  
  // 안쪽 내용 (약 60%의 획을 내부에 배정)
  const innerStrokes = Math.max(1, Math.floor(totalStrokes * 0.6) - 3);
  
  // 안쪽 내용 추가
  for (let i = 0; i < innerStrokes; i++) {
    if (i % 3 === 0) {
      // 가로 획
      const y = 35 + (i / 3) * 15;
      strokes.push(`M 35 ${y} L 65 ${y}`);
      medians.push([[35, y], [65, y]]);
    } else if (i % 3 === 1) {
      // 세로 획
      const x = 40 + ((i - 1) / 3) * 15;
      strokes.push(`M ${x} 35 L ${x} 65`);
      medians.push([[x, 35], [x, 65]]);
    } else {
      // 점이나 짧은 획
      const x = 45 + ((i - 2) / 3) * 10;
      const y = 45 + ((i - 2) / 3) * 10;
      strokes.push(`M ${x} ${y} L ${x + 5} ${y + 5}`);
      medians.push([[x, y], [x + 5, y + 5]]);
    }
  }
  
  // 바깥 테두리 - 오른쪽 세로선 (마지막에 닫음)
  strokes.push(`M 75 25 L 75 75`);
  medians.push([[75, 25], [75, 75]]);
}

// 상형자 구조용 획 생성
function generatePictographicStrokes(strokes, medians, totalStrokes) {
  // 상형자는 사물의 형태를 본떴으므로, 좀 더 특징적인 획 패턴 필요
  
  if (totalStrokes <= 4) {
    // 단순한 상형자 (日, 月, 山 등의 기본 패턴)
    // 요소의 특징에 맞게 더 균형 있는 구조 생성
    
    // 기본 사각형 (필순 원칙 1,2,3 따름)
    strokes.push('M 25 25 L 75 25'); // 위 가로선
    medians.push([[25, 25], [75, 25]]);
    
    strokes.push('M 25 25 L 25 75'); // 왼쪽 세로선
    medians.push([[25, 25], [25, 75]]);
    
    strokes.push('M 75 25 L 75 75'); // 오른쪽 세로선
    medians.push([[75, 25], [75, 75]]);
    
    strokes.push('M 25 75 L 75 75'); // 아래 가로선
    medians.push([[25, 75], [75, 75]]);
    
    if (totalStrokes > 4) {
      // 추가 특성 (중앙선 등)
      strokes.push('M 25 50 L 75 50'); // 중앙 가로선
      medians.push([[25, 50], [75, 50]]);
    }
  } else {
    // 복잡한 상형자 (인체, 동물, 자연물 등)
    // 좀 더 유기적인 곡선과 특징적 형태 제공
    
    // 기본 윤곽선
    strokes.push('M 35 20 L 65 20'); // 상단 가로
    medians.push([[35, 20], [65, 20]]);
    
    strokes.push('M 50 20 L 50 40'); // 중앙 기둥
    medians.push([[50, 20], [50, 40]]);
    
    strokes.push('M 30 40 L 70 40'); // 중앙 가로
    medians.push([[30, 40], [70, 40]]);
    
    // 하단 구조
    strokes.push('M 35 40 L 35 75'); // 왼쪽 기둥
    medians.push([[35, 40], [35, 75]]);
    
    strokes.push('M 65 40 L 65 75'); // 오른쪽 기둥
    medians.push([[65, 40], [65, 75]]);
    
    if (totalStrokes > 5) {
      // 추가 세부 요소
      strokes.push('M 35 60 L 65 60'); // 하단 가로
      medians.push([[35, 60], [65, 60]]);
    }
    
    if (totalStrokes > 6) {
      // 특징적 사선 (필순 원칙 5)
      strokes.push('M 35 40 L 50 75'); // 왼쪽 사선
      medians.push([[35, 40], [50, 75]]);
      
      strokes.push('M 65 40 L 50 75'); // 오른쪽 사선
      medians.push([[65, 40], [50, 75]]);
    }
  }
}

// 단일 구조 기본 획 생성
function generateBasicStrokes(strokes, medians, totalStrokes) {
  // 기본 구조 (단일 문자, 균형 있는 배치)
  // 필순 원칙에 따라 가로→세로→사선 순서로 배치
  
  // 기본 가로 획 (상단, 중앙, 하단)
  strokes.push('M 25 25 L 75 25'); // 상단 가로선
  medians.push([[25, 25], [75, 25]]);
  
  if (totalStrokes > 3) {
    strokes.push('M 25 50 L 75 50'); // 중앙 가로선
    medians.push([[25, 50], [75, 50]]);
  }
  
  strokes.push('M 25 75 L 75 75'); // 하단 가로선
  medians.push([[25, 75], [75, 75]]);
  
  // 기본 세로 획
  strokes.push('M 25 25 L 25 75'); // 왼쪽 세로선
  medians.push([[25, 25], [25, 75]]);
  
  if (totalStrokes > 4) {
    strokes.push('M 50 25 L 50 75'); // 중앙 세로선
    medians.push([[50, 25], [50, 75]]);
  }
  
  strokes.push('M 75 25 L 75 75'); // 오른쪽 세로선
  medians.push([[75, 25], [75, 75]]);
  
  // 추가 복잡도에 따른 사선 (필순 원칙 5)
  if (totalStrokes > 6) {
    strokes.push('M 25 25 L 50 50'); // 좌상→중앙
    medians.push([[25, 25], [50, 50]]);
    
    strokes.push('M 75 25 L 50 50'); // 우상→중앙
    medians.push([[75, 25], [50, 50]]);
  }
  
  if (totalStrokes > 8) {
    strokes.push('M 25 75 L 50 50'); // 좌하→중앙
    medians.push([[25, 75], [50, 50]]);
    
    strokes.push('M 75 75 L 50 50'); // 우하→중앙
    medians.push([[75, 75], [50, 50]]);
  }
}

// 특별 한자 스트로크 데이터 정의 (기본 한자)
const SPECIAL_HANJA = {
  // 기본 한자
  '一': { character: '一', strokes: ['M 5 50 L 95 50'], medians: [[[5, 50], [95, 50]]] },
  '二': { 
    character: '二', 
    strokes: ['M 5 33 L 95 33', 'M 5 66 L 95 66'], 
    medians: [[[5, 33], [95, 33]], [[5, 66], [95, 66]]] 
  },
  '三': { 
    character: '三', 
    strokes: ['M 5 25 L 95 25', 'M 5 50 L 95 50', 'M 5 75 L 95 75'], 
    medians: [[[5, 25], [95, 25]], [[5, 50], [95, 50]], [[5, 75], [95, 75]]] 
  },
  '人': {
    character: '人',
    strokes: ['M 40 15 L 5 75', 'M 40 15 L 95 75'],
    medians: [[[40, 15], [5, 75]], [[40, 15], [95, 75]]]
  },
  '火': {
    character: '火',
    strokes: [
      'M 40 50 C 50 40 70 40 80 50',
      'M 60 40 Q 59 60 60 80',
      'M 60 60 C 45 70 35 85 30 95',
      'M 60 60 C 75 70 85 85 90 95'
    ],
    medians: [
      [[40, 50], [50, 40], [70, 40], [80, 50]],
      [[60, 40], [59, 60], [60, 80]],
      [[60, 60], [45, 70], [35, 85], [30, 95]],
      [[60, 60], [75, 70], [85, 85], [90, 95]]
    ]
  }
  // 필요하면 더 추가할 수 있음
};

// 데이터 로드 및 처리
console.log('한자 데이터베이스 로드 중...');
let hanjaDb;
try {
  const hanjaDbContent = fs.readFileSync(HANJA_DB_PATH, 'utf8');
  hanjaDb = JSON.parse(hanjaDbContent);
  console.log(`한자 데이터베이스 로드 완료. 총 ${hanjaDb.total_characters}개 한자`);
} catch (error) {
  console.error(`한자 데이터베이스 로드 오류: ${error.message}`);
  process.exit(1);
}

// 기존 스트로크 인덱스 로드
console.log('기존 스트로크 인덱스 로드 중...');
let strokeIndex = {};
try {
  if (fs.existsSync(STROKE_INDEX_PATH)) {
    const strokeIndexContent = fs.readFileSync(STROKE_INDEX_PATH, 'utf8');
    strokeIndex = JSON.parse(strokeIndexContent);
    console.log(`스트로크 인덱스 로드 완료. ${Object.keys(strokeIndex).length}개 한자 데이터`);
  } else {
    console.log('스트로크 인덱스 파일이 없습니다. 새로 생성합니다.');
  }
} catch (error) {
  console.error(`스트로크 인덱스 로드 오류: ${error.message}`);
  console.log('새로운 스트로크 인덱스를 생성합니다.');
}

// 개별 스트로크 데이터 파일 로드
console.log('개별 스트로크 데이터 파일 로드 중...');
const strokeData = {};
if (fs.existsSync(STROKE_DATA_DIR)) {
  try {
    const files = fs.readdirSync(STROKE_DATA_DIR);
    console.log(`개별 스트로크 파일 ${files.length}개 발견`);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const char = file.replace('.json', '');
          const content = fs.readFileSync(path.join(STROKE_DATA_DIR, file), 'utf8');
          const data = JSON.parse(content);
          strokeData[char] = data;
        } catch (err) {
          console.warn(`파일 ${file} 처리 중 오류: ${err.message}`);
        }
      }
    }
    console.log(`개별 스트로크 데이터 ${Object.keys(strokeData).length}개 로드 완료`);
  } catch (error) {
    console.error(`개별 스트로크 데이터 로드 오류: ${error.message}`);
  }
} else {
  console.log('개별 스트로크 데이터 디렉토리가 없습니다.');
}

// 모든 한자 추출
const allCharacters = new Set();

// 데이터베이스에서 한자 추출
function extractHanjaFromDatabase(db) {
  console.log('데이터베이스 구조 확인:', Object.keys(db));
  
  // Level 1 characters
  if (db.levels && db.levels.level1 && Array.isArray(db.levels.level1.characters)) {
    console.log(`level1 한자 수: ${db.levels.level1.characters.length}`);
    db.levels.level1.characters.forEach(char => {
      if (char && char.character) {
        allCharacters.add(char.character);
      }
    });
  }
  
  // Level 2 characters
  if (db.levels && db.levels.level2 && Array.isArray(db.levels.level2.characters)) {
    console.log(`level2 한자 수: ${db.levels.level2.characters.length}`);
    db.levels.level2.characters.forEach(char => {
      if (char && char.character) {
        allCharacters.add(char.character);
      }
    });
  }
  
  // Level 3 characters
  if (db.levels && db.levels.level3 && Array.isArray(db.levels.level3.characters)) {
    console.log(`level3 한자 수: ${db.levels.level3.characters.length}`);
    db.levels.level3.characters.forEach(char => {
      if (char && char.character) {
        allCharacters.add(char.character);
      }
    });
  }
  
  // 다른 형식의 데이터베이스인 경우 (basic 구조)
  if (db.basic && db.basic.levels && Array.isArray(db.basic.levels)) {
    db.basic.levels.forEach(level => {
      if (level.characters && Array.isArray(level.characters)) {
        console.log(`basic ${level.name} 한자 수: ${level.characters.length}`);
        level.characters.forEach(char => {
          if (char && char.character) {
            allCharacters.add(char.character);
          }
        });
      }
    });
  }
  
  // characters 직접 배열인 경우
  if (Array.isArray(db.characters)) {
    console.log(`characters 배열 한자 수: ${db.characters.length}`);
    db.characters.forEach(char => {
      if (char && char.character) {
        allCharacters.add(char.character);
      } else if (typeof char === 'string') {
        allCharacters.add(char);
      }
    });
  }
  
  // hanja 직접 배열인 경우
  if (Array.isArray(db.hanja)) {
    console.log(`hanja 배열 한자 수: ${db.hanja.length}`);
    db.hanja.forEach(char => {
      if (char && char.character) {
        allCharacters.add(char.character);
      } else if (typeof char === 'string') {
        allCharacters.add(char);
      }
    });
  }
}

// 데이터베이스 형식에 따라 한자 추출
if (hanjaDb.hanja_database) {
  console.log('hanja_database 구조를 사용합니다.');
  extractHanjaFromDatabase(hanjaDb.hanja_database);
} else {
  console.log('최상위 구조를 사용합니다.');
  extractHanjaFromDatabase(hanjaDb);
}

// 데이터 직접 추출 (마지막 수단)
if (allCharacters.size === 0) {
  console.log('기존 방법으로 한자를 추출할 수 없어 문자열 검색을 시도합니다.');
  const dbString = JSON.stringify(hanjaDb);
  const hanjaMatches = dbString.match(/["']character["']\s*:\s*["'](.)['"]/g);
  if (hanjaMatches) {
    hanjaMatches.forEach(match => {
      const char = match.match(/["']character["']\s*:\s*["'](.)['"]/).pop();
      if (char) allCharacters.add(char);
    });
  }
  
  // 한자 검색 패턴 (유니코드 범위 기반)
  const chineseCharRegex = /[\u4E00-\u9FFF]/g;
  const chineseChars = dbString.match(chineseCharRegex);
  if (chineseChars) {
    chineseChars.forEach(char => allCharacters.add(char));
  }
}

console.log(`총 ${allCharacters.size}개 한자 추출 완료`);

// 한자가 없으면 기본 한자 추가
if (allCharacters.size === 0) {
  console.log('추출된 한자가 없어 기본 한자를 추가합니다.');
  Object.keys(SPECIAL_HANJA).forEach(char => allCharacters.add(char));
  // 몇 가지 대표 한자 추가
  ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
   '日', '月', '水', '火', '木', '金', '土', '人', '山', '川'].forEach(char => allCharacters.add(char));
}

// 통합 데이터 생성
const combinedData = {};
let generatedCount = 0;
let existingCount = 0;

for (const char of allCharacters) {
  // 데이터 소스 우선순위:
  // 1. 특별 정의된 한자
  // 2. 개별 스트로크 데이터 파일
  // 3. 스트로크 인덱스 파일
  // 4. 새로 생성하는 패턴
  
  let charData;
  
  if (SPECIAL_HANJA[char]) {
    charData = SPECIAL_HANJA[char];
    console.log(`특별 정의 사용: ${char}`);
  } else if (strokeData[char]) {
    charData = strokeData[char];
    console.log(`개별 스트로크 데이터 사용: ${char}`);
    existingCount++;
  } else if (strokeIndex[char]) {
    charData = strokeIndex[char];
    console.log(`스트로크 인덱스 데이터 사용: ${char}`);
    existingCount++;
  } else {
    charData = generateBasicPattern(char);
    generatedCount++;
  }
  
  // 데이터 정합성 확인
  if (charData.character !== char) {
    console.warn(`문자 불일치 수정: ${charData.character} -> ${char}`);
    charData.character = char;
  }
  
  // 통합 데이터에 추가
  combinedData[char] = charData;
  
  // 개별 파일로 저장
  const outputPath = path.join(OUTPUT_DIR, `${char}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(charData, null, 2), 'utf8');
}

// 통합 데이터 파일 저장
fs.writeFileSync(OUTPUT_ALL_PATH, JSON.stringify(combinedData, null, 2), 'utf8');

// 결과 요약
console.log('\n=== 스트로크 데이터 생성 완료 ===');
console.log(`총 한자 수: ${allCharacters.size}`);
console.log(`기존 데이터 사용: ${existingCount}개`);
console.log(`새로 생성된 데이터: ${generatedCount}개`);
console.log(`개별 파일 저장 디렉토리: ${OUTPUT_DIR}`);
console.log(`통합 데이터 파일: ${OUTPUT_ALL_PATH}`);
console.log('===========================\n');

console.log('스크립트 실행 완료!'); 