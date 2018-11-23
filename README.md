# Tria Prima - ☿ 🜔 🜍

Frontend application framework.

## Install

    npm i tria-prima --save

## Three principles

Application development progresses through three areas of concern:

### Store

> The structure, change, and retrieval of data.

A collection of Immutable stores model an application's state, the changes that 
can be made to that state, and how that state should be accessed.

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
and how it interactes with the application stores by means of the store's 
actions.

```javascript
export const user: ISchema.Source {
  findById(action, id) {
    return http(`/users/${id}`).get().then(action.user.merge);
  }
}
```

### Path

> What to display given the browser's location.

Browser locations are mapped to a Pages which specify a component, properties
mapped to the store, and some initial setup.

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
