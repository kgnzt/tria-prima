import * as fp from 'lodash/fp';
import * as Immutable from 'immutable';
import {
  IInstance,
  ISchema,
  ISourceAction
} from 'types';

import { Source } from '../record';

/**
 * Convert a user defined source into an application Source.
 *
 * @param page A source schema.
 * @return A source instance.
 */
export function resolveSource(
  schema: ISchema.Source<any>,
  name: string
): IInstance.Source {
  return Source({
    name,
    action: fp.reduce.convert({ cap: false })((
      acc: Immutable.Map<string, ISourceAction>,
      action: ISourceAction,
      name: string
    ) => {
      return acc.set(name, action);
    }, Immutable.Map<string, ISourceAction>(), schema)
  });
}
