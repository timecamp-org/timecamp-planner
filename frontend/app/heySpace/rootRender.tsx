import React from 'react';

import { ConnectedRouter } from 'connected-react-router/immutable';
import { createRoot, Root } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';

import { history, RootStore } from 'common/rootStore';

if (process.env.NODE_ENV !== 'production' && process.env.DEBUG_PERF === 'true') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    exclude: [
      // React Router
      /^Route/,
    ],
    trackAllPureComponents: true,
    include: [/(.*?)/],
    groupByComponent: true,
    collapseGroups: true,
    titleColor: 'yellow',
    diffNameColor: 'yellow',
    diffPathColor: 'organge',
  });
}

const domRoot = document.getElementById('app');
let root: Root | null = null;

const RenderApp = () => {
  const App = require('./components/App').default;
  if (!domRoot) {
    return;
  }

  if (!root) {
    root = createRoot(domRoot);
  }

  root.render(
    <StoreProvider store={RootStore}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </StoreProvider>
  );
};

function Component() {
  RenderApp();
}

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./components/App', () => {
    setTimeout(() => {
      RenderApp();
    });
  });
}

export default Component;
