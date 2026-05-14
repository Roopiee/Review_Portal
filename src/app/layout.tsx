import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  title: 'Pulse — Your Quarterly Review',
  description: 'A short, immersive four-step employee feedback experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={interTight.variable}>
      <body data-theme="light">{children}</body>
    </html>
  );
}
