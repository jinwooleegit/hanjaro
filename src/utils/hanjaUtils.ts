import hanjaDatabase from '../../data/hanja_database.json';

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
  total_count: number;
  levels: {
    [key: string]: HanjaLevel;
  };
};

export type HanjaDatabase = {
  [key: string]: HanjaCategory;
};

// 전체 데이터베이스 가져오기
export const getHanjaDatabase = (): HanjaDatabase => {
  return hanjaDatabase as HanjaDatabase;
};

// 특정 카테고리 가져오기 (basic, intermediate, advanced)
export const getHanjaCategory = (category: string): HanjaCategory | null => {
  const db = getHanjaDatabase();
  return db[category] || null;
};

// 특정 레벨 가져오기 (level1, level2, ...)
export const getHanjaLevel = (category: string, level: string): HanjaLevel | null => {
  const cat = getHanjaCategory(category);
  return cat?.levels[level] || null;
};

// 특정 한자 가져오기
export const getHanjaCharacter = (character: string): HanjaCharacter | null => {
  const db = getHanjaDatabase();
  
  for (const category in db) {
    for (const level in db[category].levels) {
      const found = db[category].levels[level].characters.find(
        (char) => char.character === character
      );
      if (found) return found;
    }
  }
  
  return null;
};

// 카테고리별 레벨 목록 가져오기
export const getLevelsForCategory = (category: string): { id: string; name: string }[] => {
  const cat = getHanjaCategory(category);
  if (!cat) return [];
  
  return Object.entries(cat.levels).map(([id, level]) => ({
    id,
    name: level.name
  }));
};

// 특정 레벨의 한자 목록 가져오기
export const getCharactersForLevel = (category: string, level: string): HanjaCharacter[] => {
  const lev = getHanjaLevel(category, level);
  return lev?.characters || [];
};

// 카테고리 목록 가져오기
export const getCategories = (): { id: string; name: string; description: string }[] => {
  const db = getHanjaDatabase();
  
  return Object.entries(db).map(([id, category]) => ({
    id,
    name: category.name,
    description: category.description
  }));
}; 