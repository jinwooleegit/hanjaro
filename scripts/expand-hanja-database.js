/**
 * 한자 데이터베이스 확장 스크립트
 * 
 * 이 스크립트는 다음 작업을 수행합니다:
 * 1. 기존 레거시 데이터에서 새 형식으로 변환
 * 2. 공개 데이터 소스에서 추가 한자 데이터 수집
 * 3. 데이터 검증 및 정리
 * 4. 중앙 집중식 관리 구조로 저장
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const LEGACY_DB_PATH = path.join(DATA_ROOT, 'hanja_database.json');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_ROOT, 'grades');
const METADATA_DIR = path.join(NEW_STRUCTURE_ROOT, 'metadata');

// 유틸리티 함수들
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`디렉토리 생성: ${dir}`);
  }
}

function padGrade(grade) {
  return grade < 10 ? `0${grade}` : `${grade}`;
}

function formatId(grade, order, unicode) {
  const paddedGrade = padGrade(grade);
  const paddedOrder = order.toString().padStart(4, '0');
  return `HJ-${paddedGrade}-${paddedOrder}-${unicode}`;
}

// 한자 유니코드 획득
function getUnicode(character) {
  return character.codePointAt(0).toString(16).toUpperCase();
}

// 레거시 데이터에서 급수 정보 획득
const legacyGradeMap = {
  'basic': {
    'level1': 15,
    'level2': 14,
    'level3': 13,
    'level4': 12,
    'level5': 11,
    'level6': 10
  },
  'advanced': {
    'level1': 9,
    'level2': 8,
    'level3': 7
  },
  'university': {
    'level1': 6,
    'level2': 5,
    'level3': 4,
    'level4': 3
  }
  // 전문가 급수(2급, 1급)는 추가 예정
};

// 카테고리 정보 변환
const categoryMap = {
  'basic': 'beginner',
  'advanced': 'intermediate',
  'university': 'advanced',
  'expert': 'expert'
};

// 메인 함수 - 전체 프로세스 실행
async function main() {
  console.log('한자 데이터베이스 확장 작업 시작...');
  
  // 1. 디렉토리 구조 확인
  ensureDirectoryExists(NEW_STRUCTURE_ROOT);
  ensureDirectoryExists(CHARACTERS_DIR);
  ensureDirectoryExists(GRADES_DIR);
  ensureDirectoryExists(METADATA_DIR);
  
  // 2. 레거시 데이터 로드
  let legacyData;
  try {
    const legacyContent = fs.readFileSync(LEGACY_DB_PATH, 'utf-8');
    legacyData = JSON.parse(legacyContent);
    console.log('레거시 데이터 로드 완료');
  } catch (error) {
    console.error('레거시 데이터 로드 오류:', error);
    process.exit(1);
  }
  
  // 3. 급수별 데이터 생성
  await processGradeData(legacyData);
  
  // 4. 추가 데이터 수집 (외부 소스)
  await collectAdditionalData();
  
  // 5. 데이터 검증 및 통계
  validateAndGenerateStats();
  
  console.log('한자 데이터베이스 확장 작업 완료!');
}

// 레거시 데이터 처리 및 변환
async function processGradeData(legacyData) {
  console.log('급수별 데이터 처리 중...');
  
  // 급수별 처리 상황 추적
  const gradeStats = {};
  
  // 각 카테고리 및 레벨 처리
  for (const category in legacyData) {
    const categoryData = legacyData[category];
    if (!categoryData || !categoryData.levels) continue;
    
    for (const level in categoryData.levels) {
      const levelData = categoryData.levels[level];
      if (!levelData || !levelData.characters) continue;
      
      // 급수 정보 추출
      const gradeInfo = legacyGradeMap[category]?.[level];
      if (!gradeInfo) {
        console.log(`알 수 없는 카테고리/레벨 조합: ${category}/${level}`);
        continue;
      }
      
      const grade = gradeInfo;
      const gradeStr = grade.toString();
      const paddedGrade = padGrade(grade);
      
      // 급수별 데이터 초기화
      if (!gradeStats[gradeStr]) {
        gradeStats[gradeStr] = { total: 0, processed: 0 };
      }
      
      // 한자 처리
      const characterIds = [];
      for (let i = 0; i < levelData.characters.length; i++) {
        const char = levelData.characters[i];
        gradeStats[gradeStr].total++;
        
        // 기본 데이터 검증
        if (!char || !char.character) continue;
        
        // 한자 ID 생성
        const unicode = getUnicode(char.character);
        const order = i + 1;
        const id = formatId(grade, order, unicode);
        
        // 한자 데이터 구성
        const characterData = {
          id,
          character: char.character,
          unicode,
          grade,
          category: categoryMap[category] || 'beginner',
          order_in_grade: order,
          meaning: char.meaning || '',
          pronunciation: char.pronunciation || '',
          stroke_count: char.stroke_count || 0,
          radical: char.radical || '',
          radical_meaning: '',  // 추가 데이터 필요
          radical_pronunciation: '',  // 추가 데이터 필요
          mnemonics: '',  // 추가 데이터 필요
          examples: char.examples || [],
          compounds: [],  // 추가 데이터 필요
          similar_characters: [],  // 추가 데이터 필요
          stroke_order: [],  // 추가 데이터 필요
          audio_url: `/audio/${char.character}.mp3`,
          image_url: `/images/${char.character}.svg`,
          metadata: {
            version: '1.0.0',
            last_updated: new Date().toISOString(),
            source: 'Legacy Database',
            validated: false
          }
        };
        
        // 한자 데이터 파일 저장
        const charFilePath = path.join(CHARACTERS_DIR, `${id}.json`);
        
        // 이미 존재하는 파일은 스킵 (필요시 덮어쓰기 로직 추가 가능)
        if (!fs.existsSync(charFilePath)) {
          fs.writeFileSync(charFilePath, JSON.stringify(characterData, null, 2), 'utf-8');
          gradeStats[gradeStr].processed++;
        } else {
          gradeStats[gradeStr].processed++;
        }
        
        // 급수 데이터를 위한 ID 수집
        characterIds.push(id);
      }
      
      // 급수 데이터 생성
      const gradeData = {
        grade,
        name: `${grade}급`,
        description: levelData.description || `${grade}급 한자`,
        category: categoryMap[category] || 'beginner',
        character_count: characterIds.length,
        character_ids: characterIds,
        metadata: {
          version: '1.0.0',
          last_updated: new Date().toISOString(),
          source: 'Legacy Database',
          validated: false
        }
      };
      
      // 급수 데이터 파일 저장
      const gradeFilePath = path.join(GRADES_DIR, `grade_${gradeStr}.json`);
      fs.writeFileSync(gradeFilePath, JSON.stringify(gradeData, null, 2), 'utf-8');
      
      console.log(`${grade}급 데이터 처리 완료 - ${characterIds.length}개 한자`);
    }
  }
  
  // 처리 통계 출력
  console.log('급수별 처리 통계:');
  for (const grade in gradeStats) {
    console.log(`  ${grade}급: ${gradeStats[grade].processed}/${gradeStats[grade].total} 한자 처리됨`);
  }
}

// 외부 소스에서 추가 데이터 수집
async function collectAdditionalData() {
  console.log('추가 데이터 수집 중...');
  
  // 1. 부수 데이터 수집
  await collectRadicalData();
  
  // 2. 획순 데이터 수집
  await collectStrokeOrderData();
  
  // 3. 유사 한자 관계 구축
  buildSimilarCharactersData();
  
  // 4. 한자 관계 데이터 보강
  enrichCompoundData();
  
  console.log('추가 데이터 수집 완료');
}

// 부수 데이터 수집
async function collectRadicalData() {
  console.log('부수 데이터 수집 중...');
  
  // 기본 부수 데이터 (일부 예시)
  const basicRadicals = {
    '一': { meaning: '하나', pronunciation: '일' },
    '丨': { meaning: '막대기', pronunciation: '곤' },
    '丶': { meaning: '점', pronunciation: '주' },
    '亅': { meaning: '갈고리', pronunciation: '궐' },
    '二': { meaning: '두', pronunciation: '이' },
    '亠': { meaning: '돼지해머리', pronunciation: '두' },
    '人': { meaning: '사람', pronunciation: '인' },
    '儿': { meaning: '어진사람', pronunciation: '인' },
    '入': { meaning: '들', pronunciation: '입' },
    '八': { meaning: '여덟', pronunciation: '팔' },
    '冂': { meaning: '멀', pronunciation: '경' },
    '冖': { meaning: '덮을', pronunciation: '멱' },
    '冫': { meaning: '얼음', pronunciation: '빙' },
    '几': { meaning: '안석', pronunciation: '궤' },
    '凵': { meaning: '입벌릴', pronunciation: '감' },
    '刀': { meaning: '칼', pronunciation: '도' },
    '力': { meaning: '힘', pronunciation: '력' },
    '勹': { meaning: '쌀', pronunciation: '포' },
    '匕': { meaning: '비수', pronunciation: '비' },
    '匚': { meaning: '상자', pronunciation: '방' },
    '匸': { meaning: '숨을', pronunciation: '혜' },
    '十': { meaning: '열', pronunciation: '십' },
    '卜': { meaning: '점칠', pronunciation: '복' },
    '卩': { meaning: '봉인', pronunciation: '절' },
    '厂': { meaning: '기슭', pronunciation: '한' },
    '厶': { meaning: '사사로울', pronunciation: '사' }
  };
  
  // 부수 데이터 파일 저장
  const radicalsFilePath = path.join(METADATA_DIR, 'radicals.json');
  fs.writeFileSync(radicalsFilePath, JSON.stringify({
    version: '1.0.0',
    source: 'Hanjaro Original',
    last_updated: new Date().toISOString(),
    radicals: basicRadicals
  }, null, 2), 'utf-8');
  
  // 기존 한자 데이터에 부수 정보 추가
  const files = fs.readdirSync(CHARACTERS_DIR);
  
  let updatedCount = 0;
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(CHARACTERS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const charData = JSON.parse(fileContent);
    
    // 부수 정보가 있고, 부수 의미/발음이 없는 경우에만 업데이트
    if (charData.radical && (!charData.radical_meaning || !charData.radical_pronunciation)) {
      const radicalInfo = basicRadicals[charData.radical];
      if (radicalInfo) {
        charData.radical_meaning = radicalInfo.meaning;
        charData.radical_pronunciation = radicalInfo.pronunciation;
        
        // 업데이트 저장
        fs.writeFileSync(filePath, JSON.stringify(charData, null, 2), 'utf-8');
        updatedCount++;
      }
    }
  }
  
  console.log(`부수 데이터 수집 완료 - ${Object.keys(basicRadicals).length}개 부수 정보 수집, ${updatedCount}개 한자 업데이트`);
}

// 획순 데이터 수집
async function collectStrokeOrderData() {
  console.log('획순 데이터 수집 중...');
  
  // 획순 데이터 파일이 있는지 확인
  const strokeDataPath = path.join(DATA_ROOT, 'all_strokes.json');
  
  if (fs.existsSync(strokeDataPath)) {
    // 기존 획순 데이터 로드
    const strokeDataContent = fs.readFileSync(strokeDataPath, 'utf-8');
    const strokeData = JSON.parse(strokeDataContent);
    
    // 한자 파일 처리
    const files = fs.readdirSync(CHARACTERS_DIR);
    
    let updatedCount = 0;
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(CHARACTERS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const charData = JSON.parse(fileContent);
      
      // 획순 데이터가 비어있는 경우에만 업데이트
      if (!charData.stroke_order || charData.stroke_order.length === 0) {
        const characterStrokeData = strokeData[charData.character];
        if (characterStrokeData) {
          charData.stroke_order = characterStrokeData;
          
          // 업데이트 저장
          fs.writeFileSync(filePath, JSON.stringify(charData, null, 2), 'utf-8');
          updatedCount++;
        }
      }
    }
    
    console.log(`획순 데이터 수집 완료 - ${updatedCount}개 한자 업데이트`);
  } else {
    console.log('획순 데이터 파일이 없습니다. 이 단계를 건너뜁니다.');
  }
}

// 유사 한자 관계 구축
function buildSimilarCharactersData() {
  console.log('유사 한자 관계 구축 중...');
  
  // 모든 한자 데이터 로드
  const files = fs.readdirSync(CHARACTERS_DIR);
  const allCharacters = [];
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(CHARACTERS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const charData = JSON.parse(fileContent);
    
    allCharacters.push({
      id: charData.id,
      character: charData.character,
      radical: charData.radical,
      stroke_count: charData.stroke_count,
      grade: charData.grade
    });
  }
  
  // 유사 한자 관계 구축
  let updatedCount = 0;
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(CHARACTERS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const charData = JSON.parse(fileContent);
    
    // 유사 한자 찾기 (같은 부수나 획수가 비슷한 한자)
    if (!charData.similar_characters || charData.similar_characters.length === 0) {
      const similarChars = allCharacters.filter(other => 
        other.id !== charData.id && (
          other.radical === charData.radical || 
          Math.abs(other.stroke_count - charData.stroke_count) <= 1
        )
      ).slice(0, 5); // 최대 5개
      
      if (similarChars.length > 0) {
        charData.similar_characters = similarChars.map(similar => ({
          id: similar.id,
          character: similar.character,
          similarity_type: similar.radical === charData.radical ? 'radical' : 'stroke_count'
        }));
        
        // 업데이트 저장
        fs.writeFileSync(filePath, JSON.stringify(charData, null, 2), 'utf-8');
        updatedCount++;
      }
    }
  }
  
  console.log(`유사 한자 관계 구축 완료 - ${updatedCount}개 한자 업데이트`);
}

// 한자 관계 데이터 보강
function enrichCompoundData() {
  console.log('한자 관계 데이터 보강 중...');
  
  // 모든 한자 예문 데이터 수집
  const files = fs.readdirSync(CHARACTERS_DIR);
  const charExamples = {};
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(CHARACTERS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const charData = JSON.parse(fileContent);
    
    // 예문에서 사용된 다른 한자 추출
    if (charData.examples && charData.examples.length > 0) {
      charExamples[charData.character] = {
        id: charData.id,
        compounds: new Set()
      };
      
      // 모든 예문에서 단어 수집
      for (const example of charData.examples) {
        if (example.word) {
          for (const ch of example.word) {
            // 한자이고 현재 한자가 아니면 추가
            if (/[\u4e00-\u9fff]/.test(ch) && ch !== charData.character) {
              charExamples[charData.character].compounds.add(ch);
            }
          }
        }
      }
    }
  }
  
  // 관계 데이터로 한자 정보 보강
  let updatedCount = 0;
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(CHARACTERS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const charData = JSON.parse(fileContent);
    
    // 복합어 관계가 없는 경우에만 업데이트
    if (!charData.compounds || charData.compounds.length === 0) {
      const charExampleData = charExamples[charData.character];
      
      if (charExampleData && charExampleData.compounds.size > 0) {
        // 관련 한자 ID 찾기
        const compounds = [];
        
        for (const compoundChar of charExampleData.compounds) {
          // 해당 한자의 ID 찾기
          for (const otherFile of files) {
            if (!otherFile.endsWith('.json')) continue;
            
            const otherFilePath = path.join(CHARACTERS_DIR, otherFile);
            const otherFileContent = fs.readFileSync(otherFilePath, 'utf-8');
            const otherCharData = JSON.parse(otherFileContent);
            
            if (otherCharData.character === compoundChar) {
              compounds.push({
                id: otherCharData.id,
                character: compoundChar,
                relationship: 'compound'
              });
              break;
            }
          }
        }
        
        if (compounds.length > 0) {
          charData.compounds = compounds;
          
          // 업데이트 저장
          fs.writeFileSync(filePath, JSON.stringify(charData, null, 2), 'utf-8');
          updatedCount++;
        }
      }
    }
  }
  
  console.log(`한자 관계 데이터 보강 완료 - ${updatedCount}개 한자 업데이트`);
}

// 데이터 검증 및 통계 생성
function validateAndGenerateStats() {
  console.log('데이터 검증 및 통계 생성 중...');
  
  const stats = {
    total_characters: 0,
    by_grade: {},
    by_category: {},
    completion_rates: {},
    missing_fields: {}
  };
  
  // 모든 한자 파일 검사
  const files = fs.readdirSync(CHARACTERS_DIR);
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(CHARACTERS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let charData;
    
    try {
      charData = JSON.parse(fileContent);
    } catch (error) {
      console.error(`JSON 파싱 오류 (${file}):`, error);
      continue;
    }
    
    // 기본 통계
    stats.total_characters++;
    
    // 급수별 통계
    const grade = charData.grade.toString();
    if (!stats.by_grade[grade]) {
      stats.by_grade[grade] = 0;
    }
    stats.by_grade[grade]++;
    
    // 카테고리별 통계
    const category = charData.category;
    if (!stats.by_category[category]) {
      stats.by_category[category] = 0;
    }
    stats.by_category[category]++;
    
    // 필드별 완성도 검사
    const requiredFields = [
      'id', 'character', 'unicode', 'grade', 'category', 'order_in_grade',
      'meaning', 'pronunciation', 'stroke_count', 'radical'
    ];
    
    const optionalFields = [
      'radical_meaning', 'radical_pronunciation', 'mnemonics', 
      'examples', 'compounds', 'similar_characters', 'stroke_order', 
      'audio_url', 'image_url'
    ];
    
    // 필수 필드 검사
    for (const field of requiredFields) {
      if (!charData[field]) {
        if (!stats.missing_fields[field]) {
          stats.missing_fields[field] = 0;
        }
        stats.missing_fields[field]++;
      }
    }
    
    // 선택 필드 완성도
    for (const field of optionalFields) {
      if (!stats.completion_rates[field]) {
        stats.completion_rates[field] = { total: 0, count: 0 };
      }
      
      stats.completion_rates[field].total++;
      
      // 배열 필드는 길이 확인, 그 외는 존재 여부 확인
      if (Array.isArray(charData[field])) {
        if (charData[field].length > 0) {
          stats.completion_rates[field].count++;
        }
      } else if (charData[field]) {
        stats.completion_rates[field].count++;
      }
    }
  }
  
  // 완성도 백분율 계산
  for (const field in stats.completion_rates) {
    const rate = stats.completion_rates[field];
    stats.completion_rates[field] = {
      count: rate.count,
      total: rate.total,
      percentage: Math.round((rate.count / rate.total) * 100)
    };
  }
  
  // 통계 파일 저장
  const statsFilePath = path.join(METADATA_DIR, 'database_stats.json');
  fs.writeFileSync(statsFilePath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats
  }, null, 2), 'utf-8');
  
  // 통계 정보 출력
  console.log('데이터베이스 통계:');
  console.log(`  전체 한자 수: ${stats.total_characters}`);
  console.log('  급수별 한자 수:');
  for (const grade in stats.by_grade) {
    console.log(`    ${grade}급: ${stats.by_grade[grade]}개`);
  }
  console.log('  카테고리별 한자 수:');
  for (const category in stats.by_category) {
    console.log(`    ${category}: ${stats.by_category[category]}개`);
  }
  console.log('  필드별 완성도:');
  for (const field in stats.completion_rates) {
    const rate = stats.completion_rates[field];
    console.log(`    ${field}: ${rate.percentage}% (${rate.count}/${rate.total})`);
  }
  
  console.log('데이터 검증 및 통계 생성 완료');
}

// 스크립트 실행
main().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
}); 