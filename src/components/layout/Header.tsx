import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary dark:text-primary-light text-2xl font-bold">한자로</span>
            <span className="text-gray-600 dark:text-gray-300">(韓字路)</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/learn" className="nav-link">
              학습하기
            </Link>
            <Link href="/practice" className="nav-link">
              연습하기
            </Link>
            <Link href="/challenge" className="nav-link">
              챌린지
            </Link>
            <Link href="/dictionary" className="nav-link">
              한자사전
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Auth Button */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={session.user?.image || '/images/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden sm:inline text-sm font-medium">{session.user?.name}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-10">
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      내 프로필
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      설정
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => signIn()} className="btn-primary">
                로그인
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/learn" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              학습하기
            </Link>
            <Link href="/practice" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              연습하기
            </Link>
            <Link href="/challenge" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              챌린지
            </Link>
            <Link href="/dictionary" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              한자사전
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 