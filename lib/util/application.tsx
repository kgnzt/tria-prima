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

import { Root } from '../component';
import {
  API,
  Application as ApplicationRecord,
  RootStore
} from '../record';
import {
  pagesToRouter,
  resolvePage
} from './page';
import { resolveSource } from './source';
import { resolveStore } from './store';
import { objectToRecordDefaults } from './immutable';
import {
  storeToActionTriggers,
  storesToReducer,
  storesToSelectors
} from './store';

/**
 * Convert client defined paths into a list of pages.
 *
 * @param paths Client defined paths.
 * @return A list of pages.
 */
export function pathsToPages(
  paths: ISchema.Paths
): Immutable.List<IInstance.Page> {
  return fp.reduce.convert({ cap: false })((
    acc: Immutable.List<IInstance.Page>,
    page: ISchema.Page<any>,
    path: string
  ) => {
    return acc.push(resolvePage<any>(page, path));
  }, Immutable.List<IInstance.Page>(), paths);
}

/**
 * Convert client defined stores into a store instance.
 *
 * @param paths Client defined stores.
 * @return A store instance.
 */
export function resolveStores(stores: ISchema.Stores): Immutable.Record<any> {
  return fp.reduce.convert({ cap: false })((
    acc: Immutable.Record<any>,
    store: ISchema.Store<any>,
    name: string
  ) => {
    return acc.set(name, resolveStore(store));
  }, Immutable.Record<any>(objectToRecordDefaults(stores)), stores);
}

/**
 * Convert client defined sources into a source instance.
 *
 * @param paths Client defined sources.
 * @return A source instance.
 */
export function resolveSources(
  sources: ISchema.Sources
): Immutable.Record<any> {
  return fp.reduce.convert({ cap: false })((
    acc: Immutable.Record<any>,
    source: ISchema.Source<any>,
    name: string
  ) => {
    return acc.set(name, resolveSource(source, name));
  }, Immutable.Record<any>(objectToRecordDefaults(sources)), sources);
}

/**
 * Convert an application object (client supplied) into an Application object.
 *
 * @param application An application object.
 * @return Application instance.
 */
export function resolveApplication(
  schema: ISchema.Application
): IInstance.Application {
  return ApplicationRecord({
    pages: pathsToPages(schema.path),
    stores: resolveStores(schema.store),
    sources: resolveSources(schema.source)
  });
}
