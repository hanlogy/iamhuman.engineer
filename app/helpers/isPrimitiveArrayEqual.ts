import type { PrimitiveValue } from '@hanlogy/ts-lib';

// TODO: Move to ts-lib
export function isPrimitiveArrayEqual<T extends PrimitiveValue>(
  value1: readonly T[],
  value2: readonly T[]
): boolean {
  if (value1.length !== value2.length) {
    return false;
  }

  return value1.every((item, index) => {
    return item === value2[index];
  });
}
