/**
 * 한자 데이터 체크 스크립트
 * 
 * 이 스크립트는 데이터 디렉토리에 있는 JSON 파일을 검사하여
 * 각 파일의 한자 개수를 보고합니다.
 */

const fs = require('fs');
const path = require('path');

// 디렉토리 경로 설정
const DATA_DIR = path.join(__dirname, '../data');
const BASIC_DIR = path.join(DATA_DIR, 'basic');
const ADVANCED_DIR = path.join(DATA_DIR, 'advanced');

// 메인 함수
function checkHanjaData() {
  console.log('한자 데이터 파일 확인을 시작합니다...\n');
  
  // 기본 한자 파일 확인
  console.log('=== 기본 한자 파일 확인 ===');
  checkDirectory(BASIC_DIR);
  
  // 고급 한자 파일 확인
  console.log('\n=== 고급 한자 파일 확인 ===');
  checkDirectory(ADVANCED_DIR);
  
  // 메인 데이터베이스 파일 확인
  console.log('\n=== 메인 데이터베이스 파일 확인 ===');
  const dbFile = path.join(DATA_DIR, 'hanja_database.json');
  if (fs.existsSync(dbFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      
      for (const category in data) {
        console.log(`카테고리: ${category} (선언된 총 한자 수: ${data[category].total_characters || '불명'})`);
        
        for (const level in data[category].levels) {
          const levelData = data[category].levels[level];
          const charCount = levelData.characters ? levelData.characters.length : 0;
          console.log(`  - ${level}: ${charCount}개 한자`);
        }
      }
    } catch (error) {
      console.error(`오류: ${dbFile} 파일을 처리할 수 없습니다: ${error.message}`);
    }
  } else {
    console.error(`오류: ${dbFile} 파일이 존재하지 않습니다.`);
  }
  
  console.log('\n데이터 확인이 완료되었습니다.');
}

// 디렉토리 내 JSON 파일 확인
function checkDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.error(`오류: ${directory} 디렉토리가 존재하지 않습니다.`);
    return;
  }
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(directory, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const charCount = data.characters ? data.characters.length : 0;
        
        console.log(`${file}: ${charCount}개 한자`);
        if (charCount <= 5) {
          console.log(`  ⚠️ 경고: 한자가 5개 이하입니다!`);
        }
      } catch (error) {
        console.error(`오류: ${filePath} 파일을 처리할 수 없습니다: ${error.message}`);
      }
    }
  }
}

// 스크립트 실행
checkHanjaData(); 