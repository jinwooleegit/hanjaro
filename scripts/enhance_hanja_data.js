/**
 * 한자 데이터베이스 확장 스크립트
 * 
 * 이 스크립트는 기본 한자 데이터에 확장 정보를 추가하는 기능을 제공합니다.
 * 기본 한자 ID로 데이터를 조회하고, 확장 정보를 생성하여 새 파일로 저장합니다.
 */

const fs = require('fs');
const path = require('path');

// 설정
const DATA_DIR = path.join(__dirname, '../data/new-structure');
const CHARACTERS_DIR = path.join(DATA_DIR, 'characters');
const BASIC_DATA_FILE = path.join(CHARACTERS_DIR, 'hanja_characters.json');
const EXTENDED_DATA_FILE = path.join(CHARACTERS_DIR, 'hanja_extended.json');
const TEMP_OUTPUT_FILE = path.join(CHARACTERS_DIR, 'hanja_extended_new.json');

// 난이도별 학습 단계
const GRADE_LEVELS = {
  15: '유치원 초급',
  14: '유치원 중급',
  13: '유치원 고급',
  12: '초등 1학년',
  11: '초등 2학년',
  10: '초등 3학년',
  9: '초등 4학년',
  8: '초등 5학년',
  7: '초등 6학년',
  6: '중학 1학년'
};

// 부수 데이터 (샘플)
const RADICALS = {
  '一': '으뜸 일',
  '人': '사람 인',
  '山': '메 산',
  '水': '물 수',
  '火': '불 화',
  '木': '나무 목',
  '土': '흙 토',
  '口': '입 구',
  '日': '날 일',
  '月': '달 월'
};

/**
 * 기본 한자 데이터 로드
 * @returns {Object} 한자 데이터 객체
 */
function loadBasicHanjaData() {
  try {
    const data = fs.readFileSync(BASIC_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('기본 한자 데이터 로드 오류:', error);
    process.exit(1);
  }
}

/**
 * 확장 한자 데이터 로드
 * @returns {Object} 확장 한자 데이터 객체
 */
function loadExtendedHanjaData() {
  try {
    if (fs.existsSync(EXTENDED_DATA_FILE)) {
      const data = fs.readFileSync(EXTENDED_DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { 
      metadata: {
        version: "1.0.0",
        last_updated: new Date().toISOString(),
        total_characters: 0,
        data_source: "국립국어원 한자 자료 확장"
      }, 
      characters: [] 
    };
  } catch (error) {
    console.error('확장 한자 데이터 로드 오류:', error);
    process.exit(1);
  }
}

/**
 * 확장 데이터 생성
 * @param {Object} character 한자 객체
 * @returns {Object} 확장된 한자 객체
 */
function generateExtendedData(character) {
  // 기존 확장 데이터가 있으면 그대로 유지
  if (character.extended_data) {
    return character;
  }

  const { id, radical, meaning, pronunciation, stroke_count, grade } = character;
  
  // 샘플 확장 데이터 생성
  const extendedData = {
    detailed_meaning: `${meaning}의 기본 의미입니다. 추가적인 의미와 용례를 설명합니다.`,
    etymology: `${character.character} 한자의 어원은 ${RADICALS[radical] || radical} 부수와 관련이 있습니다.`,
    mnemonics: `${character.character}를 기억하기 쉬운 방법은 ${meaning}의 이미지를 떠올리는 것입니다.`,
    common_words: [
      {
        word: `${character.character}${character.character}`,
        meaning: `${meaning} (예시 복합어)`,
        pronunciation: `${pronunciation}${pronunciation}`,
        example_sentence: `${character.character}${character.character}는 좋은 한자 학습 예문입니다.`,
        example_meaning: `${meaning} (예시 복합어)는 좋은 한자 학습 예문입니다.`
      }
    ],
    cultural_notes: `${character.character} 한자는 ${GRADE_LEVELS[grade] || '기본'} 수준에서 학습하는 문자로, 문화적으로 중요한 의미가 있습니다.`,
    pronunciation_guide: `${pronunciation}로 발음하며, 중국어에서는 (중국어 발음), 일본어에서는 (일본어 발음)으로 읽습니다.`,
    stroke_order: {
      description: `${stroke_count}획으로 이루어진 한자입니다.`,
      directions: [`첫 번째 획: 시작 방향에서 끝 방향으로`, `두 번째 획: ...`]
    }
  };

  // 관련 한자 (부수가 같은 다른 한자들을 추가할 수 있음)
  if (radical) {
    extendedData.related_characters = [];
  }

  return {
    ...character,
    extended_data: extendedData
  };
}

/**
 * 문자열에서 한자만 추출
 * @param {string} str 입력 문자열
 * @returns {string} 첫 번째 한자 문자
 */
function extractHanjaCharacter(str) {
  const match = str.match(/[\u4e00-\u9fff\u3400-\u4dbf]/);
  return match ? match[0] : '';
}

/**
 * 확장 데이터 저장
 * @param {Object} extendedData 확장 데이터 객체
 */
function saveExtendedData(extendedData) {
  try {
    // 임시 파일에 먼저 저장
    fs.writeFileSync(
      TEMP_OUTPUT_FILE,
      JSON.stringify(extendedData, null, 2),
      'utf8'
    );
    
    // 성공하면 기존 파일 대체
    if (fs.existsSync(EXTENDED_DATA_FILE)) {
      fs.renameSync(TEMP_OUTPUT_FILE, EXTENDED_DATA_FILE);
    } else {
      fs.renameSync(TEMP_OUTPUT_FILE, EXTENDED_DATA_FILE);
    }
    
    console.log(`확장 데이터가 성공적으로 저장되었습니다: ${EXTENDED_DATA_FILE}`);
  } catch (error) {
    console.error('확장 데이터 저장 오류:', error);
  }
}

/**
 * 메인 함수
 */
function main() {
  // 한자 ID 또는 문자를 인자로 받음
  const targetId = process.argv[2];
  
  if (!targetId) {
    console.log('사용법: node enhance_hanja_data.js <한자_ID 또는 한자_문자>');
    process.exit(1);
  }

  // 기본 데이터 로드
  const basicData = loadBasicHanjaData();
  // 확장 데이터 로드
  const extendedData = loadExtendedHanjaData();
  
  // ID 또는 문자로 한자 검색
  const isCharacter = targetId.length === 1 || extractHanjaCharacter(targetId).length > 0;
  const targetChar = isCharacter ? extractHanjaCharacter(targetId) : null;
  
  let targetCharacter = null;
  
  if (isCharacter && targetChar) {
    targetCharacter = basicData.characters.find(c => c.character === targetChar);
  } else {
    targetCharacter = basicData.characters.find(c => c.id === targetId);
  }
  
  if (!targetCharacter) {
    console.error(`한자 ID 또는 문자를 찾을 수 없습니다: ${targetId}`);
    process.exit(1);
  }

  // 확장 데이터에 이미 존재하는지 확인
  const existingExtendedIndex = extendedData.characters.findIndex(c => c.id === targetCharacter.id);
  
  // 확장 데이터 생성
  const enhancedCharacter = generateExtendedData(targetCharacter);
  
  // 확장 데이터 업데이트 또는 추가
  if (existingExtendedIndex >= 0) {
    extendedData.characters[existingExtendedIndex] = enhancedCharacter;
    console.log(`기존 확장 데이터를 업데이트했습니다: ${targetCharacter.character} (${targetCharacter.id})`);
  } else {
    extendedData.characters.push(enhancedCharacter);
    extendedData.metadata.total_characters = extendedData.characters.length;
    console.log(`새로운 확장 데이터를 추가했습니다: ${targetCharacter.character} (${targetCharacter.id})`);
  }
  
  // 확장 데이터 저장
  saveExtendedData(extendedData);
}

// 스크립트 실행
main(); 