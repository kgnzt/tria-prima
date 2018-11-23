import * as React from 'react';
import * as Immutable from 'immutable';
import { RecordOf } from 'immutable';

/**
 * URL parameters.
 */
export interface IParams {
  url: string;
  params: {
    [key: string]: string
  }
}

/**
 * A client defined store reducer.
 */
export type IReducer<S, P> = (state: S, payload?: P) => S;

/**
 * A client defined page entry handler.
 */
export type IPageEnter = (
  query: IInstance.Query,
  api: IInstance.SetupAPI
) => Promise<any>;

/**
 * An action trigger.
 */
export type IActionTrigger = (payload: any) => any;

// todo:
//export type IService = (store): Promise<any> => any;

/**
 * Schema definitions.
 */
export module ISchema {
  /**
   * Client defined store.
   */
  export interface Store<T> {
    store: T;
    name: string;
    action?: {
      [name: string]: IReducer<T, any>;
    };
    select?: {
      [name: string]: (store: T) => any;
    };
  }

  /**
   * Client defined page meta.
   */
  export interface PageMeta {
    title?: string;
    tags?: string[];
  }
  
  /**
   * Client defined page.
   */
  export interface Page<P> {
    meta?: PageMeta;
    select?(): P;
    component?: React.SFC<any>;
    setup?: IPageEnter;
  }

  /**
   * Client defined source.
   */
  export interface Source<T> {
    [name: string]: (store: T) => Promise<any>;
  }

  /**
   * Client defined sources.
   */
  export interface Sources {
    [route: string]: Source<any>;
  }
  
  /**
   * Client defined stores.
   */
  export interface Stores {
    [route: string]: Store<any>;
  }
  
  /**
   * Client defined paths.
   */
  export interface Paths {
    [route: string]: Page<any>;
  }

  /**
   * Client defined application.
   */
  export interface Application {
    source: Sources;
    store: Stores;
    path: Paths;
  }
}

/**
 * Page meta.
 */
export interface IPageMeta {
  title?: string;
  tags?: Immutable.List<string>;
}

/**
 * A Tria Prima application.
 */
export interface IApplication {
  pages: Immutable.List<IInstance.Page>;
  sources: Immutable.List<IInstance.Source>;
  stores: Immutable.List<IInstance.Store>;
}

/**
 * API made available to enter methods.
 */
export interface ISelectAPI {
  select: any;
  source: any;
}

/**
 * API made available to enter methods.
 */
export interface ISetupAPI {
  action: any;
  store: any;
  source: any;
}

/**
 * Complete client API.
 */
export interface IAPI {
  action: any;
  store: any;
  select: any;
  source: any;
}

/**
 * A source.
 */
export interface ISource {
  // TODO: define
}

/**
 * A page.
 */
export interface IPage {
  path: string;
  meta: IInstance.PageMeta;
  select?: any;
  component?: React.SFC<any>;
  setup?: IPageEnter;
}

/**
 * A page.
 */
export interface IQuery {
  params: Immutable.Map<string, string>;
}

/**
 * A store.
 */
export interface IStore<T> {
  store: T;
  name: string;
  action: Immutable.Map<string, IInstance.Action>;
}

/**
 * An action.
 */
export interface IAction<S, P> {
  reducer: IReducer<S, P>;
  name: string;
}

/**
 * The root store tree.
 */
export interface IRootStore {
  resource: Immutable.Map<string, any>;
}

/**
 * Instance definitions.
 */
export module IInstance {
  export type API = RecordOf<IAPI>;
  export type SelectAPI = RecordOf<ISelectAPI>;
  export type SetupAPI = RecordOf<ISetupAPI>;
  export type Action = RecordOf<IAction<any, any>>;
  export type Application = RecordOf<IApplication>;
  export type Page = RecordOf<IPage>;
  export type PageMeta = RecordOf<IPageMeta>;
  export type Query = RecordOf<IQuery>;
  export type RootStore = RecordOf<IRootStore>;
  export type Source = RecordOf<ISource>;
  export type Store = RecordOf<IStore<any>>;
  export type StoreList = Immutable.List<IStore<any>>;
}
