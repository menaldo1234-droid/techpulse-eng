import Nav from '@/components/Nav';
import type { Locale } from '@/lib/i18n';
import { locales } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'ko' ? 'ko' : 'en') as Locale;

  return (
    <>
      <Nav lang={locale} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500">
        <div className="max-w-5xl mx-auto px-5">
          &copy; {new Date().getFullYear()} TechBlips. Built by Henry.
        </div>
      </footer>
    </>
  );
}
