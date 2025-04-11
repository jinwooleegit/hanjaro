'use server';

import { generateHanjaSvgString } from './iconUtils';

/**
 * 파일 시스템에서 한자 SVG 파일이 존재하는지 확인합니다.
 * @param hanja 한자 문자
 * @returns 파일 존재 여부
 */
export async function hasHanjaSvg(hanja: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버에서만 사용할 수 있습니다');
  }
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'hanja', `${hanja}.svg`);
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 파일 시스템에 한자 SVG 파일을 생성합니다.
 * @param hanja 한자 문자
 * @param description 한자 설명 (예: "물 수")
 * @returns 생성 성공 여부
 */
export async function createHanjaSvgFile(hanja: string, description: string = ''): Promise<boolean> {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버에서만 사용할 수 있습니다');
  }
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const dirPath = path.join(process.cwd(), 'public', 'images', 'hanja');
    const filePath = path.join(dirPath, `${hanja}.svg`);
    
    // 디렉토리가 없으면 생성
    try {
      await fs.promises.access(dirPath, fs.constants.F_OK);
    } catch (error) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
    
    // SVG 문자열 생성 및 파일 쓰기
    const svgContent = generateHanjaSvgString(hanja, { description });
    await fs.promises.writeFile(filePath, svgContent, 'utf-8');
    
    return true;
  } catch (error) {
    console.error(`한자 SVG 파일 생성 중 오류: ${error}`);
    return false;
  }
} 