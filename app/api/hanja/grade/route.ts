import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

interface HanjaGradeData {
  metadata: {
    version: string;
    last_updated: string;
    total_characters: number;
    data_source: string;
    grade: number;
  };
  characters: any[];
}

// 캐시 객체
const gradeDataCache: Record<number, HanjaGradeData> = {};

/**
 * 한자 급수 데이터 파일 경로 구하기
 */
function getGradeFilePath(grade: number): string {
  return path.join(process.cwd(), 'data', 'new-structure', 'characters', 'by-grade', `grade_${grade}.json`);
}

/**
 * 특정 급수의 한자 데이터 불러오기
 */
async function loadGradeData(grade: number): Promise<HanjaGradeData | null> {
  // 캐시에 있으면 캐시된 데이터 반환
  if (gradeDataCache[grade]) {
    return gradeDataCache[grade];
  }

  try {
    const filePath = getGradeFilePath(grade);
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const gradeData: HanjaGradeData = JSON.parse(fileData);
    
    // 캐시에 저장
    gradeDataCache[grade] = gradeData;
    
    return gradeData;
  } catch (error) {
    console.error(`Failed to load grade ${grade} data:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const character = searchParams.get('character');
    const id = searchParams.get('id');
    
    // 급수로 조회하는 경우
    if (grade) {
      const gradeNum = parseInt(grade, 10);
      if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 15) {
        return NextResponse.json(
          { error: '유효하지 않은 급수입니다. 1-15 사이의 값을 입력하세요.' },
          { status: 400 }
        );
      }
      
      const gradeData = await loadGradeData(gradeNum);
      if (!gradeData) {
        return NextResponse.json(
          { error: `${gradeNum}급 한자 데이터를 찾을 수 없습니다.` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        metadata: gradeData.metadata,
        characters: gradeData.characters
      });
    }
    
    // 특정 문자로 조회하는 경우
    if (character) {
      // 모든 급수 데이터를 순회하며 찾기
      for (let g = 15; g >= 1; g--) {
        const gradeData = await loadGradeData(g);
        if (gradeData) {
          const charData = gradeData.characters.find(char => char.character === character);
          if (charData) {
            return NextResponse.json(charData);
          }
        }
      }
      
      return NextResponse.json(
        { error: `'${character}' 문자에 대한 한자 데이터를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }
    
    // ID로 조회하는 경우
    if (id) {
      // ID 형식이 "HJ-XX-XXXX-XXXX"인 경우, 급수 추출
      const match = id.match(/HJ-(\d+)-/);
      if (match) {
        const grade = parseInt(match[1], 10);
        const gradeData = await loadGradeData(grade);
        
        if (gradeData) {
          const character = gradeData.characters.find(char => char.id === id);
          if (character) {
            return NextResponse.json(character);
          }
        }
      }
      
      // 모든 급수 데이터를 순회하며 찾기
      for (let g = 15; g >= 1; g--) {
        const gradeData = await loadGradeData(g);
        if (gradeData) {
          const charData = gradeData.characters.find(char => char.id === id);
          if (charData) {
            return NextResponse.json(charData);
          }
        }
      }
      
      return NextResponse.json(
        { error: `ID '${id}'에 대한 한자 데이터를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }
    
    // 파라미터가 없는 경우 모든 급수 메타데이터 반환
    const allGradesMeta = [];
    for (let g = 15; g >= 1; g--) {
      const gradeData = await loadGradeData(g);
      if (gradeData) {
        allGradesMeta.push(gradeData.metadata);
      }
    }
    
    return NextResponse.json({
      message: '급수, 문자 또는 ID를 지정하여 한자 데이터를 조회하세요.',
      available_grades: allGradesMeta
    });
    
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 