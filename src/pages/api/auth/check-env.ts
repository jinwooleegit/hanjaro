import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 중요: 실제 시크릿 값은 노출하지 않고 설정 여부만 확인
    const envStatus = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
      KAKAO_CLIENT_ID: !!process.env.KAKAO_CLIENT_ID,
      KAKAO_CLIENT_SECRET: !!process.env.KAKAO_CLIENT_SECRET,
    };

    res.status(200).json({
      env: envStatus,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('환경 변수 확인 중 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
} 