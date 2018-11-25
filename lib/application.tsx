import * as React from 'react';
import * as fp from 'lodash/fp';
import * as Immutable from 'immutable';
import {
  Dispatch,
  Store as ReduxStore,
  createStore
} from 'redux';
import {
  IInstance,
  ISchema
} from 'types';
import { createBrowserHistory } from 'history';

import { Root } from './component';
import {
  API,
  Application as ApplicationRecord,
  RootStore
} from './record';
import {
  pagesToRouter,
  schemaToApplication,
  storesToActions,
  storesToReducer,
  storesToSelectors
} from './util';

/**
 * Create an application.
 *
 * @param application An application schema.
 * @param opts Application options.
 * @return An application component.
 */
export function Application(
  application: ISchema.Application,
  opts?: {
    /**
     * The initial store.
     */
    store: any
  }
): {
  Component: React.SFC;
  render();
} {
  const options = fp.defaults({
    store: RootStore()
  }, opts);

  const app: IInstance.Application = schemaToApplication(application);

  // Setup store.
  const reducer = storesToReducer(app.stores);
  const store: ReduxStore = createStore(reducer, options.store);

  // Setup sources and actions.
  const action = storesToActions(app.stores, store.dispatch);
  const api: IInstance.API = API({
    source: app.sources,
    store: storesToSelectors(app.stores),
    select: storesToSelectors(app.stores),
    action
  });
  const history = createBrowserHistory();
  const Router: any = pagesToRouter(app.pages, api);
  const Component = () => (
    <Root
      store={store}
    >
      <Router
        history={history}
      />
    </Root>
  );

  return {
    Component,
    render: (opts: { id?: string }) => {
      const options = fp.defaults(opts, {
        id: 'app'
      });

      ReactDOM.render(<Component />, document.getElementById(options.id));
    }
  };
}
