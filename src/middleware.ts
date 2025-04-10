import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 이미 처리된 요청을 추적하기 위한 쿠키 이름
const REDIRECT_COOKIE = 'hanja_redirected';

// 미들웨어는 모든 요청에 실행됩니다
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // 디버깅: 요청 URL과 쿠키 로깅
  console.log(`미들웨어 처리: ${pathname}`);
  
  // 다음 경로들은 미들웨어 처리에서 완전히 제외
  if (
    pathname.startsWith('/learn/hanja/') || 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/hanja/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/data/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/hanja-detail/')  // 한자 상세 페이지 제외
  ) {
    console.log(`제외된 경로: ${pathname}`);
    return NextResponse.next();
  }

  // 이미 리디렉션된 요청인지 확인
  // 이 부분이 무한 리디렉션 루프를 방지합니다
  if (request.cookies.has(REDIRECT_COOKIE)) {
    // 쿠키 값 확인 (pathname과 일치하는지)
    const redirectedPath = request.cookies.get(REDIRECT_COOKIE)?.value;
    if (redirectedPath === pathname) {
      console.log(`이미 리디렉션된 경로: ${pathname}`);
      return NextResponse.next();
    }
  }

  // URL에 인코딩된 문자가 있는 경우에만 처리
  if (pathname.includes('%')) {
    try {
      // URL 디코딩
      const decodedPath = decodeURIComponent(pathname);
      
      // 디코딩된 경로가 다른 경우에만 리디렉션
      // 이미 디코딩된 URL을 다시 디코딩하지 않도록 체크
      if (decodedPath !== pathname) {
        console.log(`URL 디코딩 처리: ${pathname} -> ${decodedPath}`);
        
        // 새 URL 생성
        url.pathname = decodedPath;
        
        // 영구 리디렉션(308)으로 설정하고 리디렉션 쿠키 추가
        const response = NextResponse.redirect(url, 308);
        
        // 리디렉션 쿠키 설정 (이미 리디렉션된 경로 기록)
        response.cookies.set(REDIRECT_COOKIE, decodedPath, { 
          maxAge: 60, // 60초 동안 유효
          path: '/',
          httpOnly: true, 
          sameSite: 'strict'
        });
        
        return response;
      }
    } catch (e) {
      console.error('URL 디코딩 오류:', e);
    }
  }
  
  // 한글 문자가 직접 URL에 포함된 경우 홈으로 리디렉션
  if (/[\uAC00-\uD7A3]/.test(pathname) && !pathname.startsWith('/learn/')) {
    console.log(`한글 URL 감지, 홈으로 리디렉션: ${pathname}`);
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // 정상 진행
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