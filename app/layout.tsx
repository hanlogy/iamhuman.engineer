import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';

const robotoSans = Roboto({
  variable: '--font-sans',
  weight: ['100', '300', '400', '500', '600', '700'],
  display: 'swap',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-sans-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IAmHuman.Engineer',
  description:
    'A directory for human engineers. No feed, no hot takes. Just our real work: PRs, shipped products, packages, talks, and case studies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
