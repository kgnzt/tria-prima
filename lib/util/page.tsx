import * as React from 'react';
import * as Immutable from 'immutable';
import * as fp from 'lodash/fp';
import Path from 'path-parser'
import * as queryString from 'query-string';
import * as parsePath from 'parse-path';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Route,
  Router,
  Switch
} from 'react-router';
import {
  IInstance,
  INavigate,
  IPageEnter,
  ISchema
} from 'types';

import {
  apiToSelectAPI,
  apiToSetupAPI
} from '../record/util';
import {
  API,
  Page,
  PageMeta,
  Query
} from '../record';

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
  console.log(page, api, location);

  const path = parsePath(location);
  const params = Immutable.Map<string, string>(route.test(path.pathname) as any);
  const query = Query({
    params
  });

  return page.setup(query, api);
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
 * Determine if a Page's path is global.
 *
 * @param page The page to check for globalness.
 * @return Determination.
 */
function isGlobal(page: IInstance.Page): boolean {
  return page.path === '*';
}

/**
 * Determine if a Page's path is the application root.
 *
 * @param page The page to check for rootness.
 * @return Determination.
 */
function isRoot(page: IInstance.Page): boolean {
  return page.path === '/';
}

/**
 * Create a navigation function.
 *
 * @param history The browser history.
 * @return A navigate function.
 */
// TODO: test
function toNavigate(history: any): INavigate {
  return (path: string, params: object = {}): any => {
    return () => {
      return history.push(path, queryString.stringify(params));
    };
  };
}

/**
 * Create a container for a Route.
 */
export function containerFor(
  page: IInstance.Page,
  api: IInstance.API
): any {
  return class extends React.Component<any, any> {
    componentDidMount() {
      console.log('HERE');
      console.log('HERE');
      onEnterPage(page, apiToSetupAPI(api));
    }
  
    render() {
      return (
        <page.component {...this.props} />
      );
    }
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
  return (
    <Route
      exact={isRoot(page)}
      key={page.path}
      path={page.path}
      component={connect((state) => {
        /**
         * Default selectors.
         */
        const defaults = {
          navigate: () => {
            return toNavigate(api.history)
          }
        };

        return createStructuredSelector(Object.assign(
          defaults,
          page.select(api)
        ))(state);
      })(containerFor(page, api))}
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
  // TODO: better home / set. Maybe set if none provided?
  const ap = api.set('history', history);
  console.log(api);

  return ({ history }) => (
    <Router
      history={api.history}
    >
      <Switch>
        {pages.map(pageToRoute(api))}
      </Switch>
    </Router>
  );
}
