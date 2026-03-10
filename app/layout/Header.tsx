import { clsx } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { LogoSvg } from '@/components/svgs';
import { HANDLE_KEY } from '@/definitions';
import { createCookieManager } from '@/server/createCookieManager';
import { MemberNavBar } from './MemberNavBar';
import { PublicNavBar } from './PublicNavBar';

export async function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const headerHeight = 'h-14 sm:h-18 md:h-22';

  let handle: string | undefined;
  if (isLoggedIn) {
    const cookie = await createCookieManager();
    handle = cookie.getCookie(HANDLE_KEY);
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
          <Link href={`/${handle ?? ''}`} className="flex items-center">
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
          {isLoggedIn && handle ? (
            <MemberNavBar handle={handle} />
          ) : (
            <PublicNavBar />
          )}
        </div>
      </header>
      <div className={headerHeight}></div>
    </>
  );
}
