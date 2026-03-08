import { DynamoDBHelper } from '@hanlogy/ts-dynamodb';

interface HelperBaseOptions {
  db?: DynamoDBHelper;
}

export abstract class HelperBase {
  constructor({ db }: HelperBaseOptions = {}) {
    this.db = db ?? new DynamoDBHelper();
  }

  protected readonly db: DynamoDBHelper;

  protected createHelper<T extends HelperBase>(
    HelperClass: new (options: HelperBaseOptions) => T
  ): T {
    if (this.constructor === HelperClass) {
      throw new Error(`Cannot create self helper (${HelperClass.name})`);
    }

    return new HelperClass({ db: this.db });
  }

  protected async generateCode(
    shortId: string,
    checkExist: (code: string) => Promise<boolean>,
    retryCount: number = 0
  ): Promise<string> {
    if (retryCount > 5) {
      throw new Error('Faild to generate code');
    }

    const code = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');

    if (await checkExist(code)) {
      return this.generateCode(shortId, checkExist, retryCount++);
    }
    return code;
  }
}
