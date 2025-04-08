// scripts/validate-data.ts
// 데이터 유효성 검사 실행 스크립트

import fs from 'fs';
import path from 'path';
import { HanjaCharacter, Category } from '../data';
import { validateAllData } from '../utils/dataValidator';

/**
 * 데이터 파일 로드
 * @param filePath 파일 경로
 */
function loadDataFile<T>(filePath: string): T {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`❌ 파일 로드 오류 (${filePath}):`, error);
    throw new Error(`데이터 로드 실패: ${filePath}`);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🔍 데이터 유효성 검사 시작...');
  
  try {
    // 한자 데이터베이스 로드
    const hanjaDBPath = 'data/hanja_database_main.json';
    console.log(`📂 한자 데이터베이스 로드 중: ${hanjaDBPath}`);
    const hanjaData = loadDataFile<{ characters: HanjaCharacter[] }>(hanjaDBPath);
    
    if (!hanjaData.characters || !Array.isArray(hanjaData.characters)) {
      console.error('❌ 유효하지 않은 한자 데이터 형식');
      process.exit(1);
    }
    
    console.log(`✅ 한자 데이터베이스 로드 완료: ${hanjaData.characters.length}개 항목`);
    
    // 카테고리 데이터 로드
    const categoryPath = 'data/categories.json';
    console.log(`📂 카테고리 데이터 로드 중: ${categoryPath}`);
    const categoryData = loadDataFile<{ categories: Category[] }>(categoryPath);
    
    if (!categoryData.categories || !Array.isArray(categoryData.categories)) {
      console.error('❌ 유효하지 않은 카테고리 데이터 형식');
      process.exit(1);
    }
    
    console.log(`✅ 카테고리 데이터 로드 완료: ${categoryData.categories.length}개 카테고리`);
    
    // 전체 데이터 유효성 검사 실행
    console.log('🔍 데이터 유효성 검사 실행 중...');
    const validationResult = validateAllData(hanjaData.characters, categoryData.categories);
    
    if (!validationResult.isValid) {
      console.error(`❌ 데이터 유효성 검사 실패: ${validationResult.errors.length}개 오류 발견`);
      
      // 오류 카테고리별로 정리
      const characterErrors: string[] = [];
      const categoryErrors: string[] = [];
      const consistencyErrors: string[] = [];
      
      validationResult.errors.forEach(error => {
        if (error.includes('한자의')) {
          characterErrors.push(error);
        } else if (error.includes('카테고리의')) {
          categoryErrors.push(error);
        } else {
          consistencyErrors.push(error);
        }
      });
      
      if (characterErrors.length > 0) {
        console.error('\n🈲 한자 데이터 오류:');
        characterErrors.forEach(error => console.error(`  - ${error}`));
      }
      
      if (categoryErrors.length > 0) {
        console.error('\n📑 카테고리 데이터 오류:');
        categoryErrors.forEach(error => console.error(`  - ${error}`));
      }
      
      if (consistencyErrors.length > 0) {
        console.error('\n🔄 데이터 일관성 오류:');
        consistencyErrors.forEach(error => console.error(`  - ${error}`));
      }
      
      process.exit(1);
    } else {
      console.log('✅ 데이터 유효성 검사 성공: 모든 데이터가 유효합니다.');
    }
  } catch (error) {
    console.error('❌ 데이터 유효성 검사 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 