import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">한자로(韓字路)</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              한자 학습의 새로운 길, 한자로와 함께 즐겁고 효과적인 한자 학습을 경험하세요.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">학습</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  기초 한자
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  한자 퀴즈
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  한자 태그
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">도구</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  학습 대시보드
                </Link>
              </li>
              <li>
                <Link href="/level-test" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  레벨 테스트
                </Link>
              </li>
              <li>
                <Link href="/pdf-practice" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  PDF 연습자료
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">정보</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/hanja-principles" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  한자 원리
                </Link>
              </li>
              <li>
                <Link href="/hanja-levels/structure" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  한자 체계
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} 한자로(韓字路). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 