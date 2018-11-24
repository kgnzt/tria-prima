import * as Immutable from 'immutable';
import * as fp from 'lodash/fp';
import {
  ISource,
  ISourceAction
} from 'types';

/**
 * A Source.
 */
export const Source = Immutable.Record<ISource>({
  action: Immutable.Map<string, ISourceAction>(),
  name: 'uncategorized'
});
