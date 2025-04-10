/**
 * 급수별 한자 데이터를 관리하는 유틸리티
 * 데이터 로딩 최적화를 위해 급수별로 분리된 파일을 활용합니다.
 */

// fs와 path는 서버 사이드에서만 사용 가능하도록 수정
const fs = typeof window === 'undefined' ? require('fs').promises : null;
const path = typeof window === 'undefined' ? require('path') : null;

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

export interface HanjaGradeData {
  metadata: {
    version: string;
    last_updated: string;
    total_characters: number;
    data_source: string;
    grade: number;
  };
  characters: HanjaExtendedCharacter[];
}

// 캐시를 사용하여 성능 최적화
const gradeDataCache: Record<number, HanjaGradeData> = {};
const characterCache: Record<string, HanjaExtendedCharacter> = {};

/**
 * 한자 급수 데이터 파일 경로 구하기
 */
function getGradeFilePath(grade: number): string {
  if (!path) return ''; // 클라이언트 측에서는 빈 문자열 반환
  return path.join(process.cwd(), 'data', 'new-structure', 'characters', 'by-grade', `grade_${grade}.json`);
}

/**
 * 특정 급수의 한자 데이터 불러오기
 * 서버 측에서만 직접 파일 로드 가능
 */
export async function loadGradeData(grade: number): Promise<HanjaGradeData | null> {
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
      const gradeData: HanjaGradeData = await response.json();
      
      // 캐시에 저장
      gradeDataCache[grade] = gradeData;
      
      // 개별 한자도 캐시에 저장
      gradeData.characters.forEach(char => {
        characterCache[char.id] = char;
        characterCache[char.character] = char;
      });
      
      return gradeData;
    }
    
    // 서버에서는 파일에서 직접 로드
    if (!fs || !path) {
      throw new Error('File system modules not available');
    }
    
    const filePath = getGradeFilePath(grade);
    const fileData = await fs.readFile(filePath, 'utf8');
    const gradeData: HanjaGradeData = JSON.parse(fileData);
    
    // 캐시에 저장
    gradeDataCache[grade] = gradeData;
    
    // 개별 한자도 캐시에 저장
    gradeData.characters.forEach(char => {
      characterCache[char.id] = char;
      characterCache[char.character] = char;
    });
    
    return gradeData;
  } catch (error) {
    console.error(`Failed to load grade ${grade} data:`, error);
    return null;
  }
}

/**
 * ID로 한자 정보 가져오기
 */
export async function getHanjaById(id: string): Promise<HanjaExtendedCharacter | null> {
  try {
    // 캐시에 있으면 캐시된 데이터 반환
    if (characterCache[id]) {
      return characterCache[id];
    }

    // 새로운 ID 기반 API를 사용하여 데이터 가져오기
    const response = await fetch(`/api/hanja/id?id=${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      // API 요청 실패 시 기존 로직으로 폴백
      
      // ID 형식이 "HJ-XX-XXXX-XXXX"인 경우, 급수 추출
      const match = id.match(/HJ-(\d+)-/);
      if (match) {
        const grade = parseInt(match[1]);
        const gradeData = await loadGradeData(grade);
        
        if (gradeData) {
          const character = gradeData.characters.find(char => char.id === id);
          if (character) {
            characterCache[id] = character;
            return character;
          }
        }
      }

      // 모든 급수 데이터 로드해서 찾기 (최후의 방법)
      for (let grade = 15; grade >= 1; grade--) {
        const gradeData = await loadGradeData(grade);
        if (gradeData) {
          const character = gradeData.characters.find(char => char.id === id);
          if (character) {
            characterCache[id] = character;
            return character;
          }
        }
      }

      return null;
    }
    
    const data = await response.json();
    
    // 응답에 오류가 있으면 null 반환
    if (data.error) {
      console.error(`API error: ${data.error}`);
      return null;
    }
    
    // 캐시에 저장
    characterCache[id] = data;
    characterCache[data.character] = data;
    
    return data;
  } catch (error) {
    console.error(`Error getting hanja data for ID ${id}:`, error);
    
    // 오류 발생 시 기존 로직으로 폴백
    for (let grade = 15; grade >= 1; grade--) {
      const gradeData = await loadGradeData(grade);
      if (gradeData) {
        const character = gradeData.characters.find(char => char.id === id);
        if (character) {
          characterCache[id] = character;
          return character;
        }
      }
    }
    
    return null;
  }
}

/**
 * 한자 문자로 한자 정보 가져오기
 */
export async function getHanjaByCharacter(character: string): Promise<HanjaExtendedCharacter | null> {
  try {
    // 캐시에 있으면 캐시된 데이터 반환
    if (characterCache[character]) {
      return characterCache[character];
    }

    // 새로운 API를 사용하여 데이터 가져오기
    const response = await fetch(`/api/hanja/grade?character=${encodeURIComponent(character)}`);
    
    if (!response.ok) {
      // API 요청 실패 시 기존 로직으로 폴백
      // 모든 급수 데이터 로드해서 찾기
      for (let grade = 15; grade >= 1; grade--) {
        const gradeData = await loadGradeData(grade);
        if (gradeData) {
          const char = gradeData.characters.find(char => char.character === character);
          if (char) {
            characterCache[character] = char;
            return char;
          }
        }
      }
      
      return null;
    }
    
    const data = await response.json();
    
    // 응답에 오류가 있으면 null 반환
    if (data.error) {
      console.error(`API error: ${data.error}`);
      return null;
    }
    
    // 캐시에 저장
    characterCache[character] = data;
    if (data.id) {
      characterCache[data.id] = data;
    }
    
    return data;
  } catch (error) {
    console.error(`Error getting hanja data for character ${character}:`, error);
    
    // 오류 발생 시 기존 로직으로 폴백
    for (let grade = 15; grade >= 1; grade--) {
      const gradeData = await loadGradeData(grade);
      if (gradeData) {
        const char = gradeData.characters.find(char => char.character === character);
        if (char) {
          characterCache[character] = char;
          return char;
        }
      }
    }
    
    return null;
  }
}

/**
 * 특정 급수의 모든 한자 가져오기
 */
export async function getHanjaByGrade(grade: number): Promise<HanjaExtendedCharacter[]> {
  const gradeData = await loadGradeData(grade);
  return gradeData ? gradeData.characters : [];
}

/**
 * 여러 급수의 한자 가져오기
 */
export async function getHanjaByGrades(grades: number[]): Promise<HanjaExtendedCharacter[]> {
  const promises = grades.map(grade => loadGradeData(grade));
  const results = await Promise.all(promises);
  
  // 결과 합치기
  return results
    .filter(Boolean)
    .flatMap(gradeData => gradeData!.characters);
}

/**
 * 특정 태그를 가진 한자 가져오기
 */
export async function getHanjaByTag(tag: string, grades?: number[]): Promise<HanjaExtendedCharacter[]> {
  const gradesToSearch = grades || [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const allCharacters = await getHanjaByGrades(gradesToSearch);
  
  return allCharacters.filter(char => char.tags.includes(tag));
}

/**
 * 관련 한자 정보 가져오기
 */
export async function getRelatedHanja(character: HanjaExtendedCharacter): Promise<HanjaExtendedCharacter[]> {
  if (!character.extended_data?.related_characters || character.extended_data.related_characters.length === 0) {
    return [];
  }
  
  const promises = character.extended_data.related_characters.map(relChar => getHanjaByCharacter(relChar));
  const results = await Promise.all(promises);
  
  return results.filter(Boolean) as HanjaExtendedCharacter[];
}

/**
 * 특정 급수 범위의 모든 한자 초기화 (미리 캐시 데이터 준비)
 */
export async function preloadGradeData(grades: number[]): Promise<void> {
  const promises = grades.map(grade => loadGradeData(grade));
  await Promise.all(promises);
  console.log(`Preloaded data for grades: ${grades.join(', ')}`);
} 