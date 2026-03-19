'use client';

import { Fragment } from 'react/jsx-runtime';
import Link from 'next/link';
import { EngineersSvg, TeamsSvg } from '@/components/svgs';
import type { UserSummary } from '@/definitions';
import { MemberNavDropdown } from './MemberNavDropdown';

const linkItems = [
  {
    name: 'engineers',
    label: 'Engineers',
    href: '/engineers',
    Icon: EngineersSvg,
  },
  {
    name: 'teams',
    label: 'Teams',
    href: '/teams',
    Icon: TeamsSvg,
  },
];

export function MemberNavBar({ user }: { user: UserSummary }) {
  return (
    <div className="flex items-center space-x-6 sm:space-x-8">
      {linkItems.map(({ name, label, href, Icon }) => {
        if (name === 'teams') {
          return <Fragment key={name}></Fragment>;
        }
        return (
          <Link
            key={name}
            href={href}
            className="text-foreground-secondary flex flex-col items-center md:flex-row"
          >
            <Icon className="h-7 w-7 md:mr-2" />
            <div className="text-foreground-muted text-xs leading-none font-medium md:text-base md:font-normal">
              {label}
            </div>
          </Link>
        );
      })}
      <MemberNavDropdown user={user} />
    </div>
  );
}
