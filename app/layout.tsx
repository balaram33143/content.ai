import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ContentForge AI — Multi-Platform Content Generator',
  description:
    'Transform any YouTube video into polished LinkedIn posts, X threads, Facebook updates, blog articles, AI images, and shareable Google Docs — powered by an automated n8n workflow.',
  keywords: [
    'content generation',
    'YouTube to blog',
    'AI content',
    'n8n workflow',
    'multi-platform content',
    'social media automation',
  ],
  authors: [{ name: 'ContentForge AI' }],
  openGraph: {
    title: 'ContentForge AI — Multi-Platform Content Generator',
    description:
      'Transform any YouTube video into polished multi-platform content powered by an automated n8n workflow.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentForge AI',
    description: 'Transform any YouTube video into polished multi-platform content.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
