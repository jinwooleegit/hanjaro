import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  LearningStatus,
  StudyEventType,
  HanjaLearningRecord,
  UserLearningData,
  UpdateLearningProgressRequest,
  StudyEvent
} from '../../../../types/learning';

// 학습 데이터 파일 경로
const LEARNING_DATA_DIR = path.join(process.cwd(), 'data', 'learning');
const getUserDataPath = (userId: string) => path.join(LEARNING_DATA_DIR, `${userId}.json`);

// 기본 사용자 데이터
const defaultUserData: UserLearningData = {
  userId: '',
  characters: {},
  levels: {},
  lastActive: new Date().toISOString(),
  streak: {
    current: 0,
    longest: 0,
    lastStudyDate: new Date().toISOString().split('T')[0]
  },
  statistics: {
    totalStudyTime: 0,
    totalCharactersStudied: 0,
    totalQuizzesTaken: 0,
    averageQuizScore: 0,
    weeklyStudyTime: {
      '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 // 일~토
    }
  },
  settings: {
    reviewInterval: [1, 3, 7, 14, 30], // 1일, 3일, 7일, 14일, 30일 후 복습
    dailyGoal: 5,
    notifications: true
  }
};

/**
 * 사용자의 학습 데이터 가져오기
 * @param userId - 사용자 ID
 */
async function getUserLearningData(userId: string): Promise<UserLearningData> {
  try {
    // 디렉토리가 없으면 생성
    await fs.mkdir(LEARNING_DATA_DIR, { recursive: true }).catch(() => {});
    
    const filePath = getUserDataPath(userId);
    
    // 파일이 있으면 읽기
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as UserLearningData;
    } catch (error) {
      // 파일이 없으면 기본 데이터 생성
      const newUserData = { ...defaultUserData, userId };
      await fs.writeFile(filePath, JSON.stringify(newUserData, null, 2), 'utf8');
      return newUserData;
    }
  } catch (error) {
    console.error('Error getting user learning data:', error);
    throw error;
  }
}

/**
 * 사용자의 학습 데이터 저장하기
 * @param userId - 사용자 ID
 * @param data - 저장할 사용자 데이터
 */
async function saveUserLearningData(userId: string, data: UserLearningData): Promise<void> {
  try {
    const filePath = getUserDataPath(userId);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving user learning data:', error);
    throw error;
  }
}

/**
 * 학습 상태 계산하기
 * @param record - 학습 기록
 */
function calculateLearningStatus(record: HanjaLearningRecord): LearningStatus {
  if (!record) return LearningStatus.NOT_STARTED;
  
  // 다음 복습 일자가 지났다면 복습 필요
  if (record.nextReviewDue && new Date(record.nextReviewDue) <= new Date()) {
    return LearningStatus.NEEDS_REVIEW;
  }
  
  // 숙련도에 따른 상태 결정
  if (record.masteryLevel >= 90) {
    return LearningStatus.COMPLETED;
  } else if (record.masteryLevel >= 40) {
    return LearningStatus.REVIEWING;
  } else if (record.masteryLevel > 0) {
    return LearningStatus.IN_PROGRESS;
  }
  
  return LearningStatus.NOT_STARTED;
}

/**
 * 다음 복습 일자 계산하기
 * @param record - 학습 기록
 * @param reviewIntervals - 복습 간격 (일)
 */
function calculateNextReviewDate(record: HanjaLearningRecord, reviewIntervals: number[]): string {
  // 복습 횟수에 따라 간격 결정 (최대는 마지막 간격 사용)
  const reviewCount = record.studyHistory.filter((e: StudyEvent) => 
    e.type === StudyEventType.REVIEWED || e.type === StudyEventType.LEARNED
  ).length;
  
  const intervalIndex = Math.min(reviewCount, reviewIntervals.length - 1);
  const intervalDays = reviewIntervals[intervalIndex];
  
  // 다음 복습 일자 계산
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  
  return nextDate.toISOString();
}

/**
 * 숙련도 계산하기
 * @param record - 학습 기록
 * @param eventType - 이벤트 종류
 * @param score - 이벤트 점수
 */
function calculateMasteryLevel(
  record: HanjaLearningRecord,
  eventType: StudyEventType,
  score?: number
): number {
  const currentMastery = record.masteryLevel || 0;
  
  switch (eventType) {
    case StudyEventType.LEARNED:
      return Math.min(currentMastery + 20, 100);
    
    case StudyEventType.REVIEWED:
      return Math.min(currentMastery + 10, 100);
    
    case StudyEventType.QUIZ_CORRECT:
      return Math.min(currentMastery + (score ? score / 5 : 15), 100);
    
    case StudyEventType.QUIZ_INCORRECT:
      return Math.max(currentMastery - (score ? (100 - score) / 5 : 10), 0);
    
    case StudyEventType.PRACTICE:
      return Math.min(currentMastery + (score ? score / 10 : 5), 100);
    
    default:
      return currentMastery;
  }
}

/**
 * 연속 학습 일수 업데이트
 * @param userData - 사용자 데이터
 */
function updateStreak(userData: UserLearningData): void {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastStudyDate = userData.streak.lastStudyDate;
  
  if (today === lastStudyDate) {
    // 오늘 이미 학습했음, 변경 없음
    return;
  }
  
  // 어제 날짜 계산
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  if (lastStudyDate === yesterdayString) {
    // 어제 학습했으면 연속 일수 증가
    userData.streak.current += 1;
    userData.streak.lastStudyDate = today;
    
    // 최장 연속 일수 업데이트
    if (userData.streak.current > userData.streak.longest) {
      userData.streak.longest = userData.streak.current;
    }
  } else {
    // 연속 끊김
    userData.streak.current = 1;
    userData.streak.lastStudyDate = today;
  }
}

/**
 * 학습 진도 업데이트 API
 * 
 * @example
 * POST /api/learning/progress
 * body: { character: "水", eventType: "learned", score: 90 }
 */
export async function POST(request: NextRequest) {
  try {
    const { character, eventType, score, details } = await request.json() as UpdateLearningProgressRequest;
    
    // 임시로 고정된 사용자 ID 사용 (인증 시스템 구현 전)
    const userId = 'default_user';
    
    if (!character || !eventType) {
      return NextResponse.json(
        { success: false, message: 'Character and event type are required' },
        { status: 400 }
      );
    }
    
    // 사용자 데이터 가져오기
    const userData = await getUserLearningData(userId);
    
    // 현재 활동 시간 업데이트
    userData.lastActive = new Date().toISOString();
    
    // 연속 학습 일수 업데이트
    updateStreak(userData);
    
    // 한자별 학습 기록 업데이트
    let record = userData.characters[character];
    
    if (!record) {
      // 처음 학습하는 한자면 새 기록 생성
      record = {
        character,
        status: LearningStatus.NOT_STARTED,
        masteryLevel: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastStudied: new Date().toISOString(),
        studyHistory: []
      };
      
      // 총 학습 한자 수 업데이트
      userData.statistics.totalCharactersStudied += 1;
    }
    
    // 학습 이벤트 추가
    record.studyHistory.push({
      timestamp: new Date().toISOString(),
      type: eventType,
      score,
      details
    });
    
    // 퀴즈 관련 통계 업데이트
    if (eventType === StudyEventType.QUIZ_CORRECT || eventType === StudyEventType.QUIZ_INCORRECT) {
      userData.statistics.totalQuizzesTaken += 1;
      
      // 평균 퀴즈 점수 업데이트
      if (score !== undefined) {
        const totalScore = userData.statistics.averageQuizScore * (userData.statistics.totalQuizzesTaken - 1) + score;
        userData.statistics.averageQuizScore = totalScore / userData.statistics.totalQuizzesTaken;
      }
      
      // 정답/오답 카운트 업데이트
      if (eventType === StudyEventType.QUIZ_CORRECT) {
        record.correctCount += 1;
      } else {
        record.incorrectCount += 1;
      }
    }
    
    // 학습 마지막 시간 업데이트
    record.lastStudied = new Date().toISOString();
    
    // 숙련도 업데이트
    record.masteryLevel = calculateMasteryLevel(record, eventType, score);
    
    // 다음 복습 일자 계산 (학습/복습인 경우만)
    if (eventType === StudyEventType.LEARNED || eventType === StudyEventType.REVIEWED) {
      record.nextReviewDue = calculateNextReviewDate(record, userData.settings.reviewInterval);
    }
    
    // 학습 상태 업데이트
    record.status = calculateLearningStatus(record);
    
    // 기록 저장
    userData.characters[character] = record;
    
    // 주간 학습 시간 업데이트 (5분 가정)
    const dayOfWeek = new Date().getDay().toString();
    userData.statistics.weeklyStudyTime[dayOfWeek] += 5;
    userData.statistics.totalStudyTime += 5;
    
    // 데이터 저장
    await saveUserLearningData(userId, userData);
    
    return NextResponse.json({
      success: true,
      character,
      updatedRecord: record
    });
  } catch (error: any) {
    console.error('Error updating learning progress:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * 사용자 학습 데이터 가져오기 API
 * 
 * @example
 * GET /api/learning/progress
 */
export async function GET(request: NextRequest) {
  try {
    // 임시로 고정된 사용자 ID 사용 (인증 시스템 구현 전)
    const userId = 'default_user';
    
    // URL에서 파라미터 추출
    const url = new URL(request.url);
    const character = url.searchParams.get('character');
    
    // 사용자 데이터 가져오기
    const userData = await getUserLearningData(userId);
    
    // 특정 한자의 학습 기록 요청인 경우
    if (character) {
      const record = userData.characters[character] || null;
      
      return NextResponse.json({
        success: true,
        character,
        record
      });
    }
    
    // 필요 없는 대용량 데이터는 제외
    const { characters, ...userDataWithoutCharacters } = userData;
    
    // 전체 데이터 요청인 경우, 통계와 요약 데이터 반환
    return NextResponse.json({
      success: true,
      data: userDataWithoutCharacters,
      summary: {
        totalCharacters: Object.keys(userData.characters).length,
        charactersCompleted: Object.values(userData.characters).filter((r: HanjaLearningRecord) => r.status === LearningStatus.COMPLETED).length,
        charactersInProgress: Object.values(userData.characters).filter((r: HanjaLearningRecord) => 
          r.status === LearningStatus.IN_PROGRESS || r.status === LearningStatus.REVIEWING
        ).length,
        charactersNeedsReview: Object.values(userData.characters).filter((r: HanjaLearningRecord) => r.status === LearningStatus.NEEDS_REVIEW).length,
        averageMastery: Object.values(userData.characters).reduce((sum: number, r: HanjaLearningRecord) => sum + r.masteryLevel, 0) / 
          Math.max(Object.keys(userData.characters).length, 1)
      }
    });
  } catch (error: any) {
    console.error('Error getting learning progress:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 