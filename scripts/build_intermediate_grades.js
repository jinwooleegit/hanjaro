const fs = require('fs');
const path = require('path');

/**
 * 중급 한자(10-6급) 데이터 구축을 위한 통합 스크립트
 * 이 스크립트는 중급 한자 데이터를 한 번에 구축하는 기능을 제공합니다.
 */

// 파일 경로 설정
const outputDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');

// 각 급수별 기본 정보
const gradeInfo = {
  10: { total: 120, category: "intermediate", description: "중급 1단계" },
  9: { total: 140, category: "intermediate", description: "중급 2단계" },
  8: { total: 150, category: "intermediate", description: "중급 3단계" },
  7: { total: 160, category: "intermediate", description: "중급 4단계" },
  6: { total: 170, category: "intermediate", description: "중급 5단계" }
};

/**
 * 기본 한자 데이터 템플릿 생성 함수
 * @param {number} grade - 급수
 * @param {number} order - 순서
 * @param {string} character - 한자
 * @param {string} unicode - 유니코드
 * @param {string} meaning - 의미
 * @param {string} pronunciation - 발음
 * @param {number} strokeCount - 획수
 * @param {string} radical - 부수
 * @returns {Object} 기본 한자 데이터 객체
 */
function createBasicHanjaData(grade, order, character, unicode, meaning, pronunciation, strokeCount, radical) {
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
      `grade:${grade}`
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
      related_characters: []
    }
  };
}

/**
 * 급수별 데이터 파일 생성 함수
 * @param {number} grade - 급수
 */
function generateGradeData(grade) {
  // 실제 개발 시 이 부분은 외부 데이터 소스나 DB에서 가져오는 것이 좋습니다.
  // 현재는 예시 데이터만 포함합니다.
  const exampleCharacters = [];
  
  // 급수별 샘플 데이터 (실제 구현 시 확장 필요)
  if (grade === 9) {
    // 9급 샘플 한자
    exampleCharacters.push(createBasicHanjaData(9, 1, "兵", "5175", "병사 병", "병", 7, "八"));
    exampleCharacters.push(createBasicHanjaData(9, 2, "學", "5B78", "배울 학", "학", 16, "子"));
    exampleCharacters.push(createBasicHanjaData(9, 3, "校", "6821", "학교 교", "교", 10, "木"));
    // ... 더 많은 한자 데이터 추가
  } else if (grade === 8) {
    // 8급 샘플 한자
    exampleCharacters.push(createBasicHanjaData(8, 1, "議", "8B70", "의논할 의", "의", 20, "言"));
    exampleCharacters.push(createBasicHanjaData(8, 2, "業", "696D", "일 업", "업", 13, "业"));
    exampleCharacters.push(createBasicHanjaData(8, 3, "經", "7D93", "경서 경", "경", 13, "糸"));
    // ... 더 많은 한자 데이터 추가
  } else if (grade === 7) {
    // 7급 샘플 한자
    exampleCharacters.push(createBasicHanjaData(7, 1, "勞", "52DE", "일할 로", "로", 12, "力"));
    exampleCharacters.push(createBasicHanjaData(7, 2, "歷", "6B77", "지날 력", "력", 16, "止"));
    exampleCharacters.push(createBasicHanjaData(7, 3, "課", "8AB2", "과목 과", "과", 15, "言"));
    // ... 더 많은 한자 데이터 추가
  } else if (grade === 6) {
    // 6급 샘플 한자
    exampleCharacters.push(createBasicHanjaData(6, 1, "慶", "6176", "경사 경", "경", 15, "心"));
    exampleCharacters.push(createBasicHanjaData(6, 2, "適", "9069", "맞을 적", "적", 15, "辶"));
    exampleCharacters.push(createBasicHanjaData(6, 3, "漢", "6F22", "한나라 한", "한", 13, "氵"));
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
 * 모든 중급 등급(10-6급) 데이터 생성 실행
 */
function buildAllIntermediateGrades() {
  console.log('Starting intermediate grades data build process...');
  
  // 10급은 이미 구축되어 있는 것으로 가정
  console.log('Grade 10 is already built.');
  
  let successCount = 0;
  
  // 9급부터 6급까지 생성
  for (let grade = 9; grade >= 6; grade--) {
    console.log(`Building grade ${grade} data...`);
    if (generateGradeData(grade)) {
      successCount++;
    }
  }
  
  console.log(`\nBuild process completed. Successfully built ${successCount} grade data files.`);
  console.log('Next step: Enhance these basic templates with complete character data.');
}

// 스크립트 실행
buildAllIntermediateGrades(); 