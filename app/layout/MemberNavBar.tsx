'use client';

import Link from 'next/link';
import { EngineersSvg, TeamsSvg } from '@/components/svgs';
import { MemberNavDropdown } from './MemberNavDropdown';

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
      <MemberNavDropdown handle={handle} />
    </div>
  );
}
