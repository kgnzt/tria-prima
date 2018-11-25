# Tria Prima - △

Frontend application framework.

## Install

    npm i tria-prima --save

## Design

Three concerns guide development.

### Store

> The structure, change, and retrieval of state.

A collection of immutable stores model the application's state, how changes are 
made to state, and provide cohesive interfaces for state access.

```javascript
export const user: ISchema.Store {
  store: Immutable.Map(),
  action: {
    merge(state, users) {
      return state.merge(users);
    }
  },
  select: {
    find(state) {
      return state;
    }
  }
}
```

### Source

> Where state comes from and goes to.

Sources define how to retrieve data (http / websocket / etc) and how it relates 
to an application's stores by way of its actions.

```javascript
export const user: ISchema.Source {
  find(action) {
    return http(`/api/users`).get().then(action.user.merge);
  }
}
```

### Path

> What to display given the browser's location.

Browser locations are mapped to Pages, which contain a root component, 
properties mapped to the store, and the actions needed for setup.

```javascript
export const UserList: ISchema.Page = {
  meta: {
    title: 'Users'
  },
  root: UserList,
  select: ({ select }) => {
    return {
      users: select.user.find
    };
  },
  setup: async ({ source }) => {
    await source.user.find();
  }
}

export const path: ISchema.Path = {
  '/user/:userId': Profile
}
```

## Creating an Application

An application is rendered by providing the schemas outlined above:

```javascript
Application({ path, source, store }).start();
```

## Deployment

Deployment is managed through the following commands:

### Compile

> Compile assets into a bundle.

    npm run tria-prima-compile

### Push

> Push assets to S3.

    npm run tria-prima-push

### Deploy

> Compile and push assets.

    npm run tria-prima-deploy
