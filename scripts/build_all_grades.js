const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 한자 데이터베이스 구축 통합 관리 스크립트
 * 이 스크립트는 모든 급수(15-1급)의 한자 데이터 구축을 관리합니다.
 */

// 스크립트 실행 옵션
const options = {
  buildBeginner: false,    // 초급(15-11급) 빌드 여부
  buildIntermediate: true, // 중급(10-6급) 빌드 여부
  buildAdvanced: true,     // 고급(5-3급) 빌드 여부
  buildExpert: false,      // 전문가(2-1급) 빌드 여부
  updateMainDB: true,      // 전체 DB 업데이트 여부
  generateStats: true      // 통계 생성 여부
};

// 스크립트 경로
const scriptPaths = {
  beginnerScript: path.resolve(__dirname, './build_beginner_grades.js'),
  intermediateScript: path.resolve(__dirname, './build_intermediate_grades.js'),
  advancedScript: path.resolve(__dirname, './build_advanced_grades.js'),
  expertScript: path.resolve(__dirname, './build_expert_grades.js'),
  updateMainDBScript: path.resolve(__dirname, './update_main_hanja_db.js'),
  statsScript: path.resolve(__dirname, './generate_grade_stats.js')
};

// 디렉토리 경로
const gradeDataDir = path.resolve(__dirname, '../data/new-structure/characters/by-grade');

/**
 * 스크립트 존재 여부 확인 함수
 * @param {string} scriptPath - 스크립트 경로
 * @returns {boolean} 스크립트 존재 여부
 */
function checkScriptExists(scriptPath) {
  return fs.existsSync(scriptPath);
}

/**
 * 스크립트 실행 함수
 * @param {string} scriptPath - 실행할 스크립트 경로
 * @param {string} scriptName - 스크립트 이름 (로그용)
 */
function runScript(scriptPath, scriptName) {
  if (checkScriptExists(scriptPath)) {
    console.log(`\n[실행] ${scriptName} 스크립트 실행 중...`);
    try {
      execSync(`node ${scriptPath}`, { stdio: 'inherit' });
      console.log(`[완료] ${scriptName} 스크립트 실행 완료`);
      return true;
    } catch (error) {
      console.error(`[오류] ${scriptName} 스크립트 실행 중 오류 발생:`, error.message);
      return false;
    }
  } else {
    console.warn(`[경고] ${scriptPath} 스크립트 파일을 찾을 수 없습니다.`);
    return false;
  }
}

/**
 * 현재 급수별 데이터 상태 체크 함수
 */
function checkCurrentGradeStatus() {
  console.log('\n[상태 확인] 현재 급수별 데이터 파일 상태 확인 중...');
  
  const gradeStatus = {};
  
  // 1급부터 15급까지 확인
  for (let grade = 15; grade >= 1; grade--) {
    const filePath = path.join(gradeDataDir, `grade_${grade}.json`);
    
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const characterCount = data.characters ? data.characters.length : 0;
        const hasContent = characterCount > 0;
        
        gradeStatus[grade] = {
          exists: true,
          characterCount,
          hasContent,
          size: (fs.statSync(filePath).size / 1024).toFixed(2) + ' KB'
        };
      } catch (error) {
        gradeStatus[grade] = { exists: true, error: error.message };
      }
    } else {
      gradeStatus[grade] = { exists: false };
    }
  }
  
  // 결과 출력
  console.log('\n현재 급수별 데이터 파일 상태:');
  console.log('------------------------------');
  
  // 상태에 따른 출력 색상 (콘솔 로그용)
  for (let grade = 15; grade >= 1; grade--) {
    const status = gradeStatus[grade];
    const category = grade >= 11 ? '초급' : grade >= 6 ? '중급' : grade >= 3 ? '고급' : '전문가';
    
    if (!status.exists) {
      console.log(`${grade}급 (${category}): 파일 없음`);
    } else if (status.error) {
      console.log(`${grade}급 (${category}): 파일 오류 - ${status.error}`);
    } else if (!status.hasContent) {
      console.log(`${grade}급 (${category}): 데이터 없음 (빈 템플릿)`);
    } else {
      console.log(`${grade}급 (${category}): ${status.characterCount}자 (${status.size})`);
    }
  }
  
  console.log('------------------------------');
  return gradeStatus;
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('한자 데이터베이스 구축 통합 관리 스크립트 시작');
  console.log('==============================================');
  
  // 현재 상태 확인
  const currentStatus = checkCurrentGradeStatus();
  
  // 각 단계별 스크립트 실행
  const results = {
    beginner: false,
    intermediate: false,
    advanced: false,
    expert: false,
    mainDB: false,
    stats: false
  };
  
  // 초급 한자 빌드
  if (options.buildBeginner) {
    results.beginner = runScript(scriptPaths.beginnerScript, '초급 한자');
  }
  
  // 중급 한자 빌드
  if (options.buildIntermediate) {
    results.intermediate = runScript(scriptPaths.intermediateScript, '중급 한자');
  }
  
  // 고급 한자 빌드
  if (options.buildAdvanced) {
    results.advanced = runScript(scriptPaths.advancedScript, '고급 한자');
  }
  
  // 전문가 한자 빌드
  if (options.buildExpert) {
    results.expert = runScript(scriptPaths.expertScript, '전문가 한자');
  }
  
  // 메인 데이터베이스 업데이트
  if (options.updateMainDB) {
    results.mainDB = runScript(scriptPaths.updateMainDBScript, '메인 DB 업데이트');
  }
  
  // 통계 생성
  if (options.generateStats) {
    results.stats = runScript(scriptPaths.statsScript, '한자 통계 생성');
  }
  
  // 실행 결과 요약
  console.log('\n==============================================');
  console.log('데이터베이스 구축 결과 요약:');
  console.log(`초급 한자(15-11급): ${options.buildBeginner ? (results.beginner ? '성공' : '실패') : '건너뜀'}`);
  console.log(`중급 한자(10-6급): ${options.buildIntermediate ? (results.intermediate ? '성공' : '실패') : '건너뜀'}`);
  console.log(`고급 한자(5-3급): ${options.buildAdvanced ? (results.advanced ? '성공' : '실패') : '건너뜀'}`);
  console.log(`전문가 한자(2-1급): ${options.buildExpert ? (results.expert ? '성공' : '실패') : '건너뜀'}`);
  console.log(`메인 DB 업데이트: ${options.updateMainDB ? (results.mainDB ? '성공' : '실패') : '건너뜀'}`);
  console.log(`통계 생성: ${options.generateStats ? (results.stats ? '성공' : '실패') : '건너뜀'}`);
  
  // 최종 상태 확인
  console.log('\n[최종 상태 확인] 업데이트 후 급수별 데이터 파일 상태:');
  checkCurrentGradeStatus();
  
  console.log('\n한자 데이터베이스 구축 완료');
}

// 스크립트 실행
main().catch(error => {
  console.error('오류 발생:', error);
}); 