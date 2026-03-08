import { HelperBase } from './HelperBase';

export class ProfileHelper extends HelperBase {
  private readonly sk = '01#';

  private buildPk({ handle }: { handle: string }) {
    return this.db.buildKey('profile', handle);
  }

  buildKeys({ handle }: { handle: string }) {
    return { pk: this.buildPk({ handle }), sk: this.sk };
  }
}
