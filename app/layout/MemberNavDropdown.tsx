import { clsx, DropdownMenu } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { logout } from '@/actions/user/logout';
import { Avatar } from '@/components/Avatar';
import { LinkOrButton } from '@/components/LinkOrButton';
import { NavLogoutSvg, NavProfileSvg, NavSettingsSvg } from '@/components/svgs';
import type { UserSummary } from '@/definitions';

const menuItems = [
  {
    name: 'profile',
    label: 'Profile',
    href: '/',
    Icon: NavProfileSvg,
  },
  {
    name: 'settings',
    label: 'Settings',
    href: '/settings',
    Icon: NavSettingsSvg,
  },
  {
    name: 'logout',
    label: 'Logout',
    href: '',
    Icon: NavLogoutSvg,
  },
] as const;

export function MemberNavDropdown({ user: { handle } }: { user: UserSummary }) {
  return (
    <DropdownMenu
      className={clsx(
        'bg-surface border-border min-w-50 rounded-xl border py-2 shadow-lg shadow-gray-200'
      )}
      alignment="bottomRight"
      options={menuItems}
      keyBuilder={({ name }) => {
        return name;
      }}
      itemBuilder={({ item: { Icon, name, label, href }, close }) => {
        const isLogout = name === 'logout';
        const isProfile = name === 'profile';
        const isSettings = name === 'settings';
        const className = clsx(
          'hover:bg-surface-secondary text-foreground-secondary h-10 w-full cursor-pointer items-center px-4'
        );
        const content = (
          <>
            <Icon className="mr-2 w-6" />
            {label}
          </>
        );

        return (
          <>
            <LinkOrButton
              href={() => {
                if (isLogout) {
                  return;
                }
                if (isProfile) {
                  return `/${handle}`;
                }
                return href;
              }}
              onClick={async () => {
                if (isLogout) {
                  await logout();
                }
                close();
              }}
              className={clsx(className, {
                flex: !isSettings,
                'flex md:hidden': isSettings,
              })}
            >
              {content}
            </LinkOrButton>
            {isSettings && (
              <Link
                onClick={() => close()}
                href={`${href}/profile`}
                className={clsx(className, 'hidden md:flex')}
              >
                {content}
              </Link>
            )}
          </>
        );
      }}
      buttonBuilder={({ show }) => {
        return (
          <button onClick={show} className="block cursor-pointer">
            <Avatar className="h-8 w-8" />
          </button>
        );
      }}
    />
  );
}
