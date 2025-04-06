const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 로드
const filePath = path.join(__dirname, 'data', 'hanja_database_fixed.json');
let db;

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  db = JSON.parse(fileContent);
  console.log('데이터베이스 로드 성공');
} catch (error) {
  console.error('데이터베이스 로드 실패:', error);
  return;
}

// 레벨 구조 확인
console.log('기존 레벨 구조:', Object.keys(db.basic.levels));

// level7이 있고 level5가 없는 경우 변환
if (db.basic.levels.level7 && !db.basic.levels.level5) {
  console.log('level7을 level5로 변환합니다.');
  
  // level7에서 level5로 데이터 이동
  db.basic.levels.level5 = {
    name: "5단계 (중학교 1학년 수준)",
    description: db.basic.levels.level7.description,
    characters: []
  };
  
  // 문자 데이터 복사 및 레벨 변경
  if (db.basic.levels.level7.characters && db.basic.levels.level7.characters.length > 0) {
    db.basic.levels.level5.characters = db.basic.levels.level7.characters.map(char => ({
      ...char,
      level: 5  // 레벨 변경
    }));
  }
  
  // level7 삭제
  delete db.basic.levels.level7;
}

// level8이 있고 level6이 없는 경우 변환
if (db.basic.levels.level8 && !db.basic.levels.level6) {
  console.log('level8을 level6으로 변환합니다.');
  
  // level8에서 level6로 데이터 이동
  db.basic.levels.level6 = {
    name: "6단계 (중학교 2학년 수준)",
    description: db.basic.levels.level8.description,
    characters: []
  };
  
  // 문자 데이터 복사 및 레벨 변경
  if (db.basic.levels.level8.characters && db.basic.levels.level8.characters.length > 0) {
    db.basic.levels.level6.characters = db.basic.levels.level8.characters.map(char => ({
      ...char,
      level: 6  // 레벨 변경
    }));
  }
  
  // level8 삭제
  delete db.basic.levels.level8;
}

// 변경된 레벨 구조 확인
console.log('변경된 레벨 구조:', Object.keys(db.basic.levels));

// 파일 저장
fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
console.log(`데이터베이스가 다음 위치에 저장되었습니다: ${filePath}`);
console.log('서버를 재시작하세요.'); 