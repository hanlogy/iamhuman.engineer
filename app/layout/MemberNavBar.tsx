'use client';

import Link from 'next/link';
import { EngineersSvg, TeamsSvg } from '@/components/svgs';
import { AddArtifactbutton } from './AddArtifactButton';
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
    <div className="flex items-center space-x-6 sm:space-x-8">
      <AddArtifactbutton />
      {linkItems.map(({ name, label, href, Icon }) => {
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
      <MemberNavDropdown handle={handle} />
    </div>
  );
}
