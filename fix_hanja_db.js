const fs = require('fs');
const path = require('path');

// 기존 백업 파일이 있으면 그걸 사용하고, 아니면 새로 생성
const originalFilePath = path.join(__dirname, 'data', 'hanja_database_fixed.json');
const backupFilePath = path.join(__dirname, 'data', 'hanja_database_backup.json');
const newFilePath = path.join(__dirname, 'data', 'hanja_database_new.json');

// 새로운 한자 데이터 (51-100번)
const newCharactersData = [
  {
    "character": "功",
    "meaning": "공 공",
    "pronunciation": "공",
    "stroke_count": 5,
    "radical": "力",
    "examples": [
      { "word": "成功", "meaning": "성공", "pronunciation": "성공" },
      { "word": "功績", "meaning": "공적", "pronunciation": "공적" }
    ],
    "level": 7,
    "order": 51
  },
  {
    "character": "績",
    "meaning": "길쌈할 적",
    "pronunciation": "적",
    "stroke_count": 17,
    "radical": "糸",
    "examples": [
      { "word": "功績", "meaning": "공적", "pronunciation": "공적" },
      { "word": "成績", "meaning": "성적", "pronunciation": "성적" }
    ],
    "level": 7,
    "order": 52
  },
  {
    "character": "結",
    "meaning": "맺을 결",
    "pronunciation": "결",
    "stroke_count": 12,
    "radical": "糸",
    "examples": [
      { "word": "結果", "meaning": "결과", "pronunciation": "결과" },
      { "word": "結論", "meaning": "결론", "pronunciation": "결론" }
    ],
    "level": 7,
    "order": 53
  },
  {
    "character": "果",
    "meaning": "과실 과",
    "pronunciation": "과",
    "stroke_count": 8,
    "radical": "木",
    "examples": [
      { "word": "結果", "meaning": "결과", "pronunciation": "결과" },
      { "word": "成果", "meaning": "성과", "pronunciation": "성과" }
    ],
    "level": 7,
    "order": 54
  },
  {
    "character": "修",
    "meaning": "닦을 수",
    "pronunciation": "수",
    "stroke_count": 10,
    "radical": "亻",
    "examples": [
      { "word": "修學", "meaning": "수학", "pronunciation": "수학" },
      { "word": "修理", "meaning": "수리", "pronunciation": "수리" }
    ],
    "level": 7,
    "order": 55
  },
  {
    "character": "提",
    "meaning": "끌 제",
    "pronunciation": "제",
    "stroke_count": 12,
    "radical": "扌",
    "examples": [
      { "word": "提案", "meaning": "제안", "pronunciation": "제안" },
      { "word": "提出", "meaning": "제출", "pronunciation": "제출" }
    ],
    "level": 7,
    "order": 56
  },
  {
    "character": "案",
    "meaning": "책상 안",
    "pronunciation": "안",
    "stroke_count": 10,
    "radical": "木",
    "examples": [
      { "word": "提案", "meaning": "제안", "pronunciation": "제안" },
      { "word": "計案", "meaning": "계안", "pronunciation": "계안" }
    ],
    "level": 7,
    "order": 57
  },
  {
    "character": "出",
    "meaning": "날 출",
    "pronunciation": "출",
    "stroke_count": 5,
    "radical": "凵",
    "examples": [
      { "word": "提出", "meaning": "제출", "pronunciation": "제출" },
      { "word": "出席", "meaning": "출석", "pronunciation": "출석" }
    ],
    "level": 7,
    "order": 58
  },
  {
    "character": "席",
    "meaning": "자리 석",
    "pronunciation": "석",
    "stroke_count": 10,
    "radical": "巾",
    "examples": [
      { "word": "出席", "meaning": "출석", "pronunciation": "출석" },
      { "word": "席次", "meaning": "석차", "pronunciation": "석차" }
    ],
    "level": 7,
    "order": 59
  },
  {
    "character": "次",
    "meaning": "버금 차",
    "pronunciation": "차",
    "stroke_count": 6,
    "radical": "欠",
    "examples": [
      { "word": "次例", "meaning": "차례", "pronunciation": "차례" },
      { "word": "次席", "meaning": "차석", "pronunciation": "차석" }
    ],
    "level": 7,
    "order": 60
  },
  {
    "character": "例",
    "meaning": "법식 례",
    "pronunciation": "례",
    "stroke_count": 8,
    "radical": "亻",
    "examples": [
      { "word": "例文", "meaning": "예문", "pronunciation": "예문" },
      { "word": "慣例", "meaning": "관례", "pronunciation": "관례" }
    ],
    "level": 7,
    "order": 61
  },
  {
    "character": "慣",
    "meaning": "익힐 관",
    "pronunciation": "관",
    "stroke_count": 15,
    "radical": "忄",
    "examples": [
      { "word": "慣例", "meaning": "관례", "pronunciation": "관례" },
      { "word": "習慣", "meaning": "습관", "pronunciation": "습관" }
    ],
    "level": 7,
    "order": 62
  },
  {
    "character": "疑",
    "meaning": "의심할 의",
    "pronunciation": "의",
    "stroke_count": 14,
    "radical": "疋",
    "examples": [
      { "word": "疑問", "meaning": "의문", "pronunciation": "의문" },
      { "word": "懷疑", "meaning": "회의", "pronunciation": "회의" }
    ],
    "level": 7,
    "order": 63
  },
  {
    "character": "讀",
    "meaning": "읽을 독",
    "pronunciation": "독",
    "stroke_count": 16,
    "radical": "言",
    "examples": [
      { "word": "讀解", "meaning": "독해", "pronunciation": "독해" },
      { "word": "朗讀", "meaning": "낭독", "pronunciation": "낭독" }
    ],
    "level": 7,
    "order": 64
  },
  {
    "character": "解",
    "meaning": "풀 해",
    "pronunciation": "해",
    "stroke_count": 13,
    "radical": "角",
    "examples": [
      { "word": "讀解", "meaning": "독해", "pronunciation": "독해" },
      { "word": "解決", "meaning": "해결", "pronunciation": "해결" }
    ],
    "level": 7,
    "order": 65
  },
  {
    "character": "決",
    "meaning": "결단할 결",
    "pronunciation": "결",
    "stroke_count": 7,
    "radical": "氵",
    "examples": [
      { "word": "解決", "meaning": "해결", "pronunciation": "해결" },
      { "word": "決心", "meaning": "결심", "pronunciation": "결심" }
    ],
    "level": 7,
    "order": 66
  },
  {
    "character": "朗",
    "meaning": "밝을 낭",
    "pronunciation": "낭",
    "stroke_count": 10,
    "radical": "月",
    "examples": [
      { "word": "朗讀", "meaning": "낭독", "pronunciation": "낭독" },
      { "word": "明朗", "meaning": "명랑", "pronunciation": "명랑" }
    ],
    "level": 7,
    "order": 67
  },
  {
    "character": "語",
    "meaning": "말씀 어",
    "pronunciation": "어",
    "stroke_count": 14,
    "radical": "言",
    "examples": [
      { "word": "言語", "meaning": "언어", "pronunciation": "언어" },
      { "word": "語彙", "meaning": "어휘", "pronunciation": "어휘" }
    ],
    "level": 7,
    "order": 68
  },
  {
    "character": "彙",
    "meaning": "모을 휘",
    "pronunciation": "휘",
    "stroke_count": 15,
    "radical": "彑",
    "examples": [
      { "word": "語彙", "meaning": "어휘", "pronunciation": "어휘" },
      { "word": "彙集", "meaning": "휘집", "pronunciation": "휘집" }
    ],
    "level": 7,
    "order": 69
  },
  {
    "character": "集",
    "meaning": "모을 집",
    "pronunciation": "집",
    "stroke_count": 12,
    "radical": "隹",
    "examples": [
      { "word": "集合", "meaning": "집합", "pronunciation": "집합" },
      { "word": "收集", "meaning": "수집", "pronunciation": "수집" }
    ],
    "level": 7,
    "order": 70
  },
  {
    "character": "合",
    "meaning": "합할 합",
    "pronunciation": "합",
    "stroke_count": 6,
    "radical": "口",
    "examples": [
      { "word": "集合", "meaning": "집합", "pronunciation": "집합" },
      { "word": "合意", "meaning": "합의", "pronunciation": "합의" }
    ],
    "level": 7,
    "order": 71
  },
  {
    "character": "收",
    "meaning": "거둘 수",
    "pronunciation": "수",
    "stroke_count": 6,
    "radical": "攴",
    "examples": [
      { "word": "收集", "meaning": "수집", "pronunciation": "수집" },
      { "word": "收入", "meaning": "수입", "pronunciation": "수입" }
    ],
    "level": 7,
    "order": 72
  },
  {
    "character": "入",
    "meaning": "들 입",
    "pronunciation": "입",
    "stroke_count": 2,
    "radical": "入",
    "examples": [
      { "word": "收入", "meaning": "수입", "pronunciation": "수입" },
      { "word": "入學", "meaning": "입학", "pronunciation": "입학" }
    ],
    "level": 7,
    "order": 73
  },
  {
    "character": "反",
    "meaning": "돌이킬 반",
    "pronunciation": "반",
    "stroke_count": 4,
    "radical": "又",
    "examples": [
      { "word": "反省", "meaning": "반성", "pronunciation": "반성" },
      { "word": "反對", "meaning": "반대", "pronunciation": "반대" }
    ],
    "level": 7,
    "order": 74
  },
  {
    "character": "省",
    "meaning": "살필 성",
    "pronunciation": "성",
    "stroke_count": 9,
    "radical": "目",
    "examples": [
      { "word": "反省", "meaning": "반성", "pronunciation": "반성" },
      { "word": "省略", "meaning": "생략", "pronunciation": "생략" }
    ],
    "level": 7,
    "order": 75
  },
  {
    "character": "對",
    "meaning": "대할 대",
    "pronunciation": "대",
    "stroke_count": 14,
    "radical": "寸",
    "examples": [
      { "word": "反對", "meaning": "반대", "pronunciation": "반대" },
      { "word": "對應", "meaning": "대응", "pronunciation": "대응" }
    ],
    "level": 7,
    "order": 76
  },
  {
    "character": "略",
    "meaning": "약할 략",
    "pronunciation": "략",
    "stroke_count": 11,
    "radical": "田",
    "examples": [
      { "word": "省略", "meaning": "생략", "pronunciation": "생략" },
      { "word": "略字", "meaning": "략자", "pronunciation": "략자" }
    ],
    "level": 7,
    "order": 77
  },
  {
    "character": "應",
    "meaning": "응할 응",
    "pronunciation": "응",
    "stroke_count": 17,
    "radical": "心",
    "examples": [
      { "word": "對應", "meaning": "대응", "pronunciation": "대응" },
      { "word": "應答", "meaning": "응답", "pronunciation": "응답" }
    ],
    "level": 7,
    "order": 78
  },
  {
    "character": "選",
    "meaning": "가릴 선",
    "pronunciation": "선",
    "stroke_count": 16,
    "radical": "辵",
    "examples": [
      { "word": "選擇", "meaning": "선택", "pronunciation": "선택" },
      { "word": "選手", "meaning": "선수", "pronunciation": "선수" }
    ],
    "level": 7,
    "order": 79
  },
  {
    "character": "擇",
    "meaning": "가릴 택",
    "pronunciation": "택",
    "stroke_count": 17,
    "radical": "扌",
    "examples": [
      { "word": "選擇", "meaning": "선택", "pronunciation": "선택" },
      { "word": "擇一", "meaning": "택일", "pronunciation": "택일" }
    ],
    "level": 7,
    "order": 80
  },
  {
    "character": "手",
    "meaning": "손 수",
    "pronunciation": "수",
    "stroke_count": 4,
    "radical": "手",
    "examples": [
      { "word": "選手", "meaning": "선수", "pronunciation": "선수" },
      { "word": "手足", "meaning": "수족", "pronunciation": "수족" }
    ],
    "level": 7,
    "order": 81
  },
  {
    "character": "章",
    "meaning": "장 장",
    "pronunciation": "장",
    "stroke_count": 11,
    "radical": "立",
    "examples": [
      { "word": "章節", "meaning": "장절", "pronunciation": "장절" },
      { "word": "文章", "meaning": "문장", "pronunciation": "문장" }
    ],
    "level": 7,
    "order": 82
  },
  {
    "character": "節",
    "meaning": "마디 절",
    "pronunciation": "절",
    "stroke_count": 13,
    "radical": "竹",
    "examples": [
      { "word": "章節", "meaning": "장절", "pronunciation": "장절" },
      { "word": "節約", "meaning": "절약", "pronunciation": "절약" }
    ],
    "level": 7,
    "order": 83
  },
  {
    "character": "約",
    "meaning": "약속할 약",
    "pronunciation": "약",
    "stroke_count": 9,
    "radical": "糸",
    "examples": [
      { "word": "節約", "meaning": "절약", "pronunciation": "절약" },
      { "word": "約束", "meaning": "약속", "pronunciation": "약속" }
    ],
    "level": 7,
    "order": 84
  },
  {
    "character": "束",
    "meaning": "묶을 속",
    "pronunciation": "속",
    "stroke_count": 7,
    "radical": "木",
    "examples": [
      { "word": "約束", "meaning": "약속", "pronunciation": "약속" },
      { "word": "束縛", "meaning": "속박", "pronunciation": "속박" }
    ],
    "level": 7,
    "order": 85
  },
  {
    "character": "縛",
    "meaning": "묶을 박",
    "pronunciation": "박",
    "stroke_count": 17,
    "radical": "糸",
    "examples": [
      { "word": "束縛", "meaning": "속박", "pronunciation": "속박" },
      { "word": "縛刑", "meaning": "박형", "pronunciation": "박형" }
    ],
    "level": 7,
    "order": 86
  },
  {
    "character": "比",
    "meaning": "견줄 비",
    "pronunciation": "비",
    "stroke_count": 4,
    "radical": "比",
    "examples": [
      { "word": "比較", "meaning": "비교", "pronunciation": "비교" },
      { "word": "對比", "meaning": "대비", "pronunciation": "대비" }
    ],
    "level": 7,
    "order": 87
  },
  {
    "character": "較",
    "meaning": "견줄 교",
    "pronunciation": "교",
    "stroke_count": 13,
    "radical": "車",
    "examples": [
      { "word": "比較", "meaning": "비교", "pronunciation": "비교" },
      { "word": "較差", "meaning": "교차", "pronunciation": "교차" }
    ],
    "level": 7,
    "order": 88
  },
  {
    "character": "計",
    "meaning": "셈할 계",
    "pronunciation": "계",
    "stroke_count": 9,
    "radical": "言",
    "examples": [
      { "word": "計算", "meaning": "계산", "pronunciation": "계산" },
      { "word": "計劃", "meaning": "계획", "pronunciation": "계획" }
    ],
    "level": 7,
    "order": 89
  },
  {
    "character": "算",
    "meaning": "셈할 산",
    "pronunciation": "산",
    "stroke_count": 14,
    "radical": "竹",
    "examples": [
      { "word": "計算", "meaning": "계산", "pronunciation": "계산" },
      { "word": "算數", "meaning": "산수", "pronunciation": "산수" }
    ],
    "level": 7,
    "order": 90
  },
  {
    "character": "劃",
    "meaning": "그을 획",
    "pronunciation": "획",
    "stroke_count": 14,
    "radical": "刂",
    "examples": [
      { "word": "計劃", "meaning": "계획", "pronunciation": "계획" },
      { "word": "劃線", "meaning": "획선", "pronunciation": "획선" }
    ],
    "level": 7,
    "order": 91
  },
  {
    "character": "數",
    "meaning": "셀 수",
    "pronunciation": "수",
    "stroke_count": 15,
    "radical": "攴",
    "examples": [
      { "word": "算數", "meaning": "산수", "pronunciation": "산수" },
      { "word": "數學", "meaning": "수학", "pronunciation": "수학" }
    ],
    "level": 7,
    "order": 92
  },
  {
    "character": "測",
    "meaning": "잴 측",
    "pronunciation": "측",
    "stroke_count": 12,
    "radical": "氵",
    "examples": [
      { "word": "測定", "meaning": "측정", "pronunciation": "측정" },
      { "word": "推測", "meaning": "추측", "pronunciation": "추측" }
    ],
    "level": 7,
    "order": 93
  },
  {
    "character": "定",
    "meaning": "정할 정",
    "pronunciation": "정",
    "stroke_count": 8,
    "radical": "宀",
    "examples": [
      { "word": "測定", "meaning": "측정", "pronunciation": "측정" },
      { "word": "決定", "meaning": "결정", "pronunciation": "결정" }
    ],
    "level": 7,
    "order": 94
  },
  {
    "character": "推",
    "meaning": "밀 추",
    "pronunciation": "추",
    "stroke_count": 11,
    "radical": "扌",
    "examples": [
      { "word": "推測", "meaning": "추측", "pronunciation": "추측" },
      { "word": "推理", "meaning": "추리", "pronunciation": "추리" }
    ],
    "level": 7,
    "order": 95
  },
  {
    "character": "問",
    "meaning": "물을 문",
    "pronunciation": "문",
    "stroke_count": 11,
    "radical": "口",
    "examples": [
      { "word": "疑問", "meaning": "의문", "pronunciation": "의문" },
      { "word": "問答", "meaning": "문답", "pronunciation": "문답" }
    ],
    "level": 7,
    "order": 96
  },
  {
    "character": "答",
    "meaning": "대답할 답",
    "pronunciation": "답",
    "stroke_count": 12,
    "radical": "竹",
    "examples": [
      { "word": "問答", "meaning": "문답", "pronunciation": "문답" },
      { "word": "應答", "meaning": "응답", "pronunciation": "응답" }
    ],
    "level": 7,
    "order": 97
  },
  {
    "character": "過",
    "meaning": "지날 과",
    "pronunciation": "과",
    "stroke_count": 12,
    "radical": "辵",
    "examples": [
      { "word": "過去", "meaning": "과거", "pronunciation": "과거" },
      { "word": "過程", "meaning": "과정", "pronunciation": "과정" }
    ],
    "level": 7,
    "order": 98
  },
  {
    "character": "程",
    "meaning": "정도 정",
    "pronunciation": "정",
    "stroke_count": 12,
    "radical": "禾",
    "examples": [
      { "word": "過程", "meaning": "과정", "pronunciation": "과정" },
      { "word": "程度", "meaning": "정도", "pronunciation": "정도" }
    ],
    "level": 7,
    "order": 99
  },
  {
    "character": "度",
    "meaning": "법도 도",
    "pronunciation": "도",
    "stroke_count": 9,
    "radical": "广",
    "examples": [
      { "word": "程度", "meaning": "정도", "pronunciation": "정도" },
      { "word": "態度", "meaning": "태도", "pronunciation": "태도" }
    ],
    "level": 7,
    "order": 100
  }
];

// 기본 한자 데이터베이스 객체
const baseHanjaDB = {
  "hanja_database": {
    "basic": {
      "name": "초등학생용 기초 한자",
      "description": "초등학생과 중학생을 위한 한자 모음",
      "total_characters": 620,
      "levels": [
        {
          "name": "7단계 (중학교 1학년 수준)",
          "description": "중학교 1학년 과정에서 배우는 한자 100자",
          "characters": []
        }
      ]
    }
  }
};

try {
  console.log('한자 데이터베이스 복구 및 업데이트를 시작합니다...');
  
  // 원본 파일 읽기 시도
  let originalData;
  try {
    const originalContent = fs.readFileSync(originalFilePath, 'utf8');
    originalData = JSON.parse(originalContent);
    console.log('기존 한자 데이터베이스 파일을 성공적으로 읽었습니다.');
    
    // 백업 생성
    fs.writeFileSync(backupFilePath, originalContent);
    console.log('백업 파일이 생성되었습니다:', backupFilePath);
  } catch (err) {
    console.log('기존 파일을 읽는데 문제가 발생했습니다:', err.message);
    console.log('기본 템플릿으로 시작합니다.');
    originalData = baseHanjaDB;
  }
  
  // 7단계(중학교 1학년) 한자 찾기
  let level7 = originalData.hanja_database.basic.levels.find(level => level.name.includes('7단계'));
  
  if (!level7) {
    console.log('7단계를 찾을 수 없어 새로 생성합니다.');
    level7 = {
      "name": "7단계 (중학교 1학년 수준)",
      "description": "중학교 1학년 과정에서 배우는 한자 100자",
      "characters": []
    };
    originalData.hanja_database.basic.levels.push(level7);
  } else {
    level7.description = "중학교 1학년 과정에서 배우는 한자 100자";
  }
  
  // 첫 50자를 유지하고 새로운 50자를 추가
  // 만약 기존 캐릭터가 없거나 50자를 넘지 않는다면 그대로 유지
  if (!level7.characters || level7.characters.length < 50) {
    console.log('기존 한자가 50자 미만이므로 샘플 데이터로 추가합니다.');
    // 샘플 데이터만 추가
    level7.characters = [...(level7.characters || []), ...newCharactersData];
  } else {
    // 51번째부터 추가
    const existingChars = level7.characters.slice(0, 50);
    level7.characters = [...existingChars, ...newCharactersData];
    console.log('기존 50자를 유지하고 새로운 한자를 추가했습니다.');
  }
  
  // 새 파일에 저장
  fs.writeFileSync(newFilePath, JSON.stringify(originalData, null, 2), 'utf8');
  console.log('업데이트된 한자 데이터베이스가 저장되었습니다:', newFilePath);
  
  // 원본 파일 백업 후 새 파일로 교체
  fs.copyFileSync(newFilePath, originalFilePath);
  console.log('원본 파일이 업데이트된 파일로 교체되었습니다.');
  
  console.log('작업이 완료되었습니다!');
  console.log('중학교 1학년 한자가 100자로 확장되었습니다.');
} catch (error) {
  console.error('오류 발생:', error);
} 