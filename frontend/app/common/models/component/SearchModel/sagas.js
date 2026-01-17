import { put, call, select, takeLatest, all, delay } from 'redux-saga/effects'
import { fromJS, Map, List } from 'immutable'
import handleError from '../../../utils/handleError'
import makeActionResult from '../../../utils/makeActionResult'

import * as SearchConstants from './constants'
import * as SearchSelectors from './selectors'
import * as SearchActions from './actions'

export default [
  watchSearch,
]

export function* watchSearch() {
  /* eslint-disable */
  yield all([
    takeLatest(SearchConstants.searchTasks, searchTasks),
    takeLatest(SearchConstants.searchProjects, searchProjects),
    takeLatest(SearchConstants.searchProjectsAndTasks, searchProjectsAndTasks),
    takeLatest(SearchConstants.searchUsers, searchUsers),
  ])
  /* eslint-enable */
}

export function* searchTasks({ searchString, projectId, searchInArchivedProject, searchInCompletedTasks, searchInMyTasks }) {
  try {
    yield put(SearchActions.searchTasksClear())

    let results = new Map()
    if (searchString) {
      results = yield select(SearchSelectors.searchTasks(), { searchString, projectId, searchInArchivedProject, searchInCompletedTasks, searchInMyTasks })
    }

    yield put(SearchActions.searchTasksSuccess(makeActionResult({
      isOk: true,
      code: 'searchTasksSuccess',
      data: { results },
    })))
  } catch (error) {
    yield put(SearchActions.searchTasksFailure(makeActionResult({
      isOk: false,
      code: 'searchTasksFailure',
      error: error,
    })))
    handleError(error, { searchString, projectId })
  }
}

export function* searchProjects({ searchString, projectId }) {
  try {
    yield put(SearchActions.searchProjectsClear())

    let results = new List()
    if (searchString) {
      results = yield select(SearchSelectors.searchProjects(searchString, projectId))
    }

    yield put(SearchActions.searchProjectsSuccess(makeActionResult({
      isOk: true,
      code: 'searchProjectsSuccess',
      data: { results },
    })))
  } catch (error) {
    yield put(SearchActions.searchProjectsFailure(makeActionResult({
      isOk: false,
      code: 'searchProjectsFailure',
      error: error,
    })))
    handleError(error, { searchString, projectId })
  }
}

function* searchProjectsAndTasks({ searchString, projectId }) {
  try {
    yield delay(500) // takeLatest + delay at the beginning = debounce
    yield put(SearchActions.searchProjects(searchString, projectId))
    yield put(SearchActions.searchTasks(searchString, projectId))
  } catch (error) {
    handleError(error, { searchString, projectId })
  }
}

function* searchUsers({ searchString }) {
  try {
    yield delay(500) // takeLatest + delay at the beginning = debounce

    let results = new List()
    if (searchString) {
      results = yield select(SearchSelectors.searchUsers, { searchString })
    }

    yield put(SearchActions.searchUsersSuccess(makeActionResult({
      isOk: true,
      code: 'searchUsersSuccess',
      data: { results },
    })))
  } catch (error) {
    yield put(SearchActions.searchUsersFailure(makeActionResult({
      isOk: false,
      code: 'searchUsersFailure',
      error: error,
    })))
    handleError(error, { searchString })
  }
}
