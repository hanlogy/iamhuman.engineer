import { ButtonGroup, clsx } from '@hanlogy/react-web-ui';

const items = [
  {
    label: 'Summary',
    value: 'summary',
  },
  {
    label: 'Links',
    value: 'links',
  },
  {
    label: 'Judgment',
    value: 'judgment',
  },
] as const;

export type TabName = (typeof items)[number]['value'];

export function Tabs({
  selectedTab,
  onChange,
}: {
  selectedTab: TabName;
  onChange: (tabName: TabName) => void;
}) {
  return (
    <ButtonGroup
      className="w-full"
      buttonBuilder={({
        item: { label, value },
        isFirst,
        isLast,
        isSelected,
      }) => {
        return (
          <button
            onClick={() => onChange(value)}
            className={clsx(
              'text-foreground-muted h-10 cursor-pointer text-center text-sm sm:text-base',
              'border-border border',
              {
                'border-r-0': !isLast,
                'rounded-l-full': isFirst,
                'rounded-r-full': isLast,
                'bg-surface-secondary font-semibold': isSelected,
              }
            )}
            type="button"
          >
            {label}
          </button>
        );
      }}
      items={items}
      value={selectedTab}
    />
  );
}
