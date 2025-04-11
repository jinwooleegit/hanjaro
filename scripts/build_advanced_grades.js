const fs = require('fs');
const path = require('path');

/**
 * 고급 한자(5-3급) 데이터 구축을 위한 스크립트
 * 이 스크립트는 고급 한자 데이터 템플릿을 구축하는 기능을 제공합니다.
 */

// 파일 경로 설정
const outputDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');

// 각 급수별 기본 정보
const gradeInfo = {
  5: { total: 300, category: "advanced", description: "고급 1단계 - 한자능력검정 3급 수준" },
  4: { total: 450, category: "advanced", description: "고급 2단계 - 전문 분야 기초 한자" },
  3: { total: 650, category: "advanced", description: "고급 3단계 - 한자능력검정 준2급 수준" }
};

/**
 * 고급 한자 데이터 템플릿 생성 함수
 * @param {number} grade - 급수
 * @param {number} order - 순서
 * @param {string} character - 한자
 * @param {string} unicode - 유니코드
 * @param {string} meaning - 의미
 * @param {string} pronunciation - 발음
 * @param {number} strokeCount - 획수
 * @param {string} radical - 부수
 * @param {string[]} tags - 태그 목록
 * @returns {Object} 고급 한자 데이터 객체
 */
function createAdvancedHanjaData(grade, order, character, unicode, meaning, pronunciation, strokeCount, radical, tags = []) {
  return {
    id: `HJ-${grade.toString().padStart(2, '0')}-${order.toString().padStart(4, '0')}-${unicode}`,
    character,
    unicode,
    meaning,
    pronunciation,
    stroke_count: strokeCount,
    radical,
    grade,
    order,
    tags: [
      `radical:${radical}`,
      `strokes:${strokeCount}`,
      `grade:${grade}`,
      ...tags
    ],
    extended_data: {
      detailed_meaning: meaning,
      etymology: "",
      mnemonics: "",
      common_words: [],
      example_sentences: [],
      cultural_notes: "",
      pronunciation_guide: {
        korean: `${pronunciation}`,
        japanese_on: "",
        japanese_kun: "",
        mandarin: "",
        cantonese: ""
      },
      stroke_order: {
        description: "",
        directions: []
      },
      related_characters: [],
      variants: [],
      level_info: {
        jlpt: "",
        hsk: "",
        korean_standard: "고급"
      }
    }
  };
}

/**
 * 급수별 데이터 파일 생성 함수
 * @param {number} grade - 급수
 */
function generateAdvancedGradeData(grade) {
  // 고급 한자 예시 데이터 (실제 구현 시 확장 필요)
  const exampleCharacters = [];
  
  if (grade === 5) {
    // 5급 샘플 한자 (일부만 예시로 포함)
    exampleCharacters.push(createAdvancedHanjaData(5, 1, "疾", "7591", "질병 질", "질", 10, "疒", ["category:medical"]));
    exampleCharacters.push(createAdvancedHanjaData(5, 2, "融", "878D", "녹을 융", "융", 16, "虫", ["category:finance"]));
    exampleCharacters.push(createAdvancedHanjaData(5, 3, "臨", "81E8", "임할 림", "림", 17, "臣", ["category:philosophy"]));
    // ... 더 많은 한자 데이터 추가
  } else if (grade === 4) {
    // 4급 샘플 한자 (일부만 예시로 포함)
    exampleCharacters.push(createAdvancedHanjaData(4, 1, "儒", "5112", "유학 유", "유", 16, "人", ["category:philosophy"]));
    exampleCharacters.push(createAdvancedHanjaData(4, 2, "壤", "58E4", "흙 양", "양", 16, "土", ["category:environment"]));
    exampleCharacters.push(createAdvancedHanjaData(4, 3, "憲", "61B2", "법 헌", "헌", 16, "心", ["category:law"]));
    // ... 더 많은 한자 데이터 추가
  } else if (grade === 3) {
    // 3급 샘플 한자 (일부만 예시로 포함)
    exampleCharacters.push(createAdvancedHanjaData(3, 1, "璃", "7483", "유리 리", "리", 14, "王", ["category:material"]));
    exampleCharacters.push(createAdvancedHanjaData(3, 2, "瞬", "77AC", "눈 깜짝할 사이 순", "순", 17, "目", ["category:time"]));
    exampleCharacters.push(createAdvancedHanjaData(3, 3, "縫", "7E2B", "꿰맬 봉", "봉", 16, "糸", ["category:craft"]));
    // ... 더 많은 한자 데이터 추가
  }
  
  // 데이터 구조 생성
  const gradeData = {
    metadata: {
      version: "1.0.0",
      last_updated: new Date().toISOString(),
      grade: grade,
      total_characters: exampleCharacters.length,
      category: gradeInfo[grade].category,
      description: gradeInfo[grade].description
    },
    characters: exampleCharacters
  };
  
  // 파일 저장
  const outputFilePath = path.join(outputDir, `grade_${grade}.json`);
  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(gradeData, null, 2), 'utf8');
    console.log(`Grade ${grade} data saved to ${outputFilePath} (${exampleCharacters.length} characters)`);
    return true;
  } catch (error) {
    console.error(`Error saving grade ${grade} data:`, error.message);
    return false;
  }
}

/**
 * 모든 고급 등급(5-3급) 데이터 생성 실행
 */
function buildAllAdvancedGrades() {
  console.log('Starting advanced grades data build process...');
  
  let successCount = 0;
  
  // 5급부터 3급까지 생성
  for (let grade = 5; grade >= 3; grade--) {
    console.log(`Building grade ${grade} data...`);
    if (generateAdvancedGradeData(grade)) {
      successCount++;
    }
  }
  
  console.log(`\nBuild process completed. Successfully built ${successCount} grade data files.`);
  console.log('Next step: Enhance these basic templates with complete character data.');
}

// 스크립트 실행
buildAllAdvancedGrades(); 