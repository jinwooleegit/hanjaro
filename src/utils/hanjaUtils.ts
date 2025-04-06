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
    
    // 서버 사이드에서만 fs 모듈 사용 (클라이언트에서는 사용 불가)
    if (typeof window === 'undefined') {
      try {
        // 서버 사이드 코드
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pathModule = require('path');
        
        // 프로젝트 루트에서 절대 경로 구성
        const fullPath = pathModule.join(process.cwd(), path);
        console.log(`절대 경로 시도: ${fullPath}`);
        
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const data = JSON.parse(content);
          console.log(`성공적으로 로드됨: ${fullPath} (${Object.keys(data).length} 필드)`);
          return data;
        } else {
          console.error(`파일을 찾을 수 없음: ${fullPath}`);
        }
        
        // data 디렉토리 내에서 시도
        const dataPath = pathModule.join(process.cwd(), 'data', path);
        console.log(`data 경로 시도: ${dataPath}`);
        
        if (fs.existsSync(dataPath)) {
          const content = fs.readFileSync(dataPath, 'utf8');
          const data = JSON.parse(content);
          console.log(`성공적으로 로드됨(data): ${dataPath} (${Object.keys(data).length} 필드)`);
          return data;
        } else {
          console.error(`파일을 찾을 수 없음(data): ${dataPath}`);
        }
      } catch (serverError) {
        console.error(`서버 사이드 파일 로드 실패: ${path}`, serverError);
      }
    }
    
    // 서버/클라이언트 모두 동작하는 방식: import 사용
    try {
      console.log(`import 시도: 'data/${path}'`);
      const module = await import(`../../data/${path}`);
      console.log(`성공적으로 로드됨 (import): ../../data/${path}`);
      return module.default;
    } catch (importError) {
      console.error(`임포트 실패: ../../data/${path}`, importError);
      
      // 기본 카테고리 시도
      if (!path.includes('/') && !path.startsWith('basic/')) {
        try {
          console.log(`basic 폴더 import 시도: ../../data/basic/${path}`);
          const module = await import(`../../data/basic/${path}`);
          console.log(`성공적으로 로드됨 (import basic): ../../data/basic/${path}`);
          return module.default;
        } catch (basicError) {
          console.error(`basic 임포트 실패: ../../data/basic/${path}`, basicError);
        }
      }
      
      // 마지막 대안: 캐시된 데이터 확인
      const category = path.split('/')[0];
      const level = path.split('/')[1]?.replace('.json', '');
      
      if (category && level && sampleLevelData[category]?.[level]) {
        console.log(`캐시된 샘플 데이터 사용: ${category}/${level}`);
        return sampleLevelData[category][level];
      }
    }
    
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
    // 데이터 경로 가져오기
    const dataPath = fullDataPaths[category]?.[normalizedLevelId];
    if (!dataPath) {
      console.error(`유효하지 않은 레벨: ${category}/${normalizedLevelId}`);
      return null;
    }
    
    // JSON 파일 비동기 로드
    console.log(`JSON 로드 시도: ${dataPath}`);
    let data = await importJSON(dataPath);
    
    if (!data) {
      console.error(`${category}/${normalizedLevelId}의 전체 한자 데이터를 찾을 수 없습니다. 다른 경로에서 시도합니다.`);
      
      // 다른 경로 형식도 시도
      const alternativePath = `basic/${normalizedLevelId}.json`;
      console.log(`대체 경로 시도: ${alternativePath}`);
      data = await importJSON(alternativePath);
      
      if (!data) {
        console.error(`대체 경로에서도 ${category}/${normalizedLevelId} 데이터를 찾을 수 없습니다. 메인 데이터베이스에서 시도합니다.`);
        
        // 메인 데이터베이스에서 시도
        const mainData = await getHanjaDatabase();
        if (mainData && mainData[category]?.levels[normalizedLevelId]) {
          console.log(`전체 한자 데이터 로드 완료(fallback): ${category}/${normalizedLevelId} (${mainData[category].levels[normalizedLevelId].characters.length}개 한자)`);
          
          // 캐시에 저장
          if (!cache.levels[category]) {
            cache.levels[category] = {};
          }
          cache.levels[category][normalizedLevelId] = mainData[category].levels[normalizedLevelId];
          
          // 부분 로딩 상태 업데이트
          if (!cache.levelPartial[category]) {
            cache.levelPartial[category] = {};
          }
          cache.levelPartial[category][normalizedLevelId] = { 
            loaded: true, 
            offset: mainData[category].levels[normalizedLevelId].characters.length 
          };
          
          return mainData[category].levels[normalizedLevelId];
        }
        
        // 샘플 데이터 시도
        if (sampleLevelData[category] && sampleLevelData[category][normalizedLevelId]) {
          console.log(`전체 한자 데이터 로드 완료(샘플): ${category}/${normalizedLevelId} (${sampleLevelData[category][normalizedLevelId].characters.length}개 한자)`);
          
          // 캐시에 저장
          if (!cache.levels[category]) {
            cache.levels[category] = {};
          }
          cache.levels[category][normalizedLevelId] = sampleLevelData[category][normalizedLevelId];
          
          // 부분 로딩 상태 업데이트
          if (!cache.levelPartial[category]) {
            cache.levelPartial[category] = {};
          }
          cache.levelPartial[category][normalizedLevelId] = { 
            loaded: true, 
            offset: sampleLevelData[category][normalizedLevelId].characters.length 
          };
          
          return sampleLevelData[category][normalizedLevelId];
        }
        
        console.error(`모든 소스에서 ${category}/${normalizedLevelId} 데이터를 찾을 수 없습니다.`);
        return null;
      }
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