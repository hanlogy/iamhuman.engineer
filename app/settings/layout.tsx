import { clsx, DialogProvider } from '@hanlogy/react-web-ui';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { HANDLE_KEY, USER_ID_KEY } from '@/definitions';
import { createCookieHelper } from '@/server/createCookieHelper';
import { Breadcrumb } from './components/Breadcrumb';
import { SideMenu } from './components/SideMenu';
import { SettingsContextProvider } from './state/provider';

export default async function SettingsLayout({
  children,
}: LayoutProps<'/settings'>) {
  const { getCookie } = await createCookieHelper();
  const header = await headers();

  const userId = getCookie(USER_ID_KEY);
  const handle = getCookie(HANDLE_KEY);

  if (!userId || !handle) {
    redirect('/login');
  }

  return (
    <DialogProvider>
      <SettingsContextProvider
        host={header.get('x-forwarded-host') ?? header.get('host') ?? ''}
        userId={userId}
        handle={handle}
      >
        <div className={clsx('px-4 sm:px-6', 'md:mx-auto md:max-w-5xl')}>
          <h2 className="py-4">
            <Breadcrumb />
          </h2>
          <div className="md:flex">
            <SideMenu />
            <div className="md:flex-1">{children}</div>
          </div>
        </div>
      </SettingsContextProvider>
    </DialogProvider>
  );
}
