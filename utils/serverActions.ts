'use server';

/**
 * 서버 전용 한자 ID 관련 유틸리티 함수
 * 모든 서버 액션을 한 곳에 모아 'use server' 지시문을 파일 최상단에 배치
 */

export async function getIdFromCharacter(character: string): Promise<string | null> {
  // API를 통해 ID 조회
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hanja/id?character=${encodeURIComponent(character)}`);
  if (!response.ok) return null;
  
  const data = await response.json();
  return data?.id || null;
}

export async function getCharacterFromId(id: string): Promise<string | null> {
  // API를 통해 문자 조회
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hanja/id?id=${id}`);
  if (!response.ok) return null;
  
  const data = await response.json();
  return data?.character || null;
}

export async function getAllHanjaIds(): Promise<string[]> {
  // API를 통해 모든 ID 조회
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hanja/all-ids`);
  if (!response.ok) return [];
  
  const data = await response.json();
  return data?.ids || [];
}

// 서버 전용 유틸리티
export async function initializeIdMappings() {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버에서만 사용할 수 있습니다');
  }
  
  // 서버 로직 구현
  const fs = require('fs');
  const path = require('path');
  
  const filePath = path.join(process.cwd(), 'data', 'new-structure', 'characters', 'hanja_extended.json');
  const fileData = await fs.promises.readFile(filePath, 'utf8');
  const data = JSON.parse(fileData);
  
  return data.characters || [];
} 