import fs from 'fs';
import path from 'path';

/**
 * 한자 문자에서 SVG 경로를 생성합니다.
 * @param hanja 한자 문자
 * @returns SVG 파일 경로
 */
export function getHanjaSvgPath(hanja: string): string {
  return `/images/hanja/${hanja}.svg`;
}

/**
 * 파일 시스템에서 한자 SVG 파일이 존재하는지 확인합니다.
 * @param hanja 한자 문자
 * @returns 파일 존재 여부
 */
export async function hasHanjaSvg(hanja: string): Promise<boolean> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'hanja', `${hanja}.svg`);
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 한자 문자를 포함한 기본 SVG 문자열을 생성합니다.
 * @param hanja 한자 문자
 * @param options 추가 옵션 (색상 등)
 * @returns SVG 문자열
 */
export function generateHanjaSvgString(
  hanja: string, 
  options: { 
    backgroundColor?: string; 
    textColor?: string;
    borderColor?: string;
    description?: string;
  } = {}
): string {
  const {
    backgroundColor = '#f5f5f5',
    textColor = '#333333',
    borderColor = '#cccccc',
    description = '',
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="2"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${hanja}</text>
    ${description ? `<text x="50%" y="75%" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#666666">${description}</text>` : ''}
  </svg>`;
}

/**
 * 파일 시스템에 한자 SVG 파일을 생성합니다.
 * @param hanja 한자 문자
 * @param description 한자 설명 (예: "물 수")
 * @returns 생성 성공 여부
 */
export async function createHanjaSvgFile(hanja: string, description: string = ''): Promise<boolean> {
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