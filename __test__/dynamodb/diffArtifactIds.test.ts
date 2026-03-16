import { diffArtifactIds } from '@/dynamodb/diffArtifactIds';

describe('diffArtifactIds', () => {
  test('empty arrays', () => {
    expect(diffArtifactIds([], [])).toStrictEqual({
      add: [],
      delete: [],
      untouched: [],
    });
  });

  test('add only', () => {
    expect(diffArtifactIds(['a'], ['a', 'b', 'c'])).toStrictEqual({
      add: ['b', 'c'],
      delete: [],
      untouched: ['a'],
    });
  });

  test('delete only', () => {
    expect(diffArtifactIds(['a', 'b', 'c'], ['a'])).toStrictEqual({
      add: [],
      delete: ['b', 'c'],
      untouched: ['a'],
    });
  });

  test('add and delete', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'c'])).toStrictEqual({
      add: ['c'],
      delete: ['a'],
      untouched: ['b'],
    });
  });

  test('same arrays', () => {
    expect(diffArtifactIds(['a', 'b'], ['a', 'b'])).toStrictEqual({
      add: [],
      delete: [],
      untouched: ['a', 'b'],
    });
  });

  test('different order', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'a'])).toStrictEqual({
      add: [],
      delete: [],
      untouched: ['b','a'],
    });
  });

  test('duplicate ids', () => {
    expect(diffArtifactIds(['a', 'a', 'b'], ['b', 'c', 'c'])).toStrictEqual({
      add: ['c'],
      delete: ['a'],
      untouched: ['b'],
    });
  });
});
