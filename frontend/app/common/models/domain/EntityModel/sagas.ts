import { FeedConnectionInstance } from 'client/src/HeySpaceClient';
import { batchActions } from 'redux-batched-actions';
import { buffers, eventChannel } from 'redux-saga';
import { call, cancel, cancelled, cps, delay, fork, put, take, takeLatest } from 'redux-saga/effects';
import { ActivityFeed, ReconnectHandler } from '../../../services';
import DesktopAppController from '../../../utils/desktopAppController';
import handleError from '../../../utils/handleError';
import isMobileApp from '../../../utils/isMobileApp';
import { onUpdateChecklistItemData } from '../ChecklistsModel/constants';
import { onControlCommand } from '../ControlCommandModel/sagas';
import { onUpdateJobStatusData } from '../JobStatusModel/constants';
import {
  onCreateMessageAttachmentsIds,
  onCreateMessageData,
  onUpdateMessageReadData,
} from '../MessagesModel/constants';
import { onUpdateUserInOrganizationData } from '../OrganizationsModel/constants';
import { onDebounceRefetchProjectFiles, onRemoveProjectPerson } from '../ProjectsModel/constants';
import EntityActions from './EntityActions';
import * as Actions from './actions';
import * as Constants from './constants';
import { ActivityType } from './types';

const INITIAL_BUFFER_SIZE = 100;
const FILL_ACTIONS_BUFFER_TIMEOUT = 500;
const NON_BATCHED_ACTION_TYPES = [
  onCreateMessageData,
  onRemoveProjectPerson,
  onUpdateMessageReadData,
  onUpdateChecklistItemData,
  onCreateMessageAttachmentsIds,
  onUpdateJobStatusData,
  onUpdateUserInOrganizationData,
  onDebounceRefetchProjectFiles,
];
const entityActions = new EntityActions();

export default [
  function* () {
    yield takeLatest(Constants.onInitActivityFeed, onInitActivityFeed);
  },
];

function* onInitActivityFeed() {
  try {
    const feed = yield cps(ActivityFeed.subscribe);
    if (!isMobileApp()) {
      window.__tc3_feed = {
        unsubscribe: feed.unsubscribe,
        close: feed.close,
        reconnect: feed.reconnect,
      };
    }
    const watchTask = yield fork(watchActivityFeed, feed);
    yield put(Actions.onInitActivityFeedSuccess());

    yield take(Constants.onCloseActivityFeed);
    yield cancel(watchTask);
  } catch (error) {
    handleError(error);
    yield put(Actions.onInitActivityFeedFailure());
  }
}

let actionsBuffer = [];

function* watchActivityFeed(feed: FeedConnectionInstance) {
  const feedChannel = yield call(createFeedChannel, feed);
  try {
    while (true) {
      const { activity } = yield take(feedChannel);

      const type = entityActions.getActivityType(activity);

      switch (type) {
        case ActivityType.PUSH_NOTIFICATION: {
          DesktopAppController.sendPushNotification(activity);
          break;
        }
        case ActivityType.CONTROL_COMMAND: {
          yield call(onControlCommand, activity);
          break;
        }
        default: {
          yield fork(actionConsumer);
          const action = entityActions.getActionFromActivity(activity);

          if (action) {
            const actionBody = action(activity);

            if (NON_BATCHED_ACTION_TYPES.includes(actionBody.type)) {
              yield put(actionBody);
            } else {
              actionsBuffer.push(actionBody);
            }
          }
        }
      }
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (yield cancelled()) {
      feedChannel.close();
    }
  }
}

function* actionConsumer() {
  yield delay(FILL_ACTIONS_BUFFER_TIMEOUT);
  if (actionsBuffer.length === 0) {
    return null;
  }
  if (actionsBuffer.length === 1) {
    yield put(actionsBuffer[0]);
  } else {
    const batched = batchActions(actionsBuffer);
    yield put(batched);
  }
  actionsBuffer = [];
  return null;
}

function createFeedChannel(feed: FeedConnectionInstance) {
  return eventChannel((emit) => {
    const feedHandler = (event) => {
      emit({ activity: event });
    };

    feed.on('message', feedHandler);
    feed.on('controlCommand', feedHandler);
    feed.on('error', handleError);
    feed.on('reconnected', ReconnectHandler.onReconnect);

    const unsubscribe = () => {
      feed.unsubscribe();
    };

    return unsubscribe;
  }, buffers.expanding(INITIAL_BUFFER_SIZE));
}
