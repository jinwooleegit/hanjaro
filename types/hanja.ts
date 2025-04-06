export interface Example {
  word: string;
  meaning: string;
  pronunciation: string;
}

export interface Stroke {
  path: string; // SVG 패스 데이터
  order: number; // 획순 번호
}

export interface Hanja {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count: number;
  radical: string;
  examples: Example[];
  level: number;
  order: number;
  strokes?: Stroke[]; // 필순 데이터, 선택적(옵셔널) 필드
}

export interface HanjaLevel {
  name: string;
  description: string;
  characters: Hanja[];
}

export interface HanjaData {
  basic: {
    name: string;
    description: string;
    total_characters: number;
    levels: {
      [key: string]: HanjaLevel;
    };
  };
} 