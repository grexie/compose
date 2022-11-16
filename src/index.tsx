import type { ComponentType, FC, PropsWithChildren } from 'react';

export type Composable = <P = {}>(component: ComponentType<P>) => FC<P>;

export const compose = <P extends object = any>(
  ...composables: [...Composable[], ComponentType<P>]
): ComponentType<P> => {
  let Component: ComponentType<P> = composables.pop() as any;
  let composable: Composable | undefined;
  while ((composable = composables.pop() as Composable | undefined)) {
    Component = composable(Component);
  }
  return Component;
};

export const createComposable =
  (Composable: ComponentType<PropsWithChildren<{}>>): Composable =>
  <P = {},>(Component: ComponentType<P>): FC<P> =>
  (props: P & JSX.IntrinsicAttributes): JSX.Element =>
    (
      <Composable>
        <Component {...props} />
      </Composable>
    );

type ComposablePropsFunction<P extends Object> = (props: object) => P;
type ComposableProps<P extends Object> = P | ComposablePropsFunction<P>;

export const createComposableWithProps = <P extends {}>(
  Composable: ComponentType<PropsWithChildren<P>>
): ((props: P) => Composable) => {
  return (composableProps: ComposableProps<P>): Composable =>
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
};
