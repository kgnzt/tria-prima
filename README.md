# Tria Prima - ☿ 🜔 🜍

Frontend application framework.

## Install

    npm i tria-prima --save

## Three principles

Application development progresses through three areas of concern:

### Store

> The structure, change, and retrieval of state.

A collection of immutable stores model the application's state, how changes are 
made to state, and the interfaces for accessing state.

```javascript
export const user: ISchema.Store {
  store: Immutable.Map(),
  action: {
    merge(state, user) {
      return state.get(user.id).merge(user);
    }
  },
  select: {
    find(state) {
      return state;
    },
    findById(state, id) {
      return state.get(id);
    }
  }
}
```

### Source

> Where data comes from and goes to.

A collection of sources define how to retrieve data (http / websocket / etc)
and how it relates to an application's stores via actions.

```javascript
export const user: ISchema.Source {
  findById(action, id) {
    return http(`/users/${id}`).get().then(action.user.merge);
  }
}
```

### Path

> What to display given the browser's location.

Browser locations are mapped to Pages which specify a root component, 
properties mapped to store changes, and any required setup.

```javascript
export const Profile: ISchema.Page = {
  meta: {
    title: 'User Profile'
  },
  component: UserProfile
  setup: async ({ params }, { source }) => {
    await source.find(params.get('userId'));
  }
}

export const path: ISchema.Path = {
  '/user/:userId': Profile
}
```
