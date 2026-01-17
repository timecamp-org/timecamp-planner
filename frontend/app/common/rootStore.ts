import { createStore, applyMiddleware, compose } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import { composeWithDevTools } from 'remote-redux-devtools'
import { fromJS } from 'immutable'
import isDev from './utils/isDevEnv'
import isMobileApp from './utils/isMobileApp'
import { routerMiddleware } from 'connected-react-router/immutable'
import { createBrowserHistory } from 'history'
import debounce from "lodash/debounce"
import { getConfig } from './services/config'

import createSagaMiddleware, { END } from 'redux-saga'

import rootReducer from './rootReducer'
import batchedSubscribe from './middlewares/batchedSubscribe'
import { PayloadMetaAction } from 'typesafe-actions'
import { AnyDict } from './types'


const sagaMiddleware = createSagaMiddleware()

export const history = isMobileApp() ? null : createBrowserHistory()

type DebounceMeta = { isBatchDisabled: boolean }

const debounceNotify = (notify, action: PayloadMetaAction<string, AnyDict, DebounceMeta>) => {
  const { meta } = action;
  const notifyFunction = meta?.isBatchDisabled ? notify : debounce(notify, 100)
  notifyFunction();
}

function createRootStore(initialState = {}) {
  const rootSaga = require('./rootSaga').default
  const middlewares = [sagaMiddleware]
  const appConfig = getConfig()
  const isRemoteDevtoolsEnabled = Boolean(appConfig?.isRemoteDevtoolsEnabled)

  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    if (isDev()) {
      const createDebugger = require('redux-flipper').default;

      let reduxDebugger = createDebugger();
      middlewares.push(reduxDebugger)
    }
  } else {
    // @ts-ignore
    middlewares.push(routerMiddleware(history))
  }

  const enhancers = [
    applyMiddleware(...middlewares),
    batchedSubscribe(debounceNotify),
  ]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers = isDev() &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : isRemoteDevtoolsEnabled
      ? composeWithDevTools
      : compose

  const reducer = rootReducer({}, history)

  const store = createStore(
    enableBatching(reducer),
    fromJS(initialState),
    composeEnhancers(...enhancers),
  )

  // @ts-ignore
  store.runSaga = sagaMiddleware.run
  // @ts-ignore
  store.asyncReducers = {}
  // @ts-ignore
  store.close = () => store.dispatch(END)

  // @ts-ignore
  store.runSaga(rootSaga)

  // TODO HMR for reducers
  // TODO HMR for sagas

  return store
}

const RootStoreSingleton = (function () {
  let store

  return {
    getInstance: function () {
      if (!store) {
        store = createRootStore()
        if (!isMobileApp()) {
          window.__tc3_store = store
        }
      }
      return store
    },
  }
})()

export const RootStore = RootStoreSingleton.getInstance()
