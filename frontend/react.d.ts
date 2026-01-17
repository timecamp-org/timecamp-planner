import * as React from 'react';

type MyPropsWithChildren<T> = {
  children?: ReactI18NextChild | Iterable<ReactI18NextChild> | Iterable<number, Element>;
} & T;

declare global {
  type ReactFCWithChildren<T = {}> = React.FC<MyPropsWithChildren<T>>;
}

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      children?: ReactI18NextChild | Iterable<ReactI18NextChild> | Iterable<number, Element>;
    }
  }
}
