import { S3_PUBLIC_BASE_URL } from '@/definitions';

export function buildS3Url(url: string): string;
export function buildS3Url(url: string | undefined): string | undefined;
export function buildS3Url(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  return `${S3_PUBLIC_BASE_URL}/${url}`;
}
