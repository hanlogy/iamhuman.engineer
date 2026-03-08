import { HelperBase } from './HelperBase';
import type { ProfileEntity } from './types';

export class ProfileHelper extends HelperBase {
  private readonly sk = '01#';

  private buildPk({ handle }: { handle: string }) {
    return this.db.buildKey('profile', handle);
  }

  buildKeys({ handle }: { handle: string }) {
    return { pk: this.buildPk({ handle }), sk: this.sk };
  }

  async get(handleLike: string): Promise<ProfileEntity | undefined> {
    const { item } = await this.db.get({
      keys: this.buildKeys({ handle: handleLike }),
    });

    if (!item) {
      return undefined;
    }

    const { pk, sk, userId, handle } = item;

    return { pk, sk, userId, handle };
  }
}
