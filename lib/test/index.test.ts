import * as index from '../';

describe('Index', () => {
  it('exports required', () => {
    [
      'Application',
      'SchemaType',
      'resource',
      'unpack',
      'constructInto'
    ].forEach(key => expect(index).toHaveProperty(key));
  });
});
