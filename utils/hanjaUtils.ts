import hanjaDatabase from '@/data/hanja_database.json';

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

export type HanjaCharacter = {
  character: string;
  pronunciation: string;
  meaning: string;
  radical: string;
  stroke_count: number;
  grade: number;
  examples: HanjaExample[];
};

// 모든 카테고리 가져오기
export function getCategories(): HanjaCategory[] {
  return hanjaDatabase.categories;
}

// 카테고리 ID로 카테고리 찾기
export function getCategoryById(categoryId: string): HanjaCategory | undefined {
  return hanjaDatabase.categories.find(category => category.id === categoryId);
}

// 카테고리 ID와 레벨 ID로 레벨 찾기
export function getHanjaLevel(categoryId: string, levelId: string): HanjaLevel | undefined {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  
  return category.levels.find(level => level.id === levelId);
}

// 카테고리 ID와 레벨 ID로 해당 레벨의 모든 한자 데이터 가져오기
export function getCharactersForLevel(categoryId: string, levelId: string): HanjaCharacter[] {
  const level = getHanjaLevel(categoryId, levelId);
  if (!level) return [];
  
  return level.characters.map(char => {
    const charData = hanjaDatabase.characters.find(c => c.character === char);
    if (!charData) {
      // 데이터가 없을 경우 기본 데이터 반환
      return {
        character: char,
        pronunciation: '정보 없음',
        meaning: '정보 없음',
        radical: '정보 없음',
        stroke_count: 0,
        grade: 0,
        examples: []
      };
    }
    return charData;
  });
}

// 한자 문자로 한자 데이터 가져오기
export function getHanjaCharacter(character: string): HanjaCharacter | undefined {
  return hanjaDatabase.characters.find(char => char.character === character);
}

// 특정 학년의 한자 가져오기
export function getCharactersByGrade(grade: number): HanjaCharacter[] {
  return hanjaDatabase.characters.filter(char => char.grade === grade);
}

// 특정 획수의 한자 가져오기
export function getCharactersByStrokeCount(strokeCount: number): HanjaCharacter[] {
  return hanjaDatabase.characters.filter(char => char.stroke_count === strokeCount);
}

// 검색어로 한자 검색하기 (한자, 뜻, 음 등을 통합 검색)
export function searchCharacters(query: string): HanjaCharacter[] {
  const searchTerm = query.toLowerCase();
  
  return hanjaDatabase.characters.filter(char => 
    char.character.includes(query) || 
    char.meaning.toLowerCase().includes(searchTerm) || 
    char.pronunciation.toLowerCase().includes(searchTerm) ||
    char.radical.toLowerCase().includes(searchTerm) ||
    char.examples.some(example => 
      example.word.toLowerCase().includes(searchTerm) ||
      example.meaning.toLowerCase().includes(searchTerm) ||
      example.pronunciation.toLowerCase().includes(searchTerm)
    )
  );
} 