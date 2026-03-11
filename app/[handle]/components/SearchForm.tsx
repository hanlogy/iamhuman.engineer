import { IconButton, IconWrapper } from '@hanlogy/react-web-ui';
import { SearchSvg } from '@/components/svgs';

export function SearchForm() {
  return (
    <>
      <IconButton className="border-border border md:hidden">
        <SearchSvg />
      </IconButton>

      <div className="relative hidden md:block">
        <IconWrapper className="absolute h-10 w-10">
          <SearchSvg className="text-foreground-secondary w-6" />
        </IconWrapper>
        <input className="border-border h-10 w-full rounded-full border pl-10" />
      </div>
    </>
  );
}
