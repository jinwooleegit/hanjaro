/**
 * ID 기반 한자 데이터 접근 유틸리티
 * 모든 한자 데이터 접근을 ID 기반으로 통일합니다.
 */

// fs와 path는 서버 사이드에서만 사용 가능하도록 수정
const fs = typeof window === 'undefined' ? require('fs') : null;
const path = typeof window === 'undefined' ? require('path') : null;
import { normalizeToId, isValidHanjaId } from './idUtils';

// 타입 정의
export interface HanjaExtendedCharacter {
  id: string;
  character: string;
  unicode: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  grade: number;
  order: number;
  tags: string[];
  extended_data?: {
    detailed_meaning: string;
    etymology: string;
    mnemonics: string;
    common_words: {
      word: string;
      meaning: string;
      pronunciation: string;
      example_sentence?: string;
      example_meaning?: string;
    }[];
    cultural_notes: string;
    pronunciation_guide: string;
    stroke_order: {
      description: string;
      directions: string[];
    };
    related_characters?: string[];
    example_sentences?: {
      hanja: string;
      hangul: string;
      meaning: string;
      level?: string;
    }[];
  };
}

// 캐시 객체
const hanjaCache: Record<string, HanjaExtendedCharacter> = {};
const gradeDataCache: Record<number, any> = {};

/**
 * 한자 급수 데이터 파일 경로 구하기
 */
function getGradeFilePath(grade: number): string {
  if (!path) return ''; // 클라이언트 측에서는 빈 문자열 반환
  return path.join(process.cwd(), 'data', 'new-structure', 'characters', 'by-grade', `grade_${grade}.json`);
}

/**
 * 특정 급수의 한자 데이터 불러오기
 */
async function loadGradeData(grade: number): Promise<any | null> {
  // 캐시에 있으면 캐시된 데이터 반환
  if (gradeDataCache[grade]) {
    return gradeDataCache[grade];
  }

  try {
    // 클라이언트에서는 API를 통해 데이터 로드
    if (typeof window !== 'undefined') {
      const response = await fetch(`/api/hanja/grades?grade=${grade}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch grade ${grade} data from API`);
      }
      const gradeData = await response.json();
      
      // 캐시에 저장
      gradeDataCache[grade] = gradeData;
      
      // 개별 한자도 캐시에 저장
      gradeData.characters.forEach((char: HanjaExtendedCharacter) => {
        hanjaCache[char.id] = char;
      });
      
      return gradeData;
    }
    
    // 서버에서는 파일에서 직접 로드
    if (!fs || !path) {
      throw new Error('File system modules not available');
    }
    
    const filePath = getGradeFilePath(grade);
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const gradeData = JSON.parse(fileData);
    
    // 캐시에 저장
    gradeDataCache[grade] = gradeData;
    
    // 개별 한자도 캐시에 저장
    gradeData.characters.forEach((char: HanjaExtendedCharacter) => {
      hanjaCache[char.id] = char;
    });
    
    return gradeData;
  } catch (error) {
    console.error(`Failed to load grade ${grade} data:`, error);
    return null;
  }
}

/**
 * ID로 한자 정보 가져오기 (ID만 사용)
 * @param id 한자 ID
 * @returns 한자 정보 또는 null
 */
export async function getHanjaById(id: string): Promise<HanjaExtendedCharacter | null> {
  // 유효한 ID 형식이 아니면 null 반환
  if (!isValidHanjaId(id)) {
    console.warn(`Invalid Hanja ID format: ${id}`);
    return null;
  }
  
  // 캐시에 있으면 캐시된 데이터 반환
  if (hanjaCache[id]) {
    return hanjaCache[id];
  }

  try {
    // ID 형식에서 급수 추출 (HJ-XX-XXXX-XXXX)
    const match = id.match(/HJ-(\d+)-/);
    if (!match) {
      return null;
    }
    
    const grade = parseInt(match[1]);
    const gradeData = await loadGradeData(grade);
    
    if (gradeData) {
      const character = gradeData.characters.find((char: HanjaExtendedCharacter) => char.id === id);
      if (character) {
        hanjaCache[id] = character;
        return character;
      }
    }
    
    // 다른 급수에서도 찾기 (ID 형식이 변경된 경우 대비)
    for (let g = 15; g >= 1; g--) {
      if (g === grade) continue; // 이미 확인했음
      
      const otherGradeData = await loadGradeData(g);
      if (otherGradeData) {
        const character = otherGradeData.characters.find((char: HanjaExtendedCharacter) => char.id === id);
        if (character) {
          hanjaCache[id] = character;
          return character;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting hanja data for ID ${id}:`, error);
    return null;
  }
}

/**
 * 임의의 식별자(ID 또는 문자)로 한자 정보 가져오기
 * 내부적으로 모두 ID로 정규화하여 처리 (임시 호환용)
 * @param identifier 한자 ID 또는 문자
 * @returns 한자 정보 또는 null
 */
export async function getHanjaByIdentifier(identifier: string): Promise<HanjaExtendedCharacter | null> {
  // ID로 정규화
  const id = await normalizeToId(identifier);
  
  if (!id) {
    console.warn(`Cannot normalize identifier to ID: ${identifier}`);
    return null;
  }
  
  // ID로 한자 정보 가져오기
  return await getHanjaById(id);
}

/**
 * 관련 한자 정보 가져오기 (ID 기반)
 * @param hanjaId 한자 ID
 * @returns 관련 한자 정보 배열
 */
export async function getRelatedCharacters(hanjaId: string): Promise<HanjaExtendedCharacter[]> {
  try {
    if (!hanjaId) {
      console.warn('관련 한자를 가져오기 위한 ID가 없습니다.');
      return [];
    }
    
    const hanja = await getHanjaById(hanjaId);
    
    if (!hanja || !hanja.extended_data?.related_characters || !Array.isArray(hanja.extended_data.related_characters) || hanja.extended_data.related_characters.length === 0) {
      return [];
    }
    
    const relatedIds = hanja.extended_data.related_characters;
    const relatedCharacters: HanjaExtendedCharacter[] = [];
    
    // 병렬로 관련 한자 정보 가져오기 (Promise.all 사용)
    await Promise.all(
      relatedIds.map(async (id: string) => {
        try {
          if (!id) return; // 잘못된 ID 건너뛰기
          
          const char = await getHanjaById(id);
          if (char) {
            relatedCharacters.push(char);
          }
        } catch (error) {
          console.error(`관련 한자 [${id}] 로드 중 오류:`, error);
          // 개별 오류는 무시하고 계속 진행
        }
      })
    );
    
    return relatedCharacters;
  } catch (error) {
    console.error('관련 한자 로드 중 오류:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

/**
 * 특정 급수의 모든 한자 가져오기
 * @param grade 한자 급수
 * @returns 한자 정보 배열
 */
export async function getHanjaByGrade(grade: number): Promise<HanjaExtendedCharacter[]> {
  const gradeData = await loadGradeData(grade);
  return gradeData ? gradeData.characters : [];
}

/**
 * 시스템 초기화 - 자주 사용되는 급수 데이터 미리 로드
 */
export async function initializeHanjaSystem(): Promise<void> {
  try {
    // 가장 많이 사용되는 급수를 미리 로드 (15-11급)
    const promises = [];
    for (let grade = 15; grade >= 11; grade--) {
      promises.push(loadGradeData(grade));
    }
    await Promise.all(promises);
    
    console.log('Hanja system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize hanja system:', error);
    throw new Error('한자 시스템 초기화에 실패했습니다.');
  }
} 