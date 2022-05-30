import React, { Component } from 'react';

type Composable = (composable: any) => any;

const compose = (...composables: Composable[]): Component => {
  let Component = composables.pop();
  let composable: Composable | undefined;
  while ((composable = composables.pop())) {
    Component = composable(Component);
  }
  return Component as unknown as Component;
};

const createComposable =
  (Composable: Composable) => (Component: Composable) => (props: object) =>
    (
      <Composable>
        <Component {...props} />
      </Composable>
    );

function createComposableWithProps<P>(Composable: Composable) {
  return (composableProps: P | (props: object) => P) => (Component: Composable) => (props: object) => {
    let composablePropsFinal;
    
    if (typeof composableProps === 'function') {
      composablePropsFinal = Object.assign({}, composablePropsFinal(props));
    } else {
      composablePropsFinal = Object.assign({}, composableProps);
    }
    
    return (
      <Composable {...composableProps}>
        <Component {...props} />
      </Composable>
    );
  }
}

export { compose, createComposable, createComposableWithProps };
