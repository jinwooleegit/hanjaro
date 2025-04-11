/**
 * 한자 데이터베이스 통합 확충 스크립트
 * 전체 한자 데이터(3-15급)를 강화하고 메인 데이터베이스를 업데이트합니다.
 */

const { spawn } = require('child_process');
const path = require('path');

// 실행할 스크립트 목록
const enhancementScripts = [
  // 각 급수별 데이터 강화 스크립트
  'enhance_beginner_hanja.js',    // 초급(15-11급) 한자 강화
  'enhance_intermediate_hanja.js', // 중급(10-6급) 한자 강화
  'enhance_advanced_hanja.js',     // 고급(5-3급) 한자 강화
  
  // 데이터베이스 통합 및 통계 스크립트
  'update_main_hanja_db.js',      // 메인 데이터베이스 업데이트
  'generate_grade_stats.js'       // 통계 생성
];

/**
 * 스크립트 실행 함수
 * @param {string} scriptName 실행할 스크립트 이름
 * @returns {Promise<boolean>} 성공 여부
 */
function runScript(scriptName) {
  return new Promise((resolve) => {
    console.log(`\n======== 실행 중: ${scriptName} ========\n`);
    
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n${scriptName} 실행 완료.`);
        resolve(true);
      } else {
        console.error(`\n${scriptName} 실행 실패. 종료 코드: ${code}`);
        resolve(false);
      }
    });
    
    child.on('error', (error) => {
      console.error(`\n${scriptName} 실행 오류: ${error.message}`);
      resolve(false);
    });
  });
}

/**
 * 메인 실행 함수
 */
async function enhanceAllHanjaData() {
  console.log('한자 데이터베이스 확충 작업 시작...');
  
  let successCount = 0;
  let totalCount = enhancementScripts.length;
  
  // 각 스크립트 순차 실행
  for (const script of enhancementScripts) {
    const success = await runScript(script);
    if (success) {
      successCount++;
    }
  }
  
  // 결과 요약
  console.log('\n======== 데이터베이스 확충 작업 완료 ========');
  console.log(`총 ${totalCount}개 스크립트 중 ${successCount}개 성공`);
  
  if (successCount === totalCount) {
    console.log('\n모든 한자 데이터 확충 작업이 성공적으로 완료되었습니다.');
  } else {
    console.log('\n일부 스크립트 실행에 실패했습니다. 로그를 확인하세요.');
  }
}

// 스크립트 실행
enhanceAllHanjaData().catch(err => {
  console.error('오류 발생:', err);
  process.exit(1);
}); 