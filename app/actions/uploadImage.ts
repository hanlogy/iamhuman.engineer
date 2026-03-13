'use client';

import {
  toActionFailure,
  toActionSuccess,
  type ActionResponse,
} from '@hanlogy/react-kit';
import type { S3Folder } from '@/definitions/types';
import { prepareSignedUrlForImage } from './prepareSignedUrlForImage';

export async function uploadImage({
  folder,
  image,
}: {
  folder: S3Folder;
  image: File;
}): Promise<ActionResponse<string>> {
  //

  const { error, data: urlData } = await prepareSignedUrlForImage({
    contentType: image.type,
    size: image.size,
    folder,
  });

  if (error) {
    return toActionFailure(error);
  }

  if (process.env.NODE_ENV === 'development') {
    // Do nothing now
  } else {
    const response = await fetch(urlData.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    });

    if (!response.ok) {
      return toActionFailure({
        message: 'Upload failed',
      });
    }
  }

  return toActionSuccess(urlData.key);
}
