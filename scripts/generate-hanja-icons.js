const fs = require('fs');
const path = require('path');

// 한자 데이터 로드 (utils/hanjaUtils.ts에서 가져온 데이터 사용)
// 데이터 파일이 없으면 기본 한자 목록 사용
const defaultHanjaList = [
  { hanja: '水', meaning: '물 수', color: '#e6f7ff', textColor: '#1890ff', borderColor: '#4dabf7' },
  { hanja: '火', meaning: '불 화', color: '#fff1f0', textColor: '#f5222d', borderColor: '#ff7875' },
  { hanja: '木', meaning: '나무 목', color: '#f6ffed', textColor: '#52c41a', borderColor: '#b7eb8f' },
  { hanja: '金', meaning: '쇠 금', color: '#fffbe6', textColor: '#faad14', borderColor: '#ffe58f' },
  { hanja: '土', meaning: '흙 토', color: '#fff7e6', textColor: '#fa8c16', borderColor: '#ffd591' },
  { hanja: '日', meaning: '날 일', color: '#fffbe6', textColor: '#fa8c16', borderColor: '#ffe58f' },
  { hanja: '月', meaning: '달 월', color: '#f9f0ff', textColor: '#722ed1', borderColor: '#d3adf7' },
  { hanja: '山', meaning: '산 산', color: '#e6fffb', textColor: '#13c2c2', borderColor: '#87e8de' },
  { hanja: '川', meaning: '내 천', color: '#e6f7ff', textColor: '#1890ff', borderColor: '#91d5ff' },
  { hanja: '人', meaning: '사람 인', color: '#fff0f6', textColor: '#eb2f96', borderColor: '#ffadd2' },
];

// SVG 생성 함수
function generateHanjaSvg(hanja, options = {}) {
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

// 메인 함수
async function main() {
  try {
    // 디렉토리 생성
    const outputDir = path.join(__dirname, '..', 'public', 'images', 'hanja');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`디렉토리 생성: ${outputDir}`);
    }

    // 기본 아이콘 생성
    const defaultIconPath = path.join(outputDir, 'default.svg');
    if (!fs.existsSync(defaultIconPath)) {
      const defaultSvg = generateHanjaSvg('漢', { description: '한자' });
      fs.writeFileSync(defaultIconPath, defaultSvg);
      console.log('기본 아이콘 생성 완료');
    }

    // 한자 아이콘 생성
    let createdCount = 0;
    for (const hanjaItem of defaultHanjaList) {
      const { hanja, meaning, color, textColor, borderColor } = hanjaItem;
      const iconPath = path.join(outputDir, `${hanja}.svg`);
      
      if (!fs.existsSync(iconPath)) {
        const svg = generateHanjaSvg(hanja, {
          backgroundColor: color,
          textColor: textColor,
          borderColor: borderColor,
          description: meaning,
        });
        
        fs.writeFileSync(iconPath, svg);
        createdCount++;
      }
    }

    console.log(`한자 아이콘 생성 완료: ${createdCount}개`);
    console.log('총 아이콘 수:', defaultHanjaList.length + 1); // 기본 아이콘 포함
  } catch (error) {
    console.error('아이콘 생성 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 