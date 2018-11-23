import * as Immutable from 'immutable';
import * as Record from '../SelectAPI';

describe('Record: SelectAPI', () => {
  describe('SelectAPI', () => {
    const { SelectAPI } = Record;

    const instance = SelectAPI();

    describe('defaults', () => {
      it('has correct default select', () => {
        expect(Immutable.Record.isRecord(instance.select)).toBe(true);
      });

      it('has correct default source', () => {
        expect(Immutable.Record.isRecord(instance.source)).toBe(true);
      });
    });
  });
});
