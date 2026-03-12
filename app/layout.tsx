import { clsx, DialogProvider } from '@hanlogy/react-web-ui';
import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import { HANDLE_KEY, USER_ID_KEY } from './definitions';
import './globals.css';
import { createCookieHelper } from './server/createCookieHelper';
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
  const { getCookie } = await createCookieHelper();
  const userId = getCookie(USER_ID_KEY);
  const handle = getCookie(HANDLE_KEY);
  const isLoggedIn = !!(userId && handle);
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
        <DialogProvider>
          <AppContextProvider host={host} userId={userId} handle={handle}>
            <Header isLoggedIn={isLoggedIn} />
            <main className="flex-1">{children}</main>
            <Footer />
          </AppContextProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
