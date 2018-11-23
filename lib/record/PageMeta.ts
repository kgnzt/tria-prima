import * as Immutable from 'immutable';
import { IPageMeta } from 'types';

/**
 * Page meta data.
 */
export const PageMeta = Immutable.Record<IPageMeta>({
  title: 'Untitled',
  tags: Immutable.List([])
});
