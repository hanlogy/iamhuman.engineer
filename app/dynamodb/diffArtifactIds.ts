export function diffArtifactIds(
  ids1: readonly string[],
  ids2: readonly string[]
): {
  add: string[];
  delete: string[];
} {
  const ids1Set = new Set(ids1);
  const ids2Set = new Set(ids2);

  return {
    add: ids2.filter((id) => {
      return !ids1Set.has(id);
    }),

    delete: ids1.filter((id) => {
      return !ids2Set.has(id);
    }),
  };
}
