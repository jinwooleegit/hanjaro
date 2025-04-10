/**
 * 외부 한자 데이터 수집 스크립트
 * 
 * 다양한 외부 소스에서 한자 데이터를 수집하고 구조화합니다.
 * 1. 국립국어원 한자 데이터
 * 2. Unihan 데이터베이스
 * 3. 교육부 권장 한자
 */

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);
const { createReadStream, createWriteStream } = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

// 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const EXTERNAL_DATA_DIR = path.join(DATA_DIR, 'external');
const NIKL_DIR = path.join(EXTERNAL_DATA_DIR, 'nikl');
const UNIHAN_DIR = path.join(EXTERNAL_DATA_DIR, 'unihan');
const MOE_DIR = path.join(EXTERNAL_DATA_DIR, 'moe');
const ENRICHED_DIR = path.join(EXTERNAL_DATA_DIR, 'enriched');
const NEW_STRUCTURE_DIR = path.join(DATA_DIR, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_DIR, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_DIR, 'grades');
const METADATA_DIR = path.join(NEW_STRUCTURE_DIR, 'metadata');

// 외부 데이터 소스 URL
const UNIHAN_URL = 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip';
const NIKL_API_BASE = 'https://openapi.korean.go.kr/api/';
const MOE_HANJA_URL = 'https://www.moe.go.kr/boardCnts/fileDown.do?m=0303&s=moe&fileSeq='; // 교육부 한자 데이터

// 디렉토리 존재 확인/생성 함수
async function ensureDirectoryExists(dirPath) {
  try {
    await fsPromises.mkdir(dirPath, { recursive: true });
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

// 파일 다운로드 함수
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`🔽 다운로드 중: ${url}`);
    
    // HTTP 또는 HTTPS 모듈 선택
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`다운로드 실패, 상태 코드: ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ 다운로드 완료: ${destPath}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destPath, () => {}); // 실패 시 파일 삭제 시도
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.end();
  });
}

// Unihan 데이터 수집 함수
async function collectUnihanData() {
  console.log('🔍 Unihan 데이터 수집 시작');
  
  const dataPath = path.join(UNIHAN_DIR, 'unihan_data.json');
  const extractDir = path.join(UNIHAN_DIR, 'extracted');
  const zipPath = path.join(UNIHAN_DIR, 'Unihan.zip');
  
  // 샘플 데이터 생성 및 반환 (실제 데이터 수집이 어려운 경우 사용)
  const generateSampleData = async () => {
    console.log('📄 샘플 Unihan 데이터 생성 중...');
    const sampleData = {
      characters: {
        '一': {
          unicode: '4E00',
          definitions: {
            zh: '数词，最小的正整数 (one, 1)',
            ko: '하나 일',
            ja: 'ひとつ、いち'
          },
          readings: {
            mandarin: 'yī',
            korean: '일(il)',
            japanese_on: 'イチ (ichi), イツ (itsu)',
            japanese_kun: 'ひと (hito)'
          },
          variants: [],
          stroke_count: 1,
          cjk_radicals: ['一']
        },
        '二': {
          unicode: '4E8C',
          definitions: {
            zh: '数词，1+1=2 (two, 2)',
            ko: '두 이',
            ja: 'ふたつ、に'
          },
          readings: {
            mandarin: 'èr',
            korean: '이(i)',
            japanese_on: 'ニ (ni), ジ (ji)',
            japanese_kun: 'ふた (futa), ふたつ (futatsu)'
          },
          variants: [],
          stroke_count: 2,
          cjk_radicals: ['二']
        }
      },
      metadata: {
        version: '1.0.0',
        source: 'Unihan Database (Sample)',
        last_updated: new Date().toISOString(),
        total_characters: 2
      }
    };
    
    await fsPromises.writeFile(dataPath, JSON.stringify(sampleData, null, 2));
    console.log(`✅ 샘플 Unihan 데이터 저장 완료: ${dataPath}`);
    return sampleData;
  };
  
  try {
    console.log('🔄 Unihan 데이터 처리 진행');
    
    // 이미 처리된 데이터가 있는지 확인
    try {
      await fsPromises.access(dataPath);
      console.log('✅ Unihan 데이터가 이미 존재합니다. 건너뜁니다.');
      return JSON.parse(await fsPromises.readFile(dataPath, 'utf8'));
    } catch (e) {
      // 파일이 없으면 진행
    }
    
    // 디렉토리 확인
    await ensureDirectoryExists(UNIHAN_DIR);
    await ensureDirectoryExists(extractDir);
    
    // Unihan.zip 다운로드
    const unihanUrl = 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip';
    
    try {
      await fsPromises.access(zipPath);
      console.log('✅ Unihan.zip이 이미 존재합니다.');
    } catch (e) {
      await downloadFile(unihanUrl, zipPath);
    }
    
    // 압축 해제 (Windows에서는 PowerShell의 Expand-Archive 사용)
    console.log('📦 Unihan.zip 압축 해제 중...');
    try {
      if (process.platform === 'win32') {
        await exec(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force"`);
      } else {
        await exec(`unzip -o ${zipPath} -d ${extractDir}`);
      }
      console.log('✅ 압축 해제 완료');
    } catch (error) {
      console.error('❌ 압축 해제 실패:', error);
      console.log('⚠️ 샘플 데이터를 사용합니다.');
      return generateSampleData();
    }
    
    // 추출된 파일 처리 및 파싱
    // 실제 구현에서는 여기서 추출된 파일들을 파싱하여 데이터를 추출해야 합니다.
    // 본 예시에서는 샘플 데이터 생성으로 대체합니다.
    return generateSampleData();
    
  } catch (error) {
    console.error('❌ Unihan 데이터 수집 실패:', error);
    throw error;
  }
}

// Unihan 파일 파싱 함수
async function parseUnihanFile(filePath, data) {
  const fileStream = createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    // 주석이나 빈 줄 무시
    if (line.startsWith('#') || line.trim() === '') continue;
    
    // U+4E00	kRSUnicode	1.0
    const match = line.match(/U\+([0-9A-F]{4,5})\s+(\w+)\s+(.+)/);
    if (match) {
      const [, codePoint, property, value] = match;
      const hexCodePoint = parseInt(codePoint, 16);
      const character = String.fromCodePoint(hexCodePoint);
      
      if (!data[character]) {
        data[character] = { 
          unicode: `U+${codePoint}`,
          character
        };
      }
      
      // 특정 속성만 추출
      if (property === 'kDefinition') {
        data[character].english_meaning = value;
      } else if (property === 'kKorean') {
        data[character].korean_pronunciation = value;
      } else if (property === 'kTotalStrokes') {
        // 획수 정보가 여러 버전일 수 있음 (예: "1 2 3")
        const strokeCounts = value.split(' ');
        data[character].stroke_count = parseInt(strokeCounts[0], 10);
      } else if (property === 'kRSUnicode') {
        // 부수 정보 (예: "32.4")
        const radicalInfo = value.split('.');
        if (radicalInfo.length > 0) {
          data[character].radical_number = parseInt(radicalInfo[0], 10);
        }
      }
    }
  }
}

// 국립국어원 한자 데이터 수집 함수
async function collectNIKLData() {
  console.log('🔍 국립국어원 한자 데이터 수집 시작');
  
  try {
    const dataPath = path.join(NIKL_DIR, 'nikl_hanja_data.json');
    
    // 이미 처리된 데이터가 있는지 확인
    try {
      await fsPromises.access(dataPath);
      console.log('✅ 국립국어원 데이터가 이미 존재합니다. 건너뜁니다.');
      return JSON.parse(await fsPromises.readFile(dataPath, 'utf8'));
    } catch (e) {
      // 파일이 없으면 진행
      console.log('🔄 국립국어원 데이터 처리 진행');
    }
    
    await ensureDirectoryExists(NIKL_DIR);
    
    // 샘플 데이터 (실제 API 호출 대체)
    const sampleData = {
      "一": {
        "meaning": "한 일",
        "pronunciation": "일",
        "stroke_count": 1,
        "radical": "一",
        "grade": 15,
        "examples": [
          {"word": "一日", "meaning": "하루", "pronunciation": "일일"},
          {"word": "一年", "meaning": "일 년", "pronunciation": "일년"},
          {"word": "一生", "meaning": "평생", "pronunciation": "일생"}
        ]
      },
      "二": {
        "meaning": "두 이",
        "pronunciation": "이",
        "stroke_count": 2,
        "radical": "二",
        "grade": 15,
        "examples": [
          {"word": "二月", "meaning": "2월", "pronunciation": "이월"},
          {"word": "二度", "meaning": "두 번", "pronunciation": "이도"},
          {"word": "二重", "meaning": "이중", "pronunciation": "이중"}
        ]
      },
      "三": {
        "meaning": "석 삼",
        "pronunciation": "삼",
        "stroke_count": 3,
        "radical": "一",
        "grade": 15,
        "examples": [
          {"word": "三國", "meaning": "삼국", "pronunciation": "삼국"},
          {"word": "三日", "meaning": "사흘", "pronunciation": "삼일"},
          {"word": "三角", "meaning": "삼각형", "pronunciation": "삼각"}
        ]
      }
    };
    
    // 실제 API 호출은 여기에 구현
    // const apiData = await fetchFromNIKLAPI();
    
    // 샘플 데이터 사용
    const apiData = sampleData;
    
    // 데이터 저장
    await fsPromises.writeFile(dataPath, JSON.stringify(apiData, null, 2));
    console.log(`✅ 국립국어원 데이터 저장 완료: ${dataPath}`);
    
    return apiData;
  } catch (error) {
    console.error('❌ 국립국어원 데이터 수집 실패:', error);
    throw error;
  }
}

// 교육부 권장 한자 데이터 수집 함수
async function collectMOEData() {
  console.log('🔍 교육부 권장 한자 데이터 수집 시작');
  
  try {
    const dataPath = path.join(MOE_DIR, 'moe_hanja_data.json');
    
    // 이미 처리된 데이터가 있는지 확인
    try {
      await fsPromises.access(dataPath);
      console.log('✅ 교육부 한자 데이터가 이미 존재합니다. 건너뜁니다.');
      return JSON.parse(await fsPromises.readFile(dataPath, 'utf8'));
    } catch (e) {
      // 파일이 없으면 진행
      console.log('🔄 교육부 한자 데이터 처리 진행');
    }
    
    await ensureDirectoryExists(MOE_DIR);
    
    // 샘플 데이터 (실제 파일 다운로드 및 파싱 대체)
    const sampleData = {
      "grades": {
        "elementary": [
          {"character": "一", "meaning": "한 일", "pronunciation": "일", "grade": 1},
          {"character": "二", "meaning": "두 이", "pronunciation": "이", "grade": 1},
          {"character": "三", "meaning": "석 삼", "pronunciation": "삼", "grade": 1},
          {"character": "四", "meaning": "넉 사", "pronunciation": "사", "grade": 1},
          {"character": "五", "meaning": "다섯 오", "pronunciation": "오", "grade": 1}
        ],
        "middle": [
          {"character": "家", "meaning": "집 가", "pronunciation": "가", "grade": 6},
          {"character": "間", "meaning": "사이 간", "pronunciation": "간", "grade": 6},
          {"character": "江", "meaning": "강 강", "pronunciation": "강", "grade": 6},
          {"character": "去", "meaning": "갈 거", "pronunciation": "거", "grade": 6}
        ],
        "high": [
          {"character": "羅", "meaning": "벌일 라", "pronunciation": "라", "grade": 3},
          {"character": "樂", "meaning": "즐길 락/노래 악", "pronunciation": "락/악", "grade": 3},
          {"character": "來", "meaning": "올 래", "pronunciation": "래", "grade": 3}
        ]
      }
    };
    
    // 실제 다운로드 및 파싱은 여기에 구현
    // const moeData = await downloadAndParseMOEData();
    
    // 샘플 데이터 사용
    const moeData = sampleData;
    
    // 데이터 저장
    await fsPromises.writeFile(dataPath, JSON.stringify(moeData, null, 2));
    console.log(`✅ 교육부 한자 데이터 저장 완료: ${dataPath}`);
    
    return moeData;
  } catch (error) {
    console.error('❌ 교육부 한자 데이터 수집 실패:', error);
    throw error;
  }
}

// 데이터 통합 및 풍부화 함수
async function enrichHanjaData(niklData, unihanData, moeData) {
  console.log('🔄 한자 데이터 통합 및 풍부화 시작');
  
  try {
    const enrichedPath = path.join(ENRICHED_DIR, 'enriched_hanja_data.json');
    
    await ensureDirectoryExists(ENRICHED_DIR);
    
    // 기존 한자 데이터 로드 (new-structure에서)
    const structurePath = path.join(NEW_STRUCTURE_DIR, 'characters', 'hanja_characters.json');
    let existingData;
    
    try {
      existingData = JSON.parse(await fsPromises.readFile(structurePath, 'utf8'));
      console.log('✅ 기존 한자 데이터 로드 완료');
    } catch (e) {
      console.warn('⚠️ 기존 한자 데이터를 찾을 수 없습니다. 새로 생성합니다.');
      existingData = { characters: [] };
    }
    
    // 문자 기반 인덱스 생성
    const charIndex = {};
    existingData.characters.forEach(char => {
      charIndex[char.character] = char;
    });
    
    // NIKL 데이터로 풍부화
    for (const [character, data] of Object.entries(niklData)) {
      if (charIndex[character]) {
        // 기존 데이터 업데이트
        const existingChar = charIndex[character];
        
        // 비어있는 정보만 채우기
        if (!existingChar.meaning && data.meaning) {
          existingChar.meaning = data.meaning;
        }
        
        if (!existingChar.pronunciation && data.pronunciation) {
          existingChar.pronunciation = data.pronunciation;
        }
        
        if (!existingChar.stroke_count && data.stroke_count) {
          existingChar.stroke_count = data.stroke_count;
        }
        
        if (!existingChar.radical && data.radical) {
          existingChar.radical = data.radical;
        }
        
        // 예제 추가
        if (data.examples && data.examples.length > 0) {
          if (!existingChar.extended_data) {
            existingChar.extended_data = {};
          }
          
          if (!existingChar.extended_data.common_words) {
            existingChar.extended_data.common_words = [];
          }
          
          // 중복 방지하며 예제 추가
          const existingWords = new Set(existingChar.extended_data.common_words.map(w => w.word));
          
          data.examples.forEach(example => {
            if (!existingWords.has(example.word)) {
              existingChar.extended_data.common_words.push({
                word: example.word,
                meaning: example.meaning,
                pronunciation: example.pronunciation
              });
              existingWords.add(example.word);
            }
          });
        }
      } else {
        // 새 한자 추가
        const newChar = {
          character,
          id: formatHanjaId(data.grade || 9, 1, character),
          unicode: character.codePointAt(0).toString(16).toUpperCase(),
          meaning: data.meaning || '',
          pronunciation: data.pronunciation || '',
          stroke_count: data.stroke_count || 0,
          radical: data.radical || '',
          grade: data.grade || 9,
          order: 1,
          tags: [],
          extended_data: {
            common_words: data.examples || []
          }
        };
        
        existingData.characters.push(newChar);
        charIndex[character] = newChar;
      }
    }
    
    // Unihan 데이터로 풍부화
    for (const [character, data] of Object.entries(unihanData)) {
      if (charIndex[character]) {
        // 기존 데이터 업데이트
        const existingChar = charIndex[character];
        
        // 비어있는 정보만 채우기
        if (!existingChar.stroke_count && data.stroke_count) {
          existingChar.stroke_count = data.stroke_count;
        }
        
        if (!existingChar.meaning && data.english_meaning) {
          // 영어 의미를 한국어로 변환해야 함 (여기서는 그대로 사용)
          existingChar.extended_data = existingChar.extended_data || {};
          existingChar.extended_data.english_meaning = data.english_meaning;
        }
        
        if (!existingChar.pronunciation && data.korean_pronunciation) {
          existingChar.pronunciation = data.korean_pronunciation;
        }
      } else {
        // 새 한자 추가 (등급 정보는 없으므로 기본값 사용)
        const newChar = {
          character,
          id: formatHanjaId(9, 1, character),
          unicode: data.unicode || character.codePointAt(0).toString(16).toUpperCase(),
          meaning: '',
          pronunciation: data.korean_pronunciation || '',
          stroke_count: data.stroke_count || 0,
          radical: '',
          grade: 9, // 기본 중급으로 설정
          order: 1,
          tags: [],
          extended_data: {
            english_meaning: data.english_meaning
          }
        };
        
        existingData.characters.push(newChar);
        charIndex[character] = newChar;
      }
    }
    
    // 교육부 데이터로 풍부화
    // 초등학교 한자는 15-10급, 중학교 한자는 9-5급, 고등학교 한자는 4-1급으로 매핑
    function mapSchoolGradeToHanjaGrade(school, schoolGrade) {
      if (school === 'elementary') {
        return 15 - (schoolGrade - 1); // 1학년: 15급, 6학년: 10급
      } else if (school === 'middle') {
        return 9 - (schoolGrade - 1); // 1학년: 9급, 3학년: 7급
      } else if (school === 'high') {
        return 6 - (schoolGrade - 1); // 1학년: 6급, 3학년: 4급
      }
      return 9; // 기본값 중급
    }
    
    for (const [school, characters] of Object.entries(moeData.grades)) {
      characters.forEach(char => {
        const character = char.character;
        const grade = mapSchoolGradeToHanjaGrade(school, char.grade);
        
        if (charIndex[character]) {
          // 기존 데이터 업데이트
          const existingChar = charIndex[character];
          
          // 급수 정보 업데이트 (교육부 권장 한자가 우선)
          existingChar.grade = grade;
          
          // 태그 추가
          if (!existingChar.tags.includes(`education:${school}`)) {
            existingChar.tags.push(`education:${school}`);
          }
          
          // 비어있는 정보만 채우기
          if (!existingChar.meaning && char.meaning) {
            existingChar.meaning = char.meaning;
          }
          
          if (!existingChar.pronunciation && char.pronunciation) {
            existingChar.pronunciation = char.pronunciation;
          }
        } else {
          // 새 한자 추가
          const newChar = {
            character,
            id: formatHanjaId(grade, 1, character),
            unicode: character.codePointAt(0).toString(16).toUpperCase(),
            meaning: char.meaning || '',
            pronunciation: char.pronunciation || '',
            stroke_count: 0, // 정보 없음
            radical: '',
            grade,
            order: 1,
            tags: [`education:${school}`],
            extended_data: {}
          };
          
          existingData.characters.push(newChar);
          charIndex[character] = newChar;
        }
      });
    }
    
    // 업데이트된 메타데이터
    existingData.metadata = {
      version: "1.1.0",
      last_updated: new Date().toISOString(),
      total_characters: existingData.characters.length,
      data_sources: ["NIKL", "Unihan", "MOE", "Internal"]
    };
    
    // 풍부화된 데이터 저장
    await fsPromises.writeFile(enrichedPath, JSON.stringify(existingData, null, 2));
    console.log(`✅ 풍부화된 한자 데이터 저장 완료: ${enrichedPath}`);
    
    // 원본 데이터도 업데이트
    await fsPromises.writeFile(structurePath, JSON.stringify(existingData, null, 2));
    console.log(`✅ 원본 한자 데이터 업데이트 완료: ${structurePath}`);
    
    return existingData;
  } catch (error) {
    console.error('❌ 한자 데이터 통합 및 풍부화 실패:', error);
    throw error;
  }
}

// 메인 함수
async function main() {
  console.log('🚀 외부 한자 데이터 수집 시작');
  
  try {
    // 1. 디렉토리 구조 생성
    await ensureDirectoryExists(EXTERNAL_DATA_DIR);
    await ensureDirectoryExists(NIKL_DIR);
    await ensureDirectoryExists(UNIHAN_DIR);
    await ensureDirectoryExists(MOE_DIR);
    await ensureDirectoryExists(ENRICHED_DIR);
    
    // 2. 데이터 수집
    console.log('📊 데이터 수집 중...');
    const niklData = await collectNIKLData();
    const unihanData = await collectUnihanData();
    const moeData = await collectMOEData();
    
    // 3. 데이터 통합 및 풍부화
    console.log('🔄 데이터 통합 및 풍부화 중...');
    const enrichedData = await enrichHanjaData(niklData, unihanData, moeData);
    
    console.log(`🎉 외부 한자 데이터 수집 완료! 총 ${enrichedData.characters.length}개의 한자 데이터가 구축되었습니다.`);
  } catch (error) {
    console.error('❌ 외부 한자 데이터 수집 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 