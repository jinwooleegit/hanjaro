/**
 * 외부 소스에서 한자 데이터 수집 스크립트
 * 
 * 이 스크립트는 다음 작업을 수행합니다:
 * 1. 국립국어원 한자 정보 (https://www.korean.go.kr/)
 * 2. Unihan 데이터베이스 (Unicode)
 * 3. 교육부 권장 한자 목록
 * 4. 기타 공개 데이터 소스
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { parse: csvParse } = require('csv-parse/sync');

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_ROOT, 'grades');
const METADATA_DIR = path.join(NEW_STRUCTURE_ROOT, 'metadata');
const EXTERNAL_DATA_DIR = path.join(DATA_ROOT, 'external');

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

// 메인 함수 - 전체 프로세스 실행
async function main() {
  console.log('외부 소스에서 한자 데이터 수집 시작...');
  
  // 디렉토리 구조 확인
  ensureDirectoryExists(NEW_STRUCTURE_ROOT);
  ensureDirectoryExists(CHARACTERS_DIR);
  ensureDirectoryExists(GRADES_DIR);
  ensureDirectoryExists(METADATA_DIR);
  ensureDirectoryExists(EXTERNAL_DATA_DIR);
  
  // 데이터 수집 및 처리
  const collectedData = {
    koreanGovData: await collectKoreanGovData(),
    unihanData: await collectUnihanData(),
    educationData: await collectEducationData()
  };
  
  // 수집한 데이터 병합 및 정리
  const mergedData = mergeExternalData(collectedData);
  
  // 새 한자 데이터 생성 또는 기존 데이터 보강
  await enrichHanjaData(mergedData);
  
  console.log('외부 소스에서 한자 데이터 수집 완료!');
}

// 국립국어원 한자 데이터 수집
async function collectKoreanGovData() {
  const koreanGovDataPath = path.join(EXTERNAL_DATA_DIR, 'korean_gov_hanja.json');
  
  // 이미 수집한 데이터가 있는지 확인
  if (fs.existsSync(koreanGovDataPath)) {
    console.log('기존 국립국어원 데이터 파일 사용');
    return JSON.parse(fs.readFileSync(koreanGovDataPath, 'utf-8'));
  }
  
  console.log('국립국어원 한자 데이터 수집 중...');
  
  // 실제 구현에서는 웹 크롤링 또는 API 호출을 통해 데이터 수집
  // 이 예시에서는 샘플 데이터 사용
  const sampleData = {
    source: '국립국어원 한자사전',
    version: '1.0.0',
    last_updated: new Date().toISOString(),
    characters: {
      '一': {
        meaning: '한 일',
        pronunciation: '일',
        radical: '一',
        stroke_count: 1,
        examples: [
          { word: '一日', meaning: '하루', pronunciation: '일일' },
          { word: '一年', meaning: '일 년', pronunciation: '일년' },
          { word: '第一', meaning: '제일', pronunciation: '제일' }
        ],
        mnemonics: '하나를 의미하는 가장 기본적인 가로획입니다.'
      },
      '二': {
        meaning: '두 이',
        pronunciation: '이',
        radical: '二',
        stroke_count: 2,
        examples: [
          { word: '二日', meaning: '이틀', pronunciation: '이일' },
          { word: '二月', meaning: '2월', pronunciation: '이월' },
          { word: '二十', meaning: '스물', pronunciation: '이십' }
        ],
        mnemonics: '두 개의 가로획으로, 두 개를 의미합니다.'
      },
      '三': {
        meaning: '석 삼',
        pronunciation: '삼',
        radical: '一',
        stroke_count: 3,
        examples: [
          { word: '三日', meaning: '사흘', pronunciation: '삼일' },
          { word: '三月', meaning: '3월', pronunciation: '삼월' },
          { word: '三國', meaning: '삼국', pronunciation: '삼국' }
        ],
        mnemonics: '세 개의 가로획으로, 셋을 의미합니다.'
      }
      // ... 더 많은 한자 데이터
    }
  };
  
  // 수집한 데이터 파일 저장
  fs.writeFileSync(koreanGovDataPath, JSON.stringify(sampleData, null, 2), 'utf-8');
  
  console.log(`국립국어원 한자 데이터 수집 완료 - ${Object.keys(sampleData.characters).length}개 한자`);
  return sampleData;
}

// Unihan 데이터베이스 수집
async function collectUnihanData() {
  const unihanDataPath = path.join(EXTERNAL_DATA_DIR, 'unihan_data.json');
  
  // 이미 수집한 데이터가 있는지 확인
  if (fs.existsSync(unihanDataPath)) {
    console.log('기존 Unihan 데이터 파일 사용');
    return JSON.parse(fs.readFileSync(unihanDataPath, 'utf-8'));
  }
  
  console.log('Unihan 데이터베이스 수집 중...');
  
  // Unihan 데이터 다운로드 및 파싱하는 실제 구현
  // 이 예시에서는 샘플 데이터 사용
  const sampleData = {
    source: 'Unihan Database',
    version: '14.0.0',
    last_updated: new Date().toISOString(),
    characters: {
      '一': {
        unicode: '4E00',
        mandarin: 'yī',
        cantonese: 'jat1',
        japanese: 'ichi',
        korean: 'il',
        stroke_count: 1,
        definition: 'one; 1; single; a (article)',
        frequency: 5
      },
      '二': {
        unicode: '4E8C',
        mandarin: 'èr',
        cantonese: 'ji6',
        japanese: 'ni',
        korean: 'i',
        stroke_count: 2,
        definition: 'two; 2; twice',
        frequency: 5
      },
      '三': {
        unicode: '4E09',
        mandarin: 'sān',
        cantonese: 'saam1',
        japanese: 'san',
        korean: 'sam',
        stroke_count: 3,
        definition: 'three; 3; several; repeatedly',
        frequency: 5
      }
      // ... 더 많은 한자 데이터
    }
  };
  
  // 수집한 데이터 파일 저장
  fs.writeFileSync(unihanDataPath, JSON.stringify(sampleData, null, 2), 'utf-8');
  
  console.log(`Unihan 데이터베이스 수집 완료 - ${Object.keys(sampleData.characters).length}개 한자`);
  return sampleData;
}

// 교육부 권장 한자 목록 수집
async function collectEducationData() {
  const educationDataPath = path.join(EXTERNAL_DATA_DIR, 'education_hanja.json');
  
  // 이미 수집한 데이터가 있는지 확인
  if (fs.existsSync(educationDataPath)) {
    console.log('기존 교육부 한자 데이터 파일 사용');
    return JSON.parse(fs.readFileSync(educationDataPath, 'utf-8'));
  }
  
  console.log('교육부 권장 한자 데이터 수집 중...');
  
  // 교육부 데이터 수집 실제 구현
  // 이 예시에서는 샘플 데이터 사용
  const sampleData = {
    source: '교육부 권장 한자',
    version: '1.0.0',
    last_updated: new Date().toISOString(),
    grades: {
      'elementary': {
        description: '초등학교 권장 한자',
        characters: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      },
      'middle': {
        description: '중학교 권장 한자',
        characters: ['百', '千', '萬', '父', '母', '兄', '弟', '姉', '妹', '子']
      },
      'high': {
        description: '고등학교 권장 한자',
        characters: ['天', '地', '人', '山', '川', '海', '林', '田', '水', '火']
      }
    }
  };
  
  // 수집한 데이터 파일 저장
  fs.writeFileSync(educationDataPath, JSON.stringify(sampleData, null, 2), 'utf-8');
  
  console.log('교육부 권장 한자 데이터 수집 완료');
  return sampleData;
}

// 수집한 데이터 병합
function mergeExternalData(collectedData) {
  console.log('수집한 데이터 병합 중...');
  
  const { koreanGovData, unihanData, educationData } = collectedData;
  const mergedCharacters = {};
  
  // 국립국어원 데이터 처리
  if (koreanGovData && koreanGovData.characters) {
    for (const [char, data] of Object.entries(koreanGovData.characters)) {
      if (!mergedCharacters[char]) {
        mergedCharacters[char] = { sources: [] };
      }
      
      mergedCharacters[char].korean_gov = data;
      mergedCharacters[char].sources.push('korean_gov');
    }
  }
  
  // Unihan 데이터 처리
  if (unihanData && unihanData.characters) {
    for (const [char, data] of Object.entries(unihanData.characters)) {
      if (!mergedCharacters[char]) {
        mergedCharacters[char] = { sources: [] };
      }
      
      mergedCharacters[char].unihan = data;
      mergedCharacters[char].sources.push('unihan');
    }
  }
  
  // 교육부 데이터 처리
  if (educationData && educationData.grades) {
    for (const [grade, data] of Object.entries(educationData.grades)) {
      if (data.characters) {
        for (const char of data.characters) {
          if (!mergedCharacters[char]) {
            mergedCharacters[char] = { sources: [] };
          }
          
          if (!mergedCharacters[char].education) {
            mergedCharacters[char].education = { grades: [] };
          }
          
          mergedCharacters[char].education.grades.push(grade);
          
          if (!mergedCharacters[char].sources.includes('education')) {
            mergedCharacters[char].sources.push('education');
          }
        }
      }
    }
  }
  
  // 병합된 데이터 파일 저장
  const mergedDataPath = path.join(EXTERNAL_DATA_DIR, 'merged_external_data.json');
  fs.writeFileSync(mergedDataPath, JSON.stringify({
    version: '1.0.0',
    last_updated: new Date().toISOString(),
    characters: mergedCharacters
  }, null, 2), 'utf-8');
  
  console.log(`데이터 병합 완료 - ${Object.keys(mergedCharacters).length}개 한자`);
  return mergedCharacters;
}

// 한자 데이터 보강
async function enrichHanjaData(mergedData) {
  console.log('한자 데이터 보강 중...');
  
  // 기존 한자 파일 목록
  const existingFiles = fs.readdirSync(CHARACTERS_DIR)
    .filter(file => file.endsWith('.json'));
  
  // 기존 급수 데이터 목록
  const gradeFiles = fs.readdirSync(GRADES_DIR)
    .filter(file => file.startsWith('grade_') && file.endsWith('.json'));
  
  const gradeData = {};
  for (const file of gradeFiles) {
    const filePath = path.join(GRADES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    gradeData[data.grade] = data;
  }
  
  // 한자 업데이트 또는 생성
  let updatedCount = 0;
  let newCount = 0;
  
  for (const [char, data] of Object.entries(mergedData)) {
    const unicode = getUnicode(char);
    
    // 이미 존재하는 파일 찾기
    const existingFile = existingFiles.find(file => {
      // HJ-XX-XXXX-UNICODE 형식에서 유니코드 부분 추출
      const fileUnicode = file.split('-')[3].split('.')[0];
      return fileUnicode === unicode;
    });
    
    if (existingFile) {
      // 기존 파일 업데이트
      const filePath = path.join(CHARACTERS_DIR, existingFile);
      const content = fs.readFileSync(filePath, 'utf-8');
      const charData = JSON.parse(content);
      
      let updated = false;
      
      // 국립국어원 데이터로 보강
      if (data.korean_gov) {
        if (!charData.radical_meaning && data.korean_gov.radical_meaning) {
          charData.radical_meaning = data.korean_gov.radical_meaning;
          updated = true;
        }
        
        if (!charData.mnemonics && data.korean_gov.mnemonics) {
          charData.mnemonics = data.korean_gov.mnemonics;
          updated = true;
        }
        
        if ((!charData.examples || charData.examples.length === 0) && data.korean_gov.examples) {
          charData.examples = data.korean_gov.examples;
          updated = true;
        }
      }
      
      // Unihan 데이터로 보강
      if (data.unihan) {
        if (!charData.frequency && data.unihan.frequency) {
          charData.frequency = data.unihan.frequency;
          updated = true;
        }
        
        if (!charData.definition && data.unihan.definition) {
          charData.definition = data.unihan.definition;
          updated = true;
        }
      }
      
      // 업데이트된 경우에만 파일 저장
      if (updated) {
        charData.metadata.last_updated = new Date().toISOString();
        fs.writeFileSync(filePath, JSON.stringify(charData, null, 2), 'utf-8');
        updatedCount++;
      }
    } else {
      // 새 한자 파일 생성
      // 급수 결정 (교육부 데이터 또는 기본값)
      let grade = 0;
      let category = '';
      
      if (data.education && data.education.grades.length > 0) {
        // 교육부 데이터 기반 급수 설정
        const eduGrade = data.education.grades[0];
        if (eduGrade === 'elementary') {
          grade = 15; // 초등학교
          category = 'beginner';
        } else if (eduGrade === 'middle') {
          grade = 10; // 중학교
          category = 'intermediate';
        } else if (eduGrade === 'high') {
          grade = 5;  // 고등학교
          category = 'advanced';
        }
      } else {
        // 기본 급수 설정
        grade = 1;  // 최상위 급수
        category = 'expert';
      }
      
      // 해당 급수에 추가
      if (!gradeData[grade]) {
        // 새 급수 데이터 생성
        gradeData[grade] = {
          grade,
          name: `${grade}급`,
          description: `${grade}급 한자`,
          category,
          character_count: 0,
          character_ids: [],
          metadata: {
            version: '1.0.0',
            last_updated: new Date().toISOString(),
            source: 'External Data Collection',
            validated: false
          }
        };
      }
      
      // 한자 순서 결정
      const order = gradeData[grade].character_count + 1;
      const id = formatId(grade, order, unicode);
      
      // 새 한자 데이터 생성
      const newCharData = {
        id,
        character: char,
        unicode,
        grade,
        category,
        order_in_grade: order,
        meaning: data.korean_gov?.meaning || '',
        pronunciation: data.korean_gov?.pronunciation || '',
        stroke_count: data.korean_gov?.stroke_count || data.unihan?.stroke_count || 0,
        radical: data.korean_gov?.radical || '',
        radical_meaning: data.korean_gov?.radical_meaning || '',
        radical_pronunciation: '',
        mnemonics: data.korean_gov?.mnemonics || '',
        examples: data.korean_gov?.examples || [],
        compounds: [],
        similar_characters: [],
        stroke_order: [],
        audio_url: `/audio/${char}.mp3`,
        image_url: `/images/${char}.svg`,
        frequency: data.unihan?.frequency || 0,
        definition: data.unihan?.definition || '',
        metadata: {
          version: '1.0.0',
          last_updated: new Date().toISOString(),
          source: data.sources.join(','),
          validated: false
        }
      };
      
      // 파일 저장
      const newFilePath = path.join(CHARACTERS_DIR, `${id}.json`);
      fs.writeFileSync(newFilePath, JSON.stringify(newCharData, null, 2), 'utf-8');
      
      // 급수 데이터 업데이트
      gradeData[grade].character_ids.push(id);
      gradeData[grade].character_count++;
      gradeData[grade].metadata.last_updated = new Date().toISOString();
      
      newCount++;
    }
  }
  
  // 업데이트된 급수 데이터 저장
  for (const [grade, data] of Object.entries(gradeData)) {
    const gradeFilePath = path.join(GRADES_DIR, `grade_${grade}.json`);
    fs.writeFileSync(gradeFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }
  
  console.log(`한자 데이터 보강 완료 - ${updatedCount}개 업데이트, ${newCount}개 새로 추가`);
}

// 스크립트 실행
main().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
}); 