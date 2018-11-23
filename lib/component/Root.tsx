import { Store } from 'redux';
import { Provider } from 'react-redux';
import * as React from 'react';

/**
 * Application root.
 */
export const Root: React.SFC<{
  children: JSX.Element,
  store: Store
}> = ({
  children,
  store
}) => {
  return (
    <Provider
      store={store}
    >
      {children}
    </Provider>
  );
}
