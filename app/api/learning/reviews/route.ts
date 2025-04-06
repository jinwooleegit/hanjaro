import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  LearningStatus,
  HanjaLearningRecord,
  UserLearningData
} from '../../../../types/learning';

// 학습 데이터 파일 경로
const LEARNING_DATA_DIR = path.join(process.cwd(), 'data', 'learning');
const getUserDataPath = (userId: string) => path.join(LEARNING_DATA_DIR, `${userId}.json`);

// 한자 데이터 파일 경로
const HANJA_DATABASE_PATH = path.join(process.cwd(), 'data', 'hanja_database_fixed.json');

/**
 * 사용자의 학습 데이터 가져오기
 * @param userId - 사용자 ID
 */
async function getUserLearningData(userId: string): Promise<UserLearningData | null> {
  try {
    const filePath = getUserDataPath(userId);
    
    // 파일이 있으면 읽기
    try {
      await fs.access(filePath);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as UserLearningData;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Error getting user learning data:', error);
    return null;
  }
}

/**
 * 한자 정보 가져오기
 * @param character - 한자
 */
async function getHanjaInfo(character: string): Promise<any | null> {
  try {
    // 한자 데이터베이스 파일 로드
    const fileContent = await fs.readFile(HANJA_DATABASE_PATH, 'utf8');
    const database = JSON.parse(fileContent);
    
    // 모든 레벨의 한자를 검색
    let foundHanja = null;
    
    // basic 레벨 검색
    if (database.basic && database.basic.levels) {
      for (const levelKey in database.basic.levels) {
        const level = database.basic.levels[levelKey];
        if (level.characters) {
          foundHanja = level.characters.find((hanja: any) => hanja.character === character);
          if (foundHanja) break;
        }
      }
    }
    
    // advanced 레벨 검색 (필요시)
    if (!foundHanja && database.advanced && database.advanced.levels) {
      for (const levelKey in database.advanced.levels) {
        const level = database.advanced.levels[levelKey];
        if (level.characters) {
          foundHanja = level.characters.find((hanja: any) => hanja.character === character);
          if (foundHanja) break;
        }
      }
    }
    
    return foundHanja;
  } catch (error) {
    console.error('Error getting hanja info:', error);
    return null;
  }
}

/**
 * 복습이 필요한 한자 목록 가져오기 API
 * 
 * @example
 * GET /api/learning/reviews
 */
export async function GET(request: NextRequest) {
  try {
    // 임시로 고정된 사용자 ID 사용 (인증 시스템 구현 전)
    const userId = 'default_user';
    
    // 사용자 학습 데이터 가져오기
    const userData = await getUserLearningData(userId);
    
    if (!userData) {
      return NextResponse.json({
        success: true,
        reviewItems: []
      });
    }
    
    // 오늘 날짜
    const today = new Date();
    
    // 복습이 필요한 한자 필터링
    const needsReviewCharacters: HanjaLearningRecord[] = [];
    
    for (const charKey in userData.characters) {
      const record = userData.characters[charKey];
      
      // 복습 예정일이 지났거나 오늘인 항목
      if (record.nextReviewDue && new Date(record.nextReviewDue) <= today) {
        needsReviewCharacters.push(record);
      }
    }
    
    // 복습 항목 상세 정보 가져오기
    const reviewItems = await Promise.all(
      needsReviewCharacters.map(async (record) => {
        const hanjaInfo = await getHanjaInfo(record.character);
        
        return {
          character: record.character,
          meaning: hanjaInfo?.meaning || '의미 없음',
          dueDate: record.nextReviewDue,
          level: hanjaInfo?.level || 0,
          status: record.status,
          masteryLevel: record.masteryLevel
        };
      })
    );
    
    // 만료일 기준으로 정렬
    reviewItems.sort((a, b) => {
      // null 체크 및 기본값 설정
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
    
    return NextResponse.json({
      success: true,
      reviewItems
    });
  } catch (error: any) {
    console.error('Error getting review notifications:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 