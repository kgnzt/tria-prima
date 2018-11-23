import * as Immutable from 'immutable';
import { ISetupAPI } from 'types';

/**
 * Page setup API.
 */
export const SetupAPI = Immutable.Record<ISetupAPI>({
  action: Immutable.Record({})(),
  source: Immutable.Record({})(),
  store: Immutable.Record({})()
});
