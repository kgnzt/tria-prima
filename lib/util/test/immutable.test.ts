import * as Util from '../immutable';

describe('Util: Immutable', () => {
  describe('objectToRecordDefaults', () => {
    const { objectToRecordDefaults } = Util;

    const object = {
      ding: 'dong',
      foo: 'bar'
    };
    const result = objectToRecordDefaults(object);

    it('correctly uses null by default', () => {
      expect(objectToRecordDefaults(object)).toEqual({
        ding: null,
        foo: null
      });
    });

    it('allows for a custom default', () => {
      expect(objectToRecordDefaults(object, 'a')).toEqual({
        ding: 'a',
        foo: 'a'
      });
    });
  });
});
