import {
  LinksSvg,
  LockSvg,
  MailSvg,
  NavProfileSvg,
  // TagsSvg,
} from '@/components/svgs';

export const profileItem = {
  name: 'profile',
  label: 'Profile',
  Icon: NavProfileSvg,
  href: '/settings/profile',
} as const;

export const menuItems = [
  profileItem,
  {
    name: 'links',
    label: 'Links',
    Icon: LinksSvg,
    href: '/settings/links',
  },
  //{
  //  name: 'tags',
  //  label: 'Tags',
  //  Icon: TagsSvg,
  //  href: '/settings/tags',
  //},
  {
    name: 'email',
    label: 'Email',
    Icon: MailSvg,
    href: '/settings/email',
  },
  {
    name: 'password',
    label: 'Password',
    Icon: LockSvg,
    href: '/settings/password',
  },
] as const;
