import * as Immutable from 'immutable';
import * as Record from '../Source';

describe('Record: Source', () => {
  describe('Source', () => {
    const { Source } = Record;

    const instance = Source();

    describe('defaults', () => {
      it('has correct default action', () => {
        expect(Immutable.Map.isMap(instance.action)).toBe(true);
      });

      it('has correct default name', () => {
        expect(instance.name).toBe('uncategorized');
      });
    });
  });
});
