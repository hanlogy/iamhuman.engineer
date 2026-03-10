'use client';

import { logout } from '@/actions/user/logout';

export function MemberNavBar() {
  return (
    <button
      onClick={() => {
        logout();
      }}
    >
      Logout
    </button>
  );
}
