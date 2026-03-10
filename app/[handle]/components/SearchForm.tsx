import { IconButton, IconWrapper, TextInput } from '@hanlogy/react-web-ui';
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

      <div className="hidden md:block">
        <TextInput
          className="border-border rounded-full border"
          prefix={
            <IconWrapper>
              <SearchSvg className="text-foreground-secondary" />
            </IconWrapper>
          }
        />
      </div>
    </div>
  );
}
