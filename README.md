# Grexie Compose

Create and use composable functions for React context providers and other wrapper components.

## Installing

```bash
yarn add @grexie/compose
```

## Usage

Create a composable from an existing component, for example a context provider:

```javascript
import { createComposable } from "@grexie/compose";

const withContextProvider = createComposable(ContextProvider);
```

Then use the composable with the `compose` function:

```typescript
import { compose } from "@grexie/compose";

const ComposedApp = compose(
  withContextProvider1,
  withContextProvider2,
  ...,
  withContextProviderN,
  App
);
```

You can chain as many composables together in the call to compose, avoiding the need to chain multiple JSX tags together to compose the App wrapper.

Or alternatively, if your composable function takes props in addition to children:

```typescript
import { createComposableWithProps, compose } from "@grexie/compose";

const withContextProvider1 =
  createComposableWithProps<PropsType>(ContextProvider);

const ComposedApp = compose(
  withContextProvider1({ ...props }),
  withContextProvider2,
  ...,
  withContextProviderN,
  App
);
```
