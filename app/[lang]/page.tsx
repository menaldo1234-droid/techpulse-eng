import Link from 'next/link';
import { t, locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/posts';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'ko' ? 'ko' : 'en') as Locale;
  const labels = t[locale];
  const posts = getAllPosts(locale);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-blue-500/5 to-amber-500/5" />
        <div className="relative max-w-5xl mx-auto px-5 py-24 md:py-32">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6 whitespace-pre-line">
            {labels.heroTitle.split('\n')[0]}<br />
            <span className="text-[var(--accent)]">{labels.heroTitle.split('\n')[1]}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mb-8 leading-relaxed">
            {labels.heroDesc}
          </p>
          <div className="flex gap-3">
            <Link href={`/${locale}/study`} className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/20">
              {labels.startLearning}
            </Link>
            <Link href={`/${locale}/about`} className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-semibold rounded-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all hover:-translate-y-0.5">
              {labels.about}
            </Link>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-bold mb-8">{labels.latest}</h2>
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${locale}/study/${post.slug}`} className="group block p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[var(--accent)] hover:shadow-xl hover:shadow-[var(--accent)]/5 transition-all hover:-translate-y-1">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
                {post.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{post.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <time>{post.date}</time>
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded font-medium">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-lg">{labels.comingSoon}</p>
        )}
      </section>
    </>
  );
}
