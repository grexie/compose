import type { ComponentType, FC, PropsWithChildren } from 'react';

type Composable<P extends {} = any> = (
  composable: any
) => FC<PropsWithChildren<P>>;

const compose = <P extends object = any>(
  ...composables: [...Composable[], ComponentType<P>]
): ComponentType<P> => {
  let Component: ComponentType<P> = composables.pop() as any;
  let composable: Composable | undefined;
  while ((composable = composables.pop() as Composable | undefined)) {
    Component = composable(Component);
  }
  return Component;
};

const createComposable =
  (Composable: ComponentType<PropsWithChildren<{}>>): Composable<{}> =>
  <P = {},>(Component: ComponentType<P>): FC<P> =>
  (props: P & JSX.IntrinsicAttributes): JSX.Element =>
    (
      <Composable>
        <Component {...props} />
      </Composable>
    );

type ComposablePropsFunction<P extends Object> = (props: object) => P;
type ComposableProps<P extends Object> = P | ComposablePropsFunction<P>;

function createComposableWithProps<P extends PropsWithChildren<{}>>(
  Composable: ComponentType<P>
) {
  return (composableProps: ComposableProps<P>): Composable<P> =>
    <CP = {},>(Component: ComponentType<CP>): FC<CP> =>
    (props: CP & JSX.IntrinsicAttributes) => {
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
