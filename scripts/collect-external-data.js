/**
 * 한자 외부 데이터 수집 스크립트
 * 다양한 외부 소스에서 한자 데이터를 수집하고 통합합니다.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const EXTERNAL_DATA_DIR = path.join(DATA_ROOT, 'external');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');

// 외부 데이터 소스 URL
const DATA_SOURCES = {
  unihan: {
    name: 'Unihan Database',
    url: 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip',
    description: '한중일 통합 한자 데이터베이스',
    processor: processUnihanData
  },
  krs: {
    name: '국립국어원 한자 자료',
    url: 'https://www.korean.go.kr/front/etcData/etcDataView.do?mn_id=46&etc_seq=71',
    description: '국립국어원 제공 한자 자료',
    processor: processKRSData
  }
};

// 디렉토리 생성 함수
function createDirectories() {
  const directories = [
    EXTERNAL_DATA_DIR,
    path.join(EXTERNAL_DATA_DIR, 'unihan'),
    path.join(EXTERNAL_DATA_DIR, 'krs')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`디렉토리 생성: ${dir}`);
    }
  });
}

// 파일 다운로드 함수
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    console.log(`파일 다운로드 중: ${url}`);
    
    const file = fs.createWriteStream(destination);
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`다운로드 실패: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`다운로드 완료: ${destination}`);
        resolve();
      });
      
    }).on('error', err => {
      fs.unlink(destination, () => {});
      reject(err);
    });
  });
}

// Unihan 데이터 처리 함수
async function processUnihanData() {
  console.log('Unihan 데이터 처리 중...');
  
  // 임의의 샘플 데이터 (실제로는 ZIP 파일 다운로드 및 추출 필요)
  const sampleData = {
    characters: [
      {
        unicode: 'U+4E00',
        character: '一',
        kDefinition: 'one; a, an; alone',
        kTotalStrokes: '1',
        kMandarin: 'yī',
        kJapaneseKun: 'HITO(TSU)',
        kJapaneseOn: 'ICHI, ITSU',
        kKorean: 'il'
      },
      {
        unicode: 'U+4E8C',
        character: '二',
        kDefinition: 'two; twice',
        kTotalStrokes: '2',
        kMandarin: 'èr',
        kJapaneseKun: 'FUTA(TSU)',
        kJapaneseOn: 'NI, JI',
        kKorean: 'i'
      }
    ]
  };
  
  const outputFile = path.join(EXTERNAL_DATA_DIR, 'unihan', 'unihan_data.json');
  fs.writeFileSync(outputFile, JSON.stringify(sampleData, null, 2), 'utf8');
  
  console.log(`Unihan 샘플 데이터 저장: ${outputFile}`);
  return sampleData;
}

// 국립국어원 한자 자료 처리 함수
async function processKRSData() {
  console.log('국립국어원 한자 자료 처리 중...');
  
  // 임의의 샘플 데이터 (실제로는 웹 스크래핑 또는 API 활용 필요)
  const sampleData = {
    characters: [
      {
        character: '가',
        radical: '口',
        stroke_count: 5,
        meaning: '더할 가',
        pronunciation: '가',
        grade: 6
      },
      {
        character: '각',
        radical: '角',
        stroke_count: 7,
        meaning: '뿔 각',
        pronunciation: '각',
        grade: 5
      }
    ]
  };
  
  const outputFile = path.join(EXTERNAL_DATA_DIR, 'krs', 'krs_data.json');
  fs.writeFileSync(outputFile, JSON.stringify(sampleData, null, 2), 'utf8');
  
  console.log(`국립국어원 샘플 데이터 저장: ${outputFile}`);
  return sampleData;
}

// 외부 데이터 통합 함수
function integrateExternalData() {
  console.log('외부 데이터 통합 중...');
  
  // 기존 한자 데이터 로드
  const existingDataPath = path.join(CHARACTERS_DIR, 'hanja_characters.json');
  let existingData = { characters: [] };
  
  try {
    if (fs.existsSync(existingDataPath)) {
      existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
    }
  } catch (error) {
    console.error('기존 데이터 로드 실패:', error);
  }
  
  // 유니코드 기준 매핑 생성
  const existingMap = {};
  existingData.characters.forEach(char => {
    if (char.unicode) {
      existingMap[char.unicode] = char;
    }
  });
  
  // Unihan 데이터 통합
  try {
    const unihanPath = path.join(EXTERNAL_DATA_DIR, 'unihan', 'unihan_data.json');
    if (fs.existsSync(unihanPath)) {
      const unihanData = JSON.parse(fs.readFileSync(unihanPath, 'utf8'));
      
      unihanData.characters.forEach(uniChar => {
        const unicode = uniChar.unicode.replace('U+', '');
        
        if (existingMap[unicode]) {
          // 기존 데이터 보강
          const char = existingMap[unicode];
          char.extended_data = char.extended_data || {};
          
          // Unihan 정보 추가
          char.extended_data.etymology = uniChar.kDefinition || char.extended_data.etymology;
          char.extended_data.pronunciation_guide = {
            mandarin: uniChar.kMandarin,
            japanese_kun: uniChar.kJapaneseKun,
            japanese_on: uniChar.kJapaneseOn,
            korean: uniChar.kKorean,
            ...char.extended_data.pronunciation_guide
          };
          
        } else {
          // 새 문자 추가 (내부 구조로 변환 필요)
          const newChar = {
            id: `HJ-EX-${unihanData.characters.indexOf(uniChar) + 1}-${unicode}`,
            character: uniChar.character,
            unicode: unicode,
            meaning: uniChar.kDefinition || '',
            pronunciation: uniChar.kKorean || '',
            stroke_count: parseInt(uniChar.kTotalStrokes) || 0,
            grade: 0, // 외부 데이터는 급수 미지정
            order: existingData.characters.length + 1,
            extended_data: {
              etymology: uniChar.kDefinition || '',
              pronunciation_guide: {
                mandarin: uniChar.kMandarin,
                japanese_kun: uniChar.kJapaneseKun,
                japanese_on: uniChar.kJapaneseOn,
                korean: uniChar.kKorean
              }
            }
          };
          
          existingData.characters.push(newChar);
          existingMap[unicode] = newChar;
        }
      });
    }
  } catch (error) {
    console.error('Unihan 데이터 통합 실패:', error);
  }
  
  // 국립국어원 데이터 통합
  try {
    const krsPath = path.join(EXTERNAL_DATA_DIR, 'krs', 'krs_data.json');
    if (fs.existsSync(krsPath)) {
      const krsData = JSON.parse(fs.readFileSync(krsPath, 'utf8'));
      
      krsData.characters.forEach(krsChar => {
        // 문자로 검색
        const found = existingData.characters.find(c => c.character === krsChar.character);
        
        if (found) {
          // 기존 데이터 보강
          found.radical = found.radical || krsChar.radical;
          found.stroke_count = found.stroke_count || krsChar.stroke_count;
          found.meaning = found.meaning || krsChar.meaning;
          found.pronunciation = found.pronunciation || krsChar.pronunciation;
          found.grade = found.grade || krsChar.grade;
        } else {
          // 새 문자 추가 (한글인 경우 다른 ID 형태 사용)
          const newChar = {
            id: `HJ-KR-${krsData.characters.indexOf(krsChar) + 1}`,
            character: krsChar.character,
            meaning: krsChar.meaning || '',
            pronunciation: krsChar.pronunciation || '',
            stroke_count: krsChar.stroke_count || 0,
            radical: krsChar.radical || '',
            grade: krsChar.grade || 0,
            order: existingData.characters.length + 1
          };
          
          existingData.characters.push(newChar);
        }
      });
    }
  } catch (error) {
    console.error('국립국어원 데이터 통합 실패:', error);
  }
  
  // 업데이트된 데이터 저장
  existingData.metadata = {
    ...existingData.metadata,
    last_updated: new Date().toISOString(),
    total_characters: existingData.characters.length,
    enriched_with: Object.keys(DATA_SOURCES).join(', ')
  };
  
  fs.writeFileSync(existingDataPath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log(`통합 데이터 저장 완료: ${existingDataPath} (${existingData.characters.length}자)`);
  
  // 확장 데이터 파일 업데이트
  const extendedDataPath = path.join(CHARACTERS_DIR, 'hanja_extended.json');
  fs.writeFileSync(extendedDataPath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log(`확장 데이터 업데이트 완료: ${extendedDataPath}`);
}

// 메인 실행 함수
async function main() {
  try {
    console.log('한자 외부 데이터 수집 시작...');
    
    // 1. 디렉토리 구조 생성
    createDirectories();
    
    // 2. 각 데이터 소스 처리
    for (const [key, source] of Object.entries(DATA_SOURCES)) {
      console.log(`${source.name} 데이터 처리 중...`);
      try {
        await source.processor();
      } catch (error) {
        console.error(`${source.name} 처리 실패:`, error);
      }
    }
    
    // 3. 수집한 데이터 통합
    integrateExternalData();
    
    console.log('한자 외부 데이터 수집 완료!');
  } catch (error) {
    console.error('데이터 수집 중 오류:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 