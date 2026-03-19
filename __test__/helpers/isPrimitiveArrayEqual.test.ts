import { isPrimitiveArrayEqual } from '@/helpers/isPrimitiveArrayEqual';

describe('isPrimitiveArrayEqual', () => {
  test('string array equal', () => {
    expect(isPrimitiveArrayEqual(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  test('string array different length', () => {
    expect(isPrimitiveArrayEqual(['a'], ['a', 'b'])).toBe(false);
  });

  test('string array different value', () => {
    expect(isPrimitiveArrayEqual(['a', 'b'], ['a', 'c'])).toBe(false);
  });

  test('string array different order', () => {
    expect(isPrimitiveArrayEqual(['a', 'b'], ['b', 'a'])).toBe(false);
  });

  test('number array equal', () => {
    expect(isPrimitiveArrayEqual([1, 2], [1, 2])).toBe(true);
  });

  test('number array different value', () => {
    expect(isPrimitiveArrayEqual([1, 2], [1, 3])).toBe(false);
  });

  test('boolean array equal', () => {
    expect(isPrimitiveArrayEqual([true, false], [true, false])).toBe(true);
  });

  test('boolean array different value', () => {
    expect(isPrimitiveArrayEqual([true, false], [false, true])).toBe(false);
  });

  test('empty array', () => {
    expect(isPrimitiveArrayEqual([], [])).toBe(true);
  });
});
