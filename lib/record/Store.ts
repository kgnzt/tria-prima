import * as Immutable from 'immutable';
import {
  IStore,
  IActionTrigger
} from 'types';

/**
 * A store.
 */
export const Store = Immutable.Record<IStore<any>>({
  store: Immutable.Map(),
  name: 'uncategorized',
  action: Immutable.Map<string, IActionTrigger>()
});
