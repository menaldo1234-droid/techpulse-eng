import Link from 'next/link';
import { t, locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/posts';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function StudyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'ko' ? 'ko' : 'en') as Locale;
  const labels = t[locale];
  const posts = getAllPosts(locale);

  return (
    <section className="max-w-5xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-black mb-3">{labels.studyLog}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-10">{labels.studyLogDesc}</p>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/study/${post.slug}`} className="group flex items-start gap-5 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/5 transition-all hover:-translate-y-0.5">
              <div className="flex-1">
                <h2 className="text-lg font-bold group-hover:text-[var(--accent)] transition-colors">{post.title}</h2>
                {post.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.description}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <time>{post.date}</time>
                  {post.series && <span className="text-[var(--accent)] font-medium">{post.series}</span>}
                  {post.youtube && <span className="text-red-500 font-medium">YouTube</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">{labels.comingSoon}</p>
      )}
    </section>
  );
}
