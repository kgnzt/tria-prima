import * as Immutable from 'immutable';
import * as Record from '../Action';

describe('Record: Action', () => {
  describe('Store', () => {
    const { Action } = Record;

    const instance = Action();

    describe('defaults', () => {
      it('has correct default reduer', () => {
        expect(instance.reducer('a')).toEqual('a');
      });

      it('has correct default name', () => {
        expect(instance.name).toBe('untitled');
      });
    });
  });
});
