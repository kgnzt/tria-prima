# Tria Prima - ☿ 🜔 🜍

Frontend application framework.

## Install

    npm i tria-prima --save

## Three principles

Three concerns for development.

### Store

> The structure, change, and retrieval of state.

A collection of immutable stores model the application's state, how changes are 
made to state, and the interfaces for accessing it.

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

> Where state comes from and goes to.

A collection of sources define how to retrieve data (http / websocket / etc)
and how it relates to an application's stores by way of its actions.

```javascript
export const user: ISchema.Source {
  findById(action, id) {
    return http(`/users/${id}`).get().then(action.user.merge);
  }
}
```

### Path

> What to display given the browser's location.

Browser locations are mapped to Pages, specifying a root component, 
properties mapped to the store, and actions required for setup.

```javascript
export const Profile: ISchema.Page = {
  meta: {
    title: 'User Profile'
  },
  component: UserProfile,
  select: ({ action, select }) => {
    return {
      users: select.user.find,
      user: createSelector([
        select.location.params,
        select.user.find
      ], (params, users) => {
        return users.find(params.get('userId'));
      })
    };
  },
  setup: async ({ params }, { source }) => {
    await source.find(params.get('userId'));
  }
}

export const path: ISchema.Path = {
  '/user/:userId': Profile
}
```

## Creating an Application

The application can be rendered by providing the three schemas outlined above:

```javascript
Application({ path, source, store }).start();
```

## Deployment

Deployment may be managed through the following commands:

### Compile

> Compile assets into a bundle.

    npm run tria-prima-compile

### Push

> Push assets to S3.

    npm run tria-prima-push

### Deploy

> Compile and push assets.

    npm run tria-prima-deploy
