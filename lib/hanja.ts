/**
 * 한자 데이터 및 관련 유틸리티 함수를 제공하는 라이브러리
 */

/**
 * 한자 문자 정보를 담는 인터페이스
 */
export interface HanjaCharacter {
  id: string;
  character: string;
  kor_pronunciation: string[];  // 한글 발음 (여러 개 가능)
  pronunciation?: string;       // 단일 발음 (유틸에서 사용)
  kor_meaning: string[];        // 훈독 (여러 개 가능)
  meaning: string;              // 의미
  level?: string;               // 급수 (예: '8급', '7급' 등)
  grade?: number;               // 숫자 형태의 등급 (0-9)
  strokes?: number;             // 획수
  stroke_count?: number;        // strokes와 동일 (호환성 유지)
  radical?: string;             // 부수
  examples?: {                  // 예문
    word: string;
    meaning: string;
    pronunciation: string;
  }[];
}

// 샘플 한자 데이터
const hanjaData: HanjaCharacter[] = [
  {
    id: '1',
    character: '人',
    kor_pronunciation: ['인'],
    kor_meaning: ['사람 인'],
    meaning: '사람',
    level: '8급',
    strokes: 2,
    radical: '人'
  },
  {
    id: '2',
    character: '水',
    kor_pronunciation: ['수'],
    kor_meaning: ['물 수'],
    meaning: '물',
    level: '8급',
    strokes: 4,
    radical: '氵'
  },
  {
    id: '3',
    character: '山',
    kor_pronunciation: ['산'],
    kor_meaning: ['메 산'],
    meaning: '산',
    level: '8급',
    strokes: 3,
    radical: '山'
  },
  {
    id: '4',
    character: '日',
    kor_pronunciation: ['일'],
    kor_meaning: ['날 일', '해 일'],
    meaning: '날, 해, 태양',
    level: '8급',
    strokes: 4,
    radical: '日'
  },
  {
    id: '5',
    character: '月',
    kor_pronunciation: ['월'],
    kor_meaning: ['달 월'],
    meaning: '달',
    level: '8급',
    strokes: 4,
    radical: '月'
  },
  {
    id: '6',
    character: '火',
    kor_pronunciation: ['화'],
    kor_meaning: ['불 화'],
    meaning: '불',
    level: '8급',
    strokes: 4,
    radical: '火'
  },
  {
    id: '7',
    character: '木',
    kor_pronunciation: ['목'],
    kor_meaning: ['나무 목'],
    meaning: '나무',
    level: '8급',
    strokes: 4,
    radical: '木'
  },
  {
    id: '8',
    character: '金',
    kor_pronunciation: ['금'],
    kor_meaning: ['쇠 금', '돈 금'],
    meaning: '쇠, 금, 돈',
    level: '8급',
    strokes: 8,
    radical: '金'
  },
  {
    id: '9',
    character: '土',
    kor_pronunciation: ['토'],
    kor_meaning: ['흙 토'],
    meaning: '흙',
    level: '8급',
    strokes: 3,
    radical: '土'
  },
  {
    id: '10',
    character: '大',
    kor_pronunciation: ['대'],
    kor_meaning: ['큰 대'],
    meaning: '크다',
    level: '8급',
    strokes: 3,
    radical: '大'
  },
  {
    id: '11',
    character: '小',
    kor_pronunciation: ['소'],
    kor_meaning: ['작을 소'],
    meaning: '작다',
    level: '8급',
    strokes: 3,
    radical: '小'
  },
  {
    id: '12',
    character: '中',
    kor_pronunciation: ['중'],
    kor_meaning: ['가운데 중'],
    meaning: '가운데',
    level: '8급',
    strokes: 4,
    radical: '丨'
  },
  {
    id: '13',
    character: '心',
    kor_pronunciation: ['심'],
    kor_meaning: ['마음 심'],
    meaning: '마음',
    level: '7급',
    strokes: 4,
    radical: '心'
  },
  {
    id: '14',
    character: '愛',
    kor_pronunciation: ['애'],
    kor_meaning: ['사랑 애'],
    meaning: '사랑',
    level: '6급',
    strokes: 13,
    radical: '心'
  },
  {
    id: '15',
    character: '學',
    kor_pronunciation: ['학'],
    kor_meaning: ['배울 학'],
    meaning: '배우다',
    level: '5급',
    strokes: 16,
    radical: '子'
  }
];

/**
 * 모든 한자 데이터를 가져옵니다.
 */
export function getCharacters(): HanjaCharacter[] {
  return hanjaData;
}

/**
 * ID로 특정 한자를 찾습니다.
 * 
 * @param id 한자 ID
 */
export function getCharacterById(id: string): HanjaCharacter | undefined {
  return hanjaData.find(char => char.id === id);
}

/**
 * 특정 급수의 한자만 필터링합니다.
 * 
 * @param level 한자 급수 (예: '8급')
 */
export function getCharactersByLevel(level: string): HanjaCharacter[] {
  return hanjaData.filter(char => char.level === level);
}

/**
 * 획수로 한자를 필터링합니다.
 * 
 * @param strokes 획수
 */
export function getCharactersByStrokes(strokes: number): HanjaCharacter[] {
  return hanjaData.filter(char => char.strokes === strokes);
}

/**
 * 부수로 한자를 필터링합니다.
 * 
 * @param radical 부수
 */
export function getCharactersByRadical(radical: string): HanjaCharacter[] {
  return hanjaData.filter(char => char.radical === radical);
}

/**
 * 한자 검색 함수
 * 
 * @param query 검색 키워드
 * @param options 검색 옵션
 */
export function searchHanja(
  query: string,
  options: {
    searchCharacter?: boolean;
    searchPronunciation?: boolean;
    searchMeaning?: boolean;
    includeExamples?: boolean;
  } = {
    searchCharacter: true,
    searchPronunciation: true,
    searchMeaning: true,
    includeExamples: false
  }
): HanjaCharacter[] {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.trim().toLowerCase();
  
  return hanjaData.filter(char => {
    // 한자 검색
    if (options.searchCharacter && char.character.includes(searchTerm)) {
      return true;
    }
    
    // 발음 검색
    if (options.searchPronunciation && char.kor_pronunciation.some(p => 
      p.toLowerCase().includes(searchTerm)
    )) {
      return true;
    }
    
    // 의미 검색
    if (options.searchMeaning) {
      // 훈독 검색
      if (char.kor_meaning.some(m => m.toLowerCase().includes(searchTerm))) {
        return true;
      }
      
      // 의미 검색
      if (char.meaning.toLowerCase().includes(searchTerm)) {
        return true;
      }
    }
    
    // 예문 검색 (옵션이 활성화된 경우)
    if (options.includeExamples && char.examples) {
      return char.examples.some(ex => 
        ex.word.includes(searchTerm) || 
        ex.meaning.toLowerCase().includes(searchTerm) ||
        ex.pronunciation.toLowerCase().includes(searchTerm)
      );
    }
    
    return false;
  });
}

/**
 * 한자를 획수 기준으로 그룹화합니다.
 */
export function groupByStrokes(characters: HanjaCharacter[] = hanjaData): Record<number, HanjaCharacter[]> {
  const groups: Record<number, HanjaCharacter[]> = {};
  
  characters.forEach(char => {
    const strokes = char.strokes || 0;
    if (!groups[strokes]) {
      groups[strokes] = [];
    }
    groups[strokes].push(char);
  });
  
  return groups;
}

/**
 * 한자를 부수 기준으로 그룹화합니다.
 */
export function groupByRadical(characters: HanjaCharacter[] = hanjaData): Record<string, HanjaCharacter[]> {
  const groups: Record<string, HanjaCharacter[]> = {};
  
  characters.forEach(char => {
    const radical = char.radical || '기타';
    if (!groups[radical]) {
      groups[radical] = [];
    }
    groups[radical].push(char);
  });
  
  return groups;
}

/**
 * 한자 리스트를 획수 기준으로 정렬합니다.
 */
export function sortByStrokes(characters: HanjaCharacter[]): HanjaCharacter[] {
  return [...characters].sort((a, b) => (a.strokes || 0) - (b.strokes || 0));
}

/**
 * 한자 리스트를 급수 기준으로 정렬합니다.
 */
export function sortByLevel(characters: HanjaCharacter[]): HanjaCharacter[] {
  // 급수 순서 (8급이 가장 쉽고, 1급이 가장 어려움)
  const levelOrder: Record<string, number> = {
    '8급': 1, '7급': 2, '6급': 3, '5급': 4, '4급': 5, '3급': 6, '2급': 7, '1급': 8
  };
  
  return [...characters].sort((a, b) => {
    const levelA = a.level ? levelOrder[a.level] || 0 : 0;
    const levelB = b.level ? levelOrder[b.level] || 0 : 0;
    return levelA - levelB;
  });
}

/**
 * 학년을 학교 급으로 변환하는 함수
 */
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

/**
 * 급수를 숫자 등급으로 변환 (8급 -> 1, 7급 -> 2, ...)
 */
export function convertLevelToGrade(level: string): number {
  const gradeMap: Record<string, number> = {
    '8급': 1, '7급': 2, '6급': 3, '5급': 4, '4급': 5, '3급': 6, '2급': 7, '1급': 8
  };
  return gradeMap[level] || 0;
}

/**
 * 숫자 등급을 급수로 변환 (1 -> 8급, 2 -> 7급, ...)
 */
export function convertGradeToLevel(grade: number): string {
  const levelMap: Record<number, string> = {
    1: '8급', 2: '7급', 3: '6급', 4: '5급', 5: '4급', 6: '3급', 7: '2급', 8: '1급'
  };
  return levelMap[grade] || '기타';
}

/**
 * 한자 데이터를 페이지네이션하여 반환합니다.
 * 
 * @param page 현재 페이지 (1부터 시작)
 * @param limit 페이지당 항목 수
 * @param characters 페이지네이션할 한자 배열 (기본값은 모든 한자)
 */
export function paginateCharacters(
  page: number = 1,
  limit: number = 20,
  characters: HanjaCharacter[] = hanjaData
): { 
  data: HanjaCharacter[]; 
  pagination: { 
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
} {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = characters.length;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: characters.slice(startIndex, endIndex),
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
}

/**
 * 특정 레벨의 한자 총 개수 가져오기
 * 
 * @param level 한자 급수 (예: '8급')
 * @returns 해당 레벨의 한자 총 개수
 */
export function getTotalCharacterCount(level: string): number {
  try {
    return getCharactersByLevel(level).length;
  } catch (e) {
    console.error(`레벨 ${level}의 총 한자 수 가져오기 오류:`, e);
    return 0;
  }
}

/**
 * 더 많은 한자 데이터 로드하기 (페이지네이션용)
 * 결과를 캐싱하여 중복 요청 방지
 * 
 * @param level 한자 급수 (예: '8급')
 * @param limit 가져올 한자 개수
 * @param offset 시작 위치
 * @returns 지정된 범위의 한자 목록
 */
export function loadMoreCharacters(
  level: string,
  limit: number = 20,
  offset: number = 0
): HanjaCharacter[] {
  const cacheKey = `level-${level}`;
  
  try {
    // 캐시된 모든 항목이 있으면 거기서 슬라이스
    if (levelCharactersCache[cacheKey]) {
      return levelCharactersCache[cacheKey].slice(offset, offset + limit);
    }
    
    // 캐시에 없으면 레벨에 해당하는 전체 데이터 가져와서 캐싱
    const levelCharacters = getCharactersByLevel(level);
    levelCharactersCache[cacheKey] = levelCharacters;
    
    // 요청한 범위만 반환
    return levelCharacters.slice(offset, offset + limit);
  } catch (e) {
    console.error(`레벨 ${level}의 추가 한자 로드 오류:`, e);
    return [];
  }
}

/**
 * 한자를 난이도별로 그룹화
 */
export function groupHanjaByGrade(hanjaList: HanjaCharacter[] = hanjaData): Record<string, HanjaCharacter[]> {
  const groups: Record<string, HanjaCharacter[]> = {};
  
  hanjaList.forEach((char) => {
    const grade = char.level || '기타';
    if (!groups[grade]) {
      groups[grade] = [];
    }
    groups[grade].push(char);
  });
  
  return groups;
}

/**
 * 한자 검색 결과를 캐싱하기 위한 객체
 */
const searchCache: Record<string, HanjaCharacter[]> = {};

/**
 * 레벨별 한자 캐싱을 위한 객체
 */
const levelCharactersCache: Record<string, HanjaCharacter[]> = {};

/**
 * 캐시된 검색 결과 초기화
 */
export function clearSearchCache(): void {
  Object.keys(searchCache).forEach(key => {
    delete searchCache[key];
  });
}

/**
 * 캐시된 레벨별 데이터 초기화
 */
export function clearLevelCache(): void {
  Object.keys(levelCharactersCache).forEach(key => {
    delete levelCharactersCache[key];
  });
}

/**
 * 캐시된 검색 결과 사용 또는 새 검색 실행
 * 
 * @param query 검색어
 * @param options 검색 옵션
 * @returns 검색 결과
 */
export function cachedSearchHanja(
  query: string,
  options: {
    searchCharacter?: boolean;
    searchPronunciation?: boolean;
    searchMeaning?: boolean;
    includeExamples?: boolean;
    useCache?: boolean;
  } = {
    searchCharacter: true,
    searchPronunciation: true,
    searchMeaning: true,
    includeExamples: false,
    useCache: true
  }
): HanjaCharacter[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();
  const cacheKey = `${searchTerm}-${JSON.stringify(options)}`;
  
  // 캐시된 결과가 있고 캐시 사용이 활성화된 경우
  if (options.useCache && searchCache[cacheKey]) {
    return searchCache[cacheKey];
  }
  
  // 새 검색 실행
  const results = searchHanja(query, options);
  
  // 결과 캐싱 (캐시 사용이 활성화된 경우)
  if (options.useCache) {
    searchCache[cacheKey] = results;
  }
  
  return results;
}

/**
 * 한자 문자와 발음을 함께 표시하는 함수
 */
export function getNormalizedCharacter(character: string): string {
  const charData = getCharacterById(character) || 
                   hanjaData.find(char => char.character === character);
  
  if (!charData) return character;
  
  const pronunciation = charData.kor_pronunciation && charData.kor_pronunciation.length > 0 
    ? charData.kor_pronunciation[0] 
    : '';
    
  return `${charData.character}(${pronunciation})`;
}

/**
 * 학습용 한자 세트 가져오기 (예: 초급, 중급, 고급)
 * 
 * @param difficulty 난이도 ('beginner', 'intermediate', 'advanced')
 */
export function getStudySet(difficulty: 'beginner' | 'intermediate' | 'advanced'): HanjaCharacter[] {
  switch(difficulty) {
    case 'beginner':
      return hanjaData.filter(char => char.level && ['8급', '7급'].includes(char.level));
    case 'intermediate':
      return hanjaData.filter(char => char.level && ['6급', '5급', '4급'].includes(char.level));
    case 'advanced':
      return hanjaData.filter(char => char.level && ['3급', '2급', '1급'].includes(char.level));
    default:
      return [];
  }
} 