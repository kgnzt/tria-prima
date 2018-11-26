import {
  ISchema,
  IResourceBundleOptions
} from 'types';

import { constructInto } from './util';
import { ResourceStore } from '../../record';

/**
 * Create a rest resource bundle.
 *
 * @param options Resource bundle options.
 * @return A resurce bundle.
 */
export function REST<T>({
  model,
  path,
  slug,
  type
}: IResourceBundleOptions<T>): ISchema.ResourceBundle<T> {
  const into = constructInto(model);

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
          return Promise.resolve();
          /*
          return service({
            method: 'get',
            path: `${path}`,
            params
          }).then(into(action.get(type).received));
          */
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
          return Promise.resolve();
          /*
          return service({
            method: 'get',
            path: `${.path}`,
            params
          }).then(into(action.get(type).received));
          */
        }
      }
    },
    store: {
      [type]: {
        action: {
        },
        select: {
          // selectCurrentId,
          // selectCurrent,
          // selectLocal,
        },
        store: ResourceStore() as any
      }
    }
  };
}
