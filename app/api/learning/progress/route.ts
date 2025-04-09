import { NextRequest, NextResponse } from 'next/server';

// 임시 라우트 핸들러 - 모든 복잡한 로직을 제거하고 간단한 응답만 반환
export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'API temporarily disabled for debugging' });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'API temporarily disabled for debugging' });
} 