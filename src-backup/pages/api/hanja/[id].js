/**
 * 특정 한자 API 라우트
 * 
 * 엔드포인트: /api/hanja/[id]
 * 메소드: GET
 * 
 * ID 형식:
 * - HJ-XX-XXXX-XXXX: 표준 ID 형식
 * - character: 한글자 한자 문자 (예: 一)
 */

import fs from 'fs';
import path from 'path';

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');

// 캐시 설정 (10분)
const CACHE_MAX_AGE = 600;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ID 파라미터 추출
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing ID parameter' });
    }

    // 캐싱 헤더 설정
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);

    // 한자 데이터 불러오기
    const hanjaData = await getHanjaById(id);
    
    if (!hanjaData) {
      return res.status(404).json({ error: 'Hanja not found' });
    }

    // 응답 반환
    return res.status(200).json({
      success: true,
      data: hanjaData
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// ID로 한자 데이터 불러오기
async function getHanjaById(id) {
  try {
    // ID가 표준 형식인지 확인
    const isStandardId = /^HJ-\d{2}-\d{4}-[0-9A-F]{4,5}$/.test(id);
    
    if (isStandardId) {
      // 표준 ID 형식으로 파일 찾기
      const filePath = path.join(CHARACTERS_DIR, `${id}.json`);
      
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } else if (id.length === 1) {
      // 한 글자 한자로 검색
      const unicode = id.codePointAt(0).toString(16).toUpperCase();
      
      // 모든 한자 파일 목록
      const files = fs.readdirSync(CHARACTERS_DIR)
        .filter(file => file.endsWith('.json'));
      
      // 유니코드로 매칭되는 파일 찾기
      for (const file of files) {
        if (file.includes(`-${unicode}.json`)) {
          const filePath = path.join(CHARACTERS_DIR, file);
          return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
      }
    }
    
    return null;
  } catch (error) {
    throw new Error(`Failed to load hanja with ID ${id}: ${error.message}`);
  }
} 