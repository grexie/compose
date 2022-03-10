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
  return (composableProps: P) => (Component: Composable) => (props: object) =>
    (
      <Composable {...composableProps}>
        <Component {...props} />
      </Composable>
    );
}

export { compose, createComposable, createComposableWithProps };
