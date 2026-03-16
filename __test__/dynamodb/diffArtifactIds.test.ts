import { diffArtifactIds } from '@/dynamodb/diffArtifactIds';

describe('diffArtifactIds', () => {
  test('empty arrays', () => {
    expect(diffArtifactIds([], [])).toStrictEqual({
      added: [],
      removed: [],
      unchanged: [],
    });
  });

  test('add only', () => {
    expect(diffArtifactIds(['a'], ['a', 'b', 'c'])).toStrictEqual({
      added: ['b', 'c'],
      removed: [],
      unchanged: ['a'],
    });
  });

  test('delete only', () => {
    expect(diffArtifactIds(['a', 'b', 'c'], ['a'])).toStrictEqual({
      added: [],
      removed: ['b', 'c'],
      unchanged: ['a'],
    });
  });

  test('add and delete', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'c'])).toStrictEqual({
      added: ['c'],
      removed: ['a'],
      unchanged: ['b'],
    });
  });

  test('same arrays', () => {
    expect(diffArtifactIds(['a', 'b'], ['a', 'b'])).toStrictEqual({
      added: [],
      removed: [],
      unchanged: ['a', 'b'],
    });
  });

  test('different order', () => {
    expect(diffArtifactIds(['a', 'b'], ['b', 'a'])).toStrictEqual({
      added: [],
      removed: [],
      unchanged: ['b', 'a'],
    });
  });

  test('duplicate ids', () => {
    expect(diffArtifactIds(['a', 'a', 'b'], ['b', 'c', 'c'])).toStrictEqual({
      added: ['c'],
      removed: ['a'],
      unchanged: ['b'],
    });
  });
});
