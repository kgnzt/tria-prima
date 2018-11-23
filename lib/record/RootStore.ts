import * as Immutable from 'immutable';
import { IRootStore } from 'types';

/**
 * Root of the store tree.
 */
export const RootStore = Immutable.Record<IRootStore>({
  resource: Immutable.Map<string, any>()
});
