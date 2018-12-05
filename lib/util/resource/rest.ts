import * as Immutable from 'Immutable';
import { createSelector } from 'reselect';
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

  /**
   * Select the current resource id.
   */
  const selectCurrentId = (state): string => {
    return 'a';
  };

  /**
   * Select the resource store.
   */
  const selectStore = (state) => {
    return state.get(type)
  }

  /**
   * Select the current server states.
   */
  const selectServer = createSelector(
    [selectStore],
    (store): Immutable.Map<string, T> => {
      return store.get(type).server;
    }
  );

  /**
   * Select the current local states.
   */
  const selectLocal = createSelector(
    [selectStore],
    (store): Immutable.Map<string, T> => {
      return store.get(type).local;
    }
  );

  /**
   * Select the current server state of a resource.
   */
  const selectCurrent = createSelector(
    [selectServer, selectCurrentId],
    (server: Immutable.Map<string, T>, id: string): T => {
      return server.get(id);
    }
  );

  /**
   * Select the current local state of a resource.
   */
  const selectCurrentLocal = createSelector(
    [selectLocal, selectCurrentId],
    (local: Immutable.Map<string, T>, id: string): T => {
      return local.get(id);
    }
  );

  /**
   * Select the current server state of a resource.
   */
  const selectSetLocal = createSelector(
    [selectCurrentLocal],
    (current: T) => {
      return
    }
  );

  return {
    source: {
      [type]: {
        /**
         * Create a resources.
         */
        create(action, {
          body,
          params,
        }: {
          body?: object,
          params?: object,
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
          received(state, payload) {
            return state;
          }
        },
        select: {
          current: selectCurrent,
          currentId: selectCurrentId,
          currentLocal: selectCurrentLocal,
          local: selectLocal,
          server: selectServer,
          setLocal: selectSetLocal,
        },
        store: ResourceStore() as any
      }
    }
  };
}
