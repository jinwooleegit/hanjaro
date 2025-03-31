import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 미들웨어는 모든 요청에 실행됩니다
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // 한글 URL 디코딩 문제 처리
  // URL에 한글이 포함된 경우 올바르게 처리
  if (pathname.includes('%')) {
    try {
      const decodedPath = decodeURIComponent(pathname);
      console.log(`URL 디코딩: ${pathname} -> ${decodedPath}`);
      
      // 디코딩된 URL을 사용하여 새 URL 생성
      url.pathname = decodedPath;
      return NextResponse.redirect(url);
    } catch (e) {
      console.error('URL 디코딩 오류:', e);
    }
  }
  
  // 잘못된 경로 패턴 감지 (한글 문자가 URL에 직접 포함된 경우)
  if (/[\uAC00-\uD7A3]/.test(pathname)) {
    console.log(`잘못된 URL 감지: ${pathname}`);
    
    // 홈페이지로 리디렉션
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // 계속 진행
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 정적 파일과 API 라우트를 제외한 모든 경로에 매칭
     * - /_next/ (Next.js 내부 파일)
     * - /api/ (API 라우트)
     * - /static/ (정적 파일)
     */
    '/((?!_next|api|static|favicon.ico).*)',
  ],
}; 