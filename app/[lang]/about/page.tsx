import { t, locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'ko' ? 'ko' : 'en') as Locale;
  const labels = t[locale];

  return (
    <section className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-black mb-6">{labels.aboutTitle}</h1>

      <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>{labels.aboutP1}</p>
        <p>{labels.aboutP2}</p>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-3">{labels.aboutWhat}</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{labels.aboutWhatDesc}</p>

      <h2 className="text-2xl font-bold mt-12 mb-3">{labels.aboutWhy}</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{labels.aboutWhyDesc}</p>
    </section>
  );
}
