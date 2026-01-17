import { put, select, cps, takeEvery, takeLatest, call, delay } from 'redux-saga/effects';
import { HeySpaceClient as client } from '../../../services';
import gravatar from 'gravatar';

import { prepareErrorMessageForUser } from '../../../utils/restApiErrorHelpers';
import makeActionResult from '../../../utils/makeActionResult';
import handleError from '../../../utils/handleError';
import * as C from './constants';
import * as UsersActions from './actions';
import { selectCurrentUser, selectCurrentUserEmail } from './selectors/domain';

import * as PopUpAlertsModelActions from '../../component/PopUpAlertsModel/actions';
import { HumanMessage } from '../HumanMessageModel/models';
import { HumanMessageKind } from '../HumanMessageModel/types';

import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';

import { i18n } from '../../../i18n';
import { handleUploadChannel } from '../FilesModel/sagas';
import { getThumbnailUrl } from '../FilesModel/helpers';
import {
  OnAvatarUpdatePayload,
  OnAvatarUploadPayload,
  OnEmailUpdatePayload,
  OnFirstNameUpdatePayload,
  OnLastNameUpdatePayload,
  OnNicknameUpdatePayload,
  OnUpdateUserPayload,
} from 'models/domain/UsersModel/payloads';
import { PayloadAction } from 'common/types';
import { UploadStep } from 'models/domain/FilesModel/types';
import { fork } from 'redux-saga/effects';

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onUpdateUser, onUpdateUser);
    });
    yield fork(function* () {
      yield takeEvery(C.onFirstNameUpdate, onFirstNameUpdate);
    });
    yield fork(function* () {
      yield takeEvery(C.onLastNameUpdate, onLastNameUpdate);
    });
    yield fork(function* () {
      yield takeEvery(C.onNicknameUpdate, onNicknameUpdate);
    });
    yield fork(function* () {
      yield takeEvery(C.onEmailUpdate, onEmailUpdate);
    });
    yield fork(function* () {
      yield takeEvery(C.onAvatarUpdate, onAvatarUpdate);
    });
    yield fork(function* () {
      yield takeEvery(C.onAvatarUpload, onAvatarUpload);
    });
    yield fork(function* () {
      yield takeEvery(C.onGravatarSet, onGravatarSet);
    });
  },
];

export function* onUpdateUser({ payload: { userSettings, ignoreDebounce } }: PayloadAction<OnUpdateUserPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateCurrentUser, undefined, RequestStatus.LOADING));

    if (ignoreDebounce) {
      // ok
    } else {
      yield delay(4000);
    }
    let immutableUser = yield select(selectCurrentUser);
    immutableUser = immutableUser.merge(userSettings);

    if (userSettings && userSettings.email) {
      yield put(
        PopUpAlertsModelActions.onAddAlert({
          humanMessage: HumanMessage({
            kind: HumanMessageKind.success,
            text: i18n.t(`Your email is changed`),
          }),
        })
      );
    }
    yield put(
      UsersActions.onUpdateUserSuccess(
        makeActionResult({
          isOk: true,
          code: 'onUpdateUserSuccess',
          data: { user: immutableUser },
        })
      )
    );

    const rawUser = {
      firstName: immutableUser.firstName,
      lastName: immutableUser.lastName,
      avatarUrl: immutableUser.avatarUrl,
      nickname: immutableUser.nickname,
      email: immutableUser.email,
      locale: immutableUser.locale,
    };
    yield cps(client.restApiClient.updateCurrentUser, rawUser);

    yield put(onSetRequestStatus(RequestTypesConstants.updateCurrentUser, undefined, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { userSettings });
    let errorMessage = 'unkown error';
    if (error instanceof client.restApiClient.Errors.ServerError) {
      errorMessage = 'Internal error'; // TODO S001 RZ zamienic wszystkie Internal error na LOWERCASE
    } else if (error instanceof client.restApiClient.Errors.FetchError) {
      errorMessage = 'Fetch error'; // TODO S001 RZ zamienic na LOWERCASE wszedzie
    } else {
      if (error.params) {
        if (error.params.body) {
          errorMessage = prepareErrorMessageForUser(error.params.body);
        }
      }
    }
    yield put(onSetRequestStatus(RequestTypesConstants.updateCurrentUser, undefined, RequestStatus.FAILURE, error));
    yield put(
      UsersActions.onUpdateUserFailure(
        makeActionResult({
          isOk: false,
          code: 'onUpdateUserFailure',
          error: new Error(errorMessage),
        })
      )
    );
  }
}

function* onFirstNameUpdate({ payload: { firstName } }: PayloadAction<OnFirstNameUpdatePayload>) {
  try {
    yield put(UsersActions.onUpdateUser({ firstName }));
  } catch (error) {
    handleError(error, { firstName });
  }
}

function* onLastNameUpdate({ payload: { lastName } }: PayloadAction<OnLastNameUpdatePayload>) {
  try {
    yield put(UsersActions.onUpdateUser({ lastName }));
  } catch (error) {
    handleError(error, { lastName });
  }
}

function* onNicknameUpdate({ payload: { nickname } }: PayloadAction<OnNicknameUpdatePayload>) {
  try {
    yield put(UsersActions.onUpdateUser({ nickname }));
  } catch (error) {
    handleError(error, { nickname });
  }
}

function* onEmailUpdate({ payload: { email } }: PayloadAction<OnEmailUpdatePayload>) {
  try {
    yield put(UsersActions.onUpdateUser({ email }));
  } catch (error) {
    handleError(error, { email });
  }
}

function* onAvatarUpdate({ payload: { avatarUrl } }: PayloadAction<OnAvatarUpdatePayload>) {
  try {
    if (!avatarUrl) {
      yield cps(client.restApiClient.deleteUserAvatar);
    }

    yield put(UsersActions.onUpdateUser({ avatarUrl }, true));
  } catch (error) {
    handleError(error, { avatarUrl });
  }
}

function* onAvatarUpload({ payload: { file } }: PayloadAction<OnAvatarUploadPayload>) {
  try {
    if (!file) {
      return;
    }
    yield call(handleUploadChannel, file, handleAvatarUploadStep);
  } catch (error) {
    handleError(error);
    yield put(
      PopUpAlertsModelActions.onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKind.error,
          text: i18n.t(`Error while uploading avatar`),
        }),
      })
    );
  }
}

export function* handleAvatarUploadStep(step: UploadStep) {
  const { error, url } = step;

  if (error) {
    throw error;
  }
  if (url) {
    const avatarUrl = getThumbnailUrl(url);
    yield put(UsersActions.onUpdateUser({ avatarUrl }, true));
    return true;
  }
  return false;
}

function* onGravatarSet() {
  try {
    const userEmail = yield select(selectCurrentUserEmail);
    const avatarUrl = gravatar.url(userEmail, { size: '200' }, true);
    yield put(UsersActions.onUpdateUser({ avatarUrl }, true));
  } catch (error) {
    handleError(error);
    yield put(
      PopUpAlertsModelActions.onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKind.error,
          text: i18n.t(`Error while setting gravatar`),
        }),
      })
    );
  }
}
