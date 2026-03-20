'use server';

import { toActionSuccess, type ActionResponse } from '@hanlogy/react-kit';
import type { Artifact, ArtifactTag } from '@/definitions';
import { ArtifactByTagHelper } from '@/dynamodb/ArtifactByTagHelper';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { tagIdsToLabels } from '@/helpers/tagIdsToLabels';

export async function getArtifacts({
  userId,
  tags,
  artifactTagId,
}: {
  userId: string;
  tags: ArtifactTag[];
  artifactTagId?: string;
}): Promise<ActionResponse<Artifact[]>> {
  const rawArtifacts = await (artifactTagId
    ? new ArtifactByTagHelper().getItems({ userId, artifactTagId })
    : new ArtifactHelper().getItems({ userId }));

  return toActionSuccess(
    rawArtifacts.map(({ tags: tagIds, ...rest }) => ({
      ...rest,
      tags: tagIdsToLabels(tagIds, tags),
    }))
  );
}
