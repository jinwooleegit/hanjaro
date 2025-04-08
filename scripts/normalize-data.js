// scripts/normalize-data.js
// 한자 데이터 정규화 및 정리 스크립트

const fs = require('fs');
const path = require('path');

/**
 * 모든 한자 데이터 파일을 단일 파일로 통합
 */
async function normalizeHanjaData() {
  console.log('🔄 한자 데이터 정규화 시작...');
  
  // 이미 만든 메인 데이터베이스 파일 사용
  const targetFile = 'data/hanja_database_main.json';
  
  try {
    const fileExists = fs.existsSync(targetFile);
    if (!fileExists) {
      console.log(`⚠️ 파일을 찾을 수 없습니다: ${targetFile}`);
      return [];
    }
    
    const fileContent = fs.readFileSync(targetFile, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (!data.characters || !Array.isArray(data.characters)) {
      console.log(`⚠️ 유효하지 않은 데이터 형식: ${targetFile}`);
      return [];
    }
    
    console.log(`✅ 데이터 로드 완료: ${targetFile} (${data.characters.length}개 항목)`);
    return data.characters;
  } catch (error) {
    console.error(`❌ 파일 처리 오류 (${targetFile}):`, error);
    return [];
  }
}

/**
 * 카테고리 데이터 정규화 및 한자 데이터와의 일관성 확인
 */
async function normalizeCategoryData(hanjaData) {
  console.log('🔄 카테고리 데이터 정규화 시작...');
  
  const categoryFile = 'data/categories.json';
  const hanjaSet = new Set(hanjaData.map(item => item.character));
  
  try {
    const fileExists = fs.existsSync(categoryFile);
    if (!fileExists) {
      console.log(`⚠️ 파일을 찾을 수 없습니다: ${categoryFile}`);
      return;
    }
    
    const fileContent = fs.readFileSync(categoryFile, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (!data.categories || !Array.isArray(data.categories)) {
      console.log('⚠️ 유효하지 않은 카테고리 데이터 형식');
      return;
    }
    
    console.log(`✅ 카테고리 데이터 로드 완료: ${data.categories.length}개 카테고리`);
    
    // 카테고리 데이터 검증 및 정리
    let allLevelIds = new Set();
    let missingCharacters = [];
    
    for (const category of data.categories) {
      if (!category.levels || !Array.isArray(category.levels)) {
        console.log(`⚠️ 카테고리 '${category.id}'에 유효한 레벨 데이터가 없습니다.`);
        continue;
      }
      
      for (const level of category.levels) {
        // 레벨 ID 중복 확인
        if (allLevelIds.has(level.id)) {
          console.log(`⚠️ 중복된 레벨 ID: ${level.id}`);
        }
        allLevelIds.add(level.id);
        
        // 한자 존재 여부 확인
        if (level.characters && Array.isArray(level.characters)) {
          for (const char of level.characters) {
            if (!hanjaSet.has(char)) {
              missingCharacters.push({ character: char, level: level.id, category: category.id });
            }
          }
        }
      }
    }
    
    if (missingCharacters.length > 0) {
      console.log(`⚠️ 한자 데이터베이스에 없는 한자 ${missingCharacters.length}개 발견`);
      
      // 누락된 한자 목록이 너무 길면 최대 10개만 표시
      const displayCount = Math.min(missingCharacters.length, 10);
      for (let i = 0; i < displayCount; i++) {
        const item = missingCharacters[i];
        console.log(`- 한자: '${item.character}', 레벨: ${item.level}, 카테고리: ${item.category}`);
      }
      
      if (missingCharacters.length > displayCount) {
        console.log(`... 그 외 ${missingCharacters.length - displayCount}개 항목 더 있음`);
      }
    } else {
      console.log('✅ 모든 한자가 데이터베이스에 존재합니다.');
    }
    
    console.log(`📊 총 ${data.categories.length}개의 카테고리, ${allLevelIds.size}개의 레벨 확인 완료`);
  } catch (error) {
    console.error('❌ 카테고리 데이터 처리 오류:', error);
  }
}

/**
 * 모든 임시 및 중복 파일 정리
 */
function cleanupTempFiles() {
  console.log('🧹 임시 파일 정리 시작...');
  
  const filesToDelete = [
    // 백업 파일 이름 추가
  ];
  
  for (const file of filesToDelete) {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`🗑️ 파일 삭제 완료: ${file}`);
      } catch (error) {
        console.error(`❌ 파일 삭제 오류 (${file}):`, error);
      }
    }
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🚀 데이터 정규화 프로세스 시작');
  
  try {
    // 한자 데이터 정규화
    const normalizedHanjaData = await normalizeHanjaData();
    
    // 카테고리 데이터 정규화
    await normalizeCategoryData(normalizedHanjaData);
    
    // 임시 파일 정리
    // cleanupTempFiles();
    
    console.log('✨ 데이터 정규화 프로세스 완료');
  } catch (error) {
    console.error('❌ 데이터 정규화 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 