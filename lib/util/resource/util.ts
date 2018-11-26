import * as fp from 'lodash/fp';
import { ISchema } from 'types';

/**
 *
 */
export function constructInto(model, ...funcs) {
  return (data) => {
    return;
  }
}

/**
 * A schema type.
 */
export enum SchemaType {
  Source = 'source',
  Store = 'store',
  Page = 'page'
}

/**
 * Given a resource bundle get a specific schema type.
 *
 * @param type The bundle type to get.
 * @param bundle A resource bundle.
 * @return The schema type.
 */
export function unpack(
  type: SchemaType.Source | SchemaType.Store,
  bundle: ISchema.ResourceBundle<any>
): ISchema.Stores | ISchema.Sources {
  return fp.reduce.convert({ cap: false })((
    acc: object,
    value,
    namespace: string
  ) => {
    return fp.set(namespace, fp.getOr({}, type, value), acc);
  }, {}, bundle);
}
