/**
 * 한자 데이터베이스 분할 스크립트
 * 
 * 이 스크립트는 대용량 hanja_database.json 파일을 카테고리별, 레벨별로 분할하여
 * 더 작은 JSON 파일들로 저장합니다. 이를 통해 데이터 로딩 속도와 메모리 사용량을 개선할 수 있습니다.
 */

const fs = require('fs');
const path = require('path');

// 디렉토리 경로 설정
const DATA_DIR = path.join(__dirname, '../data');
const SOURCE_FILE = path.join(DATA_DIR, 'hanja_database.json');
const CATEGORIES_DIR = path.join(DATA_DIR, 'categories');
const BASIC_DIR = path.join(DATA_DIR, 'basic');
const ADVANCED_DIR = path.join(DATA_DIR, 'advanced');

// 디렉토리 존재 확인 및 생성
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`디렉토리를 생성합니다: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

// 필요한 디렉토리 생성
[CATEGORIES_DIR, BASIC_DIR, ADVANCED_DIR].forEach(ensureDirectoryExists);

// 메인 함수
async function splitDatabase() {
  try {
    console.log('한자 데이터베이스 분할을 시작합니다...');
    
    // 데이터베이스 파일 읽기
    console.log(`데이터베이스 파일을 읽는 중: ${SOURCE_FILE}`);
    const database = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));
    
    // 메타데이터 파일 생성 (카테고리와 레벨 정보만 포함)
    const metadata = {
      categories: {}
    };
    
    // 각 카테고리 처리
    for (const categoryName of Object.keys(database)) {
      const category = database[categoryName];
      
      // 카테고리 메타데이터 저장
      metadata.categories[categoryName] = {
        name: category.name,
        description: category.description,
        total_characters: category.total_characters,
        levels: {}
      };
      
      // 카테고리 정보 (한자 데이터 제외) 저장
      const categoryInfo = {
        name: category.name,
        description: category.description,
        total_characters: category.total_characters,
        levels: {}
      };
      
      console.log(`카테고리 처리 중: ${categoryName}`);
      
      // 카테고리별 디렉토리 설정
      const categoryDir = categoryName === 'basic' ? BASIC_DIR : ADVANCED_DIR;
      
      // 각 레벨 처리
      for (const levelName of Object.keys(category.levels)) {
        const level = category.levels[levelName];
        
        // 레벨 메타데이터 저장
        metadata.categories[categoryName].levels[levelName] = {
          name: level.name,
          description: level.description,
          total_characters: level.characters.length
        };
        
        // 레벨 정보를 카테고리 정보에 추가
        categoryInfo.levels[levelName] = {
          name: level.name,
          description: level.description,
          total_characters: level.characters.length
        };
        
        // 레벨별 한자 데이터를 별도 파일로 저장
        const levelData = {
          name: level.name,
          description: level.description,
          characters: level.characters
        };
        
        const levelFilePath = path.join(categoryDir, `${levelName}.json`);
        fs.writeFileSync(levelFilePath, JSON.stringify(levelData, null, 2), 'utf8');
        console.log(`레벨 데이터 저장 완료: ${levelFilePath}`);
      }
      
      // 카테고리 정보 저장
      const categoryFilePath = path.join(CATEGORIES_DIR, `${categoryName}.json`);
      fs.writeFileSync(categoryFilePath, JSON.stringify(categoryInfo, null, 2), 'utf8');
      console.log(`카테고리 정보 저장 완료: ${categoryFilePath}`);
    }
    
    // 메타데이터 파일 저장
    const metadataFilePath = path.join(DATA_DIR, 'metadata.json');
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`메타데이터 저장 완료: ${metadataFilePath}`);
    
    console.log('데이터베이스 분할이 완료되었습니다!');
    console.log('\n사용 방법:');
    console.log('1. 전체 구조 정보: data/metadata.json');
    console.log('2. 카테고리 정보: data/categories/{categoryName}.json');
    console.log('3. 레벨별 한자 데이터: data/{categoryName}/{levelName}.json');
  } catch (error) {
    console.error('데이터베이스 분할 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

// 스크립트 실행
splitDatabase(); 