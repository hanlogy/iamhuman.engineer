import { clsx, IconButton } from '@hanlogy/react-web-ui';
import { Avatar } from '@/components/Avatar';
import { FilterListSvg, GitHubSvg } from '@/components/svgs';
import type { Profile } from '@/definitions/types';
import { SearchForm } from './SearchForm';

export function ProfileSummary({ profile }: { profile: Profile }) {
  return (
    <>
      <div className="flex items-start md:block">
        <Avatar
          url={profile.avatar}
          className={clsx('mr-4 h-18 w-18', 'md:mb-2 md:h-22 md:w-22')}
        />
        <div
          className={clsx(
            'flex min-h-18 flex-1 flex-col justify-center',
            'md:block md:min-h-auto'
          )}
        >
          <div className="text-xl font-medium">Zhiguang Chen</div>
          <div className="text-foreground-secondary">Stockholm, Sweden</div>
          <div className="my-1 h-10">
            <IconButton>
              <GitHubSvg />
            </IconButton>
          </div>
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
