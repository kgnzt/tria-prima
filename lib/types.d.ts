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

/**
 * A source function.
 */
export type ISourceAction = (action: any, payload: any) => Promise<any>;

/**
 * Schema definitions.
 */
export module ISchema {
  /**
   * Client defined store.
   */
  export interface Store<T> {
    store: T;
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
    select?(api?: IInstance.SelectAPI): P;
    component?: React.SFC<any>;
    setup?: IPageEnter;
  }

  /**
   * Client defined source.
   */
  export interface Source {
    [name: string]: ISourceAction;
  }

  /**
   * Client defined sources.
   */
  export interface Sources {
    [route: string]: Source;
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

  /**
   * A resource bundle.
   */
  export interface ResourceBundle<T> {
    /**
     * Standardized source for the resource.
     */
    source: Source,
  
    /**
     * Standardized store for the resource.
     */
    // Need way to pass T to ResourceStore instance.
    store: Store<IInstance.ResourceStore>,
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
// TODO: types
export interface IAPI {
  action: any;
  store: any;
  select: any;
  source: any;
  history: any;
}

/**
 * A source.
 */
export interface ISource {
  name: string;
  action: Immutable.Map<string, ISourceAction>;
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
  select: Immutable.Map<string, any>;
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
 * A resource store.
 */
export interface IResourceStore<T> {
  server: Immutable.Map<string, T>;
  local: Immutable.Map<string, T>;
}

/**
 * Options for constructing a resource bundle.
 */
export interface IResourceBundleOptions<T> {
  type: string;
  slug: string;
  model: T,
  path: string;
  key: string;
}

/**
 * Function that generates a navigation function.
 */
export type INavigate = (path: string, params: object) => Function;

/**
 * Default root component properties.
 */
export interface IPageProps {
  navigate: INavigate;
}

/**
 * Instance definitions.
 */
export module IInstance {
  export type API = RecordOf<IAPI>;
  export type Action = RecordOf<IAction<any, any>>;
  export type Application = RecordOf<IApplication>;
  export type Page = RecordOf<IPage>;
  export type PageMeta = RecordOf<IPageMeta>;
  export type Query = RecordOf<IQuery>;
  export type RootStore = RecordOf<IRootStore>;
  export type SelectAPI = RecordOf<ISelectAPI>;
  export type SetupAPI = RecordOf<ISetupAPI>;
  export type Source = RecordOf<ISource>;
  export type Store = RecordOf<IStore<any>>;
  export type StoreList = Immutable.List<IStore<any>>;

  export type ResourceStore = RecordOf<IResourceStore<any>>;
}
