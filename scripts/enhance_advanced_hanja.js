/**
 * 고급(5-3급) 한자 데이터 강화 스크립트
 * 기존의 고급 한자 데이터를 더 풍부하게 확장합니다.
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');

// 강화할 급수 목록 (고급 한자 5-3급)
const targetGrades = [5, 4, 3];

/**
 * 한자 파일 읽기 함수
 * @param {number} grade 급수
 * @returns {object|null} 한자 데이터 또는 null
 */
function readGradeFile(grade) {
  const filePath = path.join(gradeDataDir, `grade_${grade}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      console.error(`File not found: ${filePath}`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading file for grade ${grade}: ${error.message}`);
    return null;
  }
}

/**
 * 한자의 카테고리를 결정하는 함수
 * @param {string} meaning 한자의 의미
 * @param {string} radical 한자의 부수
 * @returns {string} 한자의 카테고리
 */
function determineAdvancedCategory(meaning, radical) {
  // 카테고리 분류 로직 (고급 한자에 맞게 확장)
  
  // 부수 기반 카테고리
  const radicalCategories = {
    '人': 'person',
    '口': 'speech',
    '土': 'earth',
    '女': 'female',
    '心': 'emotion',
    '手': 'action',
    '日': 'time',
    '木': 'nature',
    '水': 'water',
    '火': 'fire',
    '王': 'power',
    '目': 'perception',
    '石': 'material',
    '示': 'religion',
    '糸': 'craft',
    '言': 'communication',
    '車': 'transport',
    '金': 'metal',
    '門': 'building',
    '雨': 'weather',
    '食': 'food',
    '馬': 'animal'
  };
  
  if (radicalCategories[radical]) {
    return radicalCategories[radical];
  }
  
  // 의미 기반 카테고리
  if (meaning.includes("마음") || meaning.includes("심") || meaning.includes("정")) {
    return "emotion";
  } else if (meaning.includes("학") || meaning.includes("배") || meaning.includes("교")) {
    return "education";
  } else if (meaning.includes("정치") || meaning.includes("법") || meaning.includes("제")) {
    return "politics";
  } else if (meaning.includes("문화") || meaning.includes("예") || meaning.includes("악")) {
    return "culture";
  } else if (meaning.includes("경제") || meaning.includes("상") || meaning.includes("금")) {
    return "economy";
  } else if (meaning.includes("철학") || meaning.includes("도") || meaning.includes("리")) {
    return "philosophy";
  } else if (meaning.includes("역사") || meaning.includes("대") || meaning.includes("세")) {
    return "history";
  } else if (meaning.includes("과학") || meaning.includes("물") || meaning.includes("화")) {
    return "science";
  } else if (meaning.includes("의학") || meaning.includes("병") || meaning.includes("약")) {
    return "medicine";
  } else if (meaning.includes("종교") || meaning.includes("불") || meaning.includes("신")) {
    return "religion";
  }
  
  return "advanced";
}

/**
 * 고급 한자를 위한 관련 단어 생성 함수
 * @param {string} character 한자
 * @param {string} meaning 한자 의미
 * @param {string} pronunciation 한자 발음
 * @returns {Array} 관련 단어 배열
 */
function generateAdvancedCommonWords(character, meaning, pronunciation) {
  const words = [];
  const meaningParts = meaning.split(' ');
  const koreanMeaning = meaningParts.length > 1 ? meaningParts[0] : meaning;
  
  // 기본 단어 - 한자 + 자(字)
  words.push({
    word: `${character}字`,
    meaning: `${koreanMeaning} 자`,
    pronunciation: `${pronunciation}자`,
    example_sentence: `이것은 ${character}字입니다.`,
    example_meaning: `이것은 ${koreanMeaning} 자입니다.`
  });
  
  // 추가할 단어 유형 (실제 단어는 한자별 개별 처리 필요)
  // 여기서는 기본 구조만 제공
  
  return words;
}

/**
 * 고급 한자 예문 생성 함수
 * @param {string} character 한자
 * @param {string} meaning 한자 의미
 * @param {string} pronunciation 한자 발음
 * @returns {Array} 예문 배열
 */
function generateAdvancedExampleSentences(character, meaning, pronunciation) {
  const sentences = [];
  const meaningParts = meaning.split(' ');
  const koreanMeaning = meaningParts.length > 1 ? meaningParts[0] : meaning;
  
  // 기본 예문
  sentences.push({
    sentence: `${character}`,
    meaning: koreanMeaning,
    pronunciation: pronunciation,
    difficulty: "advanced"
  });
  
  // 고사성어나 격언으로 예문 추가 (대표적인 것만)
  if (character === '心') {
    sentences.push({
      sentence: "平常心是道",
      meaning: "평상심이도 - 평상시의 마음이 도이다",
      pronunciation: "평상심시도",
      difficulty: "advanced"
    });
  }
  
  return sentences;
}

/**
 * 한자의 문화적 배경 정보 생성
 * @param {string} character 한자
 * @param {string} meaning 한자 의미
 * @returns {string} 문화적 배경 정보
 */
function generateCulturalNotes(character, meaning) {
  return `${character}(${meaning}) 한자는 동아시아 문화권에서 오랜 역사와 철학적 의미를 가지고 있습니다. 유교, 불교, 도교 등 전통 사상에서도 중요하게 다루어진 개념입니다.`;
}

/**
 * 한자 데이터 강화 함수
 * @param {object} hanjaData 한자 데이터
 * @returns {object} 강화된 한자 데이터
 */
function enhanceHanjaData(hanjaData) {
  if (!hanjaData || !hanjaData.characters || !Array.isArray(hanjaData.characters)) {
    return hanjaData;
  }

  // 메타데이터 업데이트
  if (hanjaData.metadata) {
    hanjaData.metadata.last_updated = new Date().toISOString();
    
    // 등급별 설명 추가
    if (hanjaData.metadata.grade === 5) {
      hanjaData.metadata.description = "고급 1단계 - 중학교 1학년 수준 한자 (한자능력검정 3급 수준)";
    } else if (hanjaData.metadata.grade === 4) {
      hanjaData.metadata.description = "고급 2단계 - 중학교 2~3학년 수준 한자 (한자능력검정 준3급 수준)";
    } else if (hanjaData.metadata.grade === 3) {
      hanjaData.metadata.description = "고급 3단계 - 고등학교 1학년 수준 한자 (한자능력검정 준2급 수준)";
    }
    
    // 카테고리 확인
    hanjaData.metadata.category = "advanced";
  }

  // 각 한자 데이터 강화
  hanjaData.characters = hanjaData.characters.map(char => {
    // extended_data가 없으면 생성
    if (!char.extended_data) {
      char.extended_data = {};
    }
    
    // 기존 태그가 없거나 부족하면 태그 추가
    if (!char.tags || !Array.isArray(char.tags)) {
      char.tags = [];
    }
    
    // 부수, 획수, 급수 태그 확인 및 추가
    if (!char.tags.some(tag => tag.startsWith('radical:'))) {
      char.tags.push(`radical:${char.radical}`);
    }
    
    if (!char.tags.some(tag => tag.startsWith('strokes:'))) {
      char.tags.push(`strokes:${char.stroke_count}`);
    }
    
    if (!char.tags.some(tag => tag.startsWith('grade:'))) {
      char.tags.push(`grade:${char.grade}`);
    }
    
    // 카테고리 태그 추가
    const category = determineAdvancedCategory(char.meaning, char.radical);
    if (!char.tags.some(tag => tag.startsWith('category:'))) {
      char.tags.push(`category:${category}`);
    }
    
    // 레벨 태그 추가
    if (!char.tags.some(tag => tag.startsWith('level:'))) {
      char.tags.push('level:advanced');
    }
    
    // extended_data 항목 강화
    const extData = char.extended_data;
    
    // detailed_meaning이 비어있으면 상세 의미 추가
    if (!extData.detailed_meaning || extData.detailed_meaning.trim() === "") {
      extData.detailed_meaning = `${char.meaning}의 의미를 가진 한자로, 고급 수준에서 학습하는 한자입니다. 다양한 복합어에서 사용됩니다.`;
    }
    
    // 어원 정보 추가
    if (!extData.etymology || extData.etymology.trim() === "") {
      extData.etymology = `${char.character}(${char.meaning}) 한자는 고대 한자의 형태에서 유래되었으며, 상형문자나 회의문자 등 특정 원리로 만들어졌습니다.`;
    }
    
    // 기억법 추가
    if (!extData.mnemonics || extData.mnemonics.trim() === "") {
      extData.mnemonics = `${char.character}(${char.meaning})의 모양과 구성 요소를 분석하여 기억하면 효과적입니다. 부수(${char.radical})를 중심으로 구조를 파악하세요.`;
    }
    
    // 관련 단어가 비어있으면 단어 추가
    if (!extData.common_words || !Array.isArray(extData.common_words) || extData.common_words.length === 0) {
      extData.common_words = generateAdvancedCommonWords(char.character, char.meaning, char.pronunciation);
    }
    
    // 예문이 비어있으면 예문 추가
    if (!extData.example_sentences || !Array.isArray(extData.example_sentences) || extData.example_sentences.length === 0) {
      extData.example_sentences = generateAdvancedExampleSentences(char.character, char.meaning, char.pronunciation);
    }
    
    // 문화적 배경 정보 추가
    if (!extData.cultural_notes || extData.cultural_notes.trim() === "") {
      extData.cultural_notes = generateCulturalNotes(char.character, char.meaning);
    }
    
    // 발음 가이드 추가
    if (!extData.pronunciation_guide || typeof extData.pronunciation_guide !== 'object') {
      extData.pronunciation_guide = {
        korean: char.pronunciation,
        japanese_on: "",
        japanese_kun: "",
        mandarin: "",
        cantonese: ""
      };
    } else if (typeof extData.pronunciation_guide === 'string') {
      const oldGuide = extData.pronunciation_guide;
      extData.pronunciation_guide = {
        korean: char.pronunciation,
        japanese_on: "",
        japanese_kun: "",
        mandarin: "",
        cantonese: "",
        note: oldGuide
      };
    }
    
    // 획순 정보가 없으면 생성
    if (!extData.stroke_order) {
      extData.stroke_order = {
        description: `${char.character}(${char.meaning})의 기본 획순입니다. 부수(${char.radical})를 먼저 쓰고 나머지 부분을 씁니다.`,
        directions: []
      };
    }
    
    // 관련 한자 정보 추가
    if (!extData.related_characters || !Array.isArray(extData.related_characters)) {
      extData.related_characters = [];
    }
    
    // level_info 추가
    if (!extData.level_info) {
      extData.level_info = {
        jlpt: "",
        hsk: "",
        korean_standard: "고급"
      };
    }
    
    return char;
  });

  return hanjaData;
}

/**
 * 메인 실행 함수
 */
async function enhanceAdvancedHanja() {
  console.log('고급(5-3급) 한자 데이터 강화 시작...');
  
  let totalProcessed = 0;
  let totalSuccess = 0;
  
  for (const grade of targetGrades) {
    console.log(`\n[Grade ${grade}] 처리 중...`);
    
    // 파일 읽기
    const hanjaData = readGradeFile(grade);
    if (!hanjaData) {
      console.error(`Grade ${grade} 데이터를 처리할 수 없습니다.`);
      continue;
    }
    
    // 데이터 강화
    const enhancedData = enhanceHanjaData(hanjaData);
    
    // 파일 저장
    const outputPath = path.join(gradeDataDir, `grade_${grade}.json`);
    try {
      fs.writeFileSync(outputPath, JSON.stringify(enhancedData, null, 2), 'utf8');
      console.log(`Grade ${grade} 데이터 강화 완료: ${enhancedData.characters.length}개 한자 처리됨`);
      totalSuccess++;
    } catch (error) {
      console.error(`Grade ${grade} 데이터 저장 오류: ${error.message}`);
    }
    
    totalProcessed++;
  }
  
  console.log(`\n고급 한자 데이터 강화 작업 완료: ${totalSuccess}/${totalProcessed} 급수 처리됨`);
}

// 스크립트 실행
enhanceAdvancedHanja().catch(err => {
  console.error('오류 발생:', err);
  process.exit(1);
}); 