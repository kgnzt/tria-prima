import * as Immutable from 'immutable';
import * as Record from '../ResourceStore';

describe('Record: ResourceStore', () => {
  describe('ResourceStore', () => {
    const { ResourceStore } = Record;

    const instance = ResourceStore();

    describe('defaults', () => {
      it('has correct default server', () => {
        expect(Immutable.Map.isMap(instance.server)).toBe(true);
        expect(instance.store.resource).toBe(0);
      });
  
      it('has correct default local', () => {
        expect(Immutable.Map.isMap(instance.local)).toBe(true);
        expect(instance.action.local).toBe(0);
      });
    });
  });
});
