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

type ComposablePropsFunction<P extends Object> = (props: object) => P;
type ComposableProps<P extends Object> = P | ComposablePropsFunction<P>;

function createComposableWithProps<P extends Object>(Composable: Composable) {
  return (composableProps: ComposableProps<P>) =>
    (Component: Composable) =>
    (props: object) => {
      let composablePropsFinal: P;

      if (typeof composableProps === 'function') {
        composablePropsFinal = Object.assign(
          {},
          (composableProps as ComposablePropsFunction<P>)(props)
        );
      } else {
        composablePropsFinal = Object.assign({}, composableProps);
      }

      return (
        <Composable {...composablePropsFinal}>
          <Component {...props} />
        </Composable>
      );
    };
}

export { compose, createComposable, createComposableWithProps };
