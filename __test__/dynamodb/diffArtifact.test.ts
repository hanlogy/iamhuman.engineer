import type { Artifact } from '@/definitions';
import { diffArtifact } from '@/dynamodb/diffArtifact';

function createArtifact(overrides?: Partial<Artifact>): Artifact {
  return {
    artifactId: 'artifact-1',
    title: 'My Artifact',
    type: 'code',
    tags: ['react', 'typescript'],
    releaseDate: '2026-03-16',
    summary: 'summary',
    links: [
      {
        title: 'GitHub',
        url: 'https://github.com/example/repo',
      },
    ],
    judgment: 'good',
    ...overrides,
  };
}

describe('diffArtifact', () => {
  test('no change', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact();

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual([]);
  });

  test('artifactId', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      artifactId: 'artifact-2',
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['artifactId']);
  });

  test('title', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      title: 'New Title',
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['title']);
  });

  test('type', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      type: 'design',
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['type']);
  });

  test('tags', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      tags: ['react', 'nodejs'],
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['tags']);
  });

  test('releaseDate', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      releaseDate: '2026-03-17',
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['releaseDate']);
  });

  test('summary', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      summary: 'new summary',
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['summary']);
  });

  test('summary undefined', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      summary: undefined,
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['summary']);
  });

  test('links', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      links: [
        {
          title: 'Website',
          url: 'https://example.com',
        },
      ],
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['links']);
  });

  test('judgment', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      judgment: 'better',
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['judgment']);
  });

  test('judgment undefined', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      judgment: undefined,
    });

    expect(diffArtifact(artifact1, artifact2)).toStrictEqual(['judgment']);
  });

  test('multiple fields', () => {
    const artifact1 = createArtifact();
    const artifact2 = createArtifact({
      title: 'New Title',
      tags: ['react'],
      judgment: undefined,
    });

    expect(diffArtifact(artifact1, artifact2).toSorted()).toStrictEqual(
      ['title', 'tags', 'judgment'].sort()
    );
  });
});
