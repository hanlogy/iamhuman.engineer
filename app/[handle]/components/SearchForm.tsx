import { IconButton, IconWrapper } from '@hanlogy/react-web-ui';
import { FilterListSvg, SearchSvg } from '@/components/svgs';

export function SearchForm() {
  return (
    <div className="">
      <div className="space-x-2 md:hidden">
        <IconButton className="border-border border">
          <SearchSvg />
        </IconButton>
        <IconButton className="border-border border">
          <FilterListSvg />
        </IconButton>
      </div>

      <div className="relative hidden md:block">
        <IconWrapper className="absolute h-10 w-10">
          <SearchSvg className="text-foreground-secondary w-6" />
        </IconWrapper>
        <input className="border-border h-10 w-full rounded-full border pl-10" />
      </div>
    </div>
  );
}
