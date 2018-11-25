import * as fp from 'lodash/fp';
import {
  BundleType,
  ISchema
} from 'types';

import { ResourceStore } from '../record';

export interface IResourceOptions<T> {
  slug: string;
  model: T,
  path: string;
}

{
  user: {
    store: 
    source
  }
};

/**
 * Given a resource bundle get a specific schema type.
 *
 * @param type The bundle type to get.
 * @param bundle A resource bundle.
 * @return The schema type.
 */
export function unpack(
  type: BundleType.Source | BundleType.Store,
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

/**
 * Create a resource bundle.
 *
 * @param type The resource name.
 * @return A resurce bundle.
 */
export function resource<T>(
  type: string,
  {
    model,
    path,
    slug
  }: IResourceOptions<T>
): IResourceBundle<T> {
  const into = cstruct(model);

  return {
    source: {
      [type]: {
        /**
         * Find all resources.
         */
        find(action, {
          params
        }: {
          params: object
        }) {
          return service({
            method: 'get',
            path: `${opts.path}`,
            params
          }).then(into(action.get(type).received));
        },

        /**
         * Find a resource by id.
         */
        findById(action, {
          id,
          params
        }: {
          id: string;
          params: object;
        }) {
          return service({
            method: 'get',
            path: `${opts.path}`,
            params
          }).then(into(action.get(type).received));
        }
      }
    },
    store: {
      [type] {
        action: {
          received

        },
        select: {
          // selectCurrentId,
          // selectCurrent,
          // selectLocal,
        },
        store: ResourceStore<T>()
      );
    }
  };
}
