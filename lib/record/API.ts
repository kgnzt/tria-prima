import * as Immutable from 'immutable';
import { IAPI } from 'types';
import { createBrowserHistory } from 'history';

/**
 * Client API.
 */
export const API = Immutable.Record<IAPI>({
  action: Immutable.Record({})(),
  history: createBrowserHistory(),
  select: Immutable.Record({})(),
  source: Immutable.Record({})(),
  store: Immutable.Record({})()
});
