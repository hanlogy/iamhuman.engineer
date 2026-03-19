'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import type { UODImage } from '@/components/ImageUpload';
import type { Artifact } from '@/definitions/types';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { createSessionManager } from '@/server/auth/createSessionManager';

export async function saveArtifact(
  id: string | undefined,
  attributes: Omit<Artifact, 'artifactId' | 'tags' | 'userId'> & {
    tagLabels: string[];
    uodImage: UODImage;
  }
): Promise<ActionResponse> {
  const artifactHelper = new ArtifactHelper();
  const { getSession } = await createSessionManager();
  const { userId } = (await getSession()) ?? {};

  if (!userId) {
    return toActionFailure();
  }

  try {
    if (!id) {
      await artifactHelper.createItem({ userId, ...attributes });
    } else {
      await artifactHelper.updateItem({ userId, artifactId: id }, attributes);
    }
    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
