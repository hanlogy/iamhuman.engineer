import { diffArtifactIds } from '@/dynamodb/diffArtifactIds';

describe('diffArtifactIds', () => {
  test('empty arrays', () => {
    expect(diffArtifactIds([], [])).toStrictEqual({
      add: [],
      delete: [],
    });
  });

  test('add only', () => {
    expect(diffArtifactIds(['a'], ['a', 'b', 'c'])).toStrictEqual({
      add: ['b', 'c'],
      delete: [],
    });
  });

  test('delete only', () => {
    expect(diffArtifactIds(['a', 'b', 'c'], ['a'])).toStrictEqual({
      add: [],
      delete: ['b', 'c'],
    });
  });

  test('add and delete', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'c'])).toStrictEqual({
      add: ['c'],
      delete: ['a'],
    });
  });

  test('same arrays', () => {
    expect(diffArtifactIds(['a', 'b'], ['a', 'b'])).toStrictEqual({
      add: [],
      delete: [],
    });
  });

  test('different order', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'a'])).toStrictEqual({
      add: [],
      delete: [],
    });
  });

  test('duplicate ids', () => {
    expect(diffArtifactIds(['a', 'a', 'b'], ['b', 'c', 'c'])).toStrictEqual({
      add: ['c', 'c'],
      delete: ['a', 'a'],
    });
  });
});
