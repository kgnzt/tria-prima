import * as Immutable from 'immutable';
import * as parsePath from 'parse-path';
import { IInstance } from 'types';

import { Query } from '../record';

/**
 * Create a query instance.
 *
 * @param location The current browser location.
 * @reteurn A query instance.
 */
export function createQuery(
  location: any = window.location.href
): IInstance.Query {
  const path = parsePath(location);
  const params = Immutable.Map<string, string>(route.test(path.pathname) as any);

  return Query({
    params
  });
}
