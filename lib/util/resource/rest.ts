import * as Immutable from 'Immutable';
import * as fp from 'lodash/fp';
import { createSelector } from 'reselect';
import {
  ISchema,
  IResourceBundleOptions
} from 'types';

import { constructInto } from './util';
import { listize } from '../';
import { ResourceStore } from '../../record';

/**
 * Create a rest resource bundle.
 *
 * @param options Resource bundle options.
 * @return A resurce bundle.
 */
export function REST<T>({
  key,
  model,
  path,
  slug,
  type,
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
      },
    },
    store: {
      action: {
        /**
         * Add resource(s) to the store.
         */
        received(state, payload) {
          if (fp.isNil(payload)) {
            return state;
          }

          return listize(payload).reduce((result, resource) => {
            return state.mergeIn(['server', resource.get(key)], resource);
          }, state);
        },

        /**
         * Add local resource(s) to the store.
         */
        receivedLocal(state, payload) {
          if (fp.isNil(payload)) {
            return state;
          }

          return listize(payload).reduce((result, resource) => {
            return state.mergeIn(['local', resource.get(key)], resource);
          }, state);
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
    },
  };
}
