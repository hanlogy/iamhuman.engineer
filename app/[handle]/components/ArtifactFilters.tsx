import type { ArtifactTag } from '@/definitions';

export function ArtifactFilters({ tags }: { tags: ArtifactTag[] }) {
  return (
    <>
      {tags.length > 0 && (
        <div>
          {tags.map(({ artifactTagId, label, count }) => {
            return (
              <div key={artifactTagId}>
                {label} {count}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
