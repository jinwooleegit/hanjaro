import basicCategory from '../../data/categories/basic.json';
import advancedCategory from '../../data/categories/advanced.json';
import hanjaDatabase from '../../data/hanja_database.json';
import metadata from '../../data/metadata.json';

// 기본 레벨 데이터를 사전에 로드
import basicLevel1 from '../../data/basic/level1.json';
import basicLevel2 from '../../data/basic/level2.json';
import basicLevel3 from '../../data/basic/level3.json';
import basicLevel4 from '../../data/basic/level4.json';
import basicLevel5 from '../../data/basic/level5.json';
import basicLevel6 from '../../data/basic/level6.json';

// 고급 레벨 데이터를 사전에 로드
import advancedLevel1 from '../../data/advanced/level1.json';
import advancedLevel2 from '../../data/advanced/level2.json';

// 점진적 로딩을 위한 배치 크기 설정
const BATCH_SIZE = 20;

// 다이나믹 임포트 함수 - 이제 실제로 활용
async function importJSON(path: string) {
  console.log(`파일 로드 시도: ${path}`);
  
  try {
    // 경로 정규화
    if (path.startsWith('./')) {
      path = path.substring(2); // './'를 제거
    }
    
    // 정확한 경로 매칭을 통한 정적 데이터 반환
    // basic 레벨 데이터
    if (path === 'basic/level1.json' || path === 'data/basic/level1.json') return basicLevel1;
    if (path === 'basic/level2.json' || path === 'data/basic/level2.json') return basicLevel2;
    if (path === 'basic/level3.json' || path === 'data/basic/level3.json') return basicLevel3;
    if (path === 'basic/level4.json' || path === 'data/basic/level4.json') return basicLevel4;
    if (path === 'basic/level5.json' || path === 'data/basic/level5.json') return basicLevel5;
    if (path === 'basic/level6.json' || path === 'data/basic/level6.json') return basicLevel6;
    
    // advanced 레벨 데이터
    if (path === 'advanced/level1.json' || path === 'data/advanced/level1.json') return advancedLevel1;
    if (path === 'advanced/level2.json' || path === 'data/advanced/level2.json') return advancedLevel2;
    
    // 카테고리 데이터
    if (path === 'categories/basic.json' || path === 'data/categories/basic.json') return basicCategory;
    if (path === 'categories/advanced.json' || path === 'data/categories/advanced.json') return advancedCategory;
    
    // 마지막 대안: 캐시된 데이터 확인
    const pathParts = path.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const category = pathParts[pathParts.length - 2] || pathParts[0];
    const level = fileName.replace('.json', '');
    
    if (category && level && sampleLevelData[category]?.[level]) {
      console.log(`캐시된 샘플 데이터 사용: ${category}/${level}`);
      return sampleLevelData[category][level];
    }
    
    console.error(`지원되지 않는 파일 경로: ${path}`);
    return null;
  } catch (error) {
    console.error(`최종 파일 로드 오류: ${path}`, error);
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

// 전체 한자 데이터를 저장할 확장된 캐시
const cache: {
  categories: { [key: string]: HanjaCategory };
  levels: { [key: string]: { [key: string]: HanjaLevel } };
  levelPartial: { [key: string]: { [key: string]: { loaded: boolean, offset: number } } };
  characters: { [key: string]: HanjaCharacter };
} = {
  categories: {},
  levels: {},
  levelPartial: {}, // 부분 로딩 상태 추적
  characters: {}
};

// 전체 메타데이터 가져오기
export const getHanjaMetadata = (): HanjaMetadata => {
  return metadata as HanjaMetadata;
};

// 사전 로드된 데이터를 사용하는 맵 생성
interface CategoryDataMap {
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

interface LevelDataMap {
  [key: string]: {
    [key: string]: {
      name: string;
      description: string;
      characters: HanjaCharacter[];
    }
  }
}

const categoryData: CategoryDataMap = {
  'basic': basicCategory,
  'advanced': advancedCategory
};

// 샘플 데이터 맵 - 빠른 초기 로딩용
const sampleLevelData: LevelDataMap = {
  'basic': {
    'level1': basicLevel1,
    'level2': basicLevel2,
    'level3': basicLevel3,
    'level4': basicLevel4,
    'level5': basicLevel5,
    'level6': basicLevel6
  },
  'advanced': {
    'level1': advancedLevel1,
    'level2': advancedLevel2
  }
};

// 전체 데이터 경로 맵 - 필요할 때 로드하기 위한 경로
const fullDataPaths: {[key: string]: {[key: string]: string}} = {
  'basic': {
    'level1': 'data/basic/level1.json',
    'level2': 'data/basic/level2.json', 
    'level3': 'data/basic/level3.json',
    'level4': 'data/basic/level4.json',
    'level5': 'data/basic/level5.json',
    'level6': 'data/basic/level6.json'
  },
  'advanced': {
    'level1': 'data/advanced/level1.json',
    'level2': 'data/advanced/level2.json'
  }
};

// level이 특정 문자열로 시작하면 해당 카테고리로 변환하는 함수
const getCategoryFromLevel = (level: string): string => {
  if (level.startsWith('basic-')) {
    return 'basic';
  } else if (level.startsWith('advanced-')) {
    return 'advanced';
  }
  return 'basic'; // 기본값
};

// level 문자열을 levelN 형식으로 변환하는 함수 
const getNormalizedLevelId = (level: string): string => {
  // level이 basic-level1, advanced-level2 등의 형식인 경우
  if (level.includes('-')) {
    const parts = level.split('-');
    return parts[parts.length - 1]; // 마지막 부분 사용 (levelN)
  }
  return level; // 이미 levelN 형식인 경우
};

// 카테고리 로드 (캐싱 적용)
export const loadHanjaCategory = async (category: string): Promise<HanjaCategory | null> => {
  // 캐시에 있으면 캐시에서 반환
  if (cache.categories[category]) {
    return cache.categories[category];
  }

  try {
    if (!categoryData[category]) {
      console.error(`지원되지 않는 카테고리: ${category}`);
      return null;
    }
    
    // 타입 변환: 메타데이터 형식을 HanjaCategory 타입으로 변환
    const data = categoryData[category];
    const convertedData: HanjaCategory = {
      name: data.name,
      description: data.description,
      total_characters: data.total_characters || 0,
      levels: {} // 빈 객체로 초기화
    };
    
    // 레벨 데이터 변환
    if (data.levels) {
      Object.entries(data.levels).forEach(([levelKey, levelValue]: [string, any]) => {
        // levelValue를 HanjaLevel 타입으로 변환
        convertedData.levels[levelKey] = {
          name: levelValue.name,
          description: levelValue.description,
          characters: [] // 기본값으로 빈 배열 설정
        };
      });
    }
    
    // 캐시에 저장
    cache.categories[category] = convertedData;
    return convertedData;
  } catch (error) {
    console.error(`카테고리 로드 오류: ${category}`, error);
    return null;
  }
};

// 레벨 로드 (샘플 데이터 우선 사용, 필요시 전체 데이터 로드)
export const loadHanjaLevel = async (category: string, level: string): Promise<HanjaLevel | null> => {
  // URL 경로 방식 처리: basic-level1 형식인 경우
  const normalizedCategory = level.includes('-') ? getCategoryFromLevel(level) : category;
  const normalizedLevel = getNormalizedLevelId(level);
  
  // 캐시에 있으면 캐시에서 반환
  if (cache.levels[normalizedCategory] && cache.levels[normalizedCategory][normalizedLevel]) {
    return cache.levels[normalizedCategory][normalizedLevel];
  }

  try {
    // 1. 샘플 데이터로 초기화
    if (sampleLevelData[normalizedCategory] && sampleLevelData[normalizedCategory][normalizedLevel]) {
      const data = sampleLevelData[normalizedCategory][normalizedLevel];
      const processedData = {
        ...data,
        characters: data.characters || []
      };
      
      // 캐시 초기화
      if (!cache.levels[normalizedCategory]) {
        cache.levels[normalizedCategory] = {};
      }
      
      // 캐시에 저장
      cache.levels[normalizedCategory][normalizedLevel] = processedData;
      
      // 부분 로딩 상태 초기화
      if (!cache.levelPartial[normalizedCategory]) {
        cache.levelPartial[normalizedCategory] = {};
      }
      cache.levelPartial[normalizedCategory][normalizedLevel] = { loaded: false, offset: 0 };
      
      // 2. 즉시 전체 데이터 로드 시작 (백그라운드가 아닌 동기적으로)
      await loadFullLevelDataInBackground(normalizedCategory, normalizedLevel);
      
      // 캐시에서 업데이트된 데이터 반환
      return cache.levels[normalizedCategory][normalizedLevel];
    } else {
      console.error(`지원되지 않는 레벨: ${normalizedCategory}/${normalizedLevel}`);
      return null;
    }
  } catch (error) {
    console.error(`레벨 로드 오류: ${normalizedCategory}/${normalizedLevel}`, error);
    return null;
  }
};

// 전체 레벨 데이터를 비동기적으로 로드
export const loadFullLevelDataInBackground = async (category: string, levelId: string): Promise<HanjaLevel | null> => {
  const normalizedLevelId = getNormalizedLevelId(levelId);
  
  console.log(`전체 레벨 데이터 로드 시도: ${category}/${normalizedLevelId}`);
  
  // 캐시에 있으면 캐시에서 반환
  if (cache.levels[category] && cache.levels[category][normalizedLevelId]) {
    console.log(`캐시에서 데이터 로드: ${category}/${normalizedLevelId}`);
    return cache.levels[category][normalizedLevelId];
  }
  
  try {
    // 카테고리와 레벨에 따라 정적 데이터 직접 할당
    let data: HanjaLevel | null = null;
    
    // 정적으로 로드된 레벨 데이터 사용
    if (category === 'basic') {
      if (normalizedLevelId === 'level1') data = basicLevel1 as HanjaLevel;
      else if (normalizedLevelId === 'level2') data = basicLevel2 as HanjaLevel;
      else if (normalizedLevelId === 'level3') data = basicLevel3 as HanjaLevel;
      else if (normalizedLevelId === 'level4') data = basicLevel4 as HanjaLevel;
      else if (normalizedLevelId === 'level5') data = basicLevel5 as HanjaLevel;
      else if (normalizedLevelId === 'level6') data = basicLevel6 as HanjaLevel;
    } else if (category === 'advanced') {
      if (normalizedLevelId === 'level1') data = advancedLevel1 as HanjaLevel;
      else if (normalizedLevelId === 'level2') data = advancedLevel2 as HanjaLevel;
    }
    
    // 정적 할당으로 데이터를 찾지 못한 경우
    if (!data) {
      console.log(`정적 데이터에서 ${category}/${normalizedLevelId}를 찾을 수 없습니다. 샘플 데이터 확인 중...`);
      
      // 샘플 데이터 확인
      if (sampleLevelData[category] && sampleLevelData[category][normalizedLevelId]) {
        console.log(`샘플 데이터에서 ${category}/${normalizedLevelId} 발견`);
        data = sampleLevelData[category][normalizedLevelId] as HanjaLevel;
      } else {
        console.error(`${category}/${normalizedLevelId}를 위한 데이터를 찾을 수 없습니다.`);
        return null;
      }
    }
    
    // 데이터 검증
    if (!data || !data.characters || !Array.isArray(data.characters)) {
      console.error(`데이터 구조 오류: ${category}/${normalizedLevelId}`);
      return null;
    }
    
    // 캐시에 저장
    if (!cache.levels[category]) {
      cache.levels[category] = {};
    }
    cache.levels[category][normalizedLevelId] = data;
    
    // 부분 로딩 상태 업데이트
    if (!cache.levelPartial[category]) {
      cache.levelPartial[category] = {};
    }
    cache.levelPartial[category][normalizedLevelId] = { 
      loaded: true, 
      offset: data.characters.length 
    };
    
    console.log(`전체 한자 데이터 로드 완료: ${category}/${normalizedLevelId} (${data.characters.length}개 한자)`);
    return data;
  } catch (error) {
    console.error(`레벨 데이터 로드 실패 ${category}/${normalizedLevelId}:`, error);
    return null;
  }
};

// 점진적으로 한자 데이터 로드 (페이지네이션용)
export const loadMoreCharacters = async (category: string, level: string, limit: number = BATCH_SIZE): Promise<HanjaCharacter[]> => {
  try {
    // URL 경로 방식 처리: basic-level1 형식인 경우
    const normalizedCategory = level.includes('-') ? getCategoryFromLevel(level) : category;
    const normalizedLevel = getNormalizedLevelId(level);
    
    // 부분 로딩 상태 확인
    if (!cache.levelPartial[normalizedCategory] || !cache.levelPartial[normalizedCategory][normalizedLevel]) {
      // 해당 레벨이 아직 초기화되지 않은 경우 초기화
      await loadHanjaLevel(normalizedCategory, normalizedLevel);
      
      // 초기화 후에도 캐시가 없으면 빈 배열 반환
      if (!cache.levels[normalizedCategory]?.[normalizedLevel]) {
        console.error(`레벨 데이터를 찾을 수 없음: ${normalizedCategory}/${normalizedLevel}`);
        return [];
      }
      
      return cache.levels[normalizedCategory][normalizedLevel].characters.slice(0, limit);
    }
    
    const { loaded, offset } = cache.levelPartial[normalizedCategory][normalizedLevel];
    const characters = cache.levels[normalizedCategory][normalizedLevel].characters;
    
    // 모든 데이터가 이미 로드되었고 더 이상 가져올 데이터가 없는 경우
    if (loaded && offset >= characters.length) {
      console.log(`더 이상 로드할 한자가 없습니다: ${normalizedCategory}/${normalizedLevel}, 현재 오프셋: ${offset}, 전체 데이터: ${characters.length}`);
      return [];
    }
    
    // 이미 전체 데이터가 로드된 경우
    if (loaded) {
      console.log(`다음 배치 로드: ${normalizedCategory}/${normalizedLevel}, 오프셋: ${offset}, 한계: ${limit}`);
      
      // 다음 배치 반환
      const nextBatch = characters.slice(offset, offset + limit);
      
      // 오프셋 업데이트 (캐시에 저장)
      cache.levelPartial[normalizedCategory][normalizedLevel].offset = Math.min(
        offset + limit, 
        characters.length
      );
      
      console.log(`새 오프셋: ${cache.levelPartial[normalizedCategory][normalizedLevel].offset}, 반환된 한자 수: ${nextBatch.length}`);
      return nextBatch;
    } else {
      // 백그라운드에서 전체 데이터 로드가 진행 중인 경우
      // 강제로 전체 데이터 로드 시도
      await loadFullLevelDataInBackground(normalizedCategory, normalizedLevel);
      
      // 부분 데이터 반환
      const availableCharacters = cache.levels[normalizedCategory][normalizedLevel].characters;
      const nextOffset = Math.min(offset + limit, availableCharacters.length);
      
      // 오프셋 업데이트
      cache.levelPartial[normalizedCategory][normalizedLevel].offset = nextOffset;
      
      return availableCharacters.slice(offset, nextOffset);
    }
  } catch (error) {
    console.error(`더 많은 한자 로드 오류: ${category}/${level}`, error);
    return [];
  }
};

// 한자의 전체 개수 가져오기
export const getTotalCharacterCount = (category: string, level: string): number => {
  try {
    // URL 경로 방식 처리: basic-level1 형식인 경우
    const normalizedCategory = level.includes('-') ? getCategoryFromLevel(level) : category;
    const normalizedLevel = getNormalizedLevelId(level);
    
    // 샘플 데이터에서 실제 한자 수 가져오기 
    const sampleData = sampleLevelData[normalizedCategory]?.[normalizedLevel];
    if (sampleData && sampleData.characters) {
      // 실제 데이터 개수 사용
      const actualCount = sampleData.characters.length;
      console.log(`실제 한자 수 사용: ${normalizedCategory}/${normalizedLevel} - ${actualCount}개`);
      return actualCount;
    }
    
    // 메타데이터에서 선언된 값 사용 (UI 표시용)
    const metadata = getHanjaMetadata();
    const declaredCount = metadata.categories[normalizedCategory]?.levels[normalizedLevel]?.total_characters || 0;
    
    // 카테고리별 고정된 값 설정 (실제 할당된 한자 수보다 훨씬 많은 수를 반환)
    if (normalizedCategory === 'basic') {
      if (normalizedLevel === 'level1') return 80;  // 기본값
      if (normalizedLevel === 'level2') return 120; // 기본값
      if (normalizedLevel === 'level3') return 120; // 기본값
      if (normalizedLevel === 'level4') return 120; // 기본값
      if (normalizedLevel === 'level5') return 100; // 기본값
      if (normalizedLevel === 'level6') return 80;  // 기본값
      return 100; // 기타 기본 레벨
    } else if (normalizedCategory === 'advanced') {
      if (normalizedLevel === 'level1') return 50; // 고급 레벨 기본값
      if (normalizedLevel === 'level2') return 50; // 고급 레벨 기본값
      return 50; // 기타 고급 레벨
    }
    
    // 메타데이터에 지정된 값이 있고 5보다 크면 해당 값 사용, 아니면 기본값 50 사용
    return declaredCount > 5 ? declaredCount : 50;
  } catch (error) {
    console.error(`한자 수 확인 오류: ${category}/${level}`, error);
    return 0;
  }
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
    
    // 캐시에 없는 경우 기본 데이터에서 로드
    const db = getHanjaDatabase();
    if (db[category] && db[category].levels && db[category].levels[level]) {
      // 비동기 로드 시작 (백그라운드)
      setTimeout(() => {
        loadHanjaLevel(category, level).catch(console.error);
      }, 0);
      
      return db[category].levels[level];
    }
    
    return null;
  } catch (error) {
    console.error(`레벨 로드 오류: ${category}/${level}`, error);
    return null;
  }
};

// 전체 데이터베이스 가져오기 (레거시 지원)
export const getHanjaDatabase = (): HanjaDatabase => {
  console.warn('getHanjaDatabase 함수는 deprecated 되었습니다. 대신 getHanjaMetadata와 loadHanjaCategory를 사용하세요.');
  return hanjaDatabase as HanjaDatabase;
};

// 특정 한자 정보 가져오기
export const getHanjaCharacter = (character: string): HanjaCharacter | null => {
  // 먼저 캐시에서 검색
  if (cache.characters[character]) {
    return cache.characters[character];
  }
  
  // 캐시에 없으면 전체 데이터베이스에서 검색
  try {
    const db = getHanjaDatabase();
    for (const categoryKey in db) {
      const category = db[categoryKey];
      for (const levelKey in category.levels) {
        const level = category.levels[levelKey];
        const found = level.characters.find(c => c.character === character);
        if (found) {
          // 캐시에 추가
          cache.characters[character] = found;
          return found;
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`한자 검색 오류: ${character}`, error);
    return null;
  }
};

// 비동기 한자 로드
export const loadHanjaCharacter = async (character: string): Promise<HanjaCharacter | null> => {
  // 캐시에 있으면 바로 반환
  if (cache.characters[character]) {
    return cache.characters[character];
  }
  
  try {
    // 먼저 전체 데이터베이스에서 검색 시도
    const syncResult = getHanjaCharacter(character);
    if (syncResult) {
      return syncResult;
    }
    
    // 전체 데이터베이스에 없으면 모든 레벨을 검색
    // 이 방식은 비효율적이지만, 캐싱으로 보완됨
    const metadata = getHanjaMetadata();
    
    for (const categoryKey in metadata.categories) {
      const category = metadata.categories[categoryKey];
      for (const levelKey in category.levels) {
        // 해당 레벨의 데이터 로드 (비동기)
        await loadHanjaLevel(categoryKey, levelKey);
        
        // 로드된 데이터에서 한자 검색
        if (cache.levels[categoryKey]?.[levelKey]) {
          const found = cache.levels[categoryKey][levelKey].characters.find(c => c.character === character);
          if (found) {
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
    const metadata = getHanjaMetadata();
    if (metadata.categories[category] && metadata.categories[category].levels) {
      return Object.entries(metadata.categories[category].levels).map(([id, data]) => ({
        id,
        name: data.name
      }));
    }
    return [];
  } catch (error) {
    console.error(`카테고리별 레벨 로드 오류: ${category}`, error);
    return [];
  }
};

// 특정 레벨의 한자 목록 가져오기
export const getCharactersForLevel = (category: string, level: string): HanjaCharacter[] => {
  try {
    // URL 경로 방식 처리: basic-level1 형식인 경우
    const normalizedCategory = level.includes('-') ? getCategoryFromLevel(level) : category;
    const normalizedLevel = getNormalizedLevelId(level);
    
    // 캐시에 있는 경우 캐시에서 반환
    if (cache.levels[normalizedCategory]?.[normalizedLevel]) {
      return cache.levels[normalizedCategory][normalizedLevel].characters;
    }
    
    // 캐시에 없으면 동기 방식으로 가져오기
    const hanjaLevel = getHanjaLevel(normalizedCategory, normalizedLevel);
    return hanjaLevel?.characters || [];
  } catch (error) {
    console.error(`레벨별 한자 로드 오류: ${category}/${level}`, error);
    return [];
  }
};

// 카테고리 목록 가져오기
export const getCategories = (): { id: string; name: string; description: string }[] => {
  try {
    const metadata = getHanjaMetadata();
    return Object.entries(metadata.categories).map(([id, data]) => ({
      id,
      name: data.name,
      description: data.description
    }));
  } catch (error) {
    console.error('카테고리 목록 로드 오류:', error);
    return [];
  }
}; 