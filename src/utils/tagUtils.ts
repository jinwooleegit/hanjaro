import { HanjaCharacter } from "./types";

// 태그 인터페이스 정의
export interface Tag {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
}

export interface TagsData {
  tag_categories: TagCategory[];
}

// 태그 데이터 캐시
let tagsDataCache: TagsData | null = null;

/**
 * JSON 파일을 불러오는 유틸리티 함수
 */
export const importJSON = async <T>(filePath: string): Promise<T> => {
  try {
    // 브라우저 환경에서는 fetch를 사용하여 JSON 파일을 불러옵니다
    const response = await fetch(`/${filePath}`);
    if (!response.ok) {
      throw new Error(`JSON 파일을 불러오는데 실패했습니다: ${filePath}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`JSON 파일을 불러오는 중 오류가 발생했습니다: ${filePath}`, error);
    throw error;
  }
};

/**
 * 태그 데이터를 불러옵니다.
 */
export const loadTagsData = async (): Promise<TagsData> => {
  if (tagsDataCache) {
    return tagsDataCache;
  }

  try {
    const tagsData = await importJSON<TagsData>('data/tags.json');
    tagsDataCache = tagsData;
    return tagsData;
  } catch (error) {
    console.error('태그 데이터를 불러오는 중 오류가 발생했습니다:', error);
    return { tag_categories: [] };
  }
};

/**
 * 모든 태그 카테고리를 불러옵니다.
 */
export const getAllTagCategories = async (): Promise<TagCategory[]> => {
  const tagsData = await loadTagsData();
  return tagsData.tag_categories;
};

/**
 * 특정 카테고리의 모든 태그를 불러옵니다.
 * @param categoryId 카테고리 ID
 */
export const getTagsByCategoryId = async (categoryId: string): Promise<Tag[]> => {
  const tagsData = await loadTagsData();
  const category = tagsData.tag_categories.find(cat => cat.id === categoryId);
  return category ? category.tags : [];
};

/**
 * 태그 ID로 태그 정보를 조회합니다.
 * @param tagId 태그 ID (카테고리:태그 형식)
 */
export const getTagInfo = async (tagId: string): Promise<Tag | null> => {
  const [categoryId, tagInCategoryId] = tagId.split(':');
  const tags = await getTagsByCategoryId(categoryId);
  return tags.find(tag => tag.id === tagInCategoryId) || null;
};

/**
 * 태그 ID 목록에 해당하는 태그 정보를 모두 조회합니다.
 * @param tagIds 태그 ID 목록
 */
export const getTagsInfo = async (tagIds: string[]): Promise<Tag[]> => {
  const tagsPromises = tagIds.map(tagId => getTagInfo(tagId));
  const tags = await Promise.all(tagsPromises);
  return tags.filter((tag): tag is Tag => tag !== null);
};

/**
 * 태그로 한자를 필터링합니다.
 * @param characters 한자 배열
 * @param tagIds 필터링할 태그 ID 목록
 */
export const filterCharactersByTags = (
  characters: HanjaCharacter[],
  tagIds: string[]
): HanjaCharacter[] => {
  if (tagIds.length === 0) {
    return characters;
  }

  return characters.filter(character => {
    if (!character.tags) {
      return false;
    }
    
    return tagIds.some(tagId => character.tags?.includes(tagId));
  });
};

/**
 * 여러 레벨의 한자를 로드하고 태그로 필터링합니다.
 * @param category 카테고리 (basic, advanced 등)
 * @param levels 레벨 배열
 * @param tagIds 필터링할 태그 ID 목록
 */
export const loadCharactersByLevelsAndTags = async (
  category: string,
  levels: number[],
  tagIds: string[] = []
): Promise<HanjaCharacter[]> => {
  try {
    // 모든 레벨의 한자 데이터를 비동기적으로 불러옵니다
    const charactersPromises = levels.map(async (level) => {
      try {
        const data = await importJSON<{ characters: HanjaCharacter[] }>(`data/${category}/level${level}.json`);
        return data.characters;
      } catch (error) {
        console.error(`레벨 ${level} 데이터를 불러오는 중 오류가 발생했습니다:`, error);
        return [] as HanjaCharacter[];
      }
    });

    // 모든 비동기 작업이 완료될 때까지 기다립니다
    const charactersArrays = await Promise.all(charactersPromises);
    
    // 모든 레벨의 한자를 하나의 배열로 합칩니다
    const allCharacters = charactersArrays.flat();
    
    // 태그로 필터링합니다
    return filterCharactersByTags(allCharacters, tagIds);
  } catch (error) {
    console.error('한자를 불러오는 중 오류가 발생했습니다:', error);
    return [];
  }
};

/**
 * 특정 태그를 가진 모든 한자를 로드합니다.
 * @param tagId 태그 ID
 */
export const loadCharactersByTag = async (tagId: string): Promise<HanjaCharacter[]> => {
  // 기본 카테고리와 레벨 목록
  const categories = ['basic', 'advanced'];
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const allCharactersPromises = categories.map(category => 
    loadCharactersByLevelsAndTags(category, levels, [tagId])
  );
  
  const allCharactersArrays = await Promise.all(allCharactersPromises);
  return allCharactersArrays.flat();
};

/**
 * 한자에 태그를 추가합니다.
 * @param character 한자 객체
 * @param tagIds 추가할 태그 ID 목록
 */
export const addTagsToCharacter = (
  character: HanjaCharacter,
  tagIds: string[]
): HanjaCharacter => {
  const existingTags = character.tags || [];
  
  // 중복 태그 제거 (Array.from과 Set 사용)
  const uniqueTags = Array.from(new Set([...existingTags, ...tagIds]));
  return {
    ...character,
    tags: uniqueTags
  };
};

/**
 * 여러 한자에 동일한 태그를 일괄 추가합니다.
 * @param characters 한자 배열
 * @param tagIds 추가할 태그 ID 목록
 */
export const addTagsToCharacters = (
  characters: HanjaCharacter[],
  tagIds: string[]
): HanjaCharacter[] => {
  return characters.map(character => addTagsToCharacter(character, tagIds));
};

/**
 * 한자에서 태그를 제거합니다.
 * @param character 한자 객체
 * @param tagIds 제거할 태그 ID 목록
 */
export const removeTagsFromCharacter = (
  character: HanjaCharacter,
  tagIds: string[]
): HanjaCharacter => {
  if (!character.tags) {
    return character;
  }
  
  const filteredTags = character.tags.filter(tag => !tagIds.includes(tag));
  return {
    ...character,
    tags: filteredTags
  };
};

/**
 * 추천 태그를 자동으로 생성합니다.
 * 한자의 의미, 획수 등에 기반하여 적절한 태그를 추천합니다.
 * @param character 한자 객체
 */
export const generateRecommendedTags = (character: HanjaCharacter): string[] => {
  const recommendedTags: string[] = [];
  
  // 획수에 따른 난이도 태그 추천
  if (character.stroke_count <= 4) {
    recommendedTags.push('difficulty:beginner');
  } else if (character.stroke_count <= 9) {
    recommendedTags.push('difficulty:intermediate');
  } else {
    recommendedTags.push('difficulty:advanced');
  }
  
  // 부수에 따른 태그 추천 (간단한 예시)
  const radicalMap: Record<string, string> = {
    '人': 'radical:person',
    '心': 'radical:heart',
    '水': 'radical:water',
    '木': 'radical:tree',
    '言': 'radical:speech',
  };
  
  if (character.radical && radicalMap[character.radical]) {
    recommendedTags.push(radicalMap[character.radical]);
  }
  
  return recommendedTags;
};

/**
 * 태그별 한자 통계를 계산합니다.
 * @param characters 한자 배열
 */
export const calculateTagStatistics = (characters: HanjaCharacter[]): Record<string, number> => {
  const tagStats: Record<string, number> = {};
  
  characters.forEach(character => {
    if (character.tags) {
      character.tags.forEach((tag: string) => {
        if (!tagStats[tag]) {
          tagStats[tag] = 0;
        }
        tagStats[tag]++;
      });
    }
  });
  
  return tagStats;
};

/**
 * 한자를 태그별로 그룹화합니다.
 * @param characters 한자 배열
 */
export const groupCharactersByTag = (
  characters: HanjaCharacter[]
): Record<string, HanjaCharacter[]> => {
  const groupedCharacters: Record<string, HanjaCharacter[]> = {};
  
  characters.forEach(character => {
    if (character.tags) {
      character.tags.forEach((tag: string) => {
        if (!groupedCharacters[tag]) {
          groupedCharacters[tag] = [];
        }
        groupedCharacters[tag].push(character);
      });
    }
  });
  
  return groupedCharacters;
}; 