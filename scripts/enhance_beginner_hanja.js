/**
 * 초급(15-11급) 한자 데이터 강화 스크립트
 * 기존의 초급 한자 데이터를 더 풍부하게 확장합니다.
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');

// 강화할 급수 목록 (초급 한자 15-11급)
const targetGrades = [15, 14, 13, 12, 11];

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
    if (hanjaData.metadata.grade === 15) {
      hanjaData.metadata.description = "초급 1단계 - 가장 기본적인 한자";
    } else if (hanjaData.metadata.grade === 14) {
      hanjaData.metadata.description = "초급 2단계 - 숫자 및 기초 개념";
    } else if (hanjaData.metadata.grade === 13) {
      hanjaData.metadata.description = "초급 3단계 - 자연 및 일상 관련 한자";
    } else if (hanjaData.metadata.grade === 12) {
      hanjaData.metadata.description = "초급 4단계 - 기초 동작 및 상태 관련 한자";
    } else if (hanjaData.metadata.grade === 11) {
      hanjaData.metadata.description = "초급 5단계 - 기초 완성을 위한 한자";
    }
    
    // 카테고리 확인
    hanjaData.metadata.category = "beginner";
  }

  // 각 한자 데이터 강화
  hanjaData.characters = hanjaData.characters.map(char => {
    // extended_data가 없으면 생성
    if (!char.extended_data) {
      char.extended_data = {};
    }
    
    // 기존 태그가 없으면 기본 태그 추가
    if (!char.tags || !Array.isArray(char.tags) || char.tags.length === 0) {
      char.tags = [
        `radical:${char.radical}`,
        `strokes:${char.stroke_count}`,
        `grade:${char.grade}`
      ];
      
      // 의미 기반 카테고리 태그 추가 (예시)
      if (char.meaning.includes("사람") || char.meaning.includes("인")) {
        char.tags.push("category:person");
      } else if (char.meaning.includes("자연") || char.meaning.includes("산") || char.meaning.includes("물") || char.meaning.includes("해")) {
        char.tags.push("category:nature");
      } else if (char.meaning.includes("숫자") || char.meaning.includes("일") || char.meaning.includes("이") || char.meaning.includes("삼")) {
        char.tags.push("category:number");
      }
    }
    
    // extended_data 항목 강화
    const extData = char.extended_data;
    
    // detailed_meaning이 비어있으면 기본 의미 추가
    if (!extData.detailed_meaning || extData.detailed_meaning.trim() === "") {
      extData.detailed_meaning = char.meaning;
    }
    
    // 기억법 추가
    if (!extData.mnemonics || extData.mnemonics.trim() === "") {
      extData.mnemonics = `${char.character}(${char.meaning})의 모양을 통해 의미를 기억할 수 있습니다.`;
    }
    
    // 관련 단어가 비어있으면 기본 단어 추가 (예시)
    if (!extData.common_words || !Array.isArray(extData.common_words) || extData.common_words.length === 0) {
      extData.common_words = [
        {
          word: `${char.character}字`,
          meaning: `${char.meaning}자`,
          pronunciation: `${char.pronunciation}자`
        }
      ];
    }
    
    // 예문이 비어있으면 기본 예문 추가
    if (!extData.example_sentences || !Array.isArray(extData.example_sentences) || extData.example_sentences.length === 0) {
      extData.example_sentences = [
        {
          sentence: `${char.character}`,
          meaning: char.meaning,
          pronunciation: char.pronunciation,
          difficulty: "beginner"
        }
      ];
    }
    
    // 획순 정보가 없으면 생성
    if (!extData.stroke_order) {
      extData.stroke_order = {
        description: `${char.character}(${char.meaning})의 기본 획순입니다.`,
        directions: []
      };
    }
    
    return char;
  });

  return hanjaData;
}

/**
 * 메인 실행 함수
 */
async function enhanceBeginnerHanja() {
  console.log('초급(15-11급) 한자 데이터 강화 시작...');
  
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
  
  console.log(`\n초급 한자 데이터 강화 작업 완료: ${totalSuccess}/${totalProcessed} 급수 처리됨`);
}

// 스크립트 실행
enhanceBeginnerHanja().catch(err => {
  console.error('오류 발생:', err);
  process.exit(1);
}); 