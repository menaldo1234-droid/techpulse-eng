import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '0xHenry',
    template: '%s | 0xHenry',
  },
  description: 'Engineer Study — learning real tech from scratch.',
  metadataBase: new URL('https://0xhenry.dev'),
  openGraph: {
    title: '0xHenry',
    description: 'Engineer Study — learning real tech from scratch.',
    url: 'https://0xhenry.dev',
    siteName: '0xHenry',
    type: 'website',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: '0xHenry - Engineer Study',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '0xHenry',
    description: 'Engineer Study — learning real tech from scratch.',
    images: ['/og-default.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: '0xHenry RSS (EN)' },
        { url: '/ko/feed.xml', title: '0xHenry RSS (KO)' },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}</Script>
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
