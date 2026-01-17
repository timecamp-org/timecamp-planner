import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import * as C from './constants';
import * as AppModelConstants from '../AppModel/constants';
import * as CurrentUserConstants from '../CurrentUserModel/constants';

import { GroupsState } from './types';
import { PayloadAction } from '../../../types';
const initialState: GroupsState = fromJS({
  groupsData: {},
  groupIdByUserId: {},
});

const groupsReducer: Reducer<GroupsState, PayloadAction> = (
  state: GroupsState = initialState,
  action: PayloadAction
): GroupsState => {
  switch (action.type) {
    case C.onSetGroupsData: {
      const groups = action.payload;
      return state.set('groupsData', groups);
    }
    case C.onSetGroupData: {
      const group = action.payload;
      return state.setIn(['groupsData', group.id], group);
    }
    case C.onDeleteGroupSuccess: {
      const { groupId } = action.payload;
      return state.deleteIn(['groupsData', groupId]);
    }
    case C.onSetGroupsPeople: {
      const groupsPeople = action.payload;
      return state.set('groupIdByUserId', groupsPeople);
    }
    case C.onAddUserToGroup: {
      const { userId, groupId } = action.payload;
      return state.setIn(['groupIdByUserId', userId], groupId);
    }
    case C.onDeleteGroupSuccess: {
      const { userId } = action.payload;
      return state.deleteIn(['groupIdByUserId', userId]);
    }
    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState;
    default: {
      return state;
    }
  }
};

export default groupsReducer;
