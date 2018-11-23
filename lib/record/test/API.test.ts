import * as Immutable from 'immutable';
import * as Record from '../API';

describe('Record: API', () => {
  describe('API', () => {
    const { API } = Record;

    const instance = API();

    describe('defaults', () => {
      it('has correct default action', () => {
        expect(Immutable.Record.isRecord(instance.action)).toBe(true);
      });

      it('has correct default source', () => {
        expect(Immutable.Record.isRecord(instance.source)).toBe(true);
      });

      it('has correct default store', () => {
        expect(Immutable.Record.isRecord(instance.store)).toBe(true);
      });

      it('has correct default select', () => {
        expect(Immutable.Record.isRecord(instance.select)).toBe(true);
      });
    });
  });
});
