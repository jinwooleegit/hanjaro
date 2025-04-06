import hanjaDatabase from '../../data/hanja_database.json';
import metadata from '../../data/metadata.json';

// 다이나믹 임포트 함수
async function importJSON(path: string) {
  try {
    return await import(path);
  } catch (error) {
    console.error(`파일 로드 오류: ${path}`, error);
    return null;
  }
}

export type HanjaExample = {
  word: string;
  meaning: string;
  pronunciation: string;
};

export type HanjaCharacter = {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  examples: HanjaExample[];
  level: number;
  order: number;
};

export type HanjaLevel = {
  name: string;
  description: string;
  characters: HanjaCharacter[];
};

export type HanjaCategory = {
  name: string;
  description: string;
  total_characters: number;
  levels: {
    [key: string]: HanjaLevel;
  };
};

export type HanjaDatabase = {
  [key: string]: HanjaCategory;
};

// 메타데이터 타입
export type HanjaMetadata = {
  categories: {
    [key: string]: {
      name: string;
      description: string;
      total_characters: number;
      levels: {
        [key: string]: {
          name: string;
          description: string;
          total_characters: number;
        }
      }
    }
  }
};

// 캐시 (메모리 내 저장)
const cache: {
  categories: { [key: string]: HanjaCategory };
  levels: { [key: string]: { [key: string]: HanjaLevel } };
  characters: { [key: string]: HanjaCharacter };
} = {
  categories: {},
  levels: {},
  characters: {}
};

// 전체 메타데이터 가져오기
export const getHanjaMetadata = (): HanjaMetadata => {
  return metadata as HanjaMetadata;
};

// 카테고리 로드 (캐싱 적용)
export const loadHanjaCategory = async (category: string): Promise<HanjaCategory | null> => {
  // 캐시에 있으면 캐시에서 반환
  if (cache.categories[category]) {
    return cache.categories[category];
  }

  try {
    const categoryData = await import(`../../data/categories/${category}.json`);
    
    // 캐시에 저장
    cache.categories[category] = categoryData.default;
    return categoryData.default;
  } catch (error) {
    console.error(`카테고리 로드 오류: ${category}`, error);
    return null;
  }
};

// 레벨 로드 (캐싱 적용)
export const loadHanjaLevel = async (category: string, level: string): Promise<HanjaLevel | null> => {
  // 캐시에 있으면 캐시에서 반환
  if (cache.levels[category] && cache.levels[category][level]) {
    return cache.levels[category][level];
  }

  try {
    const levelData = await import(`../../data/${category}/${level}.json`);
    
    // 캐시 초기화
    if (!cache.levels[category]) {
      cache.levels[category] = {};
    }
    
    // 캐시에 저장
    cache.levels[category][level] = levelData.default;
    return levelData.default;
  } catch (error) {
    console.error(`레벨 로드 오류: ${category}/${level}`, error);
    return null;
  }
};

// --------------- 기존 동기 함수들 (이전 코드와의 호환성 유지) ---------------

// 전체 데이터베이스 가져오기 (레거시 지원)
export const getHanjaDatabase = (): HanjaDatabase => {
  console.warn('getHanjaDatabase 함수는 deprecated 되었습니다. 대신 getHanjaMetadata와 loadHanjaCategory를 사용하세요.');
  return hanjaDatabase as HanjaDatabase;
};

// 특정 카테고리 가져오기 (basic, intermediate, advanced)
export const getHanjaCategory = (category: string): HanjaCategory | null => {
  // 기존 동기 방식 유지 (이전 코드 호환성)
  try {
    if (cache.categories[category]) {
      return cache.categories[category];
    }
    
    const db = getHanjaDatabase();
    return db[category] || null;
  } catch (error) {
    console.error(`카테고리 로드 오류: ${category}`, error);
    return null;
  }
};

// 특정 레벨 가져오기 (level1, level2, ...)
export const getHanjaLevel = (category: string, level: string): HanjaLevel | null => {
  // 기존 동기 방식 유지 (이전 코드 호환성)
  try {
    if (cache.levels[category] && cache.levels[category][level]) {
      return cache.levels[category][level];
    }
    
    const cat = getHanjaCategory(category);
    return cat?.levels[level] || null;
  } catch (error) {
    console.error(`레벨 로드 오류: ${category}/${level}`, error);
    return null;
  }
};

// 특정 한자 가져오기
export const getHanjaCharacter = (character: string): HanjaCharacter | null => {
  // 캐시에 있으면 캐시에서 반환
  if (cache.characters[character]) {
    return cache.characters[character];
  }
  
  try {
    const db = getHanjaDatabase();
    
    for (const category in db) {
      for (const level in db[category].levels) {
        const found = db[category].levels[level].characters.find(
          (char) => char.character === character
        );
        if (found) {
          // 캐시에 저장
          cache.characters[character] = found;
          return found;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`한자 로드 오류: ${character}`, error);
    return null;
  }
};

// 특정 한자 비동기 로드 (새로운 방식)
export const loadHanjaCharacter = async (character: string): Promise<HanjaCharacter | null> => {
  // 캐시에 있으면 캐시에서 반환
  if (cache.characters[character]) {
    return cache.characters[character];
  }
  
  try {
    // 메타데이터에서 모든 카테고리 순회
    const meta = getHanjaMetadata();
    
    for (const categoryName in meta.categories) {
      const categoryMeta = meta.categories[categoryName];
      
      // 카테고리의 모든 레벨 순회
      for (const levelName in categoryMeta.levels) {
        // 레벨 데이터 로드
        const levelData = await loadHanjaLevel(categoryName, levelName);
        
        if (levelData && levelData.characters) {
          // 한자 찾기
          const found = levelData.characters.find(
            (char) => char.character === character
          );
          
          if (found) {
            // 캐시에 저장
            cache.characters[character] = found;
            return found;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`한자 비동기 로드 오류: ${character}`, error);
    return null;
  }
};

// 카테고리별 레벨 목록 가져오기
export const getLevelsForCategory = (category: string): { id: string; name: string }[] => {
  try {
    const meta = getHanjaMetadata();
    const categoryMeta = meta.categories[category];
    
    if (!categoryMeta) return [];
    
    return Object.entries(categoryMeta.levels).map(([id, level]) => ({
      id,
      name: level.name
    }));
  } catch (error) {
    console.error(`카테고리 레벨 목록 로드 오류: ${category}`, error);
    return [];
  }
};

// 특정 레벨의 한자 목록 가져오기
export const getCharactersForLevel = (category: string, level: string): HanjaCharacter[] => {
  try {
    const lev = getHanjaLevel(category, level);
    return lev?.characters || [];
  } catch (error) {
    console.error(`레벨 한자 목록 로드 오류: ${category}/${level}`, error);
    return [];
  }
};

// 카테고리 목록 가져오기
export const getCategories = (): { id: string; name: string; description: string }[] => {
  try {
    const meta = getHanjaMetadata();
    
    return Object.entries(meta.categories).map(([id, category]) => ({
      id,
      name: category.name,
      description: category.description
    }));
  } catch (error) {
    console.error('카테고리 목록 로드 오류:', error);
    return [];
  }
}; 