// data/index.ts
// 중앙 집중식 데이터 관리 시스템

import fs from 'fs';
import path from 'path';

// 타입 정의
export interface HanjaCharacter {
  character: string;
  meaning: string;
  pronunciation: string;
  strokes: number;
  radical?: string;
  examples?: string[];
  level?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  levels: {
    id: string;
    name: string;
    description: string;
    characters: string[];
  }[];
}

export interface DataManager {
  getHanjaData: (character: string) => Promise<HanjaCharacter | null>;
  getAllHanja: () => Promise<HanjaCharacter[]>;
  getCategoryData: (categoryId: string) => Promise<Category | null>;
  getAllCategories: () => Promise<Category[]>;
}

// 데이터 로드 유틸리티 함수
async function loadJsonData<T>(filePath: string): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
    throw new Error(`데이터 로드 실패: ${filePath}`);
  }
}

// 단일 데이터 소스 관리자 클래스
class HanjaDataManager implements DataManager {
  private hanjaCache: Map<string, HanjaCharacter> = new Map();
  private categoriesCache: Category[] | null = null;
  
  // 한자 데이터베이스 경로 - 단일 소스 사용
  private readonly HANJA_DB_PATH = 'data/hanja_database_main.json';
  private readonly CATEGORIES_PATH = 'data/categories.json';
  
  // 한자 데이터 가져오기
  async getHanjaData(character: string): Promise<HanjaCharacter | null> {
    // 캐시 확인
    if (this.hanjaCache.has(character)) {
      return this.hanjaCache.get(character) || null;
    }
    
    try {
      const data = await this.getAllHanja();
      const hanjaData = data.find(item => item.character === character) || null;
      
      // 캐시에 저장
      if (hanjaData) {
        this.hanjaCache.set(character, hanjaData);
      }
      
      return hanjaData;
    } catch (error) {
      console.error(`Error fetching hanja data for ${character}:`, error);
      return null;
    }
  }
  
  // 모든 한자 데이터 가져오기
  async getAllHanja(): Promise<HanjaCharacter[]> {
    try {
      const data = await loadJsonData<{ characters: HanjaCharacter[] }>(this.HANJA_DB_PATH);
      return data.characters || [];
    } catch (error) {
      console.error('Error fetching all hanja data:', error);
      return [];
    }
  }
  
  // 카테고리 데이터 가져오기
  async getCategoryData(categoryId: string): Promise<Category | null> {
    try {
      const categories = await this.getAllCategories();
      return categories.find(category => category.id === categoryId) || null;
    } catch (error) {
      console.error(`Error fetching category data for ${categoryId}:`, error);
      return null;
    }
  }
  
  // 모든 카테고리 가져오기
  async getAllCategories(): Promise<Category[]> {
    // 캐시 확인
    if (this.categoriesCache) {
      return this.categoriesCache;
    }
    
    try {
      const data = await loadJsonData<{ categories: Category[] }>(this.CATEGORIES_PATH);
      this.categoriesCache = data.categories || [];
      return this.categoriesCache;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  }
  
  // 캐시 초기화 (개발 모드에서 유용)
  clearCache() {
    this.hanjaCache.clear();
    this.categoriesCache = null;
  }
}

// 싱글톤 인스턴스 생성
export const hanjaDataManager = new HanjaDataManager();

export default hanjaDataManager; 