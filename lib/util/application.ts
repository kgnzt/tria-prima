import * as Immutable from 'immutable';
import * as fp from 'lodash/fp';
import {
  IInstance,
  ISchema
} from 'types';

import { Application as ApplicationRecord } from '../record';
import { resolvePage } from './page';
import { resolveSource } from './source';
import { resolveStore } from './store';

/**
 * Convert schemas into a list of resolved instances.
 *
 * @param schemas The schemas to create a list for.
 * @param resolve Given a schema and its name resolve an instance.
 * @return A list of resolved instances.
 */
export function schemasToList<T, S>(
  schemas: {
    [name: string]: object;
  },
  resolve: (schema: S, name: string) => T
): Immutable.List<T> {
  return fp.reduce.convert({ cap: false })((
    acc: Immutable.List<T>,
    schema: S,
    path: string
  ) => {
    return acc.push(resolve(schema, path));
  }, Immutable.List<T>(), schemas);
}

/**
 * Convert an application schema into an Application instance.
 *
 * @param schema An application schema.
 * @return Application instance.
 */
export function schemaToApplication(
  schema: ISchema.Application
): IInstance.Application {
  return ApplicationRecord({
    pages: schemasToList<
      IInstance.Page,
      ISchema.Page<any>
    >(schema.path, resolvePage),

    stores: schemasToList<
      IInstance.Store,
      ISchema.Store<any>
    >(schema.store, resolveStore),

    sources: schemasToList<
      IInstance.Source,
      ISchema.Source
    >(schema.source, resolveSource)
  });
}
