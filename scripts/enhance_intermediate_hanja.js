/**
 * 중급(10-6급) 한자 데이터 강화 스크립트
 * 기존의 중급 한자 데이터를 더 풍부하게 확장합니다.
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');

// 강화할 급수 목록 (중급 한자 10-6급)
const targetGrades = [10, 9, 8, 7, 6];

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
 * @returns {string} 한자의 카테고리
 */
function determineCategory(meaning) {
  // 카테고리 분류 로직
  if (meaning.includes("사람") || meaning.includes("인")) {
    return "person";
  } else if (meaning.includes("물") || meaning.includes("수")) {
    return "water";
  } else if (meaning.includes("불") || meaning.includes("화")) {
    return "fire";
  } else if (meaning.includes("땅") || meaning.includes("토") || meaning.includes("지")) {
    return "earth";
  } else if (meaning.includes("나무") || meaning.includes("목")) {
    return "wood";
  } else if (meaning.includes("쇠") || meaning.includes("금")) {
    return "metal";
  } else if (meaning.includes("말") || meaning.includes("언") || meaning.includes("어")) {
    return "speech";
  } else if (meaning.includes("마음") || meaning.includes("심")) {
    return "mind";
  } else if (meaning.includes("몸") || meaning.includes("신")) {
    return "body";
  } else if (meaning.includes("시간") || meaning.includes("일") || meaning.includes("월") || meaning.includes("년")) {
    return "time";
  } else if (meaning.includes("장소") || meaning.includes("처") || meaning.includes("소")) {
    return "place";
  } else if (meaning.includes("행동") || meaning.includes("할") || meaning.includes("동")) {
    return "action";
  }
  
  return "general";
}

/**
 * 한자를 위한 관련 단어 생성 함수
 * @param {string} character 한자
 * @param {string} meaning 한자 의미
 * @param {string} pronunciation 한자 발음
 * @returns {Array} 관련 단어 배열
 */
function generateCommonWords(character, meaning, pronunciation) {
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
  
  return words;
}

/**
 * 한자 예문 생성 함수
 * @param {string} character 한자
 * @param {string} meaning 한자 의미
 * @param {string} pronunciation 한자 발음
 * @returns {Array} 예문 배열
 */
function generateExampleSentences(character, meaning, pronunciation) {
  const sentences = [];
  const meaningParts = meaning.split(' ');
  const koreanMeaning = meaningParts.length > 1 ? meaningParts[0] : meaning;
  
  // 기본 예문
  sentences.push({
    sentence: `${character}`,
    meaning: koreanMeaning,
    pronunciation: pronunciation,
    difficulty: "intermediate"
  });
  
  return sentences;
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
    if (hanjaData.metadata.grade === 10) {
      hanjaData.metadata.description = "중급 1단계 - 일상 생활에서 자주 사용되는 한자";
    } else if (hanjaData.metadata.grade === 9) {
      hanjaData.metadata.description = "중급 2단계 - 일반 독서에 필요한 한자";
    } else if (hanjaData.metadata.grade === 8) {
      hanjaData.metadata.description = "중급 3단계 - 초등학교 3학년 수준 한자";
    } else if (hanjaData.metadata.grade === 7) {
      hanjaData.metadata.description = "중급 4단계 - 초등학교 4학년 수준 한자";
    } else if (hanjaData.metadata.grade === 6) {
      hanjaData.metadata.description = "중급 5단계 - 초등학교 5~6학년 수준 한자";
    }
    
    // 카테고리 확인
    hanjaData.metadata.category = "intermediate";
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
    const category = determineCategory(char.meaning);
    if (!char.tags.some(tag => tag.startsWith('category:'))) {
      char.tags.push(`category:${category}`);
    }
    
    // 레벨 태그 추가
    if (!char.tags.some(tag => tag.startsWith('level:'))) {
      char.tags.push('level:intermediate');
    }
    
    // extended_data 항목 강화
    const extData = char.extended_data;
    
    // detailed_meaning이 비어있으면 상세 의미 추가
    if (!extData.detailed_meaning || extData.detailed_meaning.trim() === "") {
      extData.detailed_meaning = `${char.meaning}의 의미를 가진 한자로, 중급 수준에서 학습합니다.`;
    }
    
    // 어원 정보 추가
    if (!extData.etymology || extData.etymology.trim() === "") {
      extData.etymology = `${char.character}(${char.meaning}) 한자의 어원은 고대 한자의 형태에서 유래되었습니다.`;
    }
    
    // 기억법 추가
    if (!extData.mnemonics || extData.mnemonics.trim() === "") {
      extData.mnemonics = `${char.character}(${char.meaning})의 모양과 의미를 연결지어 기억하면 효과적입니다.`;
    }
    
    // 관련 단어가 비어있으면 단어 추가
    if (!extData.common_words || !Array.isArray(extData.common_words) || extData.common_words.length === 0) {
      extData.common_words = generateCommonWords(char.character, char.meaning, char.pronunciation);
    }
    
    // 예문이 비어있으면 예문 추가
    if (!extData.example_sentences || !Array.isArray(extData.example_sentences) || extData.example_sentences.length === 0) {
      extData.example_sentences = generateExampleSentences(char.character, char.meaning, char.pronunciation);
    }
    
    // 문화적 배경 정보 추가
    if (!extData.cultural_notes || extData.cultural_notes.trim() === "") {
      extData.cultural_notes = `${char.character}(${char.meaning})는 동아시아 문화권에서 중요한 의미를 가집니다.`;
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
        description: `${char.character}(${char.meaning})의 기본 획순입니다.`,
        directions: []
      };
    }
    
    // 관련 한자 정보 추가
    if (!extData.related_characters || !Array.isArray(extData.related_characters)) {
      extData.related_characters = [];
    }
    
    return char;
  });

  return hanjaData;
}

/**
 * 메인 실행 함수
 */
async function enhanceIntermediateHanja() {
  console.log('중급(10-6급) 한자 데이터 강화 시작...');
  
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
  
  console.log(`\n중급 한자 데이터 강화 작업 완료: ${totalSuccess}/${totalProcessed} 급수 처리됨`);
}

// 스크립트 실행
enhanceIntermediateHanja().catch(err => {
  console.error('오류 발생:', err);
  process.exit(1);
}); 