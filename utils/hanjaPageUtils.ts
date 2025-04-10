'use client';

/**
 * 한자 상세 페이지에서 사용하는 유틸리티 함수
 * 급수별로 분리된 데이터를 활용합니다.
 */

import {
  HanjaExtendedCharacter,
  getHanjaById,
  getHanjaByCharacter,
  getRelatedHanja,
  preloadGradeData
} from './gradeBasedHanjaUtils';

// 캐시 최적화를 위한 초기화 여부 확인
let isInitialized = false;

/**
 * 한자 학습 시스템 초기화
 * - 자주 사용되는 급수의 데이터를 미리 로드하여 캐싱
 */
export async function initializeHanjaSystem(): Promise<void> {
  if (isInitialized) {
    return;
  }
  
  try {
    // 가장 많이 사용되는 급수를 미리 로드 (15-11급)
    await preloadGradeData([15, 14, 13, 12, 11]);
    isInitialized = true;
    console.log('Hanja system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize hanja system:', error);
    throw new Error('한자 시스템 초기화에 실패했습니다.');
  }
}

/**
 * ID로 한자 정보 가져오기
 */
export async function getExtendedHanjaById(id: string): Promise<HanjaExtendedCharacter | null> {
  try {
    return await getHanjaById(id);
  } catch (error) {
    console.error(`Error getting hanja data for ID ${id}:`, error);
    return null;
  }
}

/**
 * 문자로 한자 정보 가져오기
 */
export async function getHanjaInfoByCharacter(character: string): Promise<HanjaExtendedCharacter | null> {
  try {
    return await getHanjaByCharacter(character);
  } catch (error) {
    console.error(`Error getting hanja data for character ${character}:`, error);
    return null;
  }
}

/**
 * 문자로 한자 ID 가져오기
 * 직접 문자를 사용한 링크를 ID 기반으로 변환할 때 사용
 */
export async function getHanjaIdByCharacter(character: string): Promise<string | null> {
  try {
    const hanja = await getHanjaByCharacter(character);
    return hanja ? hanja.id : null;
  } catch (error) {
    console.error(`Error getting hanja ID for character ${character}:`, error);
    return null;
  }
}

/**
 * 관련 한자 정보 가져오기
 */
export async function getRelatedCharactersInfo(hanjaId: string): Promise<HanjaExtendedCharacter[]> {
  try {
    const hanja = await getHanjaById(hanjaId);
    if (!hanja || !hanja.extended_data?.related_characters) {
      return [];
    }
    
    return await getRelatedHanja(hanja);
  } catch (error) {
    console.error(`Error getting related characters for ID ${hanjaId}:`, error);
    return [];
  }
}

/**
 * 한자와 관련된 복합어 가져오기
 */
export function getCompoundWords(hanjaId: string): any[] {
  try {
    // TODO: 복합어 데이터가 준비되면 구현
    return [];
  } catch (error) {
    console.error(`Error getting compound words for ID ${hanjaId}:`, error);
    return [];
  }
}

/**
 * 한자 검색
 */
export async function searchHanja(query: string): Promise<HanjaExtendedCharacter[]> {
  try {
    // 문자로 직접 검색
    if (query.length === 1) {
      const hanja = await getHanjaByCharacter(query);
      return hanja ? [hanja] : [];
    }
    
    // TODO: 의미나 발음으로 검색하는 기능 구현
    return [];
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    return [];
  }
} 