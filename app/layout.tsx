import { clsx } from '@hanlogy/react-web-ui';
import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import './globals.css';
import { createSessionManager } from './server/auth';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hasSession } = await createSessionManager();
  const isLoggedIn = hasSession();

  return (
    <html lang="en">
      <body
        className={clsx(
          robotoSans.variable,
          robotoMono.variable,
          'font-sans antialiased',
          'flex min-h-dvh flex-col'
        )}
      >
        <Header isLoggedIn={isLoggedIn} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
