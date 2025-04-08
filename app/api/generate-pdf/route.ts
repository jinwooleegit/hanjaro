import { NextRequest, NextResponse } from 'next/server';
import { getHanjaCharacter, getAllHanjaCharacters } from '@/utils/hanjaUtils';
import type { HanjaCharacter } from '@/utils/hanjaUtils';
// @ts-ignore
import PDFDocument from 'pdfkit-next';
import fs from 'fs';
import path from 'path';

// PDFKit 타입 선언
// @ts-ignore
declare module 'pdfkit-next' {
  export default PDFDocument;
}

declare global {
  namespace PDFKit {
    interface PDFDocument {
      widthOfString(text: string): number;
      underline(x: number, y: number, width: number, height: number, options?: any): PDFKit.PDFDocument;
      font(src: string, family?: string): PDFKit.PDFDocument;
      registerFont(name: string, src: string, family?: string): PDFKit.PDFDocument;
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const character = searchParams.get('character');
    const category = searchParams.get('category') || 'basic';
    const level = searchParams.get('level') || 'level1';
    const type = searchParams.get('type');

    // 퀴즈 리뷰 PDF 생성
    if (type === 'quiz-review') {
      return generateQuizReviewPDF();
    }

    // 한자 개별 PDF 생성 (기존 로직)
    if (!character) {
      return NextResponse.json(
        { error: '한자 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 한자 데이터 가져오기
    const hanjaData = getHanjaCharacter(decodeURIComponent(character));
    
    if (!hanjaData) {
      return NextResponse.json(
        { error: '한자 데이터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // PDF 문서 생성
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `한자 학습 - ${hanjaData.character}`,
        Author: '한자로 학습 시스템',
        Subject: '한자 학습 복습지',
      },
    });

    // 한글 폰트 경로
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NanumGothic.ttf');
    
    // 한글 폰트 등록
    doc.registerFont('NanumGothic', fontPath);
    
    // 기본 폰트로 한글 폰트 설정
    doc.font('NanumGothic');

    // 버퍼에 PDF 파일 데이터 저장
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // PDF 완성 이벤트 처리
    const pdf = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      // PDF 내용 생성
      // 헤더 및 타이틀
      doc.fontSize(24).text('한자 학습 복습지', { align: 'center' });
      doc.moveDown(2);
      
      // 한자 정보 섹션
      doc.fontSize(18).text('한자 정보', { underline: true });
      doc.moveDown(0.5);
      
      // 한자와 기본 정보 - 한자는 기본 폰트로
      doc.font('Helvetica-Bold').fontSize(60).text(hanjaData.character, { align: 'center' });
      doc.moveDown();
      
      // 한글 정보 - 한글 폰트로 변경
      doc.font('NanumGothic').fontSize(14).text(`의미: ${hanjaData.meaning}`);
      doc.fontSize(14).text(`발음: ${hanjaData.pronunciation}`);
      doc.fontSize(14).text(`획수: ${hanjaData.stroke_count}`);
      
      if (hanjaData.radical) {
        doc.fontSize(14).text(`부수: ${hanjaData.radical}`);
        doc.moveDown(2);
      } else {
        doc.moveDown(2);
      }
      
      // 예제 단어 섹션
      if (hanjaData.examples && hanjaData.examples.length > 0) {
        doc.fontSize(18).text('예제 단어', { underline: true });
        doc.moveDown(0.5);
        
        hanjaData.examples.forEach((example, index) => {
          doc.fontSize(14).font('NanumGothic-Bold').text(`${index + 1}. ${example.word}`);
          doc.fontSize(12).font('NanumGothic').text(`  발음: ${example.pronunciation}`);
          doc.fontSize(12).text(`  의미: ${example.meaning}`);
          doc.moveDown(0.5);
        });
      }
      
      // 연습 공간
      doc.addPage();
      doc.font('NanumGothic').fontSize(18).text('한자 쓰기 연습', { underline: true });
      doc.moveDown(2);
      
      // 쓰기 연습을 위한 그리드 생성 (5x5)
      const gridSize = 5;
      const cellSize = 80;
      const startX = (doc.page.width - (cellSize * gridSize)) / 2;
      const startY = doc.y + 20;
      
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = startX + (col * cellSize);
          const y = startY + (row * cellSize);
          
          // 연습 칸 그리기
          doc.rect(x, y, cellSize, cellSize)
             .lineWidth(0.5)
             .stroke('#cccccc');
          
          // 가이드라인 (십자선)
          doc.moveTo(x, y + cellSize/2)
             .lineTo(x + cellSize, y + cellSize/2)
             .lineWidth(0.2)
             .stroke('#dddddd');
          
          doc.moveTo(x + cellSize/2, y)
             .lineTo(x + cellSize/2, y + cellSize)
             .lineWidth(0.2)
             .stroke('#dddddd');
        }
      }
      
      // 푸터
      const footerY = startY + (gridSize * cellSize) + 40;
      const dateStr = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.font('NanumGothic').fontSize(10).text(`생성일: ${dateStr}`, 50, footerY);
      doc.fontSize(10).text('한자로 학습 시스템 - www.hanjaro.com', 50, footerY + 15);
      
      // PDF 생성 완료
      doc.end();
    });

    // PDF 파일 반환
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=hanja_${hanjaData.character}_practice.pdf`,
      },
    });
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    return NextResponse.json(
      { error: 'PDF 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 퀴즈 리뷰 PDF 생성 함수
async function generateQuizReviewPDF() {
  try {
    // PDF 문서 생성
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `한자 퀴즈 복습 자료`,
        Author: '한자로 학습 시스템',
        Subject: '한자 퀴즈 복습 자료',
      },
    });

    // 한글 폰트 경로
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NanumGothic.ttf');
    
    // 한글 폰트 등록
    doc.registerFont('NanumGothic', fontPath);
    
    // 기본 폰트로 한글 폰트 설정
    doc.font('NanumGothic');

    // 버퍼에 PDF 파일 데이터 저장
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // 자주 사용되는 한자 10개 가져오기
    const allHanjaPromise = getAllHanjaCharacters();
    const allHanja: HanjaCharacter[] = await allHanjaPromise || [];
    
    // 랜덤으로 10개 선택
    const commonHanja = [...allHanja]
      .sort(() => 0.5 - Math.random()) // 랜덤 정렬
      .slice(0, 10); // 10개 선택

    // PDF 완성 이벤트 처리
    const pdf = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      // PDF 내용 생성
      // 헤더 및 타이틀
      doc.fontSize(24).text('한자 퀴즈 복습 자료', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).text('이 자료는 퀴즈 완료 후 복습을 위해 자동으로 생성되었습니다.', { align: 'center' });
      doc.moveDown(2);
      
      // 주요 학습 한자 섹션
      doc.fontSize(18).text('주요 학습 한자', { underline: true });
      doc.moveDown(0.5);
      
      // 한자 정보 테이블 생성
      const tableTop = doc.y;
      let tableRow = tableTop;
      const colWidths = [100, 150, 220, 80];
      const rowHeight = 30;
      
      // 테이블 헤더
      doc.font('NanumGothic-Bold').fontSize(12);
      doc.text('한자', 50, tableRow, { width: colWidths[0], align: 'center' });
      doc.text('발음', 50 + colWidths[0], tableRow, { width: colWidths[1], align: 'center' });
      doc.text('의미', 50 + colWidths[0] + colWidths[1], tableRow, { width: colWidths[2], align: 'center' });
      doc.text('획수', 50 + colWidths[0] + colWidths[1] + colWidths[2], tableRow, { width: colWidths[3], align: 'center' });
      
      // 헤더 라인
      doc.moveTo(50, tableRow + rowHeight)
        .lineTo(50 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableRow + rowHeight)
        .stroke();
      
      tableRow += rowHeight;
      
      // 테이블 내용
      doc.font('NanumGothic').fontSize(12);
      commonHanja.forEach((hanja: HanjaCharacter, idx: number) => {
        // 홀수/짝수 행 배경
        if (idx % 2 === 1) {
          doc.rect(50, tableRow, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], rowHeight)
            .fill('#f8f9fa');
        }
        
        // 한자 셀 (한자 크게 표시)
        doc.font('Helvetica-Bold').fontSize(16);
        doc.text(hanja.character, 50, tableRow + 5, { width: colWidths[0], align: 'center' });
        
        // 나머지 셀
        doc.font('NanumGothic').fontSize(12);
        doc.text(hanja.pronunciation || '', 50 + colWidths[0], tableRow + 8, { width: colWidths[1], align: 'center' });
        doc.text(hanja.meaning || '', 50 + colWidths[0] + colWidths[1], tableRow + 8, { width: colWidths[2], align: 'center' });
        doc.text(String(hanja.stroke_count || '?'), 50 + colWidths[0] + colWidths[1] + colWidths[2], tableRow + 8, { width: colWidths[3], align: 'center' });
        
        tableRow += rowHeight;
      });
      
      // 테이블 테두리
      doc.rect(50, tableTop, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableRow - tableTop)
        .stroke();
      
      // 수직 구분선
      doc.moveTo(50 + colWidths[0], tableTop)
        .lineTo(50 + colWidths[0], tableRow)
        .stroke();
      doc.moveTo(50 + colWidths[0] + colWidths[1], tableTop)
        .lineTo(50 + colWidths[0] + colWidths[1], tableRow)
        .stroke();
      doc.moveTo(50 + colWidths[0] + colWidths[1] + colWidths[2], tableTop)
        .lineTo(50 + colWidths[0] + colWidths[1] + colWidths[2], tableRow)
        .stroke();
      
      doc.moveDown(2);
      
      // 쓰기 연습 페이지
      doc.addPage();
      doc.font('NanumGothic').fontSize(18).text('한자 쓰기 연습', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text('아래 공간에 한자를 반복해서 쓰면서 연습해 보세요.', { align: 'center' });
      doc.moveDown(1);
      
      // 선택된 한자 5개만 쓰기 연습용으로 표시
      const practiceHanja = commonHanja.slice(0, 5);
      
      // 쓰기 연습 공간 생성
      const practiceRowHeight = 120;
      
      practiceHanja.forEach((hanja: HanjaCharacter, idx: number) => {
        const rowY = doc.y;
        
        // 한자 정보 표시
        doc.font('Helvetica-Bold').fontSize(30);
        doc.text(hanja.character, 50, rowY + 20, { width: 80, align: 'center' });
        
        doc.font('NanumGothic').fontSize(12);
        doc.text(`${hanja.meaning || ''} (${hanja.pronunciation || ''})`, 140, rowY + 10);
        doc.text(`획수: ${hanja.stroke_count || '?'}`, 140, rowY + 30);
        
        // 쓰기 연습 셀 8개 그리기
        const cellSize = 50;
        const cellGap = 10;
        const cellsStartX = 140;
        const cellsStartY = rowY + 50;
        
        for (let i = 0; i < 8; i++) {
          const x = cellsStartX + (i % 4) * (cellSize + cellGap);
          const y = cellsStartY + Math.floor(i / 4) * (cellSize + cellGap);
          
          // 셀 그리기
          doc.rect(x, y, cellSize, cellSize)
            .lineWidth(0.5)
            .stroke('#cccccc');
            
          // 가이드라인 (십자선)
          doc.moveTo(x, y + cellSize/2)
            .lineTo(x + cellSize, y + cellSize/2)
            .lineWidth(0.2)
            .stroke('#dddddd');
            
          doc.moveTo(x + cellSize/2, y)
            .lineTo(x + cellSize/2, y + cellSize)
            .lineWidth(0.2)
            .stroke('#dddddd');
        }
        
        // 다음 한자와의 구분선
        if (idx < practiceHanja.length - 1) {
          doc.moveDown(8);
          doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .lineWidth(0.2)
            .stroke('#cccccc');
          doc.moveDown(1);
        }
      });
      
      // 퀴즈 팁 페이지
      doc.addPage();
      doc.font('NanumGothic-Bold').fontSize(20).text('한자 학습 퀴즈 팁', { align: 'center' });
      doc.moveDown(1);
      
      // 팁 내용
      doc.font('NanumGothic').fontSize(14);
      doc.text('효과적인 한자 학습을 위한 팁', { underline: true });
      doc.moveDown(0.5);
      
      const tips = [
        "1. 획순을 정확히 익히세요 - 한자의 올바른 쓰기 순서는 암기와 이해에 도움이 됩니다.",
        "2. 부수를 기억하세요 - 부수는 한자의 의미나 발음을 추측하는 데 중요한 단서가 됩니다.",
        "3. 연관 단어를 함께 학습하세요 - 한자가 포함된 단어를 함께 외우면 활용도가 높아집니다.",
        "4. 규칙적으로 복습하세요 - 한자는 지속적인 복습이 가장 중요합니다.",
        "5. 쓰기 연습을 병행하세요 - 눈으로만 보는 것보다 직접 쓰면서 학습하는 것이 효과적입니다."
      ];
      
      tips.forEach(tip => {
        doc.text(tip);
        doc.moveDown(0.5);
      });
      
      doc.moveDown(1);
      doc.text('자주 틀리는 한자 구별하기', { underline: true });
      doc.moveDown(0.5);
      
      const confusablePairs = [
        { pair: "人 vs 入", desc: "사람 인(人)과 들어갈 입(入)은 비슷해 보이지만, 사람 인은 다리가 벌어져 있고 들어갈 입은 위쪽이 뾰족합니다." },
        { pair: "土 vs 士", desc: "흙 토(土)와 선비 사(士)는 한 획 차이입니다. 흙 토는 위 획이 길고, 선비 사는 위 획이 짧습니다." },
        { pair: "日 vs 目", desc: "날 일(日)과 눈 목(目)은 안쪽 획의 위치가 다릅니다. 날 일은 중앙에 가로획이 있고, 눈 목은 세로획이 있습니다." }
      ];
      
      confusablePairs.forEach(item => {
        doc.font('NanumGothic-Bold').text(item.pair);
        doc.font('NanumGothic').text(item.desc);
        doc.moveDown(0.5);
      });
      
      // 푸터
      const dateStr = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.moveDown(2);
      doc.font('NanumGothic').fontSize(10).text(`이 복습 자료는 ${dateStr}에 생성되었습니다.`, { align: 'center' });
      doc.fontSize(10).text('한자로 학습 시스템 - www.hanjaro.com', { align: 'center' });
      
      // PDF 생성 완료
      doc.end();
    });

    // PDF 파일 반환
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=hanja_quiz_review.pdf`,
      },
    });
  } catch (error) {
    console.error('퀴즈 리뷰 PDF 생성 오류:', error);
    return NextResponse.json(
      { error: '퀴즈 리뷰 PDF 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 