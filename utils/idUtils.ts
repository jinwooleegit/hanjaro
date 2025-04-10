/**
 * 한자 ID 관련 유틸리티 함수
 * 모든 한자 접근을 ID 기반으로 통일하기 위한 도구들
 */

import * as fs from 'fs';
import * as path from 'path';

// 캐시 객체
const characterToIdMap: Record<string, string> = {};
const idToCharacterMap: Record<string, string> = {};
let isInitialized = false;

/**
 * 캐시 초기화 - 모든 한자의 문자 → ID 매핑 생성
 */
export async function initializeIdMappings(): Promise<void> {
  if (isInitialized) return;
  
  try {
    // 확장 데이터 파일 로드
    const filePath = path.join(process.cwd(), 'data', 'new-structure', 'characters', 'hanja_extended.json');
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // 모든 한자에 대해 양방향 매핑 구축
    if (data.characters && Array.isArray(data.characters)) {
      data.characters.forEach((char: any) => {
        if (char.id && char.character) {
          characterToIdMap[char.character] = char.id;
          idToCharacterMap[char.id] = char.character;
        }
      });
    }
    
    isInitialized = true;
    console.log(`ID 매핑 초기화 완료: ${Object.keys(characterToIdMap).length}개 한자`);
  } catch (error) {
    console.error('ID 매핑 초기화 실패:', error);
    throw new Error('한자 ID 매핑 초기화에 실패했습니다.');
  }
}

/**
 * 한자 문자에서 ID 가져오기
 * @param character 한자 문자
 * @returns 한자 ID 또는 null
 */
export async function getIdFromCharacter(character: string): Promise<string | null> {
  if (!isInitialized) {
    await initializeIdMappings();
  }
  
  return characterToIdMap[character] || null;
}

/**
 * ID에서 한자 문자 가져오기
 * @param id 한자 ID
 * @returns 한자 문자 또는 null
 */
export async function getCharacterFromId(id: string): Promise<string | null> {
  if (!isInitialized) {
    await initializeIdMappings();
  }
  
  return idToCharacterMap[id] || null;
}

/**
 * 식별자가 유효한 한자 ID 형식인지 확인
 * @param identifier 확인할 식별자
 * @returns 한자 ID 형식 여부
 */
export function isValidHanjaId(identifier: string): boolean {
  return /^HJ-\d+-\d+-[0-9A-F]+$/i.test(identifier);
}

/**
 * 한자 문자 또는 다른 형식의 식별자를 ID로 정규화
 * 이미 ID면 그대로 반환, 문자면 ID로 변환
 * @param identifier 한자 문자 또는 ID
 * @returns 한자 ID 또는 null
 */
export async function normalizeToId(identifier: string): Promise<string | null> {
  // 이미 유효한 ID 형식이면 그대로 반환
  if (isValidHanjaId(identifier)) {
    return identifier;
  }
  
  // 한자 문자면 ID로 변환
  if (identifier.length === 1) {
    return await getIdFromCharacter(identifier);
  }
  
  // URL 인코딩된 문자일 수 있음
  try {
    if (identifier.includes('%')) {
      const decodedChar = decodeURIComponent(identifier);
      if (decodedChar.length === 1) {
        return await getIdFromCharacter(decodedChar);
      }
    }
  } catch (e) {
    console.error('문자 디코딩 오류:', e);
  }
  
  // 변환 실패
  return null;
}

/**
 * 모든 한자 ID 목록 가져오기
 * @returns 모든 한자 ID 배열
 */
export async function getAllHanjaIds(): Promise<string[]> {
  if (!isInitialized) {
    await initializeIdMappings();
  }
  
  return Object.values(characterToIdMap);
} 