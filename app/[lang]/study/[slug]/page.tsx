import { getAllSlugs, getPost } from '@/lib/posts';
import { locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import Link from 'next/link';

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const slug of getAllSlugs(lang)) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export default async function StudyPost({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = (lang === 'ko' ? 'ko' : 'en') as Locale;
  const post = await getPost(locale, slug);

  if (!post) {
    return (
      <section className="max-w-3xl mx-auto px-5 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link href={`/${locale}/study`} className="text-[var(--accent)] hover:underline">
          Back to Study
        </Link>
      </section>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <Link href={`/${locale}/study`} className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors mb-6 inline-block">
        &larr; {locale === 'ko' ? '스터디 목록' : 'Back to Study'}
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{post.title}</h1>
        {post.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{post.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <time>{post.date}</time>
          <span>by Henry</span>
          {post.series && <span className="text-[var(--accent)] font-medium">{post.series}</span>}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium">{tag}</span>
            ))}
          </div>
        )}
      </header>

      {post.youtube && (
        <div className="aspect-video mb-10 rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${post.youtube}`}
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
