'use client';

import { Fragment } from 'react/jsx-runtime';
import { clsx, DropdownMenu } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { logout } from '@/actions/user/logout';
import {
  EngineersSvg,
  NavLogoutSvg,
  NavProfileSvg,
  NavSettingsSvg,
  TeamsSvg,
} from '@/components/svgs';

const linkItems = [
  {
    name: 'engineers',
    label: 'Engineers',
    href: '/coming-soon',
    Icon: EngineersSvg,
  },
  {
    name: 'teams',
    label: 'Teams',
    href: '/coming-soon',
    Icon: TeamsSvg,
  },
];

const dropdownMenuItems = [
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

export function MemberNavBar({ handle }: { handle: string }) {
  return (
    <div className="flex items-center space-x-4 sm:space-x-8">
      {linkItems.map(({ name, label, href, Icon }) => {
        return (
          <Link
            key={name}
            href={href}
            className="text-foreground-secondary flex flex-row items-center"
          >
            <Icon className="mr-2 h-7 w-7 sm:h-8 sm:w-8" />
            <div className="text-sm font-medium sm:text-base sm:font-normal">
              {label}
            </div>
          </Link>
        );
      })}
      <DropdownMenu
        className={clsx(
          'bg-surface border-border min-w-50 rounded-xl border py-2 shadow-lg shadow-gray-200'
        )}
        alignment="bottomRight"
        options={dropdownMenuItems}
        keyBuilder={({ name }) => {
          return name;
        }}
        itemBuilder={({ item: { Icon, name, label, href }, close }) => {
          const isLogout = name === 'logout';
          const className =
            'h-10 px-4 flex items-center cursor-pointer hover:bg-surface-secondary w-full text-foreground-secondary';
          const icon = <Icon className="mr-2 w-6" />;

          return (
            <Fragment key={name}>
              {isLogout ? (
                <button
                  className={clsx(className)}
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  {icon}
                  {label}
                </button>
              ) : (
                <Link
                  className={clsx(className)}
                  onClick={() => {
                    close();
                  }}
                  href={name === 'profile' ? `/${handle}` : href}
                >
                  {icon}
                  {label}
                </Link>
              )}
            </Fragment>
          );
        }}
        buttonBuilder={({ show }) => {
          return (
            <button
              className="block h-8 w-8 cursor-pointer rounded-full bg-gray-300"
              onClick={show}
            ></button>
          );
        }}
      />
    </div>
  );
}
