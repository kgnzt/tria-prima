import * as Immutable from 'immutable';
import * as Record from '../Application';

describe('Record: Application', () => {
  describe('Application', () => {
    const { Application } = Record;

    const instance = Application();

    describe('defaults', () => {
      it('has correct default pages', () => {
        expect(Immutable.List.isList(instance.pages)).toBe(true);
        expect(instance.pages.size).toBe(0);
      });
  
      it('has correct default sources', () => {
        expect(Immutable.List.isList(instance.sources)).toBe(true);
        expect(instance.sources.size).toBe(0);
      });

      it('has correct default stores', () => {
        expect(Immutable.List.isList(instance.stores)).toBe(true);
        expect(instance.stores.size).toBe(0);
      });
    });
  });
});
