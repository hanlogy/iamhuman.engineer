import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import type { Artifact } from '@/definitions';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { ArtifactTagHelper } from '@/dynamodb/ArtifactTagHelper';
import { tagIdsToLabels } from '@/helpers/tagIdsToLabels';

export async function getArtifact({
  artifactId,
}: {
  artifactId: string;
}): Promise<ActionResponse<Artifact>> {
  const artifactHelper = new ArtifactHelper();
  const artifact = await artifactHelper.getItem({ artifactId });

  if (!artifact) {
    return toActionFailure({ code: 'notFound' });
  }

  const tagsHelper = new ArtifactTagHelper();
  const tags = await tagsHelper.getTags({ userId: artifact.userId });

  return toActionSuccess({
    ...artifact,
    tags: tagIdsToLabels(artifact.tags, tags),
  });
}
