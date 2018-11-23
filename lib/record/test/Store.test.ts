import * as Immutable from 'immutable';
import * as Record from '../Store';

describe('Record: Store', () => {
  describe('Store', () => {
    const { Store } = Record;

    const instance = Store();

    describe('defaults', () => {
      it('has correct default store', () => {
        expect(Immutable.Map.isMap(instance.store)).toBe(true);
        expect(instance.store.size).toBe(0);
      });
  
      it('has correct default name', () => {
        expect(instance.name).toEqual('uncategorized');
      });

      it('has correct default action', () => {
        expect(Immutable.Map.isMap(instance.action)).toBe(true);
        expect(instance.action.size).toBe(0);
      });
    });
  });
});
