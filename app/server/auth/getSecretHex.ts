export function getSecretHex(): string {
  const secretHex = process.env.SESSION_ENCRYPTION_KEY;

  if (!secretHex) {
    throw new Error('SESSION_ENCRYPTION_KEY is missing');
  }

  return secretHex;
}
