'use client';

import { useState } from 'react';
import { clsx, IconButton } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { CloseSvg, MenuSvg } from './svgs';

const navItems = [
  { label: 'Engineers', href: '/coming-soon' },
  { label: 'Teams', href: '/coming-soon' },
  { label: 'About', href: '/coming-soon' },
  { label: 'login', href: '/login' },
];

export function NavBar() {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      {isShown && (
        <button
          className="fixed top-0 left-0 z-20 h-dvh w-dvw bg-white/0 sm:hidden"
          onClick={() => setIsShown(false)}
        ></button>
      )}
      <nav
        className={clsx(
          {
            hidden: !isShown,
          },
          'sm:block!'
        )}
      >
        <ul
          className={clsx(
            'flex',
            'bg-surface fixed top-14 right-2 z-30 flex-col rounded-xl p-4 shadow-lg shadow-gray-200',
            'sm:static sm:flex-row sm:items-center sm:space-x-6 sm:bg-transparent sm:shadow-none'
          )}
        >
          {navItems.map(({ label, href }) => {
            return (
              <li key={label}>
                <Link href={href} className="flex-center h-10 w-full">
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="mt-4 sm:mt-0">
            <Link
              href="/signup"
              className="bg-accent text-on-accent flex-center h-10 min-w-30 rounded-full font-semibold"
            >
              Sign up
            </Link>
          </li>
        </ul>
      </nav>
      <IconButton onClick={() => setIsShown((p) => !p)} className="sm:hidden">
        {isShown && <CloseSvg />}
        {!isShown && <MenuSvg />}
      </IconButton>
    </>
  );
}
