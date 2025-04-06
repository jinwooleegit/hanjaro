const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 로드
const filePath = path.join(__dirname, 'data', 'hanja_database_fixed.json');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileContent);
  
  console.log('데이터베이스 로드 성공');
  console.log('레벨 구조:', Object.keys(db.basic.levels));
  
  // level5 데이터 확인
  if (db.basic.levels.level5) {
    const level5Data = db.basic.levels.level5;
    console.log('\nlevel5 정보:');
    console.log('이름:', level5Data.name);
    console.log('설명:', level5Data.description);
    console.log('문자 수:', level5Data.characters ? level5Data.characters.length : 0);
    
    // 샘플 데이터 출력
    if (level5Data.characters && level5Data.characters.length > 0) {
      console.log('\n첫 번째 문자 샘플:');
      console.log(JSON.stringify(level5Data.characters[0], null, 2));
    } else {
      console.log('level5에 문자 데이터가 없습니다.');
    }
  } else {
    console.log('level5가 데이터베이스에 존재하지 않습니다.');
  }
} catch (error) {
  console.error('데이터베이스 처리 중 오류 발생:', error);
} 