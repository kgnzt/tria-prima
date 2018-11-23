import * as Immutable from 'immutable';
import * as React from 'react';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import {
  Route,
  Router as ReactRouter
} from 'react-router';
import { createBrowserHistory } from 'history';

import {
  API,
  Page,
  Query
} from '../../record';
import * as Util from '../page';

describe('Util: Page', () => {
  const api = API({});
  const history = createBrowserHistory();

  const page: any = Page({
    path: '/foo/:fooId/bar/:barId',
    setup: sinon.stub()
  });

  afterEach(() => {
    page.setup.reset()
  });

  describe('resolvePage', () => {
    const { resolvePage } = Util;

    const page = {
      meta: {
        title: 'foo'
      },
      selector: () => 'a',
      setup: () => ''
    };
    const instance = resolvePage(page, '/user/:userId');

    it('passes props to Page', () => {
      expect(instance.setup).toBe(page.setup);
    });

    it('generates a page instance', () => {
      expect(instance.path).toEqual('/user/:userId');
    });
  });

  describe('onEnterPage', () => {
    const { onEnterPage } = Util;

    const result = onEnterPage(page, api, '/foo/100/bar/200');

    it('is curried', () => {
      expect(onEnterPage(page, api)).toBeInstanceOf(Function);
    });

    it('returns a function', () => {
      expect(result).toBeInstanceOf(Function);
    });

    it('calls page.setup', () => {
      result();

      expect(page.setup.called).toBe(true);
    });

    it('passes the url and api to the action', () => {
      result();

      expect(page.setup.args[0][0].equals(Query({
        params: Immutable.Map({
          foo: '100',
          bar: '200'
        })
      })));
    });

    it('forwards the api to setup', () => {
      result();

      expect(page.setup.args[0][1]).toBe(api);
    });
  });

  describe('pageToRoute', () => {
    const { pageToRoute } = Util;

    const route = pageToRoute(api, page);
    const wrapper = mount(<ReactRouter history={history}>{route}</ReactRouter>);

    it('is curried', () => {
      expect(pageToRoute(api)).toBeInstanceOf(Function);
    });

    it('correctly sets the Route path', () => {
      expect(wrapper.find(Route).prop('path')).toEqual(page.path);
    });

    it('correctly sets the Route key', () => {
      expect(wrapper.find(Route).key()).toEqual(page.path);
    });

    it('correctly handles onEnter', () => {
      const onEnter = wrapper.find(Route).prop('onEnter');

      onEnter();

      expect(page.setup.called).toBe(true);
    });

    it('connects the selector to the page component', () => {
      // TODO:
    });
  });

  describe('pagesToRouter', () => {
    const { pagesToRouter } = Util;

    const pages = Immutable.List([
      Page({
        path: '/foo/:fooId'
      }),
      Page({
        path: '/bar/:barId'
      })
    ]);

    const Router = pagesToRouter(pages, api);
    const wrapper = mount(<Router history={history}/>);

    it('creates a Route per page', () => {
      //expect(wrapper.find(Route).length).toBe(pages.size);
    });
  });
});
