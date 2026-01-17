import * as Constants from './constants';
import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { ViewSettingsState } from 'models/domain/ViewSettingsModel/types';
import { PayloadAction } from 'common/types';
import {
  OnCreateViewSettingsPayload,
  OnDeleteViewSettingsSuccessPayload,
  OnUpdateViewSettingsBodyPayload,
  OnUpdateViewSettingsPayload,
} from 'models/domain/ViewSettingsModel/payloads';
import { removeIdFromList, updateListWithNewItem } from 'common/utils/immutableUtils';

const initialState: ViewSettingsState = fromJS({
  viewSettingsData: {},
  viewSettingsBody: {},
  viewSettingsLinks: {},
  baseViewSettingsIdByLinkedViewSettingsId: {},
});

const viewSettingsReducer: Reducer<ViewSettingsState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case Constants.onCreateViewSettings: {
      const { viewSettings, viewSettingsBody, baseViewSettingsId }: OnCreateViewSettingsPayload = action.payload;
      const { id: viewId } = viewSettings;

      let newState = state
        .setIn(['viewSettingsData', viewId], viewSettings)
        .setIn(['viewSettingsBody', viewId], viewSettingsBody);

      if (baseViewSettingsId) {
        newState = newState
          .updateIn(['viewSettingsLinks', baseViewSettingsId], updateListWithNewItem(viewId))
          .setIn(['baseViewSettingsIdByLinkedViewSettingsId', viewId], baseViewSettingsId);
      }

      return newState;
    }

    case Constants.onUpdateViewSettings: {
      const { viewId, settings }: OnUpdateViewSettingsPayload = action.payload;

      return state.mergeIn(['viewSettingsData', viewId], settings);
    }

    case Constants.onUpdateViewSettingsBody: {
      const { viewId, settings }: OnUpdateViewSettingsBodyPayload = action.payload;

      return state.mergeIn(['viewSettingsBody', viewId], settings);
    }

    case Constants.onDeleteViewSettingsSuccess: {
      const { viewId, baseViewId }: OnDeleteViewSettingsSuccessPayload = action.payload;

      let newState = state.deleteIn(['viewSettingsData', viewId]).deleteIn(['viewSettingsBody', viewId]);

      if (baseViewId) {
        newState = newState
          .deleteIn(['baseViewSettingsIdByLinkedViewSettingsId', viewId])
          .updateIn(['viewSettingsLinks', baseViewId], removeIdFromList(viewId));
      }

      return newState;
    }

    default: {
      return state;
    }
  }
};

export default viewSettingsReducer;
