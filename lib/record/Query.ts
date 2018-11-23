import * as Immutable from 'immutable';
import { IQuery } from 'types';

/**
 * Page query.
 */
export const Query = Immutable.Record<IQuery>({
  params: Immutable.Map<string, string>()
});
