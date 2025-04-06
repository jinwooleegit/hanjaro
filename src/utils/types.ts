export interface HanjaExample {
  word: string;
  meaning: string;
  pronunciation: string;
}

export interface HanjaCharacter {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  examples: HanjaExample[];
  level?: number;
  order?: number;
  tags?: string[];
}

export interface HanjaLevel {
  category: string;
  level: number;
  name?: string;
  description?: string;
  characters: HanjaCharacter[];
}

export interface HanjaCategory {
  id: string;
  name: string;
  description: string;
  levels: {
    [key: string]: {
      name: string;
      description: string;
      characterCount: number;
    };
  };
}

export interface HanjaMetadata {
  categories: {
    [key: string]: HanjaCategory;
  };
} 