import * as Immutable from 'immutable';
import { RecordOf } from 'immutable';
import * as UUID from 'simply-uuid';
import * as fp from 'lodash/fp';
import { ignoreActions } from 'redux-ignore';
import {
  Reducer,
  Dispatch,
  AnyAction,
  combineReducers
} from 'redux';
import {
  IInstance,
  IReducer,
  ISchema,
  IActionTrigger
} from 'types';

import {
  Action,
  Store
} from '../record';

/**
 * Key used to deliniate the store key from the action name.
 */
export const ActionDelimiter = '.';

/**
 * Convert a user defined action into an application Action.
 *
 * @param page A user defined action.
 * @param name The action name.
 * @return An action instance.
 */
export function resolveAction<S, P = any>(
  reducer: IReducer<S, P>,
  name: string
): IInstance.Action {
  return Action({ reducer, name });
}

/**
 * Convert a user defined store into an application Store.
 *
 * @param page A user defined store.
 * @return A store instance.
 */
export function resolveStore<S>(
  schema: ISchema.Store<S>,
  name: string
): IInstance.Store {
  return Store({
    ...schema,
    name,
    action: fp.reduce.convert({ cap: false })((
      acc: Immutable.Map<string, IInstance.Action>,
      reducer: IReducer<S, any>,
      name: string
    ) => {
      return acc.set(name, resolveAction(reducer, name));
    }, Immutable.Map<string, IInstance.Action>(), schema.action)
  });
}

/**
 * Convert an action definition into a unique key.
 *
 * @param name The action name.
 * @param name The store the action belongs to.
 * @return The action key.
 */
export function storeActionToType(
  action: IInstance.Action,
  store: IInstance.Store
): string {
  return `${store.name}${ActionDelimiter}${action.name}`;
}

/**
 * Create a React action trigger.
 *
 * @param dispatch A dispatch function.
 * @param action The action to create a React action for.
 * @param store The store that the action belongs to.
 * @return A React action.
 */
export function createTrigger(
  dispatch: Dispatch,
  action: IInstance.Action,
  store: IInstance.Store
): IActionTrigger {
  const type: string = storeActionToType(action, store);

  return (payload: any) => {
    return dispatch({
      type,
      payload
    });
  };
}

/**
 * Create default actions for a store.
 *
 * @param store An application store.
 * @return Action trigger defaults.
 */
export function storeToActionDefaults<T>(store: IInstance.Store): T {
  return store.action.reduce((
    acc: T,
    action: IInstance.Action
  ): T => {
    return fp.set(action.name, () => {
      throw new Error(`No action named: ${action.name}, has been defined.`);
    }, acc);
  }, {} as T);
}

/**
 * Create action triggers from a store.
 *
 * @param store An application store.
 * @param dispatch An action dispatch.
 * @return An action record for the store.
 */
export function storeToActions<T>(
  store: IInstance.Store,
  dispatch: Dispatch
): RecordOf<T> {
  return store.action.reduce((
    acc: RecordOf<T>,
    action: IInstance.Action
  ) => {
    return acc.set(action.name as any, createTrigger(dispatch, action, store) as any);
  }, Immutable.Record<T>(storeToActionDefaults<T>(store))())
}

/**
 * Create actions from application stores.
 *
 * @param store Application stores.
 * @param dispatch An action dispatch.
 * @return An application action record.
 */
export function storesToActions<T>(
  stores: IInstance.StoreList,
  dispatch: Dispatch
): RecordOf<T> {
  return stores.reduce((
    acc: RecordOf<T>,
    store: IInstance.Store
  ) => {
    return acc.set(store.name as any, storeToActions(store, dispatch) as any);
  }, Immutable.Record<T>({} as any)());
}

/**
 * Get an action name from an action type.
 *
 * @param type An action type.
 * @return The action name.
 */
export function actionTypeToName(type: string): string {
  return fp.last(type.split(ActionDelimiter));
};

/**
 * Create a reducer from a store.
 *
 * @param store An application store.
 * @return A store reducer.
 */
export function storeToReducer<S = any, A = AnyAction>(
  store: IInstance.Store
): Reducer {
  return (state: S, action: AnyAction) => {
    const name = actionTypeToName(action.type);

    if (!store.action.has(name)) {
      throw new Error(`Could not find reducer for action: ${name}.`);
    }

    return store.action.get(name).reducer(state, action.payload);
  };
};

/**
 * Create a reducer from application stores.
 *
 * @param store Application stores.
 * @return An application reducer.
 */
export function storesToReducer(
  stores: IInstance.StoreList
): Reducer {
  return combineReducers(stores.reduce((
    acc: object,
    store: IInstance.Store
  ): object => {
    const reducer = ignoreActions(storeToReducer(store), (action) => {
      return /@@redux/g.test(action.type)
    });

    return fp.set(store.name, reducer, acc);
  }, {}));
}

export function storeToSelects(
  store: IInstance.Store
): any {
  return;
}

/**
 * Create selectors from application stores.
 */
export function storesToSelectors(
  stores: IInstance.StoreList
) {
  return combineReducers(stores.reduce((
    acc: object,
    store: IInstance.Store
  ): object => {
    return fp.set(store.name, storeToSelects(store), acc);
  }, {}));
}
