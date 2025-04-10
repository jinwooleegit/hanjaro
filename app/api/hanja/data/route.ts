import { NextRequest, NextResponse } from 'next/server';
import { getHanjaById, getHanjaByGrade } from '@/utils/idBasedHanjaUtils';
import { normalizeToId, isValidHanjaId } from '@/utils/idUtils';

/**
 * 한자 데이터 API - ID 기반으로만 동작
 * 
 * 지원하는 쿼리 파라미터:
 * - id: 한자 ID (필수)
 * - grade: 특정 급수의 모든 한자 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const grade = searchParams.get('grade');
    
    // 급수로 조회하는 경우
    if (grade && !id) {
      const gradeNum = parseInt(grade, 10);
      if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 15) {
        return NextResponse.json(
          { error: '유효하지 않은 급수입니다. 1-15 사이의 값을 입력하세요.' },
          { status: 400 }
        );
      }
      
      const characters = await getHanjaByGrade(gradeNum);
      if (!characters || characters.length === 0) {
        return NextResponse.json(
          { error: `${gradeNum}급 한자 데이터를 찾을 수 없습니다.` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        grade: gradeNum,
        total: characters.length,
        characters
      });
    }
    
    // 한자 ID가 없는 경우
    if (!id) {
      return NextResponse.json(
        { error: '한자 ID가 필요합니다.', param: 'id' },
        { status: 400 }
      );
    }
    
    // 만약 ID가 문자나 다른 형식이면 ID로 정규화
    if (!isValidHanjaId(id)) {
      const normalizedId = await normalizeToId(id);
      if (!normalizedId) {
        return NextResponse.json(
          { error: `'${id}'에 대한 한자 ID를 찾을 수 없습니다.` },
          { status: 404 }
        );
      }
      id = normalizedId;
    }
    
    // ID로 한자 정보 가져오기
    const hanjaData = await getHanjaById(id);
    
    if (!hanjaData) {
      return NextResponse.json(
        { error: `ID '${id}'에 대한 한자 데이터를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hanjaData);
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 