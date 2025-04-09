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

    console.log('PDF 생성 요청 시작:', { character, category, level, type });

    // 복습 자료 PDF 생성
    if (type === 'quiz-review' || type === 'review') {
      return generateReviewPDF(request);
    }

    // 한자 개별 PDF 생성 (기존 로직)
    if (!character) {
      console.error('한자 파라미터 누락됨');
      return NextResponse.json(
        { error: '한자 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 한자 데이터 가져오기
    let decodedCharacter;
    try {
      decodedCharacter = decodeURIComponent(character);
      console.log('디코딩된 한자:', decodedCharacter);
    } catch (e) {
      console.error('한자 디코딩 오류:', e);
      decodedCharacter = character;
    }

    const hanjaData = getHanjaCharacter(decodedCharacter);
    
    if (!hanjaData) {
      console.error('한자 데이터 찾을 수 없음:', decodedCharacter);
      return NextResponse.json(
        { error: '한자 데이터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('한자 데이터 로드 성공:', hanjaData);

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

    // 한글 폰트 설정 시도
    let hasKoreanFont = false;
    try {
      // Noto Sans KR 폰트 등록
      console.log('Noto Sans KR 폰트 등록 시도...');
      
      // 폰트 경로 (절대 경로와 상대 경로 모두 시도)
      const regularFontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Regular.ttf');
      const boldFontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Bold.ttf');
      
      // 폰트 파일 존재 확인
      if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
        console.log('폰트 파일 존재 확인 완료');
        
        // 폰트 등록
        doc.registerFont('NotoSansKR', regularFontPath);
        doc.registerFont('NotoSansKR-Bold', boldFontPath);
    
    // 기본 폰트로 한글 폰트 설정
        doc.font('NotoSansKR');
        hasKoreanFont = true;
        console.log('Noto Sans KR 폰트 등록 성공');
      } else {
        console.warn('폰트 파일을 찾을 수 없음. 기본 폰트 사용...');
        throw new Error('폰트 파일 없음');
      }
    } catch (fontError) {
      console.error('폰트 설정 오류:', fontError);
      // 폰트 등록 실패 시 기본 폰트 사용
      hasKoreanFont = false;
    }

    // 버퍼에 PDF 파일 데이터 저장
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // PDF 완성 이벤트 처리
    const pdf = await new Promise<Buffer>(async (resolve) => {
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
      const textFont = hasKoreanFont ? 'NotoSansKR' : 'Helvetica';
      doc.font(textFont).fontSize(14).text(`의미: ${hanjaData.meaning}`);
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
          const boldFont = hasKoreanFont ? 'NotoSansKR-Bold' : 'Helvetica-Bold';
          doc.fontSize(14).font(boldFont).text(`${index + 1}. ${example.word}`);
          doc.fontSize(12).font(textFont).text(`  발음: ${example.pronunciation}`);
          doc.fontSize(12).text(`  의미: ${example.meaning}`);
          doc.moveDown(0.5);
        });
      }
      
      // 연습 공간
      doc.addPage();
      doc.font(textFont).fontSize(18).text('필기 연습', { underline: true });
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
      
      doc.font(textFont).fontSize(10).text(`생성일: ${dateStr}`, 50, footerY);
      doc.fontSize(10).text('한자로 학습 시스템 - www.hanjaro.com', 50, footerY + 15);
      
      // PDF 생성 완료
      doc.end();
    });

    console.log('PDF 생성 완료, 반환 중...');

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

// 복습 자료 PDF 생성 함수
async function generateReviewPDF(_req: NextRequest): Promise<NextResponse> {
  try {
    console.log('한자 복습 자료 PDF 생성 시작');
    
    // PDF 문서 생성
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: '한자 학습 복습 자료',
        Author: '한자로 학습 시스템',
        Subject: '한자 학습 복습 자료',
      },
    });

    // 한글 폰트 설정 시도
    let hasKoreanFont = false;
    try {
      // Noto Sans KR 폰트 등록
      console.log('Noto Sans KR 폰트 등록 시도...');
      
      // 폰트 경로 (절대 경로와 상대 경로 모두 시도)
      const regularFontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Regular.ttf');
      const boldFontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Bold.ttf');
      
      // 폰트 파일 존재 확인
      if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
        console.log('폰트 파일 존재 확인 완료');
        
        // 폰트 등록
        doc.registerFont('NotoSansKR', regularFontPath);
        doc.registerFont('NotoSansKR-Bold', boldFontPath);
    
    // 기본 폰트로 한글 폰트 설정
        doc.font('NotoSansKR');
        hasKoreanFont = true;
        console.log('Noto Sans KR 폰트 등록 성공');
      } else {
        console.warn('폰트 파일을 찾을 수 없음. 기본 폰트 사용...');
        throw new Error('폰트 파일 없음');
      }
    } catch (fontError) {
      console.error('폰트 설정 오류:', fontError);
      // 폰트 등록 실패 시 기본 폰트 사용
      hasKoreanFont = false;
    }

    // 텍스트 폰트 설정
    const textFont = hasKoreanFont ? 'NotoSansKR' : 'Helvetica';
    const boldFont = hasKoreanFont ? 'NotoSansKR-Bold' : 'Helvetica-Bold';

    // 버퍼에 PDF 파일 데이터 저장
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // PDF 완성 이벤트 처리
    const pdf = await new Promise<Buffer>(async (resolve) => {
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      // PDF 내용 생성
      // 헤더 및 타이틀
      doc.font(boldFont).fontSize(24).text('한자 학습 복습 자료', { align: 'center' });
      doc.font(textFont).fontSize(12).text('한자로 학습 시스템', { align: 'center' });
      doc.moveDown(2);
      
      // 복습 지침 설명
      doc.font(boldFont).fontSize(16).text('효과적인 한자 학습을 위한 복습 지침', { underline: true });
      doc.moveDown(0.5);
      doc.font(textFont).fontSize(12);
      doc.text('1. 한자를 반복적으로 써보며 익히세요. 쓰기 연습은 한자 학습의 가장 효과적인 방법입니다.');
      doc.text('2. 한자의 부수와 획순을 인지하며 쓰세요. 올바른 획순은 기억력과 이해도를 높여줍니다.');
      doc.text('3. 예제 단어를 활용해 실제 사용 맥락을 익히세요. 단어 속에서 한자의 의미를 기억하는 것이 효과적입니다.');
      doc.text('4. 정기적으로 복습하세요. 복습 간격을 점차 늘려가며 장기 기억으로 전환시키세요.');
      doc.moveDown(2);
      
      // 모든 한자 데이터 가져오기 - 비동기 함수 await 처리
      const allCharacters = await getAllHanjaCharacters();
      
      // 예시로 첫 10개 한자만 사용 (실제로는 쿼리 파라미터로 받을 필요가 있음)
      const sampleCharacters = allCharacters.slice(0, 10);
      
      // 한자별 복습 페이지 생성
      sampleCharacters.forEach((hanjaData: HanjaCharacter, index: number) => {
        if (index > 0) {
          doc.addPage();
        }
        
        // 한자 정보 섹션
        doc.font(boldFont).fontSize(18).text(`한자 정보: ${hanjaData.character}`, { underline: true });
        doc.moveDown(0.5);
        
        // 한자와 기본 정보
        doc.font('Helvetica-Bold').fontSize(60).text(hanjaData.character, { align: 'center' });
        doc.moveDown();
        
        // 한글 정보
        doc.font(textFont).fontSize(14).text(`의미: ${hanjaData.meaning}`);
        doc.fontSize(14).text(`발음: ${hanjaData.pronunciation}`);
        doc.fontSize(14).text(`획수: ${hanjaData.stroke_count}`);
        
        if (hanjaData.radical) {
          doc.fontSize(14).text(`부수: ${hanjaData.radical}`);
        }
        doc.moveDown();
        
        // 예제 단어 섹션
        if (hanjaData.examples && hanjaData.examples.length > 0) {
          doc.font(boldFont).fontSize(16).text('예제 단어', { underline: true });
          doc.moveDown(0.5);
          
          hanjaData.examples.slice(0, 3).forEach((example: any, i: number) => {
            doc.font(boldFont).fontSize(14).text(`${i + 1}. ${example.word}`);
            doc.font(textFont).fontSize(12).text(`  발음: ${example.pronunciation}`);
            doc.fontSize(12).text(`  의미: ${example.meaning}`);
            doc.moveDown(0.5);
          });
        }
        
        // 쓰기 연습 그리드
        doc.moveDown();
        doc.font(boldFont).fontSize(16).text('쓰기 연습', { underline: true });
        doc.moveDown(0.5);
        
        // 연습 그리드 생성 (3x3)
        const gridSize = 3;
        const cellSize = 100;
        const startX = (doc.page.width - (cellSize * gridSize)) / 2;
        const startY = doc.y;
        
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
      });
      
      // 마지막 페이지에 추가 팁 섹션
      doc.addPage();
      doc.font(boldFont).fontSize(18).text('한자 학습을 위한 추가 팁', { underline: true });
      doc.moveDown();
      doc.font(textFont).fontSize(12);
      
      // 학습 팁 목록
      const tips = [
        '한자는 부수별로 그룹화하여 학습하면 효율적입니다. 유사한 부수를 가진 한자들은 연관성을 통해 기억하기 쉽습니다.',
        '한자의 어원과 발전 과정을 이해하면 더 깊은 이해와 기억에 도움이 됩니다.',
        '한자어가 들어간 일상 단어들을 찾아보고 의미를 분석해보세요.',
        '한자 학습 앱이나 웹사이트를 정기적으로 사용하여 꾸준히 복습하세요.',
        '한자 퀴즈나 테스트를 통해 자신의 학습 상태를 점검하세요.',
        '한자 관련 책이나 만화, 영상 등 다양한 매체를 통해 흥미를 유지하세요.',
        '자주 헷갈리는 한자들을 따로 모아 비교하며 학습하세요.',
        '한자를 실생활에서 활용할 기회를 만들어보세요. 간판, 책, 신문 등에서 한자를 찾아보는 것도 좋은 방법입니다.'
      ];
      
      tips.forEach((tip, index) => {
        doc.text(`${index + 1}. ${tip}`);
        doc.moveDown(0.5);
      });
      
      // 헷갈리기 쉬운 한자 비교
      doc.moveDown();
      doc.font(boldFont).fontSize(16).text('헷갈리기 쉬운 한자 비교', { underline: true });
      doc.moveDown(0.5);
      
      const confusablePairs = [
        { pair: ['土', '士'], desc: '흙 토(土)와 선비 사(士)는 모양이 비슷하지만, 土는 아래가 평평하고 士는 아래가 짧은 획입니다.' },
        { pair: ['大', '太'], desc: '큰 대(大)와 클 태(太)는 모두 크다는 의미를 가지지만, 太는 가운데 획이 더 길게 뻗어있습니다.' },
        { pair: ['未', '末'], desc: '아닐 미(未)와 끝 말(末)은 모양이 매우 비슷하지만, 未는 가운데 획이 왼쪽으로, 末은 오른쪽으로 기울어져 있습니다.' },
        { pair: ['日', '目'], desc: '날 일(日)과 눈 목(目)은 모두 네모 형태이지만, 目은 가운데 획이 두 개로 나뉘어 있습니다.' }
      ];
      
      confusablePairs.forEach((item, index) => {
        doc.font('Helvetica-Bold').fontSize(18).text(`${item.pair[0]}  vs  ${item.pair[1]}`, { align: 'center' });
        doc.font(textFont).fontSize(12).text(item.desc);
        doc.moveDown();
      });
      
      // 푸터
      const footerY = doc.page.height - 50;
      const dateStr = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.font(textFont).fontSize(10).text(`생성일: ${dateStr}`, 50, footerY);
      doc.fontSize(10).text('한자로 학습 시스템 - www.hanjaro.com', { align: 'center' }, footerY);
      
      // PDF 생성 완료
      doc.end();
    });

    console.log('한자 복습 자료 PDF 생성 완료, 반환 중...');

    // PDF 파일 반환
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=hanja_learning_review.pdf',
      },
    });
  } catch (error) {
    console.error('복습 자료 PDF 생성 오류:', error);
    return NextResponse.json(
      { error: '한자 학습 복습 자료 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 