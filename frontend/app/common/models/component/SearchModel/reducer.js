/*
 *
 * searchReducer
 *
 */

import { fromJS, List, Map } from 'immutable';

import * as searchConstants from './constants';

const initialState = fromJS({
  fileSearch: {
    value: '',
  },
  taskSearch: {
    isLoaded: true,
    results: {},
    value: '',
  },
  projectSearch: {
    isLoaded: false,
    results: [
      // just a list of project Ids
    ],
    value: '',
  },
  userSearch: {
    isLoaded: true,
    results: [
      // list of users Ids
    ],
    error: null,
    value: '',
  },
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case searchConstants.searchTasks: {
      return state.setIn(['taskSearch', 'value'], action.searchString);
    }

    case searchConstants.searchTasksSuccess: {
      return state
        .setIn(['taskSearch', 'isLoaded'], true)
        .setIn(['taskSearch', 'results'], action.actionResult.data.results);
    }

    case searchConstants.searchTasksShowEntireProject: {
      return state.setIn(['taskSearch', 'results', action.projectId, 'isEntireProjectShown'], action.isShown);
    }

    case searchConstants.searchTasksClear: {
      return state.setIn(['taskSearch', 'isLoaded'], false).setIn(['taskSearch', 'results'], new Map());
    }

    case searchConstants.searchProjectsSuccess: {
      return state
        .setIn(['projectSearch', 'isLoaded'], true)
        .setIn(['projectSearch', 'results'], action.actionResult.data.results);
    }

    case searchConstants.searchProjectsClear: {
      return state.setIn(['projectSearch', 'isLoaded'], false).setIn(['projectSearch', 'results'], new List());
    }

    case searchConstants.searchUsers: {
      return state.setIn(['userSearch', 'isLoaded'], false);
    }

    case searchConstants.searchUsersSuccess: {
      return state
        .setIn(['userSearch', 'isLoaded'], true)
        .setIn(['userSearch', 'results'], action.actionResult.data.results);
    }

    case searchConstants.searchUsersFailure: {
      return state
        .setIn(['userSearch', 'isLoaded'], true)
        .setIn(['userSearch', 'error'], action.actionResult.data.results);
    }

    case searchConstants.searchUsersClear: {
      return state.setIn(['userSearch', 'isLoaded'], false).setIn(['userSearch', 'results'], new List());
    }
    case searchConstants.searchFiles: {
      return state.setIn(['fileSearch', 'value'], action.searchString);
    }
    default:
      return state;
  }
}

export default searchReducer;
