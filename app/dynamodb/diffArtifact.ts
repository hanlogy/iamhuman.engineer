import type { Artifact, ArtifactLink } from '@/definitions';
import { isPrimitiveArrayEqual } from '@/helpers/isPrimitiveArrayEqual';

export function diffArtifact(
  artifact1: Artifact,
  artifact2: Artifact
): readonly (keyof Artifact)[] {
  const changedFields: (keyof Artifact)[] = [];

  if (artifact1.artifactId !== artifact2.artifactId) {
    changedFields.push('artifactId');
  }

  if (artifact1.title !== artifact2.title) {
    changedFields.push('title');
  }

  if (artifact1.type !== artifact2.type) {
    changedFields.push('type');
  }

  if (artifact1.publishedAt !== artifact2.publishedAt) {
    changedFields.push('publishedAt');
  }

  if (artifact1.summary !== artifact2.summary) {
    changedFields.push('summary');
  }

  if (artifact1.judgment !== artifact2.judgment) {
    changedFields.push('judgment');
  }

  if (!isPrimitiveArrayEqual(artifact1.tags, artifact2.tags)) {
    changedFields.push('tags');
  }

  if (!isLinkArrayEqual(artifact1.links, artifact2.links)) {
    changedFields.push('links');
  }

  return changedFields;
}

function isLinkEqual(link1: ArtifactLink, link2: ArtifactLink): boolean {
  return link1.title === link2.title && link1.url === link2.url;
}

function isLinkArrayEqual(
  value1: readonly ArtifactLink[],
  value2: readonly ArtifactLink[]
): boolean {
  if (value1.length !== value2.length) {
    return false;
  }

  return value1.every((item, index) => {
    const target = value2[index];

    if (!target) {
      return false;
    }

    return isLinkEqual(item, target);
  });
}
