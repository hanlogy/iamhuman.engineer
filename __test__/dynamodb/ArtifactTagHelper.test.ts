import { randomUUID } from 'crypto';
import { ArtifactTagHelper } from '@/dynamodb/ArtifactTagHelper';
import { FakeDynamoDBHelper } from './FakeDynamoDBHelper';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

const randomUUIDMock = randomUUID as jest.Mock;

describe('ArtifactTagHelper', () => {
  const userId = 'user-1';
  const pk = 'ARTIFACT_TAG|user-1';

  let db: FakeDynamoDBHelper;
  let helper: ArtifactTagHelper;

  beforeEach(() => {
    db = new FakeDynamoDBHelper();
    helper = new ArtifactTagHelper({ db });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create', async () => {
    randomUUIDMock.mockReturnValue('1-1-1-1');

    const result = await helper.create({
      userId,
      key: 'react',
      label: 'React',
    });

    expect(result).toStrictEqual({ artifactTagId: '1-1-1-1' });

    expect(db.put).toHaveBeenCalledWith({
      keyNames: ['pk', 'sk'],
      item: {
        pk,
        sk: '01|react|true',
        artifactTagId: '1-1-1-1',
        userId,
        key: 'react',
        label: 'React',
        count: 0,
      },
    });
  });

  describe('get', () => {
    test('with result', async () => {
      const item = {
        pk,
        sk: '01|react|true',
        artifactTagId: '1-1-1-1',
        userId,
        key: 'react',
        label: 'React',
        count: 2,
      };

      db.get.mockResolvedValue({ item });

      const result = await helper.get({
        userId,
        key: 'react',
      });

      expect(db.get).toHaveBeenCalledWith({
        keys: {
          pk,
          sk: '01|react|true',
        },
      });

      expect(result).toStrictEqual(item);
    });

    test('without result', async () => {
      db.get.mockResolvedValue({ item: undefined });

      const result = await helper.get({
        userId,
        key: 'react',
      });

      expect(db.get).toHaveBeenCalledWith({
        keys: {
          pk,
          sk: '01|react|true',
        },
      });

      expect(result).toBeUndefined();
    });
  });

  describe('resolveTags', () => {
    test('with existing and new', async () => {
      randomUUIDMock.mockReturnValue('2-2-2-2');

      db.get
        .mockResolvedValueOnce({
          item: {
            pk,
            sk: '01|react|true',
            artifactTagId: '0-0-0-0',
            userId,
            key: 'react',
            label: 'React',
            count: 1,
          },
        })
        .mockResolvedValueOnce({ item: undefined });

      db.put.mockResolvedValue({ attributes: undefined });

      const result = await helper.resolveTags(userId, [
        ' React ',
        'Node JS',
        'react',
        '',
        '   ',
        'Node-JS',
      ]);

      expect(result).toStrictEqual(['0-0-0-0', '2-2-2-2']);

      expect(db.get).toHaveBeenNthCalledWith(1, {
        keys: {
          pk,
          sk: '01|react|true',
        },
      });
      expect(db.get).toHaveBeenNthCalledWith(2, {
        keys: {
          pk,
          sk: '01|node-js|true',
        },
      });

      expect(db.put).toHaveBeenCalledTimes(1);
      expect(db.put).toHaveBeenCalledWith({
        keyNames: ['pk', 'sk'],
        item: {
          pk,
          sk: '01|node-js|true',
          artifactTagId: '2-2-2-2',
          userId,
          key: 'node-js',
          label: 'Node JS',
          count: 0,
        },
      });
    });

    test('all existing', async () => {
      db.get
        .mockResolvedValueOnce({
          item: {
            pk,
            sk: '01|react|true',
            artifactTagId: '1-1-1-1',
            userId,
            key: 'react',
            label: 'React',
            count: 1,
          },
        })
        .mockResolvedValueOnce({
          item: {
            pk,
            sk: '01|node-js|true',
            artifactTagId: '2-2-2-2',
            userId,
            key: 'node-js',
            label: 'Node JS',
            count: 1,
          },
        });

      const result = await helper.resolveTags(userId, ['React', 'Node JS']);

      expect(result).toStrictEqual(['1-1-1-1', '2-2-2-2']);
      expect(db.get).toHaveBeenCalledTimes(2);
      expect(db.put).not.toHaveBeenCalled();
    });

    test('empty labels', async () => {
      const result = await helper.resolveTags(userId, ['', '   ']);

      expect(result).toStrictEqual([]);
      expect(db.get).not.toHaveBeenCalled();
      expect(db.put).not.toHaveBeenCalled();
    });

    test('create one new tag', async () => {
      randomUUIDMock.mockReturnValue('3-3-3-3');
      db.get.mockResolvedValue({ item: undefined });
      db.put.mockResolvedValue({ attributes: undefined });

      const result = await helper.resolveTags(userId, ['Vue JS']);

      expect(result).toStrictEqual(['3-3-3-3']);
      expect(db.get).toHaveBeenCalledWith({
        keys: {
          pk,
          sk: '01|vue-js|true',
        },
      });
      expect(db.put).toHaveBeenCalledWith({
        keyNames: ['pk', 'sk'],
        item: {
          pk,
          sk: '01|vue-js|true',
          artifactTagId: '3-3-3-3',
          userId,
          key: 'vue-js',
          label: 'Vue JS',
          count: 0,
        },
      });
    });
  });

  describe('getTags', () => {
    test('empty', async () => {
      db.query.mockResolvedValue({
        items: [],
      });

      const result = await helper.getTags({ userId });

      expect(db.query).toHaveBeenCalledWith({
        keyConditions: [
          {
            attribute: 'pk',
            value: pk,
          },
        ],
      });
      expect(result).toStrictEqual([]);
    });

    test('some items', async () => {
      db.query.mockResolvedValue({
        items: [
          {
            pk,
            sk: '01|react|true',
            artifactTagId: 'tag-1',
            userId,
            key: 'react',
            label: 'React',
            count: 2,
          },
          {
            pk,
            sk: '01|nodejs|true',
            artifactTagId: 'tag-2',
            userId,
            key: 'nodejs',
            label: 'Node JS',
            count: 1,
          },
        ],
      });

      const result = await helper.getTags({ userId });

      expect(db.query).toHaveBeenCalledWith({
        keyConditions: [
          {
            attribute: 'pk',
            value: pk,
          },
        ],
      });

      expect(result).toStrictEqual([
        {
          pk,
          sk: '01|react|true',
          artifactTagId: 'tag-1',
          userId,
          key: 'react',
          label: 'React',
          count: 2,
        },
        {
          pk,
          sk: '01|nodejs|true',
          artifactTagId: 'tag-2',
          userId,
          key: 'nodejs',
          label: 'Node JS',
          count: 1,
        },
      ]);
    });

    test('invalid item', async () => {
      db.query.mockResolvedValue({
        items: [
          {
            pk,
            sk: '01|react|true',
            artifactTagId: 'tag-1',
            userId,
            key: 'react',
            label: 'React',
            count: '2',
          },
        ],
      });

      await expect(helper.getTags({ userId })).rejects.toThrow();
    });
  });
});
