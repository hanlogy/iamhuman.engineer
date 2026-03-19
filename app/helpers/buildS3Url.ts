export function buildS3Url(url: string): string;
export function buildS3Url(url: string | undefined): string | undefined;
export function buildS3Url(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  return `${process.env.NEXT_PUBLIC_S3_URL}/${url}`;
}
