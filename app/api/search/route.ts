import { NextRequest, NextResponse } from 'next/server';
import { getCharacters } from '@/lib/hanja';
import { searchHanja } from '@/utils/hanjaUtils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim() === '') {
      return NextResponse.json({ 
        error: '검색어를 입력해주세요',
        results: [] 
      }, { status: 400 });
    }

    const results = await searchHanja(query);
    
    return NextResponse.json({ 
      results, 
      count: results.length,
      query
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: '검색 중 오류가 발생했습니다',
      results: [] 
    }, { status: 500 });
  }
} 