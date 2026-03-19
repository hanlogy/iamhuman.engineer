'use client';

import { clsx } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { ArrayRightSvg } from '@/components/svgs';
import { menuItems } from '../constants';
import { useAppContext } from '../../state/hooks';

export function Breadcrumb() {
  const { pathname } = useAppContext();
  const menuItem = menuItems.find(({ href }) => href === pathname);
  let currentName: string = '';

  if (menuItem) {
    currentName = menuItem.label.toLowerCase();
  }

  return (
    <div className="flex items-center">
      <SettingsHomeLink href="/settings" className="block md:hidden" />
      <SettingsHomeLink href="/settings/profile" className="hidden md:block" />
      {currentName && (
        <>
          <ArrayRightSvg className="text-foreground-muted ml-2 w-5" />
          <div className="text-foreground-muted ml-2">{currentName}</div>
        </>
      )}
    </div>
  );
}

function SettingsHomeLink({
  href,
  className,
}: {
  href: string;
  className: string;
}) {
  return (
    <Link href={href} className={clsx('text-lg font-medium', className)}>
      Settings
    </Link>
  );
}
