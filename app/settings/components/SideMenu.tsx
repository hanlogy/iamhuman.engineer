'use client';

import { clsx, IconWrapper } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { menuItems } from '../constants';
import { useAppContext } from '../../state/hooks';

export function SideMenu() {
  const { pathname } = useAppContext();
  const isRoot = pathname === '/settings';

  return (
    <ul
      className={clsx('md:w-2xs md:pr-6 lg:w-xs lg:pr-12', {
        block: isRoot,
        'hidden md:block': !isRoot,
      })}
    >
      {menuItems.map(({ name, label, Icon, href }) => {
        const isSelected =
          name === 'profile' ? pathname === href || isRoot : pathname === href;

        return (
          <li
            key={name}
            className="border-b-border border-b last:border-b-0 md:border-0"
          >
            <Link
              href={href}
              className={clsx(
                'hover:bg-surface-secondary flex items-center rounded-lg pl-1',
                'h-14',
                'md:h-10',
                {
                  'md:bg-surface-secondary md:font-medium': isSelected,
                }
              )}
            >
              <IconWrapper size="small" className="mr-2">
                <Icon className="text-foreground-muted" />
              </IconWrapper>
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
