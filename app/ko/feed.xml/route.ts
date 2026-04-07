import { getAllPosts } from '@/lib/posts';

const BASE_URL = 'https://0xhenry.dev';

export async function GET() {
  const posts = getAllPosts('ko');

  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/ko/study/${post.slug}</link>
      <description><![CDATA[${post.description ?? ''}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${BASE_URL}/ko/study/${post.slug}</guid>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>0xHenry - 엔지니어 스터디</title>
    <link>${BASE_URL}/ko</link>
    <description>모르는 거 직접 부딪혀보고 기록하는 공간. STM32, RTOS, PCB, 임베디드 — 삽질 과정 전부 공개.</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/ko/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
