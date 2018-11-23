import * as Immutable from 'immutable';
import * as fp from 'lodash/fp';
import { IAction } from 'types';

/**
 * An action.
 */
export const Action = Immutable.Record<IAction<any, any>>({
  reducer: fp.identity,
  name: 'untitled'
});
