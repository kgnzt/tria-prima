import * as Immutable from 'immutable';
import * as Record from '../SetupAPI';

describe('Record: SetupAPI', () => {
  describe('SetupAPI', () => {
    const { SetupAPI } = Record;

    const instance = SetupAPI();

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
    });
  });
});
