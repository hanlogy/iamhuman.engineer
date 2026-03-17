import { clsx, IconWrapper } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { SocialMediaIcon } from '@/components/SocialMediaIcon';
import type { Profile } from '@/definitions/types';
import { isEmail } from '@/helpers/isEmail';

export async function ProfileSummary({
  profile: { name, avatar, location, links },
}: {
  profile: Profile;
}) {
  return (
    <>
      <div className="flex items-start md:block">
        <Avatar
          avatar={avatar}
          className={clsx('mr-2 h-18 w-18', 'lg:mr-0 lg:mb-2 lg:h-22 lg:w-22')}
        />
        <div
          className={clsx(
            'flex min-h-18 flex-1 flex-col justify-center',
            'md:block md:min-h-auto'
          )}
        >
          <div>
            {name ? (
              <span className="text-lg font-medium lg:text-xl">{name}</span>
            ) : (
              <div className="bg-surface-secondary text-foreground-muted mb-0.5 inline-block rounded-full px-3 py-1 italic">
                Name not set
              </div>
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
    </>
  );
}
