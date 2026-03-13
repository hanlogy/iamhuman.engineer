'use server';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import { getS3Helper } from '@/server/helpersRepo';

export async function prepareSignedUrlForImage({
  folder,
  contentType,
  size,
}: {
  folder: string;
  contentType: string;
  size: number;
}): Promise<
  ActionResponse<{
    uploadUrl: string;
    key: string;
    publicUrl: string;
  }>
> {
  if (!contentType.startsWith('image/')) {
    return toActionFailure({
      message: 'Invalid file type',
    });
  }

  if (size > 5 * 1024 * 1024) {
    return toActionFailure({
      message: 'File too large',
    });
  }

  const helper = getS3Helper();

  return toActionSuccess(
    await helper.getSignedUrl({
      folder,
      contentType,
    })
  );
}
