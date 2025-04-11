const fs = require('fs');
const path = require('path');

/**
 * 메인 한자 데이터베이스 업데이트 스크립트
 * 각 급수별 한자 데이터를 통합하여 중앙 데이터베이스를 구축합니다.
 */

// 경로 설정
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const outputDir = path.resolve(__dirname, '../data/new-structure/characters');
const outputFilePath = path.join(outputDir, 'hanja_characters.json');

// 통합 데이터 구조
const mainDbStructure = {
  metadata: {
    version: "1.0.0",
    last_updated: new Date().toISOString(),
    total_characters: 0,
    grade_statistics: {},
    category_statistics: {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    }
  },
  characters: []
};

/**
 * 급수별 카테고리 결정 함수
 * @param {number} grade 급수
 * @returns {string} 카테고리 (beginner, intermediate, advanced)
 */
function getCategoryForGrade(grade) {
  if (grade >= 11 && grade <= 15) return 'beginner';
  if (grade >= 6 && grade <= 10) return 'intermediate';
  if (grade >= 3 && grade <= 5) return 'advanced';
  return 'unknown';
}

/**
 * 모든 급수 데이터 로드 및 통합
 */
function buildMainDatabase() {
  console.log('Building main Hanja database...');
  
  try {
    // 출력 디렉토리 확인
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created output directory: ${outputDir}`);
    }
    
    // 총 한자 수 및 통계 초기화
    let totalCharacterCount = 0;
    const gradeStatistics = {};
    
    // 3급부터 15급까지 모든 급수 데이터 처리 (1-2급 제외)
    for (let grade = 15; grade >= 3; grade--) {
      const gradeFilePath = path.join(gradeDataDir, `grade_${grade}.json`);
      
      if (fs.existsSync(gradeFilePath)) {
        try {
          // 파일 읽기
          const gradeData = JSON.parse(fs.readFileSync(gradeFilePath, 'utf8'));
          
          if (gradeData.characters && Array.isArray(gradeData.characters)) {
            // 통계 업데이트
            const characterCount = gradeData.characters.length;
            totalCharacterCount += characterCount;
            
            const category = getCategoryForGrade(grade);
            gradeStatistics[grade] = {
              count: characterCount,
              category: category
            };
            
            // 카테고리별 통계 업데이트
            if (mainDbStructure.metadata.category_statistics[category] !== undefined) {
              mainDbStructure.metadata.category_statistics[category] += characterCount;
            }
            
            // 메인 데이터베이스에 한자 추가
            mainDbStructure.characters = [
              ...mainDbStructure.characters,
              ...gradeData.characters
            ];
            
            console.log(`Processed grade ${grade}: ${characterCount} characters`);
          } else {
            console.warn(`Warning: No character data found in grade ${grade}`);
            gradeStatistics[grade] = { count: 0, category: getCategoryForGrade(grade) };
          }
        } catch (error) {
          console.error(`Error processing grade ${grade} data:`, error.message);
          gradeStatistics[grade] = { count: 0, category: getCategoryForGrade(grade), error: true };
        }
      } else {
        console.warn(`Warning: File not found for grade ${grade}`);
        gradeStatistics[grade] = { count: 0, category: getCategoryForGrade(grade), missing: true };
      }
    }
    
    // 메인 데이터베이스 메타데이터 업데이트
    mainDbStructure.metadata.total_characters = totalCharacterCount;
    mainDbStructure.metadata.grade_statistics = gradeStatistics;
    
    console.log('Removing duplicates...');
    // 중복 제거 (동일한 유니코드를 가진 한자)
    const uniqueCharacters = {};
    let duplicateCount = 0;
    
    mainDbStructure.characters.forEach(char => {
      if (!uniqueCharacters[char.unicode]) {
        uniqueCharacters[char.unicode] = char;
      } else {
        duplicateCount++;
      }
    });
    
    mainDbStructure.characters = Object.values(uniqueCharacters);
    console.log(`Removed ${duplicateCount} duplicate characters`);
    
    mainDbStructure.metadata.total_characters = mainDbStructure.characters.length;
    
    // 최종 데이터베이스 파일 저장
    fs.writeFileSync(outputFilePath, JSON.stringify(mainDbStructure, null, 2), 'utf8');
    console.log(`Main Hanja database built successfully with ${mainDbStructure.characters.length} characters`);
    console.log(`Output saved to: ${outputFilePath}`);
    
    // 통계 요약 출력
    console.log('\nDatabase Statistics:');
    console.log('--------------------');
    console.log(`Total characters: ${mainDbStructure.metadata.total_characters}`);
    console.log(`- Beginner (15-11): ${mainDbStructure.metadata.category_statistics.beginner}`);
    console.log(`- Intermediate (10-6): ${mainDbStructure.metadata.category_statistics.intermediate}`);
    console.log(`- Advanced (5-3): ${mainDbStructure.metadata.category_statistics.advanced}`);
    
    return { success: true, message: 'Main database built successfully.' };
  } catch (error) {
    console.error('Error building main database:', error.message);
    return { success: false, message: `Error: ${error.message}` };
  }
}

// 실행
buildMainDatabase(); 