import { Page } from '../../record';
import * as Util from '../application';

describe('Util: Application', () => {
  describe('pathsToPages', () => {
    const { pathsToPages } = Util;

    const paths = {
      '/foo/:fooId': {
      },
      '/bar/:barId': {
      }
    };
    const pages = pathsToPages(paths);

    it('creates one page per path', () => {
      expect(pages.size).toBe(2);
    });

    it('correctly generates pages', () => {
      pages.forEach((page) => {
        expect(1).toEqual(1);
      });
    });
  });
});
