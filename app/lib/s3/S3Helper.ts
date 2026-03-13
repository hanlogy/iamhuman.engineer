import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createObjectKey } from './helpers';
import type {
  GetSignedUrlParams,
  GetSignedUrlResult,
  S3HelperInterface,
} from './type';

export class S3Helper implements S3HelperInterface {
  readonly client: S3Client;
  readonly bucketName: string;
  readonly publicBaseUrl: string;

  constructor() {
    const {
      S3_BUCKET_NAME,
      S3_REGION,
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

    this.bucketName = S3_BUCKET_NAME;
    this.publicBaseUrl = S3_PUBLIC_BASE_URL;
    this.client = new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async getSignedUrl({
    folder,
    contentType,
  }: GetSignedUrlParams): Promise<GetSignedUrlResult> {
    const key = createObjectKey(folder, contentType);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: 60,
    });

    return {
      uploadUrl,
      key,
      publicUrl: `${this.publicBaseUrl}/${key}`,
    };
  }
}
