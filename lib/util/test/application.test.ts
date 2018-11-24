import * as Immutable from 'immutable';

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
    const resolve = (schema, path) => {
      return 'a';
    }
    
    const result = schemasToList(schemas, resolve);

    it('returns a List', () => {
      expect(Immutable.List.isList(result)).toBe(true);
    });

    it('correctly converts schemas into a list of resolved instances', () => {
      result.forEach(item => {
        expect(item).toEqual('a');
      });
    });
  });

  describe('schemaToApplication', () => {
    const { schemaToApplication } = Util;

    const schema = {
      path: {
        '/foo/:fooId': {
        },
        '/bar/:barId': {
        }
      },
      store: {
        user: {
          store: Immutable.Map(),
        }
      },
      source: {
        user: {
          findById() {
            return Promise.resolve();
          }
        }
      }
    };

    const application = schemaToApplication(schema);

    describe('pages', () => {
      const { pages } = application;

      it('is a list of pages', () => {
        expect(Immutable.List.isList(pages)).toBe(true);
      });

      it('creates one page per path', () => {
        expect(pages.size).toBe(2);
      });

      it('each item in the list is a Page instance', () => {
        pages.forEach((item) => {
          expect(Immutable.Record.isRecord(item)).toBe(true);
        });
      });
    });

    describe('stores', () => {
      const { stores } = application;

      it('is a list of pages', () => {
        expect(Immutable.List.isList(stores)).toBe(true);
      });

      it('creates one page per path', () => {
        expect(stores.size).toBe(1);
      });

      it('each item in the list is a Store instance', () => {
        stores.forEach((item) => {
          expect(Immutable.Record.isRecord(item)).toBe(true);
        });
      });
    });

    describe('sources', () => {
      const { sources } = application;

      it('is a list of sources', () => {
        expect(Immutable.List.isList(sources)).toBe(true);
      });

      it('creates one page per source', () => {
        expect(sources.size).toBe(1);
      });

      it('each item in the list is a Source instance', () => {
        sources.forEach((item) => {
          expect(Immutable.Record.isRecord(item)).toBe(true);
        });
      });
    });
  });
});
