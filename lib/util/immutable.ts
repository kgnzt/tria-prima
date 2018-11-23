import * as fp from 'lodash/fp';

/**
 * Given an objet generate immutable defaults for a Record with the same
 * schema.
 *
 * @param source The object to create defaults for.
 * @param default The default value for each key.
 * @return A defaults object.
 */
export function objectToRecordDefaults(
  source: object,
  defaultValue: any = null
): object {
  return fp.reduce.convert({ cap: false })((
    acc: object,
    value: any,
    key: string
  ) => {
    return fp.set(key, defaultValue, acc);
  }, {}, source);
}
