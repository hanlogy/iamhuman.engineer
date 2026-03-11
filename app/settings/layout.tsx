import { clsx } from '@hanlogy/react-web-ui';
import { SideMenu } from './components/SideMenu';

export default function SettingsLayout({ children }: LayoutProps<'/settings'>) {
  return (
    <div className={clsx('px-4 sm:px-6', 'md:mx-auto md:max-w-5xl')}>
      <h2 className="py-4 text-lg font-medium">Settings</h2>
      <div className="md:flex">
        <SideMenu />
        <div className="md:flex-1">{children}</div>
      </div>
    </div>
  );
}
