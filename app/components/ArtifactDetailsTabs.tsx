import { ButtonGroup, clsx } from '@hanlogy/react-web-ui';

export const tabItems = [
  {
    label: 'Summary',
    value: 'summary',
  },
  {
    label: 'Judgment',
    value: 'judgment',
  },
  {
    label: 'Links',
    value: 'links',
  },
] as const;

export type ArtifactDetailsTabName = (typeof tabItems)[number]['value'];

export function ArtifactDetailsTabs({
  selectedTab,
  onChange,
}: {
  selectedTab: ArtifactDetailsTabName;
  onChange: (tabName: ArtifactDetailsTabName) => void;
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
              'h-8 cursor-pointer text-center text-sm',
              'border-border border',
              {
                'border-r-0': !isLast,
                'rounded-l-full': isFirst,
                'rounded-r-full': isLast,
                'bg-surface text-foreground-muted': !isSelected,
                'bg-surface-secondary font-semibold': isSelected,
              }
            )}
            type="button"
          >
            {label}
          </button>
        );
      }}
      items={tabItems}
      value={selectedTab}
    />
  );
}
