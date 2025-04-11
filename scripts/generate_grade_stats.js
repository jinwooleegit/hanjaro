const fs = require('fs');
const path = require('path');

/**
 * 한자 급수별 통계 생성 스크립트
 * 각 급수별 한자 데이터의 현황과 통계를 생성하고 저장합니다.
 */

// 디렉토리 경로
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');
const statsDir = path.resolve(__dirname, '../data/new-structure/stats');

// 통계 파일 경로
const summaryStatsPath = path.join(statsDir, 'grade_summary_stats.json');
const detailedStatsPath = path.join(statsDir, 'grade_detailed_stats.json');

// 급수 카테고리 (전문가 급수 제외)
const gradeCategories = {
  beginner: [15, 14, 13, 12, 11],
  intermediate: [10, 9, 8, 7, 6],
  advanced: [5, 4, 3]
};

// 카테고리별 한글 이름
const categoryNames = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급'
};

/**
 * 통계 디렉토리 생성
 */
function ensureStatsDirectoryExists() {
  if (!fs.existsSync(statsDir)) {
    fs.mkdirSync(statsDir, { recursive: true });
    console.log(`통계 디렉토리 생성: ${statsDir}`);
  }
}

/**
 * 개별 급수별 통계 생성
 * @param {number} grade - 급수
 * @returns {Object|null} - 급수별 통계 또는 오류 시 null
 */
function generateGradeStats(grade) {
  const filePath = path.join(gradeDataDir, `grade_${grade}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`경고: ${grade}급 데이터 파일이 존재하지 않습니다.`);
    return null;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const characters = data.characters || [];
    
    // 기본 통계
    const stats = {
      grade,
      total_characters: characters.length,
      file_size_kb: (fs.statSync(filePath).size / 1024).toFixed(2),
      metadata: data.metadata || {},
      category: getGradeCategory(grade),
      category_name: categoryNames[getGradeCategory(grade)],
      completed: characters.length > 0
    };
    
    // 추가 통계가 필요한 경우 (characters 배열이 존재하는 경우)
    if (characters.length > 0) {
      // 획수별 분포
      const strokeCounts = {};
      characters.forEach(char => {
        const strokes = char.stroke_count || 0;
        strokeCounts[strokes] = (strokeCounts[strokes] || 0) + 1;
      });
      
      // 부수별 분포
      const radicals = {};
      characters.forEach(char => {
        const radical = char.radical || '';
        if (radical) {
          radicals[radical] = (radicals[radical] || 0) + 1;
        }
      });
      
      // 확장 데이터 완성도
      let extendedDataCompleteness = 0;
      const extendedFields = [
        'detailed_meaning', 'etymology', 'mnemonics', 'common_words',
        'example_sentences', 'cultural_notes', 'pronunciation_guide', 'stroke_order'
      ];
      
      characters.forEach(char => {
        if (char.extended_data) {
          const extended = char.extended_data;
          let fieldCount = 0;
          
          extendedFields.forEach(field => {
            if (extended[field]) {
              // 빈 배열이나 객체가 아닌 경우만 카운트
              if (Array.isArray(extended[field])) {
                if (extended[field].length > 0) fieldCount++;
              } else if (typeof extended[field] === 'object') {
                if (Object.keys(extended[field]).length > 0) fieldCount++;
              } else if (extended[field]) {
                fieldCount++;
              }
            }
          });
          
          extendedDataCompleteness += fieldCount / extendedFields.length;
        }
      });
      
      // 퍼센트로 변환
      extendedDataCompleteness = characters.length > 0
        ? Math.round((extendedDataCompleteness / characters.length) * 100)
        : 0;
      
      // 통계에 추가
      stats.stroke_distribution = strokeCounts;
      stats.radical_distribution = radicals;
      stats.extended_data_completeness = extendedDataCompleteness;
      stats.most_common_strokes = Object.entries(strokeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([stroke, count]) => ({ stroke: parseInt(stroke), count }));
      stats.most_common_radicals = Object.entries(radicals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([radical, count]) => ({ radical, count }));
    }
    
    return stats;
  } catch (error) {
    console.error(`오류: ${grade}급 통계 생성 중 문제 발생:`, error.message);
    return null;
  }
}

/**
 * 급수에 해당하는 카테고리 반환
 * @param {number} grade - 급수
 * @returns {string} - 카테고리(beginner, intermediate, advanced)
 */
function getGradeCategory(grade) {
  if (gradeCategories.beginner.includes(grade)) return 'beginner';
  if (gradeCategories.intermediate.includes(grade)) return 'intermediate';
  if (gradeCategories.advanced.includes(grade)) return 'advanced';
  return 'unknown';
}

/**
 * 전체 통계 생성 및 저장
 */
function generateAllStats() {
  console.log('한자 급수별 통계 생성 시작...');
  ensureStatsDirectoryExists();
  
  const allGradeStats = {};
  const summaryStats = {
    total_grades: 13,
    completed_grades: 0,
    characters_by_category: {
      beginner: 0,
      intermediate: 0, 
      advanced: 0
    },
    total_characters: 0,
    grade_status: {},
    last_updated: new Date().toISOString()
  };
  
  // 3급부터 15급까지 통계 생성 (1-2급 제외)
  for (let grade = 15; grade >= 3; grade--) {
    const stats = generateGradeStats(grade);
    
    if (stats) {
      allGradeStats[grade] = stats;
      
      // 요약 통계 업데이트
      if (stats.completed) {
        summaryStats.completed_grades++;
      }
      
      summaryStats.characters_by_category[stats.category] += stats.total_characters;
      summaryStats.total_characters += stats.total_characters;
      
      summaryStats.grade_status[grade] = {
        exists: true,
        characters: stats.total_characters,
        completeness: stats.extended_data_completeness || 0
      };
    } else {
      summaryStats.grade_status[grade] = {
        exists: false,
        characters: 0,
        completeness: 0
      };
    }
  }
  
  // 요약 통계 저장
  fs.writeFileSync(summaryStatsPath, JSON.stringify(summaryStats, null, 2), 'utf8');
  console.log(`요약 통계 파일 저장 완료: ${summaryStatsPath}`);
  
  // 상세 통계 저장
  fs.writeFileSync(detailedStatsPath, JSON.stringify(allGradeStats, null, 2), 'utf8');
  console.log(`상세 통계 파일 저장 완료: ${detailedStatsPath}`);
  
  // 통계 요약 출력
  console.log('\n한자 데이터베이스 현황 요약:');
  console.log('------------------------------');
  console.log(`완성된 급수: ${summaryStats.completed_grades}/${summaryStats.total_grades}`);
  console.log(`총 한자 수: ${summaryStats.total_characters}자`);
  console.log(`- 초급 (15-11급): ${summaryStats.characters_by_category.beginner}자`);
  console.log(`- 중급 (10-6급): ${summaryStats.characters_by_category.intermediate}자`);
  console.log(`- 고급 (5-3급): ${summaryStats.characters_by_category.advanced}자`);
  console.log('------------------------------');
  
  return {
    summary: summaryStats,
    detailed: allGradeStats
  };
}

// 통계 생성 실행
generateAllStats(); 