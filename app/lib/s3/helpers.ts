import { randomUUID } from 'node:crypto';

export function getImageExtension(contentType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  };

  return map[contentType] ?? 'bin';
}

export function createObjectKey(folder: string, contentType: string): string {
  const extension = getImageExtension(contentType);

  return `${folder}/${randomUUID()}.${extension}`;
}
