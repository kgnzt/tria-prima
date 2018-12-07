import * as Immutable from 'immutable';
import { IResourceStore } from 'types';

/**
 * Standard resource storage.
 */
export const ResourceStore = Immutable.Record<IResourceStore<any>>({
  server: Immutable.Map<string, any>(),
  local: Immutable.Map<string, any>()
});
