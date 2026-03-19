import { clsx, IconButton, IconWrapper } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { AddSvg, FilterListSvg } from '@/components/svgs';
import { SearchForm } from './SearchForm';

export function ArtifactToolbar({ isSelf }: { isSelf: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between px-4 md:px-0">
      <h1 className="mr-4 text-lg font-medium md:pl-2">Artifacts</h1>
      {isSelf && (
        <Link
          className={clsx(
            'border-border flex-center text-on-accent bg-accent flex h-8 cursor-pointer rounded-full border',
            'px-3'
          )}
          href="/artifact"
        >
          <IconWrapper size="small">
            <AddSvg />
          </IconWrapper>
          <div className="text-sm font-medium">Add</div>
        </Link>
      )}
      <div className="flex-1"></div>
      <div className="space-x-2">
        <SearchForm />
        <IconButton className="border-border border md:hidden">
          <FilterListSvg />
        </IconButton>
      </div>
    </div>
  );
}
