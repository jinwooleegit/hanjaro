/**
 * 한자 ID 관련 유틸리티 함수
 * 모든 한자 접근을 ID 기반으로 통일하기 위한 도구들
 */

// serverActions.ts에서 서버 전용 함수들 가져오기
import { getIdFromCharacter, getCharacterFromId, getAllHanjaIds } from './serverActions';

// 클라이언트에서 사용하는 함수들
export function isValidHanjaId(identifier: string): boolean {
  return /^HJ-\d+-\d+-[0-9A-F]+$/i.test(identifier);
}

// 서버 함수 재내보내기 - 클라이언트와 서버 모두에서 일관된 API 사용을 위함
export { getIdFromCharacter, getCharacterFromId, getAllHanjaIds };

export async function normalizeToId(identifier: string): Promise<string | null> {
  // 이미 유효한 ID 형식이면 그대로 반환
  if (isValidHanjaId(identifier)) {
    return identifier;
  }
  
  // 한자 문자면 API를 통해 ID로 변환
  if (identifier.length === 1) {
    return await getIdFromCharacter(identifier);
  }
  
  // URL 인코딩된 문자일 수 있음
  try {
    if (identifier.includes('%')) {
      const decodedChar = decodeURIComponent(identifier);
      if (decodedChar.length === 1) {
        return await getIdFromCharacter(decodedChar);
      }
    }
  } catch (e) {
    console.error('문자 디코딩 오류:', e);
  }
  
  // 변환 실패
  return null;
}

// 클라이언트에서도 사용할 수 있는 유틸리티
export const clientUtils = {
  formatHanjaId(id: string): string {
    if (!isValidHanjaId(id)) return '유효하지 않은 ID';
    return id;
  },
  
  parseHanjaId(id: string): { grade: number; order: number; unicode: string } | null {
    if (!isValidHanjaId(id)) return null;
    
    const parts = id.split('-');
    return {
      grade: parseInt(parts[1], 10),
      order: parseInt(parts[2], 10),
      unicode: parts[3]
    };
  }
}; 