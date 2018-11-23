import * as Immutable from 'immutable';
import { ISelectAPI } from 'types';

/**
 * Page property select API.
 */
export const SelectAPI = Immutable.Record<ISelectAPI>({
  select: Immutable.Record({})(),
  source: Immutable.Record({})()
});
