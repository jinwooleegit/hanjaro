// @ts-ignore
import hanjaDatabase from '@/data/hanja_database_main.json';

export type HanjaLevel = {
  id: string;
  name: string;
  description: string;
  characters: string[];
};

export type HanjaCategory = {
  id: string;
  name: string;
  description: string;
  levels: HanjaLevel[];
};

export type HanjaExample = {
  word: string;
  meaning: string;
  pronunciation: string;
};

export type HanjaWord = {
  hanja: string;
  hangul: string;
  meaning: string;
};

export type HanjaSentence = {
  hanja: string;
  hangul: string;
  meaning: string;
};

export type HanjaCharacter = {
  character: string;
  pronunciation: string;
  meaning: string;
  radical: string;
  stroke_count: number;
  grade: number;
  examples: HanjaExample[];
  explanation?: string;
  example_words?: HanjaWord[];
  example_sentences?: HanjaSentence[];
};

// 데이터베이스 타입 정의
interface HanjaDatabase {
  categories: HanjaCategory[];
  characters: HanjaCharacter[];
}

// 문자열이 인코딩된 문자인지 확인
function isEncodedChar(str: string): boolean {
  return /%[0-9A-F]{2}/.test(str);
}

// URL 인코딩된 문자 처리
function normalizeHanjaChar(character: string): string {
  try {
    // 인코딩된 문자인 경우 디코딩
    if (isEncodedChar(character)) {
      return decodeURIComponent(character);
    }
    return character;
  } catch (e) {
    console.error('문자 정규화 오류:', e);
    return character;
  }
}

// 모든 카테고리 가져오기
export function getCategories(): HanjaCategory[] {
  try {
    return (hanjaDatabase as HanjaDatabase).categories || [];
  } catch (e) {
    console.error('카테고리 로드 오류:', e);
    return [];
  }
}

// 특정 카테고리의 모든 레벨 가져오기
export function getLevelsForCategory(categoryId: string): HanjaLevel[] {
  try {
    const category = getCategoryById(categoryId);
    return category?.levels || [];
  } catch (e) {
    console.error(`카테고리 ${categoryId}의 레벨 로드 오류:`, e);
    return [];
  }
}

// 카테고리 ID로 카테고리 찾기
export function getCategoryById(categoryId: string): HanjaCategory | undefined {
  try {
    return (hanjaDatabase as HanjaDatabase).categories.find((category: HanjaCategory) => category.id === categoryId);
  } catch (e) {
    console.error(`카테고리 ${categoryId} 로드 오류:`, e);
    return undefined;
  }
}

// 카테고리 ID와 레벨 ID로 레벨 찾기
export function getHanjaLevel(categoryId: string, levelId: string): HanjaLevel | undefined {
  try {
    const category = getCategoryById(categoryId);
    if (!category) return undefined;
    
    return category.levels.find((level: HanjaLevel) => level.id === levelId);
  } catch (e) {
    console.error(`카테고리 ${categoryId}, 레벨 ${levelId} 로드 오류:`, e);
    return undefined;
  }
}

// 카테고리 ID와 레벨 ID로 해당 레벨의 모든 한자 데이터 가져오기
export function getCharactersForLevel(categoryId: string, levelId: string): HanjaCharacter[] {
  try {
    const level = getHanjaLevel(categoryId, levelId);
    if (!level) return [];
    
    return level.characters.map((char: string) => {
      return getHanjaCharacter(char) || createDefaultHanjaData(char);
    });
  } catch (e) {
    console.error(`레벨 ${categoryId}/${levelId}의 한자 로드 오류:`, e);
    return [];
  }
}

// 기본 한자 데이터 생성
function createDefaultHanjaData(char: string): HanjaCharacter {
  return {
    character: char,
    pronunciation: '정보 없음',
    meaning: '정보 없음',
    radical: '정보 없음',
    stroke_count: 0,
    grade: 0,
    examples: [],
    explanation: '이 한자에 대한 정보가 없습니다.',
    example_words: [],
    example_sentences: []
  };
}

// 한자 문자로 한자 데이터 가져오기
export function getHanjaCharacter(character: string): HanjaCharacter | undefined {
  try {
    // URL 인코딩 처리된 문자 정규화
    const normalizedChar = normalizeHanjaChar(character);
    
    // 공백이나 빈 문자열인 경우 처리
    if (!normalizedChar || normalizedChar.trim() === '') {
      console.warn('빈 문자로 한자 검색 시도');
      return undefined;
    }
    
    // 실제 첫 번째 문자만 사용 (여러 문자가 입력된 경우)
    const firstChar = normalizedChar.charAt(0);
    
    // 데이터베이스에서 일치하는 한자 찾기
    const hanjaData = (hanjaDatabase as HanjaDatabase).characters.find(
      (char: HanjaCharacter) => char.character === firstChar
    );
    
    // 확장 데이터 변환 - 이전 버전과의 호환성 유지
    if (hanjaData) {
      // 깊은 복사로 원본 데이터 보존
      const enhancedData = JSON.parse(JSON.stringify(hanjaData));
      
      // 예시 단어가 없는 경우 기존 examples에서 변환
      if (!enhancedData.example_words && enhancedData.examples) {
        enhancedData.example_words = enhancedData.examples.map((ex: HanjaExample) => ({
          hanja: ex.word, // 한자 단어
          hangul: ex.pronunciation, // 한글 발음
          meaning: ex.meaning // 의미
        }));
      }
      
      // 예문이 없는 경우 기본 예문 생성
      if (!enhancedData.example_sentences || enhancedData.example_sentences.length === 0) {
        // 기본 예문 생성 (examples 기반)
        if (enhancedData.examples && enhancedData.examples.length > 0) {
          enhancedData.example_sentences = enhancedData.examples.slice(0, 2).map((ex: HanjaExample) => ({
            hanja: ex.word, // 한자 단어
            hangul: ex.pronunciation, // 한글 발음
            meaning: `${ex.meaning}은(는) ${firstChar}자가 포함된 한자어입니다.` // 설명
          }));
        } else {
          // 빈 배열 설정
          enhancedData.example_sentences = [];
        }
      }
      
      // 설명이 없는 경우 기본 설명 추가
      if (!enhancedData.explanation) {
        enhancedData.explanation = `${enhancedData.meaning}을(를) 의미하는 한자입니다.`;
      }
      
      return enhancedData;
    }
    
    console.warn(`한자 '${firstChar}' 데이터를 찾을 수 없음`);
    return undefined;
  } catch (e) {
    console.error(`한자 '${character}' 로드 오류:`, e);
    return undefined;
  }
}

// 특정 학년의 한자 가져오기
export function getCharactersByGrade(grade: number): HanjaCharacter[] {
  try {
    return (hanjaDatabase as HanjaDatabase).characters.filter(
      (char: HanjaCharacter) => char.grade === grade
    );
  } catch (e) {
    console.error(`${grade}학년 한자 로드 오류:`, e);
    return [];
  }
}

// 특정 획수의 한자 가져오기
export function getCharactersByStrokeCount(strokeCount: number): HanjaCharacter[] {
  try {
    return (hanjaDatabase as HanjaDatabase).characters.filter(
      (char: HanjaCharacter) => char.stroke_count === strokeCount
    );
  } catch (e) {
    console.error(`획수 ${strokeCount}의 한자 로드 오류:`, e);
    return [];
  }
}

// 검색어로 한자 검색하기 (한자, 뜻, 음 등을 통합 검색)
export function searchCharacters(query: string): HanjaCharacter[] {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    
    return (hanjaDatabase as HanjaDatabase).characters.filter((char: HanjaCharacter) => 
      char.character.includes(query) || 
      char.meaning.toLowerCase().includes(searchTerm) || 
      char.pronunciation.toLowerCase().includes(searchTerm) ||
      char.radical.toLowerCase().includes(searchTerm) ||
      (char.examples && char.examples.some((example: HanjaExample) => 
        example.word.toLowerCase().includes(searchTerm) ||
        example.meaning.toLowerCase().includes(searchTerm) ||
        example.pronunciation.toLowerCase().includes(searchTerm)
      ))
    );
  } catch (e) {
    console.error(`검색어 '${query}' 검색 오류:`, e);
    return [];
  }
} 