import * as Immutable from 'immutable';
import { IAPI } from 'types';

/**
 * Client API.
 */
export const API = Immutable.Record<IAPI>({
  action: Immutable.Record({})(),
  select: Immutable.Record({})(),
  source: Immutable.Record({})(),
  store: Immutable.Record({})()
});
