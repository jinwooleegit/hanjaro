// 한자 데이터 타입 정의
export interface Hanja {
  id: number;
  character: string;
  meaning: string;
  pronunciation: string;
  strokes: number;
  examples: string[];
  level: number;
  story: string;
  strokePaths?: StrokePath[];
  relatedHanja?: RelatedHanja[];
}

export interface StrokePath {
  path: string;
  animationDelay?: string;
  strokeDasharray?: string;
  strokeDashoffset?: string;
  strokeLinecap?: string;
  strokeWidth?: string;
}

export interface RelatedHanja {
  character: string;
  meaning: string;
}

// 사용자 데이터 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  progress: UserProgress;
}

export interface UserProgress {
  currentLevel: number;
  completedHanja: number[];
  learningPath: LearningPath;
  quizResults: QuizResult[];
  streakDays: number;
  lastActive: Date;
}

export interface LearningPath {
  recommendedHanja: number[];
  nextQuizDate: Date;
}

export interface QuizResult {
  quizId: string;
  date: Date;
  score: number;
  totalQuestions: number;
  hanjaIds: number[];
}

// 퀴즈 관련 타입 정의
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  level: number;
  type: QuizType;
}

export enum QuizType {
  MEANING = 'meaning',
  CHARACTER = 'character',
  STROKE_ORDER = 'stroke_order',
  COMPOSITION = 'composition'
}

export interface QuizQuestion {
  id: string;
  hanjaId: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// 학습 경로 및 진행도 관련 타입
export interface LearningLevel {
  id: number;
  title: string;
  description: string;
  hanjaCount: number;
  requiredMastery: number;
}

export interface UserHanjaMastery {
  hanjaId: number;
  masteryLevel: number; // 0-100 척도
  lastPracticed: Date;
  nextReviewDate: Date;
} 