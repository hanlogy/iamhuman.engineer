'use server';

import fs from 'fs/promises';
import path from 'path';

export async function saveFileToPublic({
  file,
  key,
}: {
  file: File;
  key: string;
}) {
  const publicDir = path.join(process.cwd(), 'public');
  const fullPath = path.join(publicDir, key);

  const relative = path.relative(publicDir, fullPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Invalid key: path traversal detected');
  }

  // Create the destination directory if it doesn't exist
  const targetDir = path.dirname(fullPath);
  await fs.mkdir(targetDir, { recursive: true });

  // Write the file
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, fileBuffer);
}
