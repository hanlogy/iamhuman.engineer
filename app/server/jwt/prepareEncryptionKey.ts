export function prepareEncryptionKey(secretHex?: unknown): Uint8Array {
  if (!secretHex || typeof secretHex !== 'string') {
    throw new Error('A valied JWE secret is required');
  }

  const key = new Uint8Array(Buffer.from(secretHex, 'hex'));

  if (key.byteLength !== 32) {
    throw new Error('JWE secret must decode to exactly 32 bytes');
  }

  return key;
}
