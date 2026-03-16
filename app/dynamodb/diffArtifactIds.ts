export interface DiffArtifactIdsResult {
  readonly add: readonly string[];
  readonly delete: readonly string[];
  readonly untouched: readonly string[];
}

export function diffArtifactIds(
  ids1: readonly string[],
  ids2: readonly string[]
): DiffArtifactIdsResult {
  const uniqueIds1 = Array.from(new Set(ids1));
  const uniqueIds2 = Array.from(new Set(ids2));

  const ids1Set = new Set(uniqueIds1);
  const ids2Set = new Set(uniqueIds2);

  return {
    add: uniqueIds2.filter((id) => {
      return !ids1Set.has(id);
    }),
    delete: uniqueIds1.filter((id) => {
      return !ids2Set.has(id);
    }),
    untouched: uniqueIds2.filter((id) => {
      return ids1Set.has(id);
    }),
  };
}
