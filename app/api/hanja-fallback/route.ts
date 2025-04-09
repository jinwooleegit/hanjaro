import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // URL에서 한자 문자 가져오기
  const searchParams = request.nextUrl.searchParams;
  const hanja = searchParams.get('hanja');

  if (!hanja) {
    return new NextResponse('한자 문자가 필요합니다', { status: 400 });
  }

  // SVG 경로 구성
  const svgPath = path.join(process.cwd(), 'public', 'images', 'hanja', `${hanja}.svg`);
  const defaultSvgPath = path.join(process.cwd(), 'public', 'images', 'hanja', 'default.svg');
  
  try {
    // 요청된 한자 SVG 파일이 존재하는지 확인
    let svgContent;
    
    try {
      // 파일 존재 확인
      await fs.promises.access(svgPath, fs.constants.F_OK);
      // 파일 읽기
      svgContent = await fs.promises.readFile(svgPath, 'utf-8');
    } catch (error) {
      // 파일이 없으면 기본 SVG 사용
      console.warn(`한자 SVG를 찾을 수 없습니다: ${hanja}, 기본 SVG 사용`);
      
      // 기본 SVG를 동적으로 생성
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#f5f5f5" stroke="#ccc" stroke-width="2"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#333">${hanja}</text>
      </svg>`;
    }

    // SVG 응답 반환
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // 24시간 캐싱
      },
    });
  } catch (error) {
    console.error('한자 SVG 제공 중 오류 발생:', error);
    return new NextResponse('서버 오류', { status: 500 });
  }
} 