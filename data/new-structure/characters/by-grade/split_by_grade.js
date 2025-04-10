const fs = require('fs');
const path = require('path');

try {
  // 원본 데이터 파일 경로
  const sourceFilePath = path.resolve(__dirname, '..', 'hanja_extended.json');
  
  // 결과물을 저장할 디렉토리
  const outputDir = __dirname;
  
  console.log(`Reading data from: ${sourceFilePath}`);
  
  // 원본 데이터 읽기
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`Source file not found: ${sourceFilePath}`);
  }
  
  const rawData = fs.readFileSync(sourceFilePath, 'utf8');
  console.log(`File read successfully, parsing JSON...`);
  
  const data = JSON.parse(rawData);
  console.log(`Total characters in source: ${data.characters.length}`);
  
  // 급수별로 데이터 분리
  const gradeMap = {};
  
  // 각 한자를 급수별로 분류
  data.characters.forEach(character => {
    const grade = character.grade;
    if (!gradeMap[grade]) {
      gradeMap[grade] = [];
    }
    gradeMap[grade].push(character);
  });
  
  console.log(`Found characters for ${Object.keys(gradeMap).length} different grades`);
  
  // 각 급수별로 파일 생성
  Object.keys(gradeMap).forEach(grade => {
    const gradeData = {
      metadata: {
        version: data.metadata.version,
        last_updated: data.metadata.last_updated,
        total_characters: gradeMap[grade].length,
        data_source: data.metadata.data_source,
        grade: parseInt(grade)
      },
      characters: gradeMap[grade]
    };
  
    const outputFilePath = path.join(outputDir, `grade_${grade}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(gradeData, null, 2), 'utf8');
    console.log(`Grade ${grade} data saved to ${outputFilePath} (${gradeMap[grade].length} characters)`);
  });
  
  console.log('Data split complete!');
} catch (error) {
  console.error('Error:', error.message);
} 