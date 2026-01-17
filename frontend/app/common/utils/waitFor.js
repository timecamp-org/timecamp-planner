import { take, select } from 'redux-saga/effects'

function* waitFor(selector) {
  if (yield select(selector)) {
    return
  }

  while (true) {
    yield take('*')
    if (yield select(selector)) {
      return
    }
  }
}

export default waitFor
