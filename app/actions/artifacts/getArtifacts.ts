'use server';

import { cache } from 'react';
import { toActionSuccess, type ActionResponse } from '@hanlogy/react-kit';
import type { Artifact } from '@/definitions';
import { ArtifactByTagHelper } from '@/dynamodb/ArtifactByTagHelper';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { tagIdsToLabels } from '@/helpers/tagIdsToLabels';
import { getCachedArtifactTags } from './getArtifactTags';

export async function getArtifacts({
  userId,
  artifactTagId,
}: {
  userId: string;
  artifactTagId?: string;
}): Promise<ActionResponse<Artifact[]>> {
  const [rawArtifacts, tagsResult] = await Promise.all([
    artifactTagId
      ? new ArtifactByTagHelper().getItems({ userId, artifactTagId })
      : new ArtifactHelper().getItems({ userId }),
    getCachedArtifactTags({ userId }),
  ]);

  const tags = tagsResult.success ? tagsResult.data : [];

  return toActionSuccess(
    rawArtifacts.map(({ tags: tagIds, ...rest }) => ({
      ...rest,
      tags: tagIdsToLabels(tagIds, tags),
    }))
  );
}

export const getCachedArtifacts = cache(getArtifacts);
