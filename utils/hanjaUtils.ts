// @ts-ignore
import hanjaDatabase from '../data/hanja_database_main.json';
// @ts-ignore
import categoriesData from '../data/categories.json';

// @ts-ignore
import basicLevelData from '../data/hanja_basic.json';
// @ts-ignore
import advancedLevelData from '../data/hanja_advanced.json';
// @ts-ignore
import universityLevelData from '../data/hanja_university.json';

// 기본 레벨 데이터를 사전에 로드
import basicLevel1 from '@/data/basic/level1.json';
import basicLevel2 from '@/data/basic/level2.json';
import basicLevel3 from '@/data/basic/level3.json';
import basicLevel4 from '@/data/basic/level4.json';
import basicLevel5 from '@/data/basic/level5.json';
import basicLevel6 from '@/data/basic/level6.json';

// 고급 레벨 데이터를 사전에 로드
import advancedLevel1 from '@/data/advanced/level1.json';
import advancedLevel2 from '@/data/advanced/level2.json';

// 대학교 레벨 데이터를 사전에 로드
import universityLevel1 from '@/data/university/level1.json';
import universityLevel3 from '@/data/university/level3.json';
import universityLevel4 from '@/data/university/level4.json';

// 성능 최적화를 위한 캐싱 객체들
const characterCache: Record<string, HanjaCharacter> = {};
const levelCharactersCache: Record<string, HanjaCharacter[]> = {};
const categoryCache: Record<string, HanjaCategory> = {};
const levelCache: Record<string, HanjaLevel> = {};

// 점진적 로딩을 위한 배치 크기 설정
const BATCH_SIZE = 20;

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
  characters: {
    character: string;
    meaning: string;
    pronunciation: string;
    strokes: number;
    examples: string[];
    radical: string;
    tags: string[];
  }[];
  meta: { 
    totalCount: number; 
    lastUpdated: string; 
    version: string; 
  };
}

// 문자열이 인코딩된 문자인지 확인
function isEncodedChar(str: string): boolean {
  return /%[0-9A-F]{2}/.test(str);
}

// URL 인코딩된 문자 처리 (메모이제이션 적용)
const normalizedChars: Record<string, string> = {};
function normalizeHanjaChar(character: string): string {
  // 캐시에 있으면 캐시된 값 반환
  if (normalizedChars[character]) {
    return normalizedChars[character];
  }
  
  try {
    // 인코딩된 문자인 경우 디코딩하고 캐시에 저장
    if (isEncodedChar(character)) {
      const decoded = decodeURIComponent(character);
      normalizedChars[character] = decoded;
      return decoded;
    }
    // 캐시에 저장하고 반환
    normalizedChars[character] = character;
    return character;
  } catch (e) {
    console.error('문자 정규화 오류:', e);
    return character;
  }
}

// 카테고리 데이터 가져오기 함수
export function getCategories(): HanjaCategory[] {
  return [
    {
      id: 'beginner',
      name: '초급',
      description: '기초 한자와 간단한 구조의 한자를 학습합니다. 일상생활에서 자주 사용되는 기본 한자들이 포함됩니다.',
      levels: [
        { id: 'level1', name: '15급', description: '한자 학습 입문 단계로 가장 기초적인 한자를 학습합니다.', characters: [] },
        { id: 'level2', name: '14급', description: '기초 한자를 확장하여 일상에서 자주 쓰이는 쉬운 한자를 학습합니다.', characters: [] },
        { id: 'level3', name: '13급', description: '초등 저학년 수준의 필수 한자를 학습합니다.', characters: [] },
        { id: 'level4', name: '12급', description: '기초 한자 구조와 의미를 이해하는 단계입니다.', characters: [] },
        { id: 'level5', name: '11급', description: '초급 마지막 단계로 초등학교 수준의 한자를 마스터합니다.', characters: [] }
      ]
    },
    {
      id: 'intermediate',
      name: '중급',
      description: '중간 수준의 한자와 조금 더 복잡한 구조의 한자를 학습합니다. 더 많은 부수와 결합된 한자들이 포함됩니다.',
      levels: [
        { id: 'level1', name: '10급', description: '중급 첫 단계로 더 복잡한 구조의 한자를 학습합니다.', characters: [] },
        { id: 'level2', name: '9급', description: '일상 생활과 학업에 필요한 중요 한자를 학습합니다.', characters: [] },
        { id: 'level3', name: '8급', description: '중급 수준의 한자어와 문화적 배경을 함께 학습합니다.', characters: [] },
        { id: 'level4', name: '7급', description: '다양한 분야에서 사용되는 한자를 확장합니다.', characters: [] },
        { id: 'level5', name: '6급', description: '중급 마지막 단계로 고등학교 수준의 기초 한자를 학습합니다.', characters: [] }
      ]
    },
    {
      id: 'advanced',
      name: '고급',
      description: '복잡한 구조와 의미를 가진 한자를 학습합니다. 전문 분야에서 사용되는 한자들이 포함됩니다.',
      levels: [
        { id: 'level1', name: '5급', description: '고급 첫 단계로 전문 분야에서 사용되는 한자를 학습합니다.', characters: [] },
        { id: 'level2', name: '4급', description: '다양한 한자 조합과 심화된 활용법을 학습합니다.', characters: [] },
        { id: 'level3', name: '3급', description: '고급 마지막 단계로 한자 지식을 심화합니다.', characters: [] }
      ]
    },
    {
      id: 'expert',
      name: '전문가',
      description: '가장 높은 수준의 한자와 희귀 한자를 학습합니다. 고전 문헌과 전문 서적에서 사용되는 한자들이 포함됩니다.',
      levels: [
        { id: 'level1', name: '2급', description: '전문가 첫 단계로 희귀 한자와 전문 용어를 학습합니다.', characters: [] },
        { id: 'level2', name: '1급', description: '최고 수준의 한자 지식과 고전 문헌에 사용되는 한자를 학습합니다.', characters: [] }
      ]
    }
  ];
}

// 카테고리별 레벨 데이터 가져오기
export function getLevelsForCategory(categoryId: string) {
  const categories = getCategories();
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.levels.map(level => ({
    id: level.id,
    name: level.name,
    description: level.description
  })) : [];
}

// 카테고리 ID로 카테고리 찾기 (캐시 사용)
export function getCategoryById(categoryId: string): HanjaCategory | undefined {
    if (categoryCache[categoryId]) {
      return categoryCache[categoryId];
    }
    
    const categories = getCategories();
  const category = categories.find(cat => cat.id === categoryId);
    
    if (category) {
      categoryCache[categoryId] = category;
    }
    
    return category;
}

// 특정 레벨 가져오기 (캐시 사용)
export function getHanjaLevel(categoryId: string, levelId: string): HanjaLevel | null {
  const cacheKey = `${categoryId}-${levelId}`;
  
  // 캐시에 있으면 캐시된 데이터 반환
    if (levelCache[cacheKey]) {
      return levelCache[cacheKey];
    }
    
  try {
    const category = getCategoryById(categoryId);
    if (!category) return null;
    
    const level = category.levels.find(level => level.id === levelId);
    if (!level) return null;
    
    // 캐시에 저장
      levelCache[cacheKey] = level;
    return level;
  } catch (e) {
    console.error(`카테고리 ${categoryId}, 레벨 ${levelId} 가져오기 오류:`, e);
    return null;
  }
}

// 특정 레벨의 한자 문자 가져오기 (캐싱 적용)
export function getCharactersForLevel(categoryId: string, levelId: string): HanjaCharacter[] {
  const cacheKey = `${categoryId}-${levelId}`;
  
  // 캐시에 있으면 캐시된 데이터 반환
  if (levelCharactersCache[cacheKey]) {
    return levelCharactersCache[cacheKey];
  }
    
  try {
    // 학습 단계에 맞는 데이터 로드
    let levelData: any = null;
    
    console.log(`특정 레벨의 한자 로드: 카테고리 ${categoryId}, 레벨 ${levelId}`);
    
    // 초급 레벨 (beginner) - 15급~11급
    if (categoryId === 'beginner') {
      if (levelId === 'level1') levelData = basicLevel1;       // 15급 - 초등 1단계
      else if (levelId === 'level2') levelData = basicLevel2;  // 14급 - 초등 2단계
      else if (levelId === 'level3') levelData = basicLevel3;  // 13급 - 초등 3단계
      else if (levelId === 'level4') levelData = basicLevel4;  // 12급 - 초등 4단계
      else if (levelId === 'level5') levelData = basicLevel5;  // 11급 - 초등 5단계
    }
    // 중급 레벨 (intermediate) - 10급~6급
    else if (categoryId === 'intermediate') {
      if (levelId === 'level1') levelData = basicLevel6;       // 10급 - 초등 6단계
      else if (levelId === 'level2') levelData = advancedLevel1; // 9급 - 중급 1단계
      else if (levelId === 'level3') levelData = advancedLevel2; // 8급 - 중급 2단계 
      else if (levelId === 'level4') levelData = basicLevel5;  // 7급 - 중급 3단계 (임시로 다른 데이터 사용)
      else if (levelId === 'level5') levelData = basicLevel6;  // 6급 - 중급 4단계 (임시로 다른 데이터 사용)
    }
    // 고급 레벨 (advanced) - 5급~3급
    else if (categoryId === 'advanced') {
      if (levelId === 'level1') levelData = universityLevel1;  // 5급 - 고급 1단계
      else if (levelId === 'level2') levelData = universityLevel3; // 4급 - 고급 2단계
      else if (levelId === 'level3') levelData = universityLevel4; // 3급 - 고급 3단계
    }
    // 전문가 레벨 (expert) - 2급~1급
    else if (categoryId === 'expert') {
      if (levelId === 'level1') levelData = universityLevel3;  // 2급 - 전문가 1단계
      else if (levelId === 'level2') levelData = universityLevel4; // 1급 - 전문가 2단계
    }
    // 구 카테고리 호환성 유지 (기존 URL 지원)
    else if (categoryId === 'elementary') {
      // 예전 카테고리인 elementary를 beginner로 매핑
      if (levelId === 'level1') levelData = basicLevel1;
      else if (levelId === 'level2') levelData = basicLevel2;
      else if (levelId === 'level3') levelData = basicLevel3;
      else if (levelId === 'level4') levelData = basicLevel4;
      else if (levelId === 'level5') levelData = basicLevel5;
      else if (levelId === 'level6') levelData = basicLevel6;
    }
    else if (categoryId === 'middle') {
      // 예전 카테고리인 middle을 intermediate로 매핑
      if (levelId === 'level1') levelData = advancedLevel1; 
      else if (levelId === 'level2') levelData = advancedLevel2;
      else if (levelId === 'level3') levelData = basicLevel6;
    }
    else if (categoryId === 'high') {
      // 예전 카테고리인 high를 advanced로 매핑
      if (levelId === 'level1') levelData = universityLevel1;
      else if (levelId === 'level2') levelData = universityLevel3;
      else if (levelId === 'level3') levelData = universityLevel4;
    }
    else if (categoryId === 'university') {
      // 예전 카테고리인 university를 expert로 매핑
      if (levelId === 'level1') levelData = universityLevel1;
      else if (levelId === 'level2') levelData = universityLevel3;
      else if (levelId === 'level3') levelData = universityLevel4;
      else if (levelId === 'level4') levelData = basicLevel6;
    }
    
    // 데이터가 없으면 빈 배열 반환
    if (!levelData) {
      console.warn(`카테고리 ${categoryId}, 레벨 ${levelId}에 대한 레벨 데이터를 찾을 수 없습니다.`);
      return [];
    }
    
    // 문자 데이터 변환
    const characters = levelData.characters.map((char: any) => {
      return {
        character: char.character,
        pronunciation: char.pronunciation,
        meaning: char.meaning,
        radical: char.radical || '',
        stroke_count: char.stroke_count || 0,
        grade: char.level || 0,
        examples: char.examples || [],
        order: char.order || 0
      };
    });
    
    // 캐시에 저장
    levelCharactersCache[cacheKey] = characters;
    console.log(`${categoryId}-${levelId} 레벨에 ${characters.length}개 한자 로드됨`);
    return characters;
    
  } catch (e) {
    console.error(`카테고리 ${categoryId}, 레벨 ${levelId}의 문자 가져오기 오류:`, e);
    return [];
  }
}

// 기본 한자 데이터 생성
function createDefaultHanjaData(character: string): HanjaCharacter {
  return {
    character: character,
    pronunciation: '알 수 없음',
    meaning: '의미 정보 없음',
    radical: '',
    stroke_count: 0,
    grade: 0,
    examples: []
  };
}

// 한자 문자 가져오기 (캐싱 적용)
export function getHanjaCharacter(character: string): HanjaCharacter | null {
  try {
    // 문자 정규화 (URL 디코딩 등)
    const normalizedChar = normalizeHanjaChar(character);
    
    // 캐시에 있으면 캐시된 데이터 반환
    if (characterCache[normalizedChar]) {
      return characterCache[normalizedChar];
    }
    
    // 데이터베이스에서 검색
    const db = hanjaDatabase as HanjaDatabase;
    const char = db.characters.find(c => c.character === normalizedChar);
    
    if (char) {
      // 데이터 변환
      const hanjaChar: HanjaCharacter = {
        character: char.character,
        pronunciation: char.pronunciation,
        meaning: char.meaning,
        radical: char.radical,
        stroke_count: char.strokes || 0,
        grade: 0, // 기본값 설정
        examples: char.examples ? char.examples.map(e => {
          return { word: e, meaning: '', pronunciation: '' }
        }) : [],
      };
      
      // 캐시에 저장
      characterCache[normalizedChar] = hanjaChar;
      return hanjaChar;
    }
    
    return null;
  } catch (e) {
    console.error(`한자 문자 가져오기 오류: ${character}`, e);
    return null;
  }
}

// 한자 캐릭터를 모두 로드 (지연 로딩)
const loadedCharacters: HanjaCharacter[] = [];
let isLoadingAll = false;
export async function getAllHanjaCharacters(): Promise<HanjaCharacter[]> {
  if (loadedCharacters.length > 0) {
    return loadedCharacters;
  }
  
  if (isLoadingAll) {
    // 이미 로딩 중이면 대기
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (loadedCharacters.length > 0) {
          clearInterval(checkInterval);
          resolve(loadedCharacters);
        }
      }, 100);
    });
  }
  
  isLoadingAll = true;
  
  try {
    const db = hanjaDatabase as HanjaDatabase;
    // 데이터 변환
    const characters = db.characters.map(char => {
      const hanjaChar: HanjaCharacter = {
        character: char.character,
        pronunciation: char.pronunciation,
        meaning: char.meaning,
        radical: char.radical,
        stroke_count: char.strokes || 0,
        grade: 0, // 기본값 설정
        examples: char.examples ? char.examples.map(e => {
          return { word: e, meaning: '', pronunciation: '' }
        }) : [],
      };
      return hanjaChar;
    });
    
    // 캐릭터 캐시 업데이트
    characters.forEach(char => {
      characterCache[char.character] = char;
    });
    
    // 로드된 캐릭터 저장
    loadedCharacters.push(...characters);
    
    return characters;
  } catch (e) {
    console.error('모든 한자 로드 오류:', e);
    return [];
  } finally {
    isLoadingAll = false;
  }
}

// 한자 검색 함수
export async function searchHanja(query: string): Promise<HanjaCharacter[]> {
  // 모든 한자 로드
  const characters = await getAllHanjaCharacters();
  
  if (!query || query.trim() === '') {
    return [];
  }
  
  // 검색 로직 수행
  return characters.filter(char => {
    // 한자, 의미, 발음으로 검색
    return (
      char.character.includes(query) ||
      char.meaning.includes(query) ||
      char.pronunciation.includes(query)
    );
  });
}

// 한자 문자와 발음을 함께 표시하는 함수
export function getNormalizedCharacter(character: string): string {
  const hanjaData = getHanjaCharacter(character);
  if (!hanjaData) return character;
  
  return `${hanjaData.character}(${hanjaData.pronunciation})`;
}

// 학년을 학교 급으로 변환하는 함수
export function getLevelString(grade: number): string {
  switch (grade) {
    case 1:
    case 2:
    case 3:
    case 4:
      return '초등학교';
    case 5:
    case 6:
      return '중학교';
    case 7:
    case 8:
      return '고등학교';
    case 9: return '대학교';
    default: return '기타';
  }
}

// 획수별 한자 그룹화
export function groupHanjaByStrokeCount(hanjaList: HanjaCharacter[]): Record<number, HanjaCharacter[]> {
  const groups: Record<number, HanjaCharacter[]> = {};
  
  hanjaList.forEach((char) => {
    const strokeCount = char.stroke_count || 0;
    if (!groups[strokeCount]) {
      groups[strokeCount] = [];
    }
    groups[strokeCount].push(char);
  });
  
  return groups;
}

// 난이도별 한자 그룹화
export function groupHanjaByGrade(hanjaList: HanjaCharacter[]): Record<number, HanjaCharacter[]> {
  const groups: Record<number, HanjaCharacter[]> = {};
  
  hanjaList.forEach((char) => {
    const grade = char.grade || 0;
    if (!groups[grade]) {
      groups[grade] = [];
    }
    groups[grade].push(char);
  });
  
  return groups;
}

// 한자 리스트 정렬 (획수 기준)
export function sortHanjaByStrokeCount(hanjaList: HanjaCharacter[]): HanjaCharacter[] {
  return [...hanjaList].sort((a, b) => (a.stroke_count || 0) - (b.stroke_count || 0));
}

// 한자 리스트 정렬 (난이도 기준)
export function sortHanjaByGrade(hanjaList: HanjaCharacter[]): HanjaCharacter[] {
  return [...hanjaList].sort((a, b) => (a.grade || 0) - (b.grade || 0));
}

// 특정 레벨의 한자 총 개수 가져오기
export function getTotalCharacterCount(categoryId: string, levelId: string): number {
  try {
    const level = getHanjaLevel(categoryId, levelId);
    return level?.characters.length || 0;
  } catch (e) {
    console.error(`카테고리 ${categoryId}, 레벨 ${levelId}의 총 한자 수 가져오기 오류:`, e);
    return 0;
  }
}

// 더 많은 한자 데이터 로드하기 (페이지네이션용)
export async function loadMoreCharacters(
  categoryId: string,
  levelId: string,
  limit: number = 20,
  offset: number = 0
): Promise<HanjaCharacter[]> {
  const cacheKey = `${categoryId}-${levelId}`;
  
  try {
    // 캐시된 모든 항목이 있으면 거기서 슬라이스
    if (levelCharactersCache[cacheKey]) {
      return levelCharactersCache[cacheKey].slice(offset, offset + limit);
    }
    
    const level = getHanjaLevel(categoryId, levelId);
    if (!level) return [];
    
    // 시작 인덱스부터 제한 개수만큼 한자 가져오기
    const characterSlice = level.characters.slice(offset, offset + limit);
    
    // 각 한자의 상세 정보 가져오기
    return characterSlice.map((char: string) => {
      return getHanjaCharacter(char) || createDefaultHanjaData(char);
    });
  } catch (e) {
    console.error(`카테고리 ${categoryId}, 레벨 ${levelId}의 추가 한자 로드 오류:`, e);
    return [];
  }
} 