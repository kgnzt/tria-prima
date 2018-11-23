import * as Immutable from 'immutable';
import {
  IApplication,
  IInstance
} from 'types';

/**
 * A Tria Prima application.
 */
export const Application = Immutable.Record<IApplication>({
  pages: Immutable.List<IInstance.Page>(),
  sources: Immutable.List<IInstance.Source>(),
  stores: Immutable.List<IInstance.Store>()
});
