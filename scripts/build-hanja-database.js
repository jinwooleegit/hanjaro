/**
 * 한자 데이터베이스 구축 스크립트
 * 
 * 기존 데이터를 새로운 관계형 구조로 변환하여 저장합니다.
 * 핵심 기능:
 * 1. 한자 데이터를 중앙 집중식으로 관리
 * 2. 관계형 데이터 구조 구현 (ID 기반)
 * 3. 성능 최적화를 위한 데이터 분할
 * 4. 메타데이터 확충
 */

const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_DIR = path.join(DATA_DIR, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_DIR, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_DIR, 'grades');
const METADATA_DIR = path.join(NEW_STRUCTURE_DIR, 'metadata');
const RELATIONS_DIR = path.join(NEW_STRUCTURE_DIR, 'relations');
const CATEGORIES_DIR = path.join(NEW_STRUCTURE_DIR, 'categories');
const BY_GRADE_DIR = path.join(CHARACTERS_DIR, 'by-grade');

// 디렉토리 존재 확인/생성 함수
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`✅ 디렉토리 생성 또는 확인 완료: ${dirPath}`);
  } catch (error) {
    console.error(`❌ 디렉토리 생성 실패: ${dirPath}`, error);
    throw error;
  }
}

// ID 포맷팅 (ID 관련 유틸리티)
function formatHanjaId(grade, order, character) {
  const gradeStr = grade.toString().padStart(2, '0');
  const orderStr = order.toString().padStart(4, '0');
  const unicode = character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  return `HJ-${gradeStr}-${orderStr}-${unicode}`;
}

// 모든 디렉토리 생성 함수
async function createDirectories() {
  console.log('🏗️ 디렉토리 구조 생성 중...');
  await ensureDirectoryExists(NEW_STRUCTURE_DIR);
  await ensureDirectoryExists(CHARACTERS_DIR);
  await ensureDirectoryExists(BY_GRADE_DIR);
  await ensureDirectoryExists(GRADES_DIR);
  await ensureDirectoryExists(METADATA_DIR);
  await ensureDirectoryExists(RELATIONS_DIR);
  await ensureDirectoryExists(CATEGORIES_DIR);
  console.log('✅ 모든 디렉토리 생성 완료');
}

// 기존 데이터 로드 함수
async function loadExistingData() {
  console.log('📂 기존 데이터 로드 중...');
  
  try {
    // 기본 한자 데이터베이스 로드
    const hanjaDbPath = path.join(DATA_DIR, 'hanja_database.json');
    const hanjaDbData = JSON.parse(await fs.readFile(hanjaDbPath, 'utf8'));
    
    // 급수별 데이터 로드 (초급 1~6, 중급 1~2, 전문가 1~4)
    const basicLevels = {};
    const advancedLevels = {};
    const expertLevels = {};
    
    for (let level = 1; level <= 6; level++) {
      const filePath = path.join(DATA_DIR, 'basic', `level${level}.json`);
      basicLevels[level] = JSON.parse(await fs.readFile(filePath, 'utf8'));
    }
    
    for (let level = 1; level <= 4; level++) {
      try {
        const filePath = path.join(DATA_DIR, 'advanced', `level${level}.json`);
        advancedLevels[level] = JSON.parse(await fs.readFile(filePath, 'utf8'));
      } catch (error) {
        console.warn(`⚠️ 고급 레벨 ${level} 데이터를 찾을 수 없습니다.`);
      }
    }
    
    for (let level = 1; level <= 4; level++) {
      try {
        const filePath = path.join(DATA_DIR, 'university', `level${level}.json`);
        expertLevels[level] = JSON.parse(await fs.readFile(filePath, 'utf8'));
      } catch (error) {
        console.warn(`⚠️ 전문가 레벨 ${level} 데이터를 찾을 수 없습니다.`);
      }
    }
    
    // 획순 데이터 로드
    const strokesPath = path.join(DATA_DIR, 'all_strokes.json');
    const strokesData = JSON.parse(await fs.readFile(strokesPath, 'utf8'));
    
    // 메타데이터 로드
    const metadataPath = path.join(DATA_DIR, 'metadata.json');
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
    
    console.log('✅ 기존 데이터 로드 완료');
    
    return {
      hanjaDb: hanjaDbData,
      basicLevels,
      advancedLevels,
      expertLevels,
      strokes: strokesData,
      metadata
    };
  } catch (error) {
    console.error('❌ 데이터 로드 실패:', error);
    throw error;
  }
}

// 한자 등급별 매핑 (level -> grade)
const levelToGradeMap = {
  'beginner': {
    'level1': 15,
    'level2': 14,
    'level3': 13,
    'level4': 12,
    'level5': 11,
    'level6': 10
  },
  'intermediate': {
    'level1': 9,
    'level2': 8,
    'level3': 7,
    'level4': 6,
    'level5': 5
  },
  'advanced': {
    'level1': 4,
    'level2': 3,
    'level3': 2
  },
  'expert': {
    'level1': 1
  }
};

// 카테고리별 등급 매핑 생성
function createCategoryGradeMapping() {
  return {
    'beginner': { 
      name: '초급', 
      description: '한자 학습 입문 단계', 
      grades: [15, 14, 13, 12, 11, 10]
    },
    'intermediate': { 
      name: '중급', 
      description: '중급 수준의 한자 학습', 
      grades: [9, 8, 7, 6, 5]
    },
    'advanced': { 
      name: '고급', 
      description: '고급 수준의 한자 학습', 
      grades: [4, 3, 2]
    },
    'expert': { 
      name: '전문가', 
      description: '전문가 수준의 한자 학습', 
      grades: [1]
    }
  };
}

// 한자 데이터 변환 함수
async function transformHanjaData(existingData) {
  console.log('🔄 한자 데이터 변환 중...');
  
  const { hanjaDb, basicLevels, advancedLevels, expertLevels, strokes, metadata } = existingData;
  
  // 모든 한자를 저장할 배열
  const allCharacters = [];
  
  // 급수별 한자 ID 목록
  const gradeCharacterIds = {};
  for (let grade = 1; grade <= 15; grade++) {
    gradeCharacterIds[grade] = [];
  }
  
  // 기본 한자 데이터 처리
  const processHanjaData = (levelData, categoryName, levelNumber) => {
    if (!levelData || !levelData.characters) return;
    
    // 급수 매핑 결정
    let grade = 0;
    if (categoryName === 'beginner') {
      grade = levelToGradeMap.beginner[`level${levelNumber}`] || 15;
    } else if (categoryName === 'intermediate') {
      grade = levelToGradeMap.intermediate[`level${levelNumber}`] || 10;
    } else if (categoryName === 'advanced') {
      grade = levelToGradeMap.advanced[`level${levelNumber}`] || 4;
    } else if (categoryName === 'expert') {
      grade = levelToGradeMap.expert.level1 || 1;
    }
    
    // 각 한자 처리
    for (const char of levelData.characters) {
      // 획순 정보 추가
      const strokeInfo = strokes[char.character] || { strokes: [] };
      
      // ID 생성
      const id = formatHanjaId(grade, char.order || 1, char.character);
      
      // 태그 생성
      const tags = char.tags || [];
      if (char.radical) tags.push(`radical:${char.radical}`);
      if (char.stroke_count) tags.push(`strokes:${char.stroke_count}`);
      
      // 변환된 데이터 생성
      const transformedChar = {
        id,
        character: char.character,
        unicode: char.character.codePointAt(0).toString(16).toUpperCase(),
        meaning: char.meaning || '',
        pronunciation: char.pronunciation || '',
        stroke_count: char.stroke_count || 0,
        radical: char.radical || '',
        grade,
        order: char.order || 1,
        tags,
        extended_data: {
          detailed_meaning: char.detailed_meaning || char.meaning || '',
          etymology: char.etymology || '',
          mnemonics: char.mnemonics || '',
          common_words: char.examples || [],
          example_sentences: char.example_sentences || [],
          cultural_notes: char.cultural_notes || '',
          pronunciation_guide: char.pronunciation_guide || '',
          stroke_order: {
            description: char.stroke_description || '',
            directions: strokeInfo.strokes || []
          },
          related_characters: char.related_characters || []
        }
      };
      
      // 배열에 추가
      allCharacters.push(transformedChar);
      
      // 급수별 ID 추가
      if (grade >= 1 && grade <= 15) {
        gradeCharacterIds[grade].push(id);
      }
    }
  };
  
  // 기본 레벨 처리
  if (hanjaDb && hanjaDb.basic && hanjaDb.basic.levels) {
    for (const [levelName, levelData] of Object.entries(hanjaDb.basic.levels)) {
      const levelNumber = parseInt(levelName.replace('level', ''));
      processHanjaData(levelData, 'beginner', levelNumber);
    }
  }
  
  // 또는 직접 basicLevels에서 처리
  for (const [levelNumber, levelData] of Object.entries(basicLevels)) {
    processHanjaData(levelData, 'beginner', parseInt(levelNumber));
  }
  
  // 고급 레벨 처리
  for (const [levelNumber, levelData] of Object.entries(advancedLevels)) {
    processHanjaData(levelData, 'advanced', parseInt(levelNumber));
  }
  
  // 전문가 레벨 처리
  for (const [levelNumber, levelData] of Object.entries(expertLevels)) {
    processHanjaData(levelData, 'expert', parseInt(levelNumber));
  }
  
  // 급수별 한자 정보 생성
  const gradeInfo = {};
  const categoryInfo = createCategoryGradeMapping();
  
  for (let grade = 1; grade <= 15; grade++) {
    const ids = gradeCharacterIds[grade];
    let category = '';
    let categoryName = '';
    
    // 카테고리 결정
    if (grade >= 10 && grade <= 15) {
      category = 'beginner';
      categoryName = '초급';
    } else if (grade >= 5 && grade <= 9) {
      category = 'intermediate';
      categoryName = '중급';
    } else if (grade >= 2 && grade <= 4) {
      category = 'advanced';
      categoryName = '고급';
    } else if (grade === 1) {
      category = 'expert';
      categoryName = '전문가';
    }
    
    gradeInfo[grade] = {
      grade,
      name: `${grade}급`,
      description: `${categoryName} ${grade}급 한자`,
      category,
      character_count: ids.length,
      character_ids: ids,
      metadata: {
        version: "1.0.0",
        last_updated: new Date().toISOString()
      }
    };
  }
  
  console.log('✅ 한자 데이터 변환 완료');
  return { characters: allCharacters, grades: gradeInfo, categories: categoryInfo };
}

// 변환된 데이터 저장 함수
async function saveTransformedData(transformedData) {
  console.log('💾 변환된 데이터 저장 중...');
  
  try {
    const { characters, grades, categories } = transformedData;
    
    // 전체 한자 데이터 저장
    const allCharactersPath = path.join(CHARACTERS_DIR, 'hanja_characters.json');
    await fs.writeFile(
      allCharactersPath, 
      JSON.stringify({ 
        metadata: { 
          version: "1.0.0", 
          last_updated: new Date().toISOString(),
          total_characters: characters.length 
        }, 
        characters 
      }, null, 2)
    );
    console.log(`✅ 전체 한자 데이터 저장 완료: ${allCharactersPath}`);
    
    // 급수별 한자 데이터 저장
    for (let grade = 1; grade <= 15; grade++) {
      const gradeCharacters = characters.filter(char => char.grade === grade);
      const gradeDataPath = path.join(BY_GRADE_DIR, `grade_${grade}.json`);
      
      await fs.writeFile(
        gradeDataPath,
        JSON.stringify({
          metadata: {
            version: "1.0.0",
            last_updated: new Date().toISOString(),
            grade,
            total_characters: gradeCharacters.length
          },
          characters: gradeCharacters
        }, null, 2)
      );
      
      console.log(`✅ ${grade}급 한자 데이터 저장 완료: ${gradeDataPath}`);
    }
    
    // 급수 정보 저장
    for (let grade = 1; grade <= 15; grade++) {
      const gradeInfoPath = path.join(GRADES_DIR, `grade_${grade}.json`);
      await fs.writeFile(
        gradeInfoPath,
        JSON.stringify(grades[grade], null, 2)
      );
      
      console.log(`✅ ${grade}급 정보 저장 완료: ${gradeInfoPath}`);
    }
    
    // 카테고리 정보 저장
    for (const [category, info] of Object.entries(categories)) {
      const categoryPath = path.join(CATEGORIES_DIR, `${category}.json`);
      
      // 급수별 세부 정보 추가
      const gradeDetails = info.grades.map(g => ({
        grade: g,
        name: grades[g].name,
        character_count: grades[g].character_count,
        description: grades[g].description
      }));
      
      await fs.writeFile(
        categoryPath,
        JSON.stringify({
          id: category,
          name: info.name,
          description: info.description,
          grades: info.grades,
          grade_details: gradeDetails,
          metadata: {
            version: "1.0.0",
            last_updated: new Date().toISOString()
          }
        }, null, 2)
      );
      
      console.log(`✅ ${info.name} 카테고리 정보 저장 완료: ${categoryPath}`);
    }
    
    // 관계 데이터 생성 및 저장
    const relations = {
      radical_relations: {},
      similar_shape: {},
      similar_pronunciation: {},
      compound_words: {}
    };
    
    // 획수 기반 관계 생성
    const strokeCountGroups = {};
    characters.forEach(char => {
      const count = char.stroke_count;
      if (!strokeCountGroups[count]) strokeCountGroups[count] = [];
      strokeCountGroups[count].push(char.id);
    });
    
    // 부수 기반 관계 생성
    const radicalGroups = {};
    characters.forEach(char => {
      const radical = char.radical;
      if (radical) {
        if (!radicalGroups[radical]) radicalGroups[radical] = [];
        radicalGroups[radical].push(char.id);
      }
    });
    
    // 발음 기반 관계 생성
    const pronunciationGroups = {};
    characters.forEach(char => {
      const pron = char.pronunciation;
      if (pron) {
        if (!pronunciationGroups[pron]) pronunciationGroups[pron] = [];
        pronunciationGroups[pron].push(char.id);
      }
    });
    
    // 관계 데이터 구축
    characters.forEach(char => {
      // 부수 관계
      if (char.radical) {
        relations.radical_relations[char.id] = radicalGroups[char.radical].filter(id => id !== char.id);
      }
      
      // 형태 유사 관계 (같은 획수의 한자들)
      relations.similar_shape[char.id] = strokeCountGroups[char.stroke_count]?.filter(id => id !== char.id) || [];
      
      // 발음 유사 관계
      relations.similar_pronunciation[char.id] = pronunciationGroups[char.pronunciation]?.filter(id => id !== char.id) || [];
      
      // 관련 복합어 (extended_data에서 추출)
      relations.compound_words[char.id] = char.extended_data?.common_words?.map(word => ({
        word: word.word,
        meaning: word.meaning,
        pronunciation: word.pronunciation
      })) || [];
    });
    
    // 관계 정보 저장
    const relationsPath = path.join(RELATIONS_DIR, 'hanja_relations.json');
    await fs.writeFile(
      relationsPath,
      JSON.stringify(relations, null, 2)
    );
    console.log(`✅ 한자 관계 데이터 저장 완료: ${relationsPath}`);
    
    // 메타데이터 저장
    // 1. 부수 정보
    const radicals = Array.from(new Set(characters.map(char => char.radical).filter(Boolean)));
    const radicalsData = {
      metadata: {
        version: "1.0.0",
        last_updated: new Date().toISOString(),
        total_radicals: radicals.length
      },
      radicals: radicals.map(radical => ({
        radical,
        character_count: radicalGroups[radical]?.length || 0,
        character_ids: radicalGroups[radical] || []
      }))
    };
    
    const radicalsPath = path.join(METADATA_DIR, 'radicals.json');
    await fs.writeFile(
      radicalsPath,
      JSON.stringify(radicalsData, null, 2)
    );
    console.log(`✅ 부수 메타데이터 저장 완료: ${radicalsPath}`);
    
    // 2. 획수 정보
    const strokeCounts = Array.from(new Set(characters.map(char => char.stroke_count).filter(Boolean)));
    const strokesData = {
      metadata: {
        version: "1.0.0",
        last_updated: new Date().toISOString(),
        total_stroke_counts: strokeCounts.length
      },
      stroke_counts: strokeCounts.sort((a, b) => a - b).map(count => ({
        count,
        character_count: strokeCountGroups[count]?.length || 0,
        character_ids: strokeCountGroups[count] || []
      }))
    };
    
    const strokesPath = path.join(METADATA_DIR, 'strokes.json');
    await fs.writeFile(
      strokesPath,
      JSON.stringify(strokesData, null, 2)
    );
    console.log(`✅ 획수 메타데이터 저장 완료: ${strokesPath}`);
    
    // 3. 발음 정보
    const pronunciations = Array.from(new Set(characters.map(char => char.pronunciation).filter(Boolean)));
    const pronunciationsData = {
      metadata: {
        version: "1.0.0",
        last_updated: new Date().toISOString(),
        total_pronunciations: pronunciations.length
      },
      pronunciations: pronunciations.sort().map(pron => ({
        pronunciation: pron,
        character_count: pronunciationGroups[pron]?.length || 0,
        character_ids: pronunciationGroups[pron] || []
      }))
    };
    
    const pronunciationsPath = path.join(METADATA_DIR, 'pronunciations.json');
    await fs.writeFile(
      pronunciationsPath,
      JSON.stringify(pronunciationsData, null, 2)
    );
    console.log(`✅ 발음 메타데이터 저장 완료: ${pronunciationsPath}`);
    
    console.log('✅ 모든 데이터 저장 완료');
  } catch (error) {
    console.error('❌ 데이터 저장 실패:', error);
    throw error;
  }
}

// 메인 함수
async function main() {
  console.log('🚀 한자 데이터베이스 구축 시작');
  
  try {
    // 1. 디렉토리 구조 생성
    await createDirectories();
    
    // 2. 기존 데이터 로드
    const existingData = await loadExistingData();
    
    // 3. 데이터 변환
    const transformedData = await transformHanjaData(existingData);
    
    // 4. 변환된 데이터 저장
    await saveTransformedData(transformedData);
    
    console.log('🎉 한자 데이터베이스 구축 완료!');
  } catch (error) {
    console.error('❌ 한자 데이터베이스 구축 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 