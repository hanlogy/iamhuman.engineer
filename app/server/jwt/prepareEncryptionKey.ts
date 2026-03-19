export function prepareEncryptionKey(secretHex: string): Uint8Array {
  const key = new Uint8Array(Buffer.from(secretHex, 'hex'));

  if (key.byteLength !== 32) {
    throw new Error('JWE secret must decode to exactly 32 bytes');
  }

  return key;
}
