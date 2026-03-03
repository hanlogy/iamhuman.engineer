import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { clsx, IconButton } from '@hanlogy/react-web-ui';
import { GitHubIcon, MenuIcon } from './components/icons';
import Link from 'next/link';

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
  const headerHeight = 'h-14 md:h-18';

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
        <div className={headerHeight}></div>
        <header
          className={clsx(
            headerHeight,
            'fixed top-0 right-0 left-0 z-50',
            'flex items-center justify-between px-4 md:px-6',
            'bg-background'
          )}
        >
          <div className="flex items-baseline">
            <div className="text-lg font-semibold">IAmHuman</div>
            <div className="text-sm font-semibold">.Engineer</div>
          </div>
          <nav className="hidden sm:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link href="/coming-soon">Engineers</Link>
              </li>
              <li>
                <Link href="/coming-soon">Teams</Link>
              </li>
              <li>
                <Link href="/coming-soon">About</Link>
              </li>
              <li>
                <Link
                  href="/coming-soon"
                  className="bg-accent text-on-accent flex-center h-10 min-w-30 rounded-full font-semibold"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
          <IconButton className="sm:hidden">
            <MenuIcon />
          </IconButton>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="px-4 py-4 text-center">
          <div className="text-foreground-secondary text-sm font-semibold italic">
            A companion to GitHub, LinkedIn, your personal site and more. Not a
            replacement
          </div>
          <div className="text-foreground-muted flex-center mt-4 flex-col text-center text-sm">
            © 2026 IAmHuman.Engineer
            <a
              className="mt-2"
              href="https://github.com/hanlogy/iamhuman.engineer"
              target="_blank"
            >
              <GitHubIcon className="w-6" />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
