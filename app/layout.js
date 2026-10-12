import { Cormorant_Garamond, Noto_Serif } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--f-display' });
const body = Noto_Serif({ subsets: ['latin'], weight: ['400', '600'], variable: '--f-body' });

export const metadata = {
  metadataBase: new URL('https://YOUR-SITE.vercel.app'),
  title: 'Abdullah & Nada - Wedding Invitation',
  description: 'You are invited to our wedding. 15 October 2026.',
  openGraph: {
    title: 'Abdullah & Nada - Wedding Invitation',
    description: 'You are invited to our wedding. 15 October 2026.',
    url: '/',
    siteName: 'Abdullah & Nada',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Abdullah & Nada - Wedding Invitation' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#2a0a0e' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}