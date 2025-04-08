'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 주요 링크 반복 렌더링 최적화
const NavLink = memo(({ item, isActive }: { item: { name: string; href: string }; isActive: boolean }) => (
  <div className="relative group px-1">
    <Link
      href={item.href}
      className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
    >
      {item.name}
      {!isActive && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      )}
    </Link>
  </div>
));

NavLink.displayName = 'NavLink';

// 모바일 링크 최적화
const MobileNavLink = memo(({ item, isActive, onClick }: { 
  item: { name: string; href: string }; 
  isActive: boolean;
  onClick?: () => void;
}) => (
  <div>
    <Link
      href={item.href}
      onClick={onClick}
      className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : 'mobile-nav-link-inactive'}`}
    >
      {item.name}
    </Link>
  </div>
));

MobileNavLink.displayName = 'MobileNavLink';

export default function Navigation() {
  const pathname = usePathname() || '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // 메뉴 토글 로직 최적화
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  // 모바일 메뉴 닫기
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // 메뉴 항목 메모이제이션
  const navItems = useMemo(() => [
    { name: '홈', href: '/' },
    { name: '한자 학습', href: '/learn' },
    { name: '한자 퀴즈', href: '/quiz' },
    { name: '한자 원리', href: '/pages/hanja-principles' },
    { name: '대시보드', href: '/dashboard' },
  ], []);

  return (
    <>
      {/* 네비게이션 바 높이만큼 빈 공간 확보 */}
      <div className="h-16"></div>
      
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-md shadow-lg' 
          : ''
      }`}>
        {/* 그라데이션 배경 추가 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                한자로
              </Link>
            </div>
            
            {/* 데스크톱 메뉴 */}
            <nav className="hidden md:flex md:items-center md:space-x-2">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </nav>
            
            {/* 로그인 버튼 (데스크톱) */}
            <div className="hidden md:flex">
              <Link href="/api/auth/signin">
                <button className="ml-4 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                  로그인
                </button>
              </Link>
            </div>
            
            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">메뉴 열기</span>
                <div className="relative w-6 h-5">
                  <span className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
                  <span className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out top-2 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="relative md:hidden bg-white dark:bg-gray-900 shadow-xl rounded-b-xl overflow-hidden">
            <div className="px-2 pt-4 pb-5 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <MobileNavLink 
                  key={item.href} 
                  item={item} 
                  isActive={pathname === item.href} 
                  onClick={closeMobileMenu}
                />
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <Link href="/api/auth/signin" onClick={closeMobileMenu}>
                <button className="w-full px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  로그인
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
} 