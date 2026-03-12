import { clsx } from '@hanlogy/react-web-ui';
import { redirect } from 'next/navigation';
import { createSessionManager } from '@/server/auth';
import { Breadcrumb } from './components/Breadcrumb';
import { SideMenu } from './components/SideMenu';

export default async function SettingsLayout({
  children,
}: LayoutProps<'/settings'>) {
  const { hasSession } = await createSessionManager();

  if (!hasSession()) {
    redirect('/login');
  }

  return (
    <div className={clsx('px-4 sm:px-6', 'md:mx-auto md:max-w-5xl')}>
      <h2 className="py-4">
        <Breadcrumb />
      </h2>
      <div className="md:flex">
        <SideMenu />
        <div className="md:flex-1">{children}</div>
      </div>
    </div>
  );
}
