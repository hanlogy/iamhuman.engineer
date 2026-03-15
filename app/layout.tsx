import { clsx, DialogProvider } from '@hanlogy/react-web-ui';
import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import './globals.css';
import { getUserFromCookie } from './server/userInCookie';
import { AppContextProvider } from './state/provider';

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
  const header = await headers();
  const user = await getUserFromCookie();

  const host = header.get('x-forwarded-host') ?? header.get('host') ?? '';

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
        <AppContextProvider host={host} user={user}>
          <DialogProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </DialogProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
