import { diffArtifactIds } from '@/dynamodb/diffArtifactIds';

describe('diffArtifactIds', () => {
  test('empty arrays', () => {
    expect(diffArtifactIds([], [])).toStrictEqual({
      toAdd: [],
      toDelete: [],
      toKeep: [],
    });
  });

  test('add only', () => {
    expect(diffArtifactIds(['a'], ['a', 'b', 'c'])).toStrictEqual({
      toAdd: ['b', 'c'],
      toDelete: [],
      toKeep: ['a'],
    });
  });

  test('delete only', () => {
    expect(diffArtifactIds(['a', 'b', 'c'], ['a'])).toStrictEqual({
      toAdd: [],
      toDelete: ['b', 'c'],
      toKeep: ['a'],
    });
  });

  test('add and delete', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'c'])).toStrictEqual({
      toAdd: ['c'],
      toDelete: ['a'],
      toKeep: ['b'],
    });
  });

  test('same arrays', () => {
    expect(diffArtifactIds(['a', 'b'], ['a', 'b'])).toStrictEqual({
      toAdd: [],
      toDelete: [],
      toKeep: ['a', 'b'],
    });
  });

  test('different order', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'a'])).toStrictEqual({
      toAdd: [],
      toDelete: [],
      toKeep: ['b', 'a'],
    });
  });

  test('duplicate ids', () => {
    expect(diffArtifactIds(['a', 'a', 'b'], ['b', 'c', 'c'])).toStrictEqual({
      toAdd: ['c'],
      toDelete: ['a'],
      toKeep: ['b'],
    });
  });
});
