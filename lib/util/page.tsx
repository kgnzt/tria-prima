import * as React from 'react';
import * as Immutable from 'immutable';
import * as fp from 'lodash/fp';
import Path from 'path-parser'
import * as parsePath from 'parse-path';
import { connect } from 'react-redux';
import {
  apiToSelectAPI,
  apiToSetupAPI
} from '../record/util';
import {
  Route,
  Router,
  Switch
} from 'react-router';
import {
  API,
  Page,
  PageMeta,
  Query
} from '../record';
import {
  IInstance,
  IPageEnter,
  ISchema
} from 'types';

/**
 * Convert a user defined page into an application Page.
 *
 * @param page A user defined page.
 * @return A page instance.
 */
export function resolvePage<P>(
  schema: ISchema.Page<P>,
  path: string
): IInstance.Page {
  return Page({
    ...schema,
    meta: schema.meta
      ? PageMeta({
          tags: schema.meta.tags ? Immutable.List(schema.meta.tags) : Immutable.List(),
          title: schema.meta.title
        })
      : PageMeta(),
    path
  });
}

/**
 * Generates a function to be called when a page is entered.
 *
 * @param page The page being entered.
 * @param api A setup API instance.
 * @param location The browser current location.
 * @return An on enter function.
 */
export function onEnterPage(
  page: IInstance.Page,
  api: IInstance.SetupAPI,
  location: any = window.location.href
) {
  const route = Path.createPath(page.path);

  return () => {
    const path = parsePath(location);
    const params = Immutable.Map<string, string>(route.test(path.pathname) as any);
    const query = Query({
      params
    });

    return page.setup(query, api);
  }
}

/**
 * Convert a page into a React route component.
 *
 * @param api An API instance.
 * @param page A page.
 * @return A React route component.
 */
export function mapStateToProps() {
  return (api) => {
  };
}

/**
 * Convert a page into a React route component.
 *
 * @param api An API instance.
 * @param page A page.
 * @return A React route component.
 */
export const pageToRoute = fp.curry((
  api: IInstance.API,
  page: IInstance.Page
): JSX.Element => {
  if (page.path === '/') {
    console.log('xoomie');
    console.log('xoomie');
    console.log('xoomie');
    console.log('xoomie');
  }

  return (
    <Route
      exact={page.path === '/'}
      key={page.path}
      path={page.path}
      component={connect(() => {
        console.log('s');
        return {};
      })(page.component)}
      onEnter={onEnterPage(page, apiToSetupAPI(api))}
    />
  );
});

/**
 * Convert pages into a React router component.
 *
 * @param pages A list of pages.
 * @param api The application api.
 * @return A React routing component.
 */
export function pagesToRouter(
  pages: Immutable.List<IInstance.Page> = Immutable.List<IInstance.Page>(),
  api: IInstance.API = API()
): React.SFC<{
  history: any;
}> {
  console.log(pages, api);
  return ({ history }) => (
    <Router
      history={history}
    >
      <Switch>
        {pages.map(pageToRoute(api))}
      </Switch>
    </Router>
  );
}
