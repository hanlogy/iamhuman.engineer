import { createObjectKey } from './helpers';
import type {
  GetSignedUrlParams,
  GetSignedUrlResult,
  S3HelperInterface,
} from './type';

export class FakeS3Helper implements S3HelperInterface {
  constructor() {}
  async getSignedUrl({
    folder,
    contentType,
  }: GetSignedUrlParams): Promise<GetSignedUrlResult> {
    const key = createObjectKey(folder, contentType);

    return {
      uploadUrl: '',
      key,
    };
  }
}
