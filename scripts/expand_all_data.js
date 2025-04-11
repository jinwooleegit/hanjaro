/**
 * 모든 급수 한자 데이터 확장 통합 스크립트
 * 3-15급의 한자 데이터를 확장하고 통계를 업데이트합니다.
 */

const { spawn } = require('child_process');
const path = require('path');

// 실행할 스크립트 목록 (1-2급 제외, 고급 5-3급까지만 유지)
const scripts = [
  // 고급 한자 (5-3급)
  'expand_grade_3_data.js',
  'expand_grade_4_data.js',
  'expand_grade_5_data.js',
  
  // 6-10급 (중급 한자)
  'expand_grade_6_data.js',
  'expand_grade_7_data.js',
  'expand_grade_8_data.js',
  'expand_grade_9_data.js',
  'expand_grade_10_data.js',
  
  // 11-15급 (초급 한자)
  'expand_grade_11_data.js',
  'expand_grade_12_data.js',
  'expand_grade_13_data.js',
  'expand_grade_14_data.js',
  'expand_grade_15_data.js',
  
  // 데이터베이스 업데이트 및 통계
  'update_main_hanja_db.js',
  'generate_grade_stats.js'
];

// 스크립트 순차 실행 함수
async function runScripts() {
  for (const script of scripts) {
    console.log(`\n======== Running ${script} ========\n`);
    
    try {
      await new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, script);
        const child = spawn('node', [scriptPath], { stdio: 'inherit' });
        
        child.on('close', (code) => {
          if (code === 0) {
            console.log(`\n${script} completed successfully.`);
            resolve();
          } else {
            console.error(`\n${script} failed with code ${code}.`);
            // 실패해도 다음 스크립트 진행
            resolve();
          }
        });
        
        child.on('error', (error) => {
          console.error(`\nError executing ${script}: ${error.message}`);
          // 실패해도 다음 스크립트 진행
          resolve();
        });
      });
    } catch (error) {
      console.error(`Error with ${script}: ${error.message}`);
      // 개별 스크립트 오류가 전체 과정을 중단하지 않도록 함
    }
  }
  
  console.log('\n======== All scripts executed ========\n');
}

// 메인 실행
runScripts().catch(error => {
  console.error(`Script execution error: ${error.message}`);
  process.exit(1);
}); 