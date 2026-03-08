import type { PutConfig } from '@hanlogy/ts-dynamodb';
import { HelperBase } from './HelperBase';
import type { CreateProfileFields, ProfileEntity } from './types';

export class ProfileHelper extends HelperBase {
  private readonly sk = '01#';

  private buildPk({ handle }: { handle: string }) {
    return this.db.buildKey('profile', handle);
  }

  private buildKeys({ handle }: { handle: string }) {
    return { pk: this.buildPk({ handle }), sk: this.sk };
  }

  buildPutConfig({
    handle,
    userId,
  }: CreateProfileFields): PutConfig<ProfileEntity> {
    return {
      keyNames: ['pk', 'sk'],
      item: {
        ...this.buildKeys({ handle }),
        handle,
        userId,
      },
    };
  }
}
