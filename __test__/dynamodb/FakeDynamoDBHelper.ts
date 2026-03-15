import { DynamoDBHelper } from '@hanlogy/ts-dynamodb';

export class FakeDynamoDBHelper extends DynamoDBHelper {
  constructor() {
    super({
      tableName: 'test',
      client: {} as never,
    });
  }

  buildKey = jest.fn((...args: (string | number | boolean)[]) => {
    return args.join('|');
  });

  put = jest.fn();
  get = jest.fn();
  query = jest.fn();
}
