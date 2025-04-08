// utils/errorHandler.ts
// 애플리케이션 전반의 오류 처리를 위한 유틸리티

import { NextResponse } from 'next/server';

/**
 * 오류 로깅 함수
 * @param error 오류 객체
 * @param context 오류 발생 컨텍스트 설명
 */
export function logError(error: unknown, context: string = '알 수 없는 컨텍스트'): void {
  console.error(`🔴 오류 발생 [${context}]:`, error);
  
  // 프로덕션 환경에서는 실제 로깅 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // TODO: 실제 로깅 서비스 연동 코드 추가
    // 예: Sentry, LogRocket 등
  }
}

/**
 * 구체적인 오류 타입 반환
 * @param error 오류 객체
 */
export function getErrorDetails(error: unknown): { 
  message: string; 
  status?: number; 
  code?: string;
} {
  if (error instanceof Error) {
    return { 
      message: error.message,
      code: (error as any).code
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  return { message: '알 수 없는 오류가 발생했습니다.' };
}

/**
 * API 오류 응답 생성
 * @param error 오류 객체
 * @param status HTTP 상태 코드
 */
export function createErrorResponse(error: unknown, status: number = 500) {
  const details = getErrorDetails(error);
  
  logError(error, `API 응답 (${status})`);
  
  return NextResponse.json(
    { 
      success: false, 
      error: details.message, 
      code: details.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

/**
 * 데이터 로드 시 폴백 핸들러
 * @param loader 데이터 로드 함수
 * @param fallback 오류 발생 시 반환할 기본값
 * @param context 오류 로깅에 사용할 컨텍스트
 */
export async function withFallback<T>(
  loader: () => Promise<T>,
  fallback: T,
  context: string = '데이터 로드'
): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}

/**
 * 클라이언트 컴포넌트에서 사용할 오류 처리 훅을 위한 함수
 * @param fn 실행할 함수
 * @param onError 오류 발생 시 실행할 콜백
 */
export async function tryCatch<T>(
  fn: () => Promise<T>, 
  onError?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logError(error, '클라이언트 작업');
    
    if (onError) {
      onError(error);
    }
    
    return null;
  }
}

/**
 * 오류 메시지를 사용자 친화적인 메시지로 변환
 * @param error 오류 객체 또는 메시지
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const details = getErrorDetails(error);
  
  // 일반적인 오류 코드에 대한 사용자 친화적 메시지 매핑
  const errorMessages: Record<string, string> = {
    'ECONNREFUSED': '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
    'NOT_FOUND': '요청하신 정보를 찾을 수 없습니다.',
    'UNAUTHORIZED': '로그인이 필요한 서비스입니다.',
    'FORBIDDEN': '접근 권한이 없습니다.',
    'VALIDATION_ERROR': '입력한 정보가 올바르지 않습니다.',
    'INTERNAL_SERVER_ERROR': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  };
  
  // 오류 코드에 해당하는 친화적 메시지가 있으면 반환
  if (details.code && errorMessages[details.code]) {
    return errorMessages[details.code];
  }
  
  // 기본 오류 메시지 반환
  if (details.message.includes('network') || details.message.includes('연결')) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  if (details.message.includes('timeout') || details.message.includes('시간 초과')) {
    return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

export default {
  logError,
  getErrorDetails,
  createErrorResponse,
  withFallback,
  tryCatch,
  getFriendlyErrorMessage
}; 