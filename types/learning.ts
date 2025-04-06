/**
 * 학습 진도 추적을 위한 타입 정의
 */

// 학습 상태 (학습 중, 복습 필요, 완료 등)
export enum LearningStatus {
  NOT_STARTED = 'not_started',  // 학습 시작 전
  IN_PROGRESS = 'in_progress',  // 학습 중
  NEEDS_REVIEW = 'needs_review', // 복습 필요
  REVIEWING = 'reviewing',      // 복습 중
  COMPLETED = 'completed',      // 학습 완료
}

// 한자 학습 기록
export interface HanjaLearningRecord {
  character: string;           // 한자
  status: LearningStatus;      // 학습 상태
  masteryLevel: number;        // 숙련도 (0-100)
  correctCount: number;        // 정답 횟수
  incorrectCount: number;      // 오답 횟수
  lastStudied: string;         // 마지막 학습 일시 (ISO 문자열)
  nextReviewDue?: string;      // 다음 복습 예정 일시 (ISO 문자열)
  studyHistory: StudyEvent[];  // 학습 이벤트 이력
}

// 학습 이벤트 종류
export enum StudyEventType {
  LEARNED = 'learned',         // 처음 학습
  REVIEWED = 'reviewed',       // 복습
  QUIZ_CORRECT = 'quiz_correct', // 퀴즈 정답
  QUIZ_INCORRECT = 'quiz_incorrect', // 퀴즈 오답
  PRACTICE = 'practice',        // 필기 연습
}

// 학습 이벤트
export interface StudyEvent {
  timestamp: string;            // 이벤트 발생 일시 (ISO 문자열)
  type: StudyEventType;         // 이벤트 종류
  score?: number;               // 이벤트 점수 (해당하는 경우)
  details?: string;             // 추가 세부 정보
}

// 레벨별 학습 진행 상황
export interface LevelProgress {
  levelId: string;              // 레벨 ID (level1, level2 등)
  totalCharacters: number;      // 총 한자 수
  studiedCharacters: number;    // 학습한 한자 수
  completedCharacters: number;  // 완료된 한자 수
  averageMastery: number;       // 평균 숙련도
}

// 사용자 학습 데이터
export interface UserLearningData {
  userId: string;               // 사용자 ID
  characters: {                 // 한자별 학습 기록
    [key: string]: HanjaLearningRecord;
  };
  levels: {                     // 레벨별 진행 상황
    [key: string]: LevelProgress;
  };
  lastActive: string;           // 마지막 활동 일시 (ISO 문자열)
  streak: {                     // 연속 학습 기록
    current: number;            // 현재 연속 일수
    longest: number;            // 최장 연속 일수
    lastStudyDate: string;      // 마지막 학습 일자 (YYYY-MM-DD)
  };
  statistics: {                 // 학습 통계
    totalStudyTime: number;     // 총 학습 시간 (분)
    totalCharactersStudied: number; // 총 학습 한자 수
    totalQuizzesTaken: number;  // 총 퀴즈 횟수
    averageQuizScore: number;   // 평균 퀴즈 점수
    weeklyStudyTime: {          // 주간 학습 시간
      [key: string]: number;    // 요일별 시간 (분)
    };
  };
  settings: {                   // 사용자 설정
    reviewInterval: number[];   // 복습 간격 (일)
    dailyGoal: number;          // 일일 목표 학습량
    notifications: boolean;     // 알림 설정
  };
}

// 학습 세션 기록
export interface StudySession {
  id: string;                   // 세션 ID
  userId: string;               // 사용자 ID
  startTime: string;            // 시작 일시 (ISO 문자열)
  endTime?: string;             // 종료 일시 (ISO 문자열)
  duration: number;             // 세션 지속 시간 (초)
  activityType: string;         // 활동 종류 (학습, 퀴즈, 필기 등)
  characters: string[];         // 학습한 한자 목록
  level?: string;               // 학습 레벨 (해당하는 경우)
  score?: number;               // 세션 점수 (해당하는 경우)
}

// API 요청 타입
export interface UpdateLearningProgressRequest {
  character: string;
  eventType: StudyEventType;
  score?: number;
  details?: string;
}

// API 응답 타입
export interface LearningProgressResponse {
  success: boolean;
  character?: string;
  updatedRecord?: HanjaLearningRecord;
  message?: string;
} 