import * as Immutable from 'immutable';

import * as Record from '../RootStore';

describe('Record: RootStore', () => {
  describe('RootStore', () => {
    const { RootStore } = Record;

    const instance = RootStore();

    describe('defaults', () => {
      it('has correct default resoure', () => {
        expect(Immutable.Map.isMap(instance.resource)).toBe(true);
        expect(instance.resource.size).toBe(0);
      });
    });
  });
});
