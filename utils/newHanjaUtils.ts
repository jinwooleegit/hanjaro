'use client';

/**
 * 새로운 관계형 구조를 활용하는 한자 유틸리티 함수 모음
 * 최적화된 데이터 로딩과 캐싱 전략을 구현하였습니다.
 */

// 타입 선언
export type HanjaCharacter = {
  id: string;
  character: string;
  unicode: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  grade: number;
  order: number;
  tags?: string[];
  extended_data?: {
    detailed_meaning?: string;
    etymology?: string;
    mnemonics?: string;
    common_words?: {
      word: string;
      meaning: string;
      pronunciation: string;
      example_sentence?: string;
      example_meaning?: string;
    }[];
    example_sentences?: {
      sentence: string;
      meaning: string;
      pronunciation?: string;
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
    }[];
    cultural_notes?: string;
    pronunciation_guide?: string;
    stroke_order?: {
      description: string;
      directions: string[];
    };
    related_characters?: string[];
  };
};

export type HanjaGrade = {
  grade: number;
  name: string;
  description: string;
  category: string;
  character_count: number;
  character_ids: string[];
  metadata: {
    version: string;
    last_updated: string;
  };
};

export type HanjaCategory = {
  id: string;
  name: string;
  description: string;
  grades: number[];
  grade_details: {
    grade: number;
    name: string;
    character_count: number;
    description: string;
  }[];
};

export type RelationType = 'radical_relations' | 'similar_shape' | 'similar_pronunciation' | 'compound_words';

// 캐싱 객체
const characterCache: Record<string, HanjaCharacter> = {};
const gradeCache: Record<number, HanjaGrade> = {};
const categoryCache: Record<string, HanjaCategory> = {};
const relationCache: Record<string, any> = {};
const metadataCache: Record<string, any> = {};

// 데이터 로드 함수
async function loadJsonFile<T>(path: string): Promise<T> {
  try {
    // 개발 환경에서는 경로 앞에 붙음
    const basePath = process.env.NODE_ENV === 'development' ? '' : '';
    const response = await fetch(`${basePath}${path}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`Error loading file ${path}:`, error);
    throw error;
  }
}

// 인덱스
const charactersById: Record<string, HanjaCharacter> = {};
const charactersByUnicode: Record<string, HanjaCharacter> = {};
const charactersByChar: Record<string, HanjaCharacter> = {};

// 시스템 초기화
let isInitialized = false;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

/**
 * 한자 데이터베이스 시스템 초기화 (싱글톤 패턴)
 */
export async function initializeHanjaSystem(): Promise<void> {
  if (isInitialized) return;
  
  if (isInitializing) {
    if (initPromise) {
      await initPromise;
      return;
    }
  }
  
  isInitializing = true;
  
  initPromise = (async () => {
    try {
      // 한자 기본 데이터 로드 (점진적 로딩 전략)
      console.log('Loading hanja data...');
      const hanjaData = await loadJsonFile<{ characters: HanjaCharacter[] }>('/data/new-structure/characters/hanja_characters.json');
      
      // 캐시 및 인덱스 구축
      hanjaData.characters.forEach(char => {
        characterCache[char.id] = char;
        charactersById[char.id] = char;
        charactersByUnicode[char.unicode] = char;
        charactersByChar[char.character] = char;
      });
      
      // 메타데이터 로드 (병렬 로딩)
      console.log('Loading metadata...');
      const metadataPromises = [
        loadJsonFile<Record<string, any>>('/data/new-structure/metadata/radicals.json')
          .then(data => { metadataCache['radicals'] = data; }),
        loadJsonFile<Record<string, any>>('/data/new-structure/metadata/strokes.json')
          .then(data => { metadataCache['strokes'] = data; }),
        loadJsonFile<Record<string, any>>('/data/new-structure/metadata/pronunciations.json')
          .then(data => { metadataCache['pronunciations'] = data; })
      ];
      
      // 관계 데이터 로드
      console.log('Loading relations...');
      const relationsPromise = loadJsonFile<Record<string, any>>('/data/new-structure/relations/hanja_relations.json')
        .then(data => { Object.assign(relationCache, data); });
      
      // 병렬 로딩 대기
      await Promise.all([...metadataPromises, relationsPromise]);
      
      isInitialized = true;
      console.log('Hanja system initialized successfully');
    } catch (error) {
      console.error('Error initializing Hanja system:', error);
      isInitialized = false;
    } finally {
      isInitializing = false;
      initPromise = null;
    }
  })();
  
  await initPromise;
}

/**
 * 초기화 확인 유틸리티
 */
function ensureInitialized(): void {
  if (!isInitialized && !isInitializing) {
    // 초기화가 되지 않았다면 동기적으로 경고를 출력하고 초기화 시작
    console.warn('Hanja system not initialized. Initializing now...');
    initializeHanjaSystem();
    
    // 작은 데이터는 임시 반환 가능
    if (typeof window !== 'undefined') {
      // 클라이언트 측에서는 경고만 표시
      console.warn('Data might be incomplete until initialization completes.');
    }
  }
}

/**
 * ID로 한자 조회 (동기 메서드)
 */
export function getHanjaById(id: string): HanjaCharacter | null {
  ensureInitialized();
  return charactersById[id] || null;
}

/**
 * 문자로 한자 조회 (동기 메서드)
 */
export function getHanjaByCharacter(char: string): HanjaCharacter | null {
  ensureInitialized();
  return charactersByChar[char] || null;
}

/**
 * 유니코드로 한자 조회 (동기 메서드)
 */
export function getHanjaByUnicode(unicode: string): HanjaCharacter | null {
  ensureInitialized();
  return charactersByUnicode[unicode] || null;
}

/**
 * 카테고리 데이터 로드 (비동기 메서드)
 */
export async function getCategory(categoryId: string): Promise<HanjaCategory | null> {
  ensureInitialized();
  
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }
  
  try {
    const category = await loadJsonFile<HanjaCategory>(`/data/new-structure/categories/${categoryId}.json`);
    categoryCache[categoryId] = category;
    return category;
  } catch (error) {
    console.error(`Error loading category ${categoryId}:`, error);
    return null;
  }
}

/**
 * 급수 데이터 로드 (비동기 메서드)
 */
export async function getGrade(grade: number): Promise<HanjaGrade | null> {
  ensureInitialized();
  
  if (gradeCache[grade]) {
    return gradeCache[grade];
  }
  
  try {
    const gradeData = await loadJsonFile<HanjaGrade>(`/data/new-structure/grades/grade_${grade}.json`);
    gradeCache[grade] = gradeData;
    return gradeData;
  } catch (error) {
    console.error(`Error loading grade ${grade}:`, error);
    return null;
  }
}

/**
 * 급수별 한자 목록 로드 (비동기 메서드)
 */
export async function getHanjaByGrade(grade: number): Promise<HanjaCharacter[]> {
  ensureInitialized();
  
  try {
    const gradeData = await getGrade(grade);
    if (!gradeData) return [];
    
    // 이미 로드된 캐시 데이터 활용
    const characters = gradeData.character_ids
      .map(id => getHanjaById(id))
      .filter(char => char !== null) as HanjaCharacter[];
    
    // 캐시에 없는 경우, 직접 로드
    if (characters.length < gradeData.character_count * 0.8) {
      const data = await loadJsonFile<{characters: HanjaCharacter[]}>(`/data/new-structure/characters/by-grade/grade_${grade}.json`);
      
      // 캐시 업데이트
      data.characters.forEach(char => {
        characterCache[char.id] = char;
        charactersById[char.id] = char;
        charactersByUnicode[char.unicode] = char;
        charactersByChar[char.character] = char;
      });
      
      return data.characters;
    }
    
    return characters;
  } catch (error) {
    console.error(`Error getting hanja by grade ${grade}:`, error);
    return [];
  }
}

/**
 * 카테고리별 한자 목록 로드 (비동기 메서드)
 */
export async function getHanjaByCategory(categoryId: string): Promise<HanjaCharacter[]> {
  ensureInitialized();
  
  try {
    const category = await getCategory(categoryId);
    if (!category) return [];
    
    // 병렬로 모든 급수 한자 로드
    const gradePromises = category.grades.map(grade => getHanjaByGrade(grade));
    const gradeCharacters = await Promise.all(gradePromises);
    
    // 결과 합치기
    return gradeCharacters.flat();
  } catch (error) {
    console.error(`Error getting hanja by category ${categoryId}:`, error);
    return [];
  }
}

/**
 * 한자 간 관계 정보 조회 (동기 메서드)
 */
export function getRelatedHanja(id: string, relationType: RelationType): HanjaCharacter[] {
  ensureInitialized();
  
  if (!relationCache[relationType] || !relationCache[relationType][id]) {
    return [];
  }
  
  // ID 목록을 통해 관련 한자 조회
  const relatedIds = relationCache[relationType][id];
  return relatedIds
    .map((relatedId: string) => getHanjaById(relatedId))
    .filter((char: HanjaCharacter | null) => char !== null) as HanjaCharacter[];
}

/**
 * 발음별 한자 목록 조회 (동기 메서드)
 */
export function getHanjaByPronunciation(pronunciation: string): HanjaCharacter[] {
  ensureInitialized();
  
  if (!metadataCache['pronunciations']) {
    return [];
  }
  
  const pronData = metadataCache['pronunciations'].pronunciations
    .find((p: any) => p.pronunciation === pronunciation);
  
  if (!pronData) {
    return [];
  }
  
  return pronData.character_ids
    .map((id: string) => getHanjaById(id))
    .filter((char: HanjaCharacter | null) => char !== null) as HanjaCharacter[];
}

/**
 * 획수별 한자 목록 조회 (동기 메서드)
 */
export function getHanjaByStrokeCount(strokeCount: number): HanjaCharacter[] {
  ensureInitialized();
  
  if (!metadataCache['strokes']) {
    return [];
  }
  
  const strokeData = metadataCache['strokes'].stroke_counts
    .find((s: any) => s.count === strokeCount);
  
  if (!strokeData) {
    return [];
  }
  
  return strokeData.character_ids
    .map((id: string) => getHanjaById(id))
    .filter((char: HanjaCharacter | null) => char !== null) as HanjaCharacter[];
}

/**
 * 부수별 한자 목록 조회 (동기 메서드)
 */
export function getHanjaByRadical(radical: string): HanjaCharacter[] {
  ensureInitialized();
  
  if (!metadataCache['radicals']) {
    return [];
  }
  
  const radicalData = metadataCache['radicals'].radicals
    .find((r: any) => r.radical === radical);
  
  if (!radicalData) {
    return [];
  }
  
  return radicalData.character_ids
    .map((id: string) => getHanjaById(id))
    .filter((char: HanjaCharacter | null) => char !== null) as HanjaCharacter[];
}

/**
 * 한자 검색 (다양한 검색 조건 지원)
 */
export function searchHanja(options: {
  text?: string;
  pronunciation?: string;
  radical?: string;
  strokeCount?: number;
  grade?: number;
  category?: string;
  tags?: string[];
}): HanjaCharacter[] {
  ensureInitialized();
  
  const { text, pronunciation, radical, strokeCount, grade, category, tags } = options;
  let results: HanjaCharacter[] = [];
  
  // 텍스트 검색 (문자 또는 의미)
  if (text) {
    if (text.length === 1) {
      const charMatch = getHanjaByCharacter(text);
      if (charMatch) {
        results = [charMatch];
      }
    } else {
      // 의미 검색
      results = Object.values(charactersById).filter(char => 
        char.meaning.includes(text) || 
        char.extended_data?.detailed_meaning?.includes(text)
      );
    }
    return results;
  }
  
  // 필터링 기반 검색
  let searchPool = Object.values(charactersById);
  
  // 해당하는 조건으로 필터링
  if (pronunciation) {
    searchPool = searchPool.filter(char => char.pronunciation.includes(pronunciation));
  }
  
  if (radical) {
    searchPool = searchPool.filter(char => char.radical === radical);
  }
  
  if (strokeCount !== undefined) {
    searchPool = searchPool.filter(char => char.stroke_count === strokeCount);
  }
  
  if (grade !== undefined) {
    searchPool = searchPool.filter(char => char.grade === grade);
  }
  
  if (tags && tags.length > 0) {
    searchPool = searchPool.filter(char => 
      char.tags && tags.some(tag => char.tags!.includes(tag))
    );
  }
  
  return searchPool;
}

/**
 * 한자와 관련된 복합어 조회
 */
export function getCompoundWords(id: string): { word: string; meaning: string; pronunciation: string }[] {
  ensureInitialized();
  
  if (!relationCache['compound_words'] || !relationCache['compound_words'][id]) {
    return [];
  }
  
  return relationCache['compound_words'][id];
}

/**
 * 전체 한자 데이터 로드 (개발 및 디버깅용)
 */
export async function loadExtendedHanjaData(): Promise<HanjaCharacter[]> {
  ensureInitialized();
  
  try {
    // 이미 로드된 데이터가 충분히 있는 경우 그대로 반환
    const cachedChars = Object.values(charactersById);
    if (cachedChars.length > 0) {
      return cachedChars;
    }
    
    // 데이터 로드
    const data = await loadJsonFile<{characters: HanjaCharacter[]}>('/data/new-structure/characters/hanja_characters.json');
    
    // 캐시 업데이트
    data.characters.forEach(char => {
      characterCache[char.id] = char;
      charactersById[char.id] = char;
      charactersByUnicode[char.unicode] = char;
      charactersByChar[char.character] = char;
    });
    
    return data.characters;
  } catch (error) {
    console.error('Error loading extended hanja data:', error);
    return [];
  }
}

/**
 * ID로 확장 한자 정보 조회 (비동기 메서드)
 */
export async function getExtendedHanjaById(id: string): Promise<HanjaCharacter | null> {
  ensureInitialized();
  
  // 이미 캐시에 있는 경우
  const cachedChar = getHanjaById(id);
  if (cachedChar) {
    return cachedChar;
  }
  
  try {
    // API를 통해 가져오기
    const response = await fetch(`/api/hanja/id?id=${encodeURIComponent(id)}`);
    if (!response.ok) return null;
    
    const char = await response.json();
    
    // 캐시 업데이트
    characterCache[char.id] = char;
    charactersById[char.id] = char;
    charactersByChar[char.character] = char;
    charactersByUnicode[char.unicode] = char;
    
    return char;
  } catch (error) {
    console.error(`Error getting extended hanja data for ID ${id}:`, error);
    return null;
  }
}

/**
 * 문자로 확장 한자 정보 조회 (비동기 메서드)
 */
export async function getExtendedHanjaByCharacter(char: string): Promise<HanjaCharacter | null> {
  ensureInitialized();
  
  // 이미 캐시에 있는 경우
  const cachedChar = getHanjaByCharacter(char);
  if (cachedChar) {
    return cachedChar;
  }
  
  try {
    // API를 통해 가져오기
    const response = await fetch(`/api/hanja/character?character=${encodeURIComponent(char)}`);
    if (!response.ok) return null;
    
    const character = await response.json();
    
    // 캐시 업데이트
    characterCache[character.id] = character;
    charactersById[character.id] = character;
    charactersByChar[character.character] = character;
    charactersByUnicode[character.unicode] = character;
    
    return character;
  } catch (error) {
    console.error(`Error getting extended hanja data for character ${char}:`, error);
    return null;
  }
}

/**
 * 관련 한자 정보 조회 (비동기 메서드)
 */
export async function getRelatedCharactersInfo(id: string): Promise<HanjaCharacter[]> {
  ensureInitialized();
  
  const char = await getExtendedHanjaById(id);
  if (!char || !char.extended_data?.related_characters || char.extended_data.related_characters.length === 0) {
    return [];
  }
  
  // 모든 관련 한자 정보 가져오기
  const promises = char.extended_data.related_characters.map(charId => {
    if (charId.length === 1) {
      // 문자인 경우 확장 정보 가져오기
      return getExtendedHanjaByCharacter(charId);
    } else {
      // ID인 경우 ID로 가져오기
      return getExtendedHanjaById(charId);
    }
  });
  
  const results = await Promise.all(promises);
  return results.filter(Boolean) as HanjaCharacter[];
} 