import * as Immutable from 'immutable';

import * as Record from '../PageMeta';

describe('Record: PageMeta', () => {
  describe('PageMeta', () => {
    const { PageMeta } = Record;

    const instance = PageMeta();

    describe('defaults', () => {
      it('has correct default title', () => {
        expect(instance.title).toEqual('Untitled');
      });

      it('has correct default tags', () => {
        expect(Immutable.List.isList(instance.tags)).toBe(true);
        expect(instance.tags.size).toBe(0);
      });
    });
  });
});
