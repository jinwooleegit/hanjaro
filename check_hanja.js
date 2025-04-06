const fs = require('fs');

try {
  // 메인 데이터베이스 파일 사용
  const data = JSON.parse(fs.readFileSync('data/hanja_database_main.json', 'utf8'));
  
  // 레벨별 한자 수 확인
  const levels = data.hanja_database.basic.levels;
  
  console.log('한자 데이터베이스 현황:');
  console.log('------------------------');
  
  levels.forEach(level => {
    const charCount = level.characters ? level.characters.length : 0;
    console.log(`${level.name}: ${charCount}자`);
    console.log(`설명: ${level.description}`);
    console.log('------------------------');
  });
  
  // 총 한자 수 확인
  const totalChars = levels.reduce((total, level) => {
    return total + (level.characters ? level.characters.length : 0);
  }, 0);
  
  console.log(`총 한자 수: ${totalChars}자`);
  
} catch (error) {
  console.error('오류 발생:', error);
} 