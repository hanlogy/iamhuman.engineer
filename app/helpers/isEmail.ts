export function isEmail(str: string): boolean {
  const value = str.trim();

  if (value.length === 0) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
