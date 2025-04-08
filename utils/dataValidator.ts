// utils/dataValidator.ts
// 데이터 유효성 검사 유틸리티

import { HanjaCharacter, Category } from '../data';

/**
 * 한자 데이터 유효성 검사
 * @param character 검사할 한자 데이터
 * @returns 유효성 검사 결과와 오류 메시지 배열
 */
export function validateHanjaData(character: Partial<HanjaCharacter>): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  // 필수 필드 검사
  if (!character.character) {
    errors.push('한자 문자가 누락되었습니다.');
  }
  
  if (!character.meaning) {
    errors.push(`'${character.character}' 한자의 의미가 누락되었습니다.`);
  }
  
  if (!character.pronunciation) {
    errors.push(`'${character.character}' 한자의 발음이 누락되었습니다.`);
  }
  
  if (character.strokes === undefined || character.strokes <= 0) {
    errors.push(`'${character.character}' 한자의 획수가 누락되었거나 유효하지 않습니다.`);
  }
  
  // 예시 데이터 유효성 검사
  if (character.examples && !Array.isArray(character.examples)) {
    errors.push(`'${character.character}' 한자의 예시가 배열 형식이 아닙니다.`);
  }
  
  // 태그 데이터 유효성 검사
  if (character.tags && !Array.isArray(character.tags)) {
    errors.push(`'${character.character}' 한자의 태그가 배열 형식이 아닙니다.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 카테고리 데이터 유효성 검사
 * @param category 검사할 카테고리 데이터
 * @returns 유효성 검사 결과와 오류 메시지 배열
 */
export function validateCategoryData(category: Partial<Category>): {
  isValid: boolean;
  errors: string[]
} {
  const errors: string[] = [];
  
  // 필수 필드 검사
  if (!category.id) {
    errors.push('카테고리 ID가 누락되었습니다.');
  }
  
  if (!category.name) {
    errors.push(`'${category.id}' 카테고리의 이름이 누락되었습니다.`);
  }
  
  if (!category.description) {
    errors.push(`'${category.id}' 카테고리의 설명이 누락되었습니다.`);
  }
  
  // 레벨 데이터 검사
  if (!category.levels || !Array.isArray(category.levels)) {
    errors.push(`'${category.id}' 카테고리의 레벨 데이터가 누락되었거나 배열 형식이 아닙니다.`);
  } else {
    // 각 레벨 검사
    category.levels.forEach((level, index) => {
      if (!level.id) {
        errors.push(`'${category.id}' 카테고리의 레벨 ${index + 1}의 ID가 누락되었습니다.`);
      }
      
      if (!level.name) {
        errors.push(`'${category.id}' 카테고리의 레벨 '${level.id}'의 이름이 누락되었습니다.`);
      }
      
      if (!level.description) {
        errors.push(`'${category.id}' 카테고리의 레벨 '${level.id}'의 설명이 누락되었습니다.`);
      }
      
      if (!level.characters || !Array.isArray(level.characters) || level.characters.length === 0) {
        errors.push(`'${category.id}' 카테고리의 레벨 '${level.id}'의 한자 목록이 누락되었거나 유효하지 않습니다.`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 데이터베이스 일관성 검사
 * @param characters 전체 한자 데이터 배열
 * @param categories 전체 카테고리 데이터 배열
 * @returns 일관성 검사 결과와 오류 메시지 배열
 */
export function validateDatabaseConsistency(
  characters: HanjaCharacter[],
  categories: Category[]
): {
  isConsistent: boolean;
  errors: string[]
} {
  const errors: string[] = [];
  const characterSet = new Set(characters.map(c => c.character));
  
  // 카테고리에 포함된 모든 한자가 데이터베이스에 존재하는지 확인
  categories.forEach(category => {
    category.levels.forEach(level => {
      level.characters.forEach(character => {
        if (!characterSet.has(character)) {
          errors.push(`카테고리 '${category.id}'의 레벨 '${level.id}'에 있는 한자 '${character}'가 데이터베이스에 없습니다.`);
        }
      });
    });
  });
  
  // 레벨 ID의 중복 여부 확인
  const levelIds = new Set<string>();
  categories.forEach(category => {
    category.levels.forEach(level => {
      if (levelIds.has(level.id)) {
        errors.push(`레벨 ID '${level.id}'가 여러 카테고리에서 중복되고 있습니다.`);
      }
      levelIds.add(level.id);
    });
  });
  
  return {
    isConsistent: errors.length === 0,
    errors
  };
}

/**
 * 전체 데이터 유효성 검사 실행
 * @param characters 전체 한자 데이터 배열
 * @param categories 전체 카테고리 데이터 배열
 * @returns 유효성 검사 결과와 오류 메시지 배열
 */
export function validateAllData(
  characters: HanjaCharacter[],
  categories: Category[]
): {
  isValid: boolean;
  errors: string[]
} {
  const errors: string[] = [];
  
  // 개별 한자 데이터 검사
  characters.forEach(character => {
    const result = validateHanjaData(character);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  });
  
  // 개별 카테고리 데이터 검사
  categories.forEach(category => {
    const result = validateCategoryData(category);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  });
  
  // 데이터베이스 일관성 검사
  const consistencyResult = validateDatabaseConsistency(characters, categories);
  if (!consistencyResult.isConsistent) {
    errors.push(...consistencyResult.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  validateHanjaData,
  validateCategoryData,
  validateDatabaseConsistency,
  validateAllData
}; 