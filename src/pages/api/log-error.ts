import { NextApiRequest, NextApiResponse } from 'next';

interface ErrorLogPayload {
  url: string;
  errorType: string;
  message: string;
  userAgent?: string;
  timestamp?: string;
}

/**
 * 클라이언트 측 오류를 로깅하기 위한 API 엔드포인트
 * 이 API는 404, URL 오류 등이 발생했을 때 클라이언트에서 호출할 수 있습니다.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  try {
    const { url, errorType, message } = req.body as ErrorLogPayload;
    
    // 기본 검증
    if (!url || !errorType) {
      return res.status(400).json({ message: '필수 필드가 누락되었습니다' });
    }
    
    // 오류 로그 구성
    const errorLog: ErrorLogPayload = {
      url,
      errorType,
      message: message || '오류 발생',
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    };
    
    // 실제 프로덕션 환경에서는 데이터베이스나 로그 서비스에 저장
    // 개발 환경에서는 콘솔에 로그 출력
    console.log('[오류 로그]', JSON.stringify(errorLog, null, 2));
    
    // 성공적으로 로깅됨
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('오류 로깅 중 문제 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
} 