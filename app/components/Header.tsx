import { clsx } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { NavBar } from './NavBar';

export function Header() {
  const headerHeight = 'h-14 sm:h-18 md:h-22';

  return (
    <>
      <header className="bg-background fixed top-0 right-0 left-0 z-50">
        <div
          className={clsx(
            headerHeight,
            'flex items-center justify-between px-4 md:px-6',
            'mx-auto max-w-6xl'
          )}
        >
          <Link href="/" className="flex items-baseline">
            <div className="text-lg font-semibold sm:text-xl">IAmHuman</div>
            <div className="text-sm font-semibold">.Engineer</div>
          </Link>
          <NavBar />
        </div>
      </header>
      <div className={headerHeight}></div>
    </>
  );
}
