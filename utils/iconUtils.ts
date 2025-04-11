// 클라이언트에서도 사용 가능한 유틸리티 함수들

/**
 * 한자 문자에서 SVG 경로를 생성합니다.
 * @param hanja 한자 문자
 * @returns SVG 파일 경로
 */
export function getHanjaSvgPath(hanja: string): string {
  return `/images/hanja/${hanja}.svg`;
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

// 서버 액션 다시 내보내기 - 클라이언트와 서버 모두에서 일관된 API 사용을 위함
export { hasHanjaSvg, createHanjaSvgFile } from './iconServerActions'; 