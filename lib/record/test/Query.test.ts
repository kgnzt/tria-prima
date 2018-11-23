import * as Immutable from 'immutable';
import * as React from 'react';

import * as Record from '../Query';

describe('Record: Query', () => {
  describe('Query', () => {
    const { Query } = Record;

    const instance = Query();

    describe('defaults', () => {
      it('has correct default params', () => {
        expect(Immutable.Map.isMap(instance.params)).toBe(true);
        expect(instance.params.size).toBe(0);
      });
    });
  });
});
