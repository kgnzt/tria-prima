import * as Immutable from 'immutable';
import * as React from 'react';
import * as fp from 'lodash/fp';
import { IPage } from 'types';

import { PageMeta } from './PageMeta';

/**
 * A page.
 */
export const Page = Immutable.Record<IPage>({
  meta: PageMeta(),
  path: null,
  select: fp.identity,
  component: () => <span>Undefined component.</span>,
  setup: () => {
    return Promise.resolve()
  }
});
