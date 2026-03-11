import { clsx, IconButton } from '@hanlogy/react-web-ui';
import { FilterListSvg, GitHubSvg } from '@/components/svgs';
import { AddArtifactbutton } from './AddArtifactButton';
import { SearchForm } from './SearchForm';

export function ProfileSummary() {
  return (
    <>
      <div className="flex items-start md:block">
        <div
          className={clsx(
            'bg-surface-secondary rounded-full',
            'mr-4 h-18 w-18',
            'md:mb-2 md:h-22 md:w-22'
          )}
        ></div>
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
      <div className="mt-8 mb-4 flex items-center justify-between md:block">
        <div className="flex-1 space-x-2">
          <SearchForm />
          <IconButton className="border-border border md:hidden">
            <FilterListSvg />
          </IconButton>
        </div>
        <div className="md:hidden">
          <AddArtifactbutton />
        </div>
      </div>
    </>
  );
}

/*
 */
