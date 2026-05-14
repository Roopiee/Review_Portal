import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  title: 'Net Connect Global - Employee Feedback Portal',
  description: 'A short, immersive four-step employee feedback experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={interTight.variable}>
      <body data-theme="dark">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
