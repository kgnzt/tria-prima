import * as Immutable from 'immutable';
import * as sinon from 'sinon';

import {
  Store,
  Action
} from '../../record';
import * as Util from '../store';

describe('Util: Store', () => {
  const { storeActionToType } = Util;

  const dispatch = sinon.stub();
  const action = Action({
    name: 'bar'
  });
  const store = Store({
    name: 'foo',
    action: Immutable.Map({
      test: Action({
        name: 'test',
        reducer: sinon.stub()
      })
    })
  });

  beforeEach(() => {
    dispatch.reset();
  });

  it('correctly defines ActionDelimiter', () => {
    expect(Util.ActionDelimiter).toEqual('.');
  });

  describe('resolveAction', () => {
    const { resolveAction } = Util;

    const reducer = sinon.stub();
    const name = 'foo';

    const instance = resolveAction(reducer, name);

    it('correctly sets the reducer', () => {
      expect(instance.reducer).toEqual(reducer);
    });

    it('correctly sets the action name', () => {
      expect(instance.name).toEqual(name);
    });
  });

  describe('resolveStore', () => {
    const { resolveStore } = Util;

    const name = 'foo';
    const schema = {
      store: Immutable.Map(),
      action: {
        ding: (state, payload) => {
        }
      }
    };
    const instance = resolveStore(schema, name);

    it('assigns the data store', () => {
      expect(instance.store).toEqual(schema.store);
    });

    it('assigns the name', () => {
      expect(instance.name).toEqual('foo');
    });

    describe('action', () => {
      const { action } = instance;

      it('creates an action map', () => {
        expect(Immutable.Map.isMap(action)).toBe(true);
      });

      it('resolves each action', () => {
        action.forEach(action => {
          expect(action.name).toEqual('ding');
        });
      });
    });
  });

  describe('storeActionToType', () => {
    it('correctly generates an action type', () => {
      expect(storeActionToType(action, store)).toEqual('foo.bar');
    });
  });

  describe('createTrigger', () => {
    const { createTrigger } = Util;

    const result = createTrigger(dispatch, action, store);

    it('returns a function', () => {
      expect(result).toBeInstanceOf(Function);
    });

    it('correctly calls dispatch when called', () => {
      result('ding');

      expect(dispatch.calledWithExactly({
        type: storeActionToType(action, store),
        payload: 'ding'
      }))
    });
  });

  describe('storeToActionDefaults', () => {
    const { storeToActionDefaults } = Util;

    const store = Store({
      action: Immutable.Map({
        foo: Action({
          name: 'foo',
          reducer: (state) => {
            return state;
          }
        }),
        ding: Action({
          name: 'ding',
          reducer: (state) => {
            return state;
          }
        })
      })
    });

    const result = storeToActionDefaults<{
      foo: any,
      ding: any
    }>(store);

    it('creates default for each action entry ', () => {
      expect(Object.keys(result)).toEqual(['foo', 'ding']);
    });

    it('provides a callable function for defaults', () => {
      expect(result.foo).toBeInstanceOf(Function);
    });

    it('provides an action that throws for defaults', () => {
      expect(() => {
        expect(result.foo());
      }).toThrow('No action named: foo, has been defined.')
    });
  });

  describe('storeToActions', () => {
    const { storeToActions } = Util;

    const store = Store({
      name: 'zing',
      action: Immutable.Map({
        ding: Action({
          name: 'ding',
          reducer: (state) => {
            return state;
          }
        }),
        dong: Action({
          name: 'dong',
          reducer: (state) => {
            return state;
          }
        })
      })
    });
    const dispatch = sinon.stub();

    const result = storeToActions<{
      foo: any,
      ding: any,
    }>(store, dispatch);

    beforeEach(() => {
      dispatch.reset();
    });

    it('creates a record that allow for dot access operator', () => {
      expect(result.foo).toBeInstanceOf(Function);
    });

    it('creates an entry for each action provided in the store', () => {
      expect(result).toHaveProperty('foo');
      expect(result).toHaveProperty('ding');
    });

    it('dispatches correctly on action trigger calls', () => {
      result.foo('alpha')

      expect(dispatch.calledWithExactly({
        type: storeActionToType(store.action.get('foo'), store),
        payload: 'alpha'
      }))
    });
  });

  describe('actionTypeToName', () => {
    const { actionTypeToName } = Util;

    const result = actionTypeToName('foo.bar');

    it('return the tail of the action type', () => {
      expect(actionTypeToName('foo.bar')).toEqual('bar');
    });
  });

  describe.only('storeToReducer', () => {
    const { storeToReducer } = Util;

    const store = Store({
      name: 'root',
      action: Immutable.Map({
        test: Action({
          name: 'test',
          reducer: (state, payload) => {
            return state + payload;
          }
        })
      })
    });

    const reducer = storeToReducer(store);

    it('returns a reducing function', () => {
      expect(reducer).toBeInstanceOf(Function);
    });

    it('throws if no reducer exists for type in store', () => {
      expect(() => {
        reducer(0, {
          type: 'root.alphabet',
          payload: 5
        })
      }).toThrow('Could not find reducer for action: alphabet.');
    });

    it('correctly delegates to the reducing function returning result', () => {
      expect(reducer(5, {
        type: 'root.test',
        payload: 5
      })).toEqual(10);
    });
  });

  describe('storesToReducer', () => {
    const { storesToReducer } = Util;

    const stores = Immutable.List([
      Store({
        name: 'alpha',
        action: Immutable.Map({
          foo: Action({
            name: 'foo',
            reducer(state, payload) {
              return state + payload;
            }
          })
        })
      }),
      Store({
        name: 'beta',
        action: Immutable.Map({
          foo: Action({
            name: 'foo',
            reducer(state, payload) {
              return state - payload;
            }
          })
        })
      })
    ]);

    const reducer = storesToReducer(stores);

    it('ignores @@redux namespace', () => {
      expect(() => {
        reducer(0, {
          type: '@@redux/INITa.2.k.9.p.c',
          payload: 5
        })
      }).toBe(0);
    });

    it('throw if an action cannot be found', () => {
      expect(() => {
        reducer(0, {
          type: 'root.zing',
          payload: 5
        })
      }).toThrow('Could not find reducer for action: zing.');
    });

    it('correctly delegates to the reducing function returning result', () => {
      expect(reducer(5, {
        type: 'root.foo',
        payload: 5
      })).toEqual(10);
    });
  });
});
