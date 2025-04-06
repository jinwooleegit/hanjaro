import { NextRequest, NextResponse } from 'next/server';

// 캐싱을 위한 메모리 저장소
const strokeDataCache = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터에서 한자 가져오기
    const searchParams = request.nextUrl.searchParams;
    const character = searchParams.get('char');

    if (!character) {
      return NextResponse.json(
        { error: '한자 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 캐시에서 먼저 확인
    if (strokeDataCache.has(character)) {
      return NextResponse.json(strokeDataCache.get(character));
    }

    // 캐시에 없으면 CDN에서 가져오기
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${character}.json`
      );

      if (!response.ok) {
        throw new Error(`데이터를 가져오지 못했습니다: ${response.status}`);
      }

      const data = await response.json();
      
      // 캐시에 저장
      strokeDataCache.set(character, data);
      
      return NextResponse.json(data);
    } catch (error) {
      console.error(`스트로크 데이터 가져오기 실패 (${character}):`, error);

      // 대체 CDN 시도
      try {
        const fallbackResponse = await fetch(
          `https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/${character}.json`
        );

        if (!fallbackResponse.ok) {
          throw new Error(`대체 소스에서 데이터를 가져오지 못했습니다: ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        
        // 캐시에 저장
        strokeDataCache.set(character, fallbackData);
        
        return NextResponse.json(fallbackData);
      } catch (fallbackError) {
        console.error(`대체 소스에서 스트로크 데이터 가져오기 실패 (${character}):`, fallbackError);
        
        // 기본 에러 응답
        return NextResponse.json(
          { error: `스트로크 데이터를 찾을 수 없습니다: ${character}` },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('스트로크 데이터 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// API 경로 재검증 및 캐싱 최적화
export const dynamic = 'force-dynamic';
export const revalidate = 604800; // 1주일마다 재검증 