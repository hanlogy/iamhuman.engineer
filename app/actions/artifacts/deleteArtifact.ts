'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import { refresh } from 'next/cache';
import { ArtifactHelper } from '@/dynamodb/ArtifactHelper';
import { createSessionManager } from '@/server/auth';

export async function deleteArtifact(
  artifactId: string
): Promise<ActionResponse> {
  const helper = new ArtifactHelper();

  const { getSession } = await createSessionManager();
  const session = await getSession({ checkDb: true });
  if (!session) {
    return toActionFailure();
  }
  const { userId } = session;

  try {
    await helper.deleteItem({ userId, artifactId });
    refresh();
    return toActionSuccess();
  } catch (e) {
    console.log(e);
    return toActionFailure();
  }
}
