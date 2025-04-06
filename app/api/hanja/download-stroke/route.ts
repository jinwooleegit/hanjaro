import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 한자 필순 데이터를 다운로드하여 저장하는 API 엔드포인트
 * 
 * CDN에서 한자 필순 데이터를 가져와 로컬 파일 시스템에 저장합니다.
 * 
 * @example
 * GET /api/hanja/download-stroke?char=水
 */
export async function GET(request: NextRequest) {
  // 요청 URL에서 문자 파라미터 추출
  const { searchParams } = new URL(request.url);
  const character = searchParams.get('char');

  // 로깅 및 검증
  console.log('Stroke data request for character:', character);
  
  if (!character) {
    console.error('No character parameter provided');
    return NextResponse.json(
      { error: 'Character parameter is required' },
      { status: 400 }
    );
  }

  // 문자 인코딩 확인
  const encodedChar = encodeURIComponent(character);
  console.log('Encoded character:', encodedChar);
  console.log('Character code points:', Array.from(character).map(c => c.charCodeAt(0)));

  try {
    // 스트로크 데이터 디렉토리 확인 및 생성
    const strokeDataDir = path.join(process.cwd(), 'public', 'stroke-data');
    if (!fs.existsSync(strokeDataDir)) {
      console.log('Creating stroke data directory');
      fs.mkdirSync(strokeDataDir, { recursive: true });
    }

    // 파일 경로 설정
    const filePath = path.join(strokeDataDir, `${character}.json`);
    
    // 캐시된 파일이 있는지 확인
    if (fs.existsSync(filePath)) {
      console.log(`Using cached stroke data for ${character}`);
      const cachedData = fs.readFileSync(filePath, 'utf-8');
      return NextResponse.json(JSON.parse(cachedData));
    }

    // CDN에서 스트로크 데이터 가져오기
    console.log(`Fetching stroke data for ${character} from CDN`);
    const cdnUrl = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodedChar}.json`;
    console.log('CDN request URL:', cdnUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
    
    const response = await fetch(cdnUrl, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stroke data: ${response.status} ${response.statusText}`);
    }
    
    const strokeData = await response.json();
    console.log(`Stroke data fetched successfully for ${character}`);
    
    // 스트로크 데이터 캐싱
    console.log(`Caching stroke data for ${character}`);
    fs.writeFileSync(filePath, JSON.stringify(strokeData, null, 2));
    
    return NextResponse.json(strokeData);
  } catch (fetchError: any) {
    console.error('Error fetching or processing stroke data:', fetchError.message || fetchError);
    
    // 오류 메시지와 함께 응답
    return NextResponse.json(
      { 
        error: 'Failed to fetch stroke data',
        message: fetchError.message || 'Unknown error',
        character: character
      }, 
      { status: 404 }
    );
  }
} 