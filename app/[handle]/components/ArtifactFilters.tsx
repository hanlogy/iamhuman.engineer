import { clsx } from '@hanlogy/react-web-ui';
import Link from 'next/link';
import { CloseSvg } from '@/components/svgs';
import type { ArtifactTag } from '@/definitions';

export function ArtifactFilters({
  selectedTag,
  tags,
  handle,
}: {
  selectedTag?: ArtifactTag | undefined;
  tags: ArtifactTag[];
  handle: string;
}) {
  const fileterTags = tags.filter((e) => e.count > 0);

  return (
    <>
      {fileterTags.length > 0 && (
        <div>
          <h2 className="text-foreground-muted mb-2 text-lg font-medium">
            Tags
          </h2>
          {fileterTags.map(({ artifactTagId, label, count, key }) => {
            const isSelected = key === selectedTag?.key;
            return (
              <div key={artifactTagId} className="relative h-10">
                <Link
                  href={`/${handle}?tag=${key}`}
                  className={clsx(
                    '-ml-3 flex h-full items-center rounded-full px-3',
                    {
                      'hover:bg-surface-secondary': !isSelected,
                      'bg-surface': isSelected,
                    }
                  )}
                >
                  <div
                    className={clsx(
                      'text-foreground-secondary mr-2 font-medium',
                      {
                        'font-semibold': isSelected,
                      }
                    )}
                  >
                    {label}
                  </div>
                  <div
                    className={clsx(
                      'flex-center h-6 min-w-6 rounded-full text-sm font-medium',
                      {
                        'bg-surface': !isSelected,
                        'bg-surface-secondary': isSelected,
                      }
                    )}
                  >
                    {count}
                  </div>
                </Link>
                {isSelected && (
                  <div className="absolute top-1 right-2 justify-self-end">
                    <Link
                      href={`/${handle}`}
                      className="hover:bg-surface-secondary text-foreground-secondary flex-center h-8 w-8 rounded-full"
                    >
                      <CloseSvg className="w-5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
