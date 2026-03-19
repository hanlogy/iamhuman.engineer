import type { ArtifactTag } from '@/definitions';

export function tagIdsToLabels(
  tagIds: readonly string[],
  tags: readonly ArtifactTag[]
): readonly string[] {
  return tagIds
    .map((tagId) => {
      const tag = tags.find((e) => e.artifactTagId === tagId);
      if (!tag) {
        return undefined;
      }
      return tag.label;
    })
    .filter((e) => e !== undefined);
}
