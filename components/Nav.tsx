'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import SearchModal from './SearchModal';

export default function Nav({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const labels = t[lang];
  const otherLang = lang === 'en' ? 'ko' : 'en';
  const otherLabel = lang === 'en' ? 'KO' : 'EN';
  const otherPath = lang === 'en'
    ? pathname.replace(/^\/en/, '/ko')
    : pathname.replace(/^\/ko/, '/en');

  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <>
      <nav className="sticky top-0 z-50 nav-glass">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="hover:opacity-80 transition-opacity">
            <img src="/logo-terminal.svg" alt="0xHenry" className="h-8" />
          </Link>
          <div className="flex items-center gap-6">
            {/* Nav links (desktop) */}
            <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Link href={`/${lang}`} className="hover:text-[var(--accent)] transition-colors">{labels.home}</Link>
              <Link href={`/${lang}/study`} className="hover:text-[var(--accent)] transition-colors">{labels.study}</Link>
              <Link href={`/${lang}/about`} className="hover:text-[var(--accent)] transition-colors">{labels.about}</Link>
            </div>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <kbd className="hidden sm:inline-flex text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '\u2318K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Language toggle (desktop) */}
            <Link href={otherPath} className="hidden sm:inline-flex text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
              {otherLabel}
            </Link>

            {/* Theme toggle (desktop) */}
            <button onClick={toggleTheme} className="hidden sm:inline-flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>

            {/* Auth: Sign In / User avatar */}
            {session?.user ? (
              <Link
                href={`/${lang}/dashboard`}
                className="shrink-0"
                aria-label="Dashboard"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-[var(--accent)] transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] transition-colors"
              >
                {lang === 'ko' ? '로그인' : 'Sign In'}
              </Link>
            )}

            {/* Hamburger button (mobile only) */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          ref={mobileMenuRef}
          className="sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
          style={{
            maxHeight: mobileMenuOpen ? '300px' : '0px',
            opacity: mobileMenuOpen ? 1 : 0,
          }}
        >
          <div className="px-5 pb-4 pt-1 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-800">
            <Link
              href={`/${lang}`}
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] transition-colors py-1"
            >
              {labels.home}
            </Link>
            <Link
              href={`/${lang}/study`}
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] transition-colors py-1"
            >
              {labels.study}
            </Link>
            <Link
              href={`/${lang}/about`}
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] transition-colors py-1"
            >
              {labels.about}
            </Link>
            <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href={otherPath}
                onClick={closeMobileMenu}
                className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
              >
                {otherLabel}
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {dark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal lang={lang} isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}
