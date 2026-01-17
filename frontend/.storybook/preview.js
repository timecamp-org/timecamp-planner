import { addons } from '@storybook/addons';
import { addDecorator } from '@storybook/react';
import withRedux from 'addon-redux/withRedux';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import StoryRouter from 'storybook-react-router';
import rootReducer from '../app/common/rootReducer';
import { MaterialThemeProvider } from '../app/heySpace/theme/material-theme';
import stateMock from '../tests/mocks/stateMock';
import withReduxEnhancer from './enhancer';

const history = createBrowserHistory();

const store = createStore(rootReducer({}, history), withReduxEnhancer);

const withReduxSettings = {
  Provider,
  store,
  state: stateMock,
  actions: [],
};

export const withReduxDecorator = withRedux(addons)(withReduxSettings);

addDecorator(withReduxDecorator);
addDecorator(StoryRouter());
addDecorator((story) => <MaterialThemeProvider>{story()}</MaterialThemeProvider>);
