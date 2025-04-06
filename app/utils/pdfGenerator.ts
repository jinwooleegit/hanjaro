import jsPDF from 'jspdf';

interface HanjaCharacter {
  character: string;
  meaning: string;
  pronunciation: string;
  stroke_count?: number;
}

/**
 * 한자 필기 연습 PDF를 생성합니다.
 * @param characters 저장할 한자 객체 배열
 * @param title PDF 제목
 * @param repeatCount 각 한자의 반복 횟수 (기본값: 10)
 * @returns 생성된 PDF 문서 객체
 */
export function generateHanjaPracticePDF(characters: HanjaCharacter[], title: string = '한자 필기 연습', repeatCount: number = 10): jsPDF {
  // A4 크기 PDF 생성 (210 x 297 mm)
  const pdf = new jsPDF({
    orientation: 'p', // portrait
    unit: 'mm',
    format: 'a4'
  });
  
  // 문서 정보 설정
  pdf.setProperties({
    title: title,
    subject: '한자 필기 연습',
    author: '한자로',
    keywords: '한자, 필기, 연습, 학습',
    creator: '한자로 앱'
  });
  
  // 폰트 및 여백 설정
  const margin = 15; // 페이지 여백 (mm)
  const lineHeight = 8; // 줄 간격 (mm)
  
  // 제목 추가
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(title, margin, margin);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(margin, margin + 3, 210 - margin, margin + 3);
  
  // 생성 날짜 추가
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`생성일: ${dateStr}`, margin, margin + 8);
  
  let y = margin + 15; // 시작 y 위치
  let currentPage = 1;
  
  // 각 한자별 연습 영역 생성
  characters.forEach((hanjaObj, charIndex) => {
    const char = hanjaObj.character;
    
    // 페이지 넘김 확인 (연습 영역 높이: ~110mm)
    if (y + 110 > 297 - margin) {
      pdf.addPage();
      currentPage++;
      y = margin;
    }
    
    // 한자 정보 헤더
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${charIndex + 1}. ${char} (${hanjaObj.pronunciation}) - ${hanjaObj.meaning}`, margin, y);
    
    // 구분선
    pdf.setDrawColor(200);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + 2, 210 - margin, y + 2);
    
    // 큰 한자 표시
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(36);
    pdf.text(char, margin, y + 12);
    
    // 획수 정보 (있는 경우)
    if (hanjaObj.stroke_count) {
      pdf.setFontSize(9);
      pdf.text(`(${hanjaObj.stroke_count}획)`, margin + 12, y + 12);
    }
    
    // 점선 사각형 네모칸 그리기 (가로 5개, 세로 2개)
    const boxWidth = 30; // 네모칸 너비
    const boxHeight = 30; // 네모칸 높이
    const boxGap = 5; // 네모칸 간격
    const boxPerRow = 5; // 한 줄당 네모칸 수
    const rowsNeeded = Math.ceil(repeatCount / boxPerRow); // 필요한 줄 수
    
    pdf.setDrawColor(220);
    pdf.setLineDashPattern([1, 1], 0);
    
    // 연습 네모칸 그리기
    for (let i = 0; i < repeatCount; i++) {
      const row = Math.floor(i / boxPerRow);
      const col = i % boxPerRow;
      
      const boxX = margin + col * (boxWidth + boxGap);
      const boxY = y + 15 + row * (boxHeight + boxGap);
      
      // 네모칸 그리기
      pdf.rect(boxX, boxY, boxWidth, boxHeight);
      
      // 십자선 그리기 (가이드)
      pdf.setLineDashPattern([0.5, 0.5], 0);
      pdf.setDrawColor(230);
      
      // 가로 중앙선
      pdf.line(
        boxX, boxY + boxHeight / 2, 
        boxX + boxWidth, boxY + boxHeight / 2
      );
      
      // 세로 중앙선
      pdf.line(
        boxX + boxWidth / 2, boxY, 
        boxX + boxWidth / 2, boxY + boxHeight
      );
    }
    
    // 연습 영역 높이 계산
    const practiceAreaHeight = (boxHeight + boxGap) * rowsNeeded;
    
    // 사용법 안내
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100);
    pdf.text('각 칸에 한자를 쓰고 획순을 익히세요. 중앙선은 가이드로만 사용하세요.', margin, y + 20 + practiceAreaHeight);
    
    // 다음 한자로 Y 위치 이동
    y += 25 + practiceAreaHeight;
    
    // 텍스트 색상 원래대로
    pdf.setTextColor(0);
    
    // 실선으로 되돌리기
    pdf.setLineDashPattern([], 0);
  });
  
  // 페이지 번호 추가
  for (let i = 1; i <= currentPage; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`${i}/${currentPage}`, 210 - margin, 297 - 5);
  }
  
  return pdf;
}

/**
 * 한자 필기 연습 PDF를 생성하고 다운로드합니다.
 * @param characters 저장할 한자 객체 배열
 * @param filename 저장할 파일 이름 (기본값: '한자_필기_연습.pdf')
 * @param title PDF 제목 (기본값: '한자 필기 연습')
 * @param repeatCount 각 한자의 반복 횟수 (기본값: 10)
 */
export function downloadHanjaPracticePDF(
  characters: HanjaCharacter[], 
  filename: string = '한자_필기_연습.pdf',
  title: string = '한자 필기 연습',
  repeatCount: number = 10
): void {
  // PDF 생성
  const pdf = generateHanjaPracticePDF(characters, title, repeatCount);
  
  // PDF 저장
  pdf.save(filename);
}

/**
 * 오늘 날짜로 파일 이름 생성
 */
export function generateTodayFilename(prefix: string = '한자_필기_연습'): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${prefix}_${year}${month}${day}.pdf`;
} 