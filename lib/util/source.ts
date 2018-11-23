import * as Immutable from 'immutable';
import {
  IInstance,
  ISchema
} from 'types';

/**
 * Convert a user defined page into an application Page.
 *
 * @param page A user defined page.
 * @return A page instance.
 */
export function resolveSource(
  schema: ISchema.Page<any>,
  name: string
): IInstance.Page {
  return;
}
