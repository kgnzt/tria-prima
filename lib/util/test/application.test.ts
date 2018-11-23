import { Page } from '../../record';
import * as Util from '../application';

describe('Util: Application', () => {
  describe('schemasToList', () => {
    const { schemasToList } = Util;

    const schemas = {
      '/foo/:fooId': {
      },
      '/bar/:barId': {
      }
    };

    it('d', () => {
      expect(1).toBe(1);
    });
  });
});
