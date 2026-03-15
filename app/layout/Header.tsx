import { clsx } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { LogoSvg } from '@/components/svgs';
import { getUserFromCookie } from '@/server/userInCookie';
import { MemberNavBar } from './MemberNavBar';
import { PublicNavBar } from './PublicNavBar';

export async function Header() {
  let headerHeight = 'h-14 sm:h-18 md:h-22';
  const user = await getUserFromCookie();
  const isLoggedIn = !!user;

  let homeLink = '/';
  if (isLoggedIn) {
    headerHeight = 'h-14 sm:h-16';
    homeLink = `/${user.handle}`;
  }

  return (
    <>
      <header
        className={clsx('bg-background fixed top-0 right-0 left-0 z-50', {
          'border-border border-b md:border-0': isLoggedIn,
        })}
      >
        <div
          className={clsx(
            headerHeight,
            'flex items-center justify-between px-4 md:px-6',
            'mx-auto max-w-6xl'
          )}
        >
          <Link href={homeLink} className="flex items-center">
            <LogoSvg className="w-6 sm:w-7" />
            {!isLoggedIn && (
              <>
                <div className="ml-1 text-lg font-semibold sm:text-xl">
                  IAmHuman
                </div>
                <div className="mt-1 text-sm font-semibold">.Engineer</div>
              </>
            )}
          </Link>
          {isLoggedIn ? <MemberNavBar user={user} /> : <PublicNavBar />}
        </div>
      </header>
      <div className={headerHeight}></div>
    </>
  );
}
