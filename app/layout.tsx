
import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'L Vision — Curated Luxury & Lifestyle',
    template: '%s · L Vision',
  },
  description:
    'L Vision by Inoshkins — одежда, украшения, цветы и кофе. Откройте коллекции и найдите свой стиль.',
  applicationName: 'L Vision',
  keywords: [
    'L Vision',
    'fashion',
    'luxury clothing',
    'одежда',
    'украшения',
    'LV Flowers',
    'Marry Me',
  ],
  openGraph: {
    title: 'L Vision — Curated Luxury & Lifestyle',
    description:
      'Одежда, украшения, цветы и кофе в эстетике L Vision.',
    siteName: 'L Vision',
    type: 'website',
    locale: 'ru_RU',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090909' },
    { media: '(prefers-color-scheme: light)', color: '#f8f6f0' },
  ],
};

const themeScript = `
  try {
    var theme = localStorage.getItem('lv-theme');
    document.documentElement.dataset.theme =
      theme === 'light' ? 'light' : 'dark';
  } catch (error) {
    document.documentElement.dataset.theme = 'dark';
  }
`;

const fonts =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Unbounded:wght@500;600;700&display=swap';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fonts} />

        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
