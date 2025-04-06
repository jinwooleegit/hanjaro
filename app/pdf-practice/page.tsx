'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface HanjaStrokeData {
  character: string;
  meaning: string;
  pronunciation: string;
  strokeCount: number;
  strokes: string[][];
}

const PdfPractice = () => {
  const searchParams = useSearchParams();
  const level = searchParams?.get('level') || null;
  const character = searchParams?.get('character') || null;

  const [hanjaList, setHanjaList] = useState<string[]>([]);
  const [strokeData, setStrokeData] = useState<{ [key: string]: HanjaStrokeData }>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 학습 레벨에 해당하는 한자 목록 가져오기
  useEffect(() => {
    const fetchHanjaList = async () => {
      try {
        setLoading(true);
        let targetHanja: string[] = [];

        if (character) {
          // 단일 한자만 가져오는 경우
          targetHanja = [character];
        } else if (level) {
          // 레벨에 해당하는 한자 목록 가져오기
          const response = await fetch(`/api/hanja?level=${level}&limit=100`);
          const data = await response.json();
          
          if (data.success && data.hanjas) {
            targetHanja = data.hanjas.map((hanja: any) => hanja.character);
          } else {
            throw new Error('한자 목록을 가져오는데 실패했습니다.');
          }
        } else {
          // 레벨이나 한자가 지정되지 않은 경우, 빈 배열 설정
          setErrorMsg('학습한 한자만 PDF 다운로드가 가능합니다. 한자 학습 페이지에서 한자를 학습한 후 이용해주세요.');
          setLoading(false);
          return;
        }

        setHanjaList(targetHanja);

        // 각 한자에 대한 획 정보 가져오기
        const strokeDataPromises = targetHanja.map(async (char) => {
          try {
            const response = await fetch(`/api/hanja/strokes?character=${char}`);
            const data = await response.json();
            
            if (data.success) {
              return { char, data: data.data };
            }
            return null;
          } catch (error) {
            console.error(`${char} 획 정보 가져오기 오류:`, error);
            return null;
          }
        });

        const results = await Promise.all(strokeDataPromises);
        const strokeDataMap: { [key: string]: HanjaStrokeData } = {};
        
        results.forEach((result) => {
          if (result && result.data) {
            strokeDataMap[result.char] = result.data;
          }
        });

        setStrokeData(strokeDataMap);
        setLoading(false);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        setErrorMsg('한자 데이터를 불러오는데 문제가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchHanjaList();
  }, [level, character]);

  // PDF 생성 및 다운로드
  const generatePDF = () => {
    // PDF 생성 기본 설정
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // A4 크기: 210mm x 297mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // 한자당 페이지 수
    const pagesPerHanja = 2;  // 한 한자당 2페이지 사용 (연습 페이지 + 반복 페이지)
    
    // 저작권 정보와 워터마크 추가 함수
    const addCopyright = () => {
      // 저작권 표시 (테이블로 추가하여 한글 표시 지원)
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      
      // AutoTable을 사용하여 저작권 정보 추가
      (doc as any).autoTable({
        body: [['© 2025 한자로. 모든 권리 보유. 저작권/기타 문의는 milgae@naver.com']],
        startY: pageHeight - 10,
        styles: {
          halign: 'center',
          fontSize: 8,
          textColor: [100, 100, 100],
          lineWidth: 0
        },
        theme: 'plain'
      });
      
      // 페이지 번호
      const pageNum = doc.getNumberOfPages();
      doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
      
      // 워터마크 (옅은 배경 로고) - 이미지화하여 처리
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(60);
      
      // 워터마크 텍스트를 AutoTable로 추가
      (doc as any).autoTable({
        body: [['한자로']],
        startY: pageHeight / 2 - 20,
        styles: {
          halign: 'center',
          fontSize: 60,
          textColor: [230, 230, 230],
          lineWidth: 0,
        },
        theme: 'plain',
        tableWidth: pageWidth - 40,
        margin: { left: 20 }
      });
      
      // 텍스트 색상 원래대로
      doc.setTextColor(0, 0, 0);
    };

    hanjaList.forEach((char, charIndex) => {
      // 각 한자당 첫 페이지 - 기본 연습 페이지
      if (charIndex > 0) {
        doc.addPage();
      }
      
      const data = strokeData[char];
      
      if (!data) {
        // 데이터가 없는 경우 메시지 표시 (테이블 사용)
        (doc as any).autoTable({
          body: [[`한자 ${char} 데이터를 찾을 수 없습니다.`]],
          startY: margin + 10,
          styles: {
            fontSize: 16,
            lineWidth: 0
          },
          theme: 'plain'
        });
        addCopyright();
        return;
      }

      // 페이지 제목 (테이블로 추가)
      (doc as any).autoTable({
        body: [['한자 필기 연습']],
        startY: margin,
        styles: {
          fontSize: 20,
          halign: 'center',
          lineWidth: 0
        },
        theme: 'plain',
        tableWidth: pageWidth - 40,
        margin: { left: 20 }
      });
      
      // 한자 정보 헤더
      let currentY = margin + 20;
      
      // 한자 문자 표시
      doc.setFontSize(24);
      doc.text(`${char}`, margin, currentY + 10);
      
      // 한자 정보 (테이블로 추가)
      (doc as any).autoTable({
        body: [
          [`뜻: ${data.meaning || '정보 없음'}`, `획수: ${data.strokeCount || '정보 없음'}`],
          [`음: ${data.pronunciation || '정보 없음'}`, '']
        ],
        startY: currentY,
        styles: {
          fontSize: 12,
          lineWidth: 0
        },
        theme: 'plain',
        tableWidth: contentWidth - 30,
        margin: { left: margin + 25 }
      });

      currentY += 40;

      // 획순 연습 가이드 (첫 페이지)
      (doc as any).autoTable({
        body: [['아래 상자에 순서대로 각 획을 연습하세요.']],
        startY: currentY,
        styles: {
          fontSize: 10,
          lineWidth: 0
        },
        theme: 'plain'
      });
      
      currentY += 15;

      // 각 획별 연습 칸
      const boxSize = 40; // 연습 칸 크기 증가 (mm)
      const rows = 3; // 3행
      const cols = 3; // 3열
      const totalBoxes = rows * cols;
      const strokeCount = data.strokeCount || 1;
      
      // 행과 열 배치로 그리드 생성
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const boxIndex = i * cols + j;
          
          if (boxIndex >= strokeCount) continue;
          
          const x = margin + j * (boxSize + 10); // 10mm 간격
          const y = currentY + i * (boxSize + 10);
          
          // 박스 그리기 (두꺼운 선으로)
          doc.setDrawColor(0);
          doc.setLineWidth(0.7);
          doc.rect(x, y, boxSize, boxSize);
          
          // 획수 표시 (테이블로 추가)
          (doc as any).autoTable({
            body: [[`${boxIndex + 1}획`]],
            startY: y + 2,
            styles: {
              fontSize: 8,
              lineWidth: 0
            },
            theme: 'plain',
            tableWidth: 20,
            margin: { left: x + 2 }
          });
          
          // 가이드 선 (십자선) 그리기
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.3);
          // 가로선
          doc.line(x, y + boxSize/2, x + boxSize, y + boxSize/2);
          // 세로선
          doc.line(x + boxSize/2, y, x + boxSize/2, y + boxSize);
          
          // 대각선 (가이드라인 추가)
          doc.line(x, y, x + boxSize, y + boxSize);
          doc.line(x + boxSize, y, x, y + boxSize);
        }
      }

      // 완성된 한자 연습 칸
      currentY += (rows * (boxSize + 10)) + 5;
      
      // 페이지가 가득 차면 다음 페이지로
      if (currentY + boxSize * 2 > pageHeight - margin - 20) {
        doc.addPage();
        currentY = margin + 10;
        
        // 제목 추가 (테이블로)
        (doc as any).autoTable({
          body: [[`한자 완성 연습: ${char}`]],
          startY: currentY,
          styles: {
            fontSize: 20,
            halign: 'center',
            lineWidth: 0
          },
          theme: 'plain',
          tableWidth: pageWidth - 40,
          margin: { left: 20 }
        });
        
        currentY += 15;
      }

      // 완성 한자 박스 (더 큰 사이즈)
      const completeBoxSize = boxSize * 1.5;
      
      // 완성 연습 제목 (테이블로 추가)
      (doc as any).autoTable({
        body: [['한자 완성 연습']],
        startY: currentY,
        styles: {
          fontSize: 12,
          lineWidth: 0
        },
        theme: 'plain'
      });
      
      currentY += 15;
      
      // 완성 한자 연습 칸 (2열 배치)
      const completeBoxesPerRow = 2;
      for (let i = 0; i < 4; i++) { // 2행 2열 = 4개 박스
        const row = Math.floor(i / completeBoxesPerRow);
        const col = i % completeBoxesPerRow;
        
        const x = margin + col * (completeBoxSize + 15); // 15mm 간격
        const y = currentY + row * (completeBoxSize + 15);
        
        // 박스 그리기 (두꺼운 선으로)
        doc.setDrawColor(0);
        doc.setLineWidth(0.7);
        doc.rect(x, y, completeBoxSize, completeBoxSize);
        
        // 가이드 선 (십자선) 그리기
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        // 가로선
        doc.line(x, y + completeBoxSize/2, x + completeBoxSize, y + completeBoxSize/2);
        // 세로선
        doc.line(x + completeBoxSize/2, y, x + completeBoxSize/2, y + completeBoxSize);
        // 대각선 (가이드라인 추가)
        doc.line(x, y, x + completeBoxSize, y + completeBoxSize);
        doc.line(x + completeBoxSize, y, x, y + completeBoxSize);
      }

      // 저작권 정보 추가
      addCopyright();

      // 반복 연습 페이지 (두 번째 페이지)
      doc.addPage();
      
      // 페이지 제목 (테이블로 추가)
      (doc as any).autoTable({
        body: [[`한자 '${char}' 반복 연습`]],
        startY: margin,
        styles: {
          fontSize: 20,
          halign: 'center',
          lineWidth: 0
        },
        theme: 'plain',
        tableWidth: pageWidth - 40,
        margin: { left: 20 }
      });
      
      // 한자 정보 헤더 (간단하게) - 테이블로 추가
      currentY = margin + 15;
      (doc as any).autoTable({
        body: [[`한자: ${char} | 뜻: ${data.meaning || '정보 없음'} | 음: ${data.pronunciation || '정보 없음'}`]],
        startY: currentY,
        styles: {
          fontSize: 14,
          halign: 'center',
          lineWidth: 0
        },
        theme: 'plain',
        tableWidth: pageWidth - 40,
        margin: { left: 20 }
      });
      
      currentY += 15;
      
      // A4 용지에 맞는 그리드 생성
      const gridRows = 8;
      const gridCols = 6;
      const cellSize = 25; // 셀 크기 증가 (mm)
      const cellSpacing = 2; // 간격 증가
      
      const gridWidth = (cellSize * gridCols) + (cellSpacing * (gridCols - 1));
      const gridHeight = (cellSize * gridRows) + (cellSpacing * (gridRows - 1));
      
      // 그리드를 페이지 중앙에 배치
      const gridStartX = (pageWidth - gridWidth) / 2;
      let gridStartY = currentY;
      
      // 그리드 그리기
      for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
          const x = gridStartX + j * (cellSize + cellSpacing);
          const y = gridStartY + i * (cellSize + cellSpacing);
          
          // 셀 그리기 (두꺼운 선으로)
          doc.setDrawColor(0);
          doc.setLineWidth(0.7);
          doc.rect(x, y, cellSize, cellSize);
          
          // 십자선 그리기 (가이드)
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.2);
          doc.line(x, y + cellSize/2, x + cellSize, y + cellSize/2); // 가로선
          doc.line(x + cellSize/2, y, x + cellSize/2, y + cellSize); // 세로선
          
          // 대각선 (가이드라인 추가)
          doc.line(x, y, x + cellSize, y + cellSize);
          doc.line(x + cellSize, y, x, y + cellSize);
        }
      }
      
      // 저작권 정보 추가
      addCopyright();
    });

    // PDF 다운로드
    const filename = character 
      ? `한자_${character}_연습.pdf` 
      : level 
        ? `한자_${level}_연습.pdf` 
        : '한자_연습.pdf';
    
    doc.save(filename);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">한자 필기 연습 자료</h1>
      
      {loading ? (
        <div className="text-center my-10">
          <p>한자 데이터를 불러오는 중입니다...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
          <p>{errorMsg}</p>
          <p className="mt-3">
            <Link href="/learn" className="text-blue-600 hover:underline">한자 학습 페이지로 이동하기</Link>
          </p>
          </div>
      ) : (
        <>
          {hanjaList.length > 0 ? (
            <div className="mb-6">
              <p className="mb-3">선택한 {hanjaList.length}개의 한자에 대한 필기 연습 자료를 생성합니다:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {hanjaList.map((char) => (
                  <span key={char} className="text-2xl border border-gray-300 rounded px-3 py-1">
                    {char}
                  </span>
                ))}
                  </div>
                  <button 
                onClick={generatePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none"
                >
                  PDF 다운로드
                </button>
              </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded my-6">
              <p>학습한 한자만 PDF 다운로드가 가능합니다. 먼저 한자 학습 페이지에서 한자를 학습한 후, 해당 한자의 연습 자료를 다운로드할 수 있습니다.</p>
              <p className="mt-2">현재 선택된 한자가 없거나, URL에 한자 또는 레벨 정보가 포함되지 않았습니다.</p>
              <p className="mt-3">
                <Link href="/learn" className="text-blue-600 hover:underline">한자 학습 페이지로 이동하기</Link>
              </p>
                </div>
              )}
              
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">한자 필기 연습 안내</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>한자 학습 시 직접 손으로 필기하면서 연습하는 것이 가장 효과적입니다.</li>
              <li>PDF 문서에는 각 한자의 필기 연습을 위한 가이드라인이 포함되어 있습니다.</li>
              <li>각 한자마다 <strong>2장의 연습 페이지</strong>가 제공됩니다.</li>
              <li>첫 번째 페이지는 <strong>획순 연습</strong>을 위한 페이지로, 각 획을 순서대로 연습할 수 있습니다.</li>
              <li>두 번째 페이지는 <strong>반복 연습</strong>을 위한 페이지로, 한자를 반복해서 써볼 수 있습니다.</li>
              <li>일일 학습 후 PDF를 다운로드하여 필기 연습에 활용하세요.</li>
            </ul>
              </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">PDF 출력 시 주의사항</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>인쇄 시 <strong>"실제 크기"</strong> 또는 <strong>"100% 배율"</strong>로 설정하여 인쇄하세요.</li>
              <li>프린터 설정에서 <strong>"배경 그래픽 인쇄"</strong> 옵션을 활성화하면 가이드라인이 더 선명하게 인쇄됩니다.</li>
              <li>양면 인쇄보다는 <strong>단면 인쇄</strong>를 권장합니다.</li>
              <li>문서 여백 없이 인쇄하면 더 많은 공간에 연습할 수 있습니다.</li>
            </ul>
            </div>
            
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2025 한자로. 모든 권리 보유. 저작권/기타 문의는 <a href="mailto:milgae@naver.com" className="text-blue-500 hover:underline">milgae@naver.com</a>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfPractice; 