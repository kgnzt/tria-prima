import * as fp from 'lodash/fp';
import * as Immutable from 'immutable';
import {
  IInstance,
  IActionTrigger,
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
  schema: ISchema.Source,
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

export function dork(
  actions: Immutable.Map<string, ISourceAction>,
  reducer: any,
): Immutable.Map<string, IActionTrigger> {
  return actions.map((action: ISourceAction) => {
    return (payload: any): any => {
      return action(reducer, payload);
    };
  });
};

// TODO: make immutable record
// TODO: types
export function sourcesToSourceApi(
  sources: Immutable.List<IInstance.Source>,
  reducer: any,
): IInstance.Source {
  return sources.reduce((acc: object, source: IInstance.Source) => {
    return fp.set(source.name, dork(source.action, reducer).toJS(), acc);
  }, {});
}
