import * as Immutable from 'immutable';
import { IResourceStore } from 'types';

/**
 * Standard resource storage.
 */
export const Store<T> = Immutable.Record<IResourceStore<T>>({
  resource: Immutable.Map<string, T>(),
  local: Immutable.Map<string, T>()
});
