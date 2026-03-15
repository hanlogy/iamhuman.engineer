import { clsx, IconButton, IconWrapper } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { SocialMediaIcon } from '@/components/SocialMediaIcon';
import { FilterListSvg } from '@/components/svgs';
import type { Profile } from '@/definitions/types';
import { isEmail } from '@/helpers/isEmail';
import { SearchForm } from './SearchForm';

export function ProfileSummary({
  profile: { name, avatar, location, links },
}: {
  profile: Profile;
}) {
  return (
    <>
      <div className="flex items-start md:block">
        <Avatar
          url={avatar}
          className={clsx('mr-4 h-18 w-18', 'md:mb-2 md:h-22 md:w-22')}
        />
        <div
          className={clsx(
            'flex min-h-18 flex-1 flex-col justify-center',
            'md:block md:min-h-auto'
          )}
        >
          <div className="text-xl font-medium">
            {name ? (
              name
            ) : (
              <span className="text-foreground-muted italic">Name not set</span>
            )}
          </div>
          {location && (
            <div className="text-foreground-secondary">{location}</div>
          )}
          {links && (
            <div className="my-1 flex">
              {links.map((link) => {
                const href = isEmail(link) ? `mailto:${link}` : link;
                return (
                  <Link href={href} key={href} className="flex-center h-8 w-8">
                    <IconWrapper>
                      <SocialMediaIcon
                        url={link}
                        className="text-foreground-secondary"
                      />
                    </IconWrapper>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 mb-2 flex items-center justify-end space-x-2 md:mt-8 md:block md:space-x-0">
        <SearchForm />
        <IconButton className="border-border border md:hidden">
          <FilterListSvg />
        </IconButton>
      </div>
    </>
  );
}

/*
 */
