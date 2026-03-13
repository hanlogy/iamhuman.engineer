import { createObjectKey } from './helpers';
import type {
  GetSignedUrlParams,
  GetSignedUrlResult,
  S3HelperInterface,
} from './type';

export class FakeS3Helper implements S3HelperInterface {
  readonly publicBaseUrl: string;

  constructor() {
    const {
      S3_BUCKET_NAME,
      S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY,
      S3_PUBLIC_BASE_URL,
    } = process.env;

    if (
      !S3_ACCESS_KEY_ID ||
      !S3_SECRET_ACCESS_KEY ||
      !S3_BUCKET_NAME ||
      !S3_PUBLIC_BASE_URL
    ) {
      throw new Error('Make sure all the required variables are set');
    }

    this.publicBaseUrl = S3_PUBLIC_BASE_URL;
  }
  async getSignedUrl({
    folder,
    contentType,
  }: GetSignedUrlParams): Promise<GetSignedUrlResult> {
    const key = createObjectKey(folder, contentType);

    return {
      uploadUrl: '',
      key,
      publicUrl: `${this.publicBaseUrl}/${key}`,
    };
  }
}
