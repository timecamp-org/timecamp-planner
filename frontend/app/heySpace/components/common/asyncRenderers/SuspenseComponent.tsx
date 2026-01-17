import { Suspense } from 'react';

import AppLoaderToggle from 'commonComponents/AppLoaderToggle';

export type SuspenseComponentInteface = {
  fallback?: JSX.Element;
  disableLoader?: boolean;
};

const SuspenseComponent: ReactFCWithChildren<SuspenseComponentInteface> = ({
  children,
  fallback,
  disableLoader = false,
}) => (
  <Suspense
    //@ts-ignore
    fallback={disableLoader ? <div></div> : fallback || <AppLoaderToggle />}
  >
    {children}
  </Suspense>
);

export default SuspenseComponent;
