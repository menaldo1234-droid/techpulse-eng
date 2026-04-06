'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export default function Nav({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const labels = t[lang];
  const otherLang = lang === 'en' ? 'ko' : 'en';
  const otherLabel = lang === 'en' ? 'KO' : 'EN';
  const otherPath = lang === 'en'
    ? `/ko${pathname}`
    : pathname.replace(/^\/ko/, '') || '/en';

  const [dark, setDark] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="text-xl font-extrabold tracking-tight hover:text-[var(--accent)] transition-colors">
          TechBlips
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href={`/${lang}`} className="hover:text-[var(--accent)] transition-colors">{labels.home}</Link>
            <Link href={`/${lang}/study`} className="hover:text-[var(--accent)] transition-colors">{labels.study}</Link>
            <Link href={`/${lang}/about`} className="hover:text-[var(--accent)] transition-colors">{labels.about}</Link>
          </div>
          <Link href={otherPath} className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
            {otherLabel}
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
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
    </nav>
  );
}
