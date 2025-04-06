/**
 * 한자 필순 데이터 다운로드 유틸리티
 * 
 * HanziWriter CDN에서 한자 필순 데이터를 다운로드하여 로컬에 저장합니다.
 * 이 스크립트는 한자 데이터베이스에 있는 모든 한자에 대한 필순 데이터를 가져옵니다.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

// 비동기 함수로 변환
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// 데이터 저장 경로
const STROKE_DATA_DIR = path.join(process.cwd(), 'data', 'stroke_data');

/**
 * CDN에서 한자 필순 데이터를 가져오는 함수
 * @param {string} char - 한자
 * @returns {Promise<object>} - 필순 데이터 객체
 */
async function fetchStrokeData(char) {
  return new Promise((resolve, reject) => {
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodeURIComponent(char)}.json`;
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch data for ${char}: Status ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (err) {
          reject(new Error(`Failed to parse data for ${char}: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Request error for ${char}: ${err.message}`));
    });
  });
}

/**
 * 데이터베이스에서 모든 한자 추출
 * @returns {Promise<string[]>} - 한자 목록
 */
async function extractAllCharacters() {
  try {
    // 한자 데이터베이스 파일 로드
    const filePath = path.join(process.cwd(), 'data', 'hanja_database_fixed.json');
    const fileContent = await readFileAsync(filePath, 'utf8');
    const database = JSON.parse(fileContent);
    
    const characters = new Set();
    
    // basic 레벨에서 한자 추출
    if (database.basic && database.basic.levels) {
      Object.values(database.basic.levels).forEach(level => {
        if (level.characters) {
          level.characters.forEach(char => {
            characters.add(char.character);
          });
        }
      });
    }
    
    // advanced 레벨에서 한자 추출 (있을 경우)
    if (database.advanced && database.advanced.levels) {
      Object.values(database.advanced.levels).forEach(level => {
        if (level.characters) {
          level.characters.forEach(char => {
            characters.add(char.character);
          });
        }
      });
    }
    
    return [...characters];
  } catch (error) {
    console.error('Failed to extract characters from database:', error);
    return [];
  }
}

/**
 * 메인 함수: 모든 한자의 필순 데이터 다운로드
 */
async function downloadAllStrokeData() {
  try {
    // 저장 디렉토리 생성 (없을 경우)
    try {
      await mkdirAsync(STROKE_DATA_DIR, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // 모든 한자 추출
    const characters = await extractAllCharacters();
    console.log(`Found ${characters.length} unique characters in the database.`);
    
    // 다운로드 진행 상황 추적
    let successful = 0;
    let failed = 0;
    const failedChars = [];
    
    // 각 한자에 대한 필순 데이터 다운로드
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const filePath = path.join(STROKE_DATA_DIR, `${char}.json`);
      
      // 이미 있는 파일은 건너뛰기 (선택 사항)
      if (fs.existsSync(filePath)) {
        console.log(`Data for ${char} already exists. Skipping.`);
        successful++;
        continue;
      }
      
      try {
        console.log(`Downloading data for ${char} (${i + 1}/${characters.length})...`);
        const data = await fetchStrokeData(char);
        await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf8');
        successful++;
        
        // 요청 간 간격 두기 (서버 부하 방지)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to download data for ${char}:`, error.message);
        failed++;
        failedChars.push(char);
      }
    }
    
    console.log('\nDownload summary:');
    console.log(`Total characters: ${characters.length}`);
    console.log(`Successfully downloaded: ${successful}`);
    console.log(`Failed: ${failed}`);
    
    if (failedChars.length > 0) {
      console.log('Failed characters:', failedChars.join(', '));
      await writeFileAsync(
        path.join(STROKE_DATA_DIR, '_failed_characters.json'), 
        JSON.stringify(failedChars, null, 2), 
        'utf8'
      );
    }
  } catch (error) {
    console.error('An error occurred during the download process:', error);
  }
}

// 스크립트 실행
downloadAllStrokeData(); 