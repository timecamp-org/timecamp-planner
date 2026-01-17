import { PayloadAction } from 'common/types';
import { SagaIterator } from 'redux-saga';
import { call, cps, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { GoogleApiClient, UserTracker, HeySpaceClient as client, localStorage } from '../../../services';
import generateId from '../../../utils/generate-pushid';
import getCookie from '../../../utils/getCookie';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';
import timezoneName from '../../../utils/timezoneName';
import * as PopUpAlertsModelActions from '../../component/PopUpAlertsModel/actions';
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import * as AppModelSagas from '../AppModel/sagas';
import * as EntityModelACtions from '../EntityModel/actions';
import * as NotificationsModelActions from '../NotificationsModel/actions';
import * as NotificationsModelSagas from '../NotificationsModel/sagas';
import * as OrganizationsModelActions from '../OrganizationsModel/actions';
import { onSetRequestStatus } from '../RequestModel/actions';
import {
  changePassword,
  deleteCurrentUser,
  onSendUserFeedback as onSendUserFeedbackRequestType,
} from '../RequestModel/constants/requestTypes';
import { RequestStatus, ResponseCode } from '../RequestModel/types';
import * as UsersActions from '../UsersModel/actions';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';
import * as Actions from './actions';
import * as Constants from './constants';
import {
  OnCheckIfEmailExistPayload,
  OnInvitedUserSetPasswordPayload,
  OnPasswordChangePayload,
  OnSendEmailWithPasswordChangeLinkPayload,
  OnSendUserFeedbackPayload,
  OnSetPasswordPayload,
  OnSignInPayload,
  OnSignInWithAppleAccountPayload,
  OnSignInWithGoogleAccountPayload,
  OnSignOutPayload,
  OnSignUpPayload,
  OnSignUpWithAppleAccountPayload,
  OnSignUpWithGoogleAccountPayload,
} from './payloads';
import { AuthStatus } from './types';

export function* onSignIn({ payload: { username, password } }: PayloadAction<OnSignInPayload>) {
  let user;
  try {
    user = yield cps(client.restApiClient.authenticateWithCookie, username, password);
  } catch (error) {
    yield put(
      Actions.onSignInFailure(
        makeActionResult({
          isOk: false,
          code: 'client.restApiClient.userAuthenticateWithCookie',
          error,
        }),
      ),
    );
    handleError(error, { username });
    return;
  }

  try {
    yield call(AppModelSagas.onInit);

    yield put(NotificationsModelActions.onUnmutePushNotifications());

    yield put(
      Actions.onSignInSuccess(
        makeActionResult({
          isOk: true,
          code: 'login ok',
          data: user,
        }),
      ),
    );
  } catch (error) {
    yield put(
      Actions.onSignInFailure(
        makeActionResult({
          isOk: false,
          code: 'client.restApiClient.userAuthenticateWithCookie',
          error,
        }),
      ),
    );
    handleError(error, { username });
  }
}

export function* onSignInWithGoogleAccount({ payload: { token } }: PayloadAction<OnSignInWithGoogleAccountPayload>) {
  let idToken = token ? token : null;
  let userProfile: { idToken?: string } = {};

  if (!idToken) {
    try {
      yield call(GoogleApiClient.initIfNotInitialized);
      userProfile = yield GoogleApiClient.signIn();
      idToken = userProfile.idToken;
    } catch (error) {
      // don't send error if user close popup or denied permissions
      switch (error.error) {
        case AuthStatus.SIGN_IN_CANCELLED:
        case AuthStatus.IN_PROGRESS:
        case AuthStatus.POP_UP_CLOSED_BY_USER_ERROR:
        case AuthStatus.ACCESS_DENIED_ERROR: {
          yield put(
            Actions.onSignInWithGoogleAccountFailure(
              makeActionResult({
                isOk: false,
                code: 'gapi.signInSafeError',
                error,
              }),
            ),
          );
          break;
        }
        default: {
          yield put(
            Actions.onSignInWithGoogleAccountFailure(
              makeActionResult({
                isOk: false,
                code: 'gapi.signIn',
                error,
              }),
            ),
          );
          handleError(error);
        }
      }
      return;
    }
  }

  if (idToken) {
    let user;
    try {
      user = yield cps(client.restApiClient.authenticateToOpenIdWithCookie, idToken);
    } catch (error) {
      // Check if token is valid but user is not register
      if (error.params.body.code !== ResponseCode.FORBIDDEN) {
        yield put(
          Actions.onSignInWithGoogleAccountFailure(
            makeActionResult({
              isOk: false,
              code: 'client.restApiClient.userAuthenticateWithCookie',
              error: error,
            }),
          ),
        );
        handleError(error);
        return;
      } else {
        yield put(
          Actions.onSignInWithGoogleAccountSuccess(
            makeActionResult({
              isOk: true,
              code: AuthStatus.ACCOUNT_DOES_NOT_EXIST,
              data: {
                userProfile,
                idToken,
              },
            }),
          ),
        );
        return;
      }
    }

    try {
      yield call(AppModelSagas.onInit);

      yield put(NotificationsModelActions.onUnmutePushNotifications());

      yield put(
        Actions.onSignInWithGoogleAccountSuccess(
          makeActionResult({
            isOk: true,
            code: 'login ok',
            data: user,
          }),
        ),
      );
    } catch (error) {
      yield put(
        Actions.onSignInWithGoogleAccountFailure(
          makeActionResult({
            isOk: false,
            code: 'client.restApiClient.userAuthenticateWithCookie',
            error,
          }),
        ),
      );
      handleError(error);
    }
  }
}

export function* onSignInWithAppleAccount({
  payload: { token, firstName, lastName },
}: PayloadAction<OnSignInWithAppleAccountPayload>) {
  let idToken = token ? token : null;

  if (!idToken) {
    throw new Error('idToken is not defined');
  }

  let user;
  try {
    user = yield cps(client.restApiClient.authenticateToApple, idToken);
  } catch (error) {
    // Check if token is valid but user is not register
    if (error.params.body.code !== ResponseCode.FORBIDDEN) {
      yield put(
        Actions.onSignInWithAppleAccountFailure(
          makeActionResult({
            isOk: false,
            code: 'client.restApiClient.userAuthenticateWithCookie',
            error: error,
          }),
        ),
      );
      handleError(error);
      return;
    } else {
      yield put(
        Actions.onSignUpWithAppleAccount({
          token: idToken,
          firstName,
          lastName,
        }),
      );
      return;
    }
  }

  try {
    yield call(AppModelSagas.onInit);

    yield put(NotificationsModelActions.onUnmutePushNotifications());

    yield put(
      Actions.onSignInWithAppleAccountSuccess(
        makeActionResult({
          isOk: true,
          code: 'login ok',
          data: user,
        }),
      ),
    );
  } catch (error) {
    yield put(
      Actions.onSignInWithAppleAccountFailure(
        makeActionResult({
          isOk: false,
          code: 'client.restApiClient.userAuthenticateWithCookie',
          error,
        }),
      ),
    );
    handleError(error);
  }
}

function* onAuthenticationDelete(): SagaIterator {
  try {
    yield put(EntityModelACtions.onCloseActivityFeed());
    yield put(UsersActions.setCurrentUserId());
    yield put(OrganizationsModelActions.onSetCurrentOrganizationId());

    yield cps(localStorage.removeItem, 'currentOrganizationId');

    yield call(client.userContext.setOrganizationId, null);
    yield call(client.userContext.setUserOrganizationIds, []);
    yield call(client.userContext.setUser, null);
    yield call(client.userContext.setSubscription, null);
    yield call(client.userContext.setUser, null);
    yield call(client.userContext.setUserRole, null);

    yield put(PopUpAlertsModelActions.onRemoveAlert('synchronization-error'));
    yield put(
      Actions.onAuthenticationDeleteSuccess(
        makeActionResult({
          isOk: true,
          code: 'authdel success',
        }),
      ),
    );
  } catch (error) {
    yield put(
      Actions.onAuthenticationDeleteFailure(
        makeActionResult({
          isOk: false,
          code: 'authdel failure',
          error,
        }),
      ),
    );
    handleError(error);
  }
}

export function* onSignOut({ payload: { deauthenticateGapi } }: PayloadAction<OnSignOutPayload>) {
  try {
    // We first have to mute user notifications while beeing authorized.
    yield call(NotificationsModelSagas.onMutePushNotifications);
    yield call(client.restApiClient.deauthenticate, (error) => {
      if (error) {
        handleError(error);
      }
    });
    yield put(
      Actions.onSignOutSuccess(
        makeActionResult({
          isOk: true,
          code: 'signout success',
        }),
      ),
    );
    yield put(Actions.onAuthenticationDelete());
    if (deauthenticateGapi) {
      GoogleApiClient.signOut();
    }
  } catch (error) {
    yield put(
      Actions.onSignOutFailure(
        makeActionResult({
          isOk: false,
          code: 'signout failure',
          error,
        }),
      ),
    );
    handleError(error);
    yield put(Actions.onAuthenticationDelete());
  }
}

export function* onSignUp({
  payload: { username, password, firstName = '', lastName = '', phone = '', referrer = '' },
}: PayloadAction<OnSignUpPayload>) {
  try {
    const timeZone = timezoneName().toLowerCase();

    yield cps(
      client.restApiClient.registerWithPassword,
      generateId(),
      username,
      password,
      firstName,
      lastName,
      timeZone,
      referrer
    );
    const user = yield cps(client.restApiClient.authenticateWithCookie, username, password);

    yield call(AppModelSagas.onInit);

    UserTracker.track(UserTrackerEvent.memberSignedUp, {
      ...(yield call(getUserTrackingBasicData)),
      phone,
      from: 'self',
    });

    yield put(
      Actions.onSignUpSuccess(
        makeActionResult({
          isOk: true,
          code: 'client.restApiClient.userRegister',
          data: user,
        }),
      ),
    );
  } catch (error) {
    yield put(
      Actions.onSignUpFailure(
        makeActionResult({
          isOk: false,
          code: 'client.restApiClient.userRegister',
          error,
        }),
      ),
    );
    handleError(error, { username });
  }
}

export function* onSignUpWithGoogleAccount({
  payload: { token, phone },
}: PayloadAction<OnSignUpWithGoogleAccountPayload>) {
  let idToken: string = token ? token : null;

  if (!idToken) {
    try {
      yield call(GoogleApiClient.initIfNotInitialized);
      const userProfile = yield GoogleApiClient.signIn();
      idToken = userProfile.idToken;
    } catch (error) {
      // don't send error if user close popup or denied permissions
      switch (error.error) {
        case AuthStatus.IN_PROGRESS:
        case AuthStatus.SIGN_IN_CANCELLED:
        case AuthStatus.POP_UP_CLOSED_BY_USER_ERROR:
        case AuthStatus.ACCESS_DENIED_ERROR: {
          yield put(
            Actions.onSignInWithGoogleAccountFailure(
              makeActionResult({
                isOk: false,
                code: 'gapi.signUpSafeError',
                error,
              }),
            ),
          );
          break;
        }
        default: {
          handleError(error);
          yield put(
            Actions.onSignInWithGoogleAccountFailure(
              makeActionResult({
                isOk: false,
                code: 'gapi.signUp',
                error,
              }),
            ),
          );
        }
      }
      return;
    }
  }

  try {
    const timeZone = timezoneName().toLowerCase();

    yield cps(client.restApiClient.registerWithOpenId, generateId(), idToken, timeZone);
    const user = yield cps(client.restApiClient.authenticateToOpenIdWithCookie, idToken);

    yield call(AppModelSagas.onInit);

    yield put(
      Actions.onSignUpWithGoogleAccountSuccess(
        makeActionResult({
          isOk: true,
          code: 'client.restApiClient.onSignUpWithGoogleAccount',
          data: user,
        }),
      ),
    );

    UserTracker.track(UserTrackerEvent.memberSignedUp, {
      ...(yield call(getUserTrackingBasicData)),
      phone,
      from: 'self',
    });
  } catch (error) {
    handleError(error);
    // If user already has a HeySpace account bound to google account, just log him in and redirect to default page instead of throwing errors
    if (error.params?.body?.code === ResponseCode.CONFLICT) {
      yield put(Actions.onSignInWithGoogleAccount({ token: idToken }));
    } else {
      yield put(
        Actions.onSignUpWithGoogleAccountFailure(
          makeActionResult({
            isOk: false,
            code: 'client.restApiClient.onSignUpWithGoogleAccount',
            error,
          }),
        ),
      );
    }
  }
}

export function* onSignUpWithAppleAccount({
  payload: { token, firstName, lastName, phone = '' },
}: PayloadAction<OnSignUpWithAppleAccountPayload>) {
  let idToken: string = token ? token : null;

  if (!idToken) {
    throw new Error('idToken is not defined');
  }

  try {
    const timeZone = timezoneName().toLowerCase();

    yield cps(client.restApiClient.registerWithApple, generateId(), idToken, timeZone, firstName, lastName);
    const user = yield cps(client.restApiClient.authenticateToApple, idToken);

    yield call(AppModelSagas.onInit);

    yield put(
      Actions.onSignUpWithAppleAccountSuccess(
        makeActionResult({
          isOk: true,
          code: 'client.restApiClient.onSignUpWithAppleAccount',
          data: user,
        }),
      ),
    );

    UserTracker.track(UserTrackerEvent.memberSignedUp, {
      ...(yield call(getUserTrackingBasicData)),
      phone,
      from: 'self',
      provider: 'apple',
    });
  } catch (error) {
    handleError(error);
    // If user already has a HeySpace account bound to google account, just log him in and redirect to default page instead of throwing errors
    if (error.params?.body?.code === ResponseCode.CONFLICT) {
      yield put(Actions.onSignInWithAppleAccount({ token: idToken }));
    } else {
      yield put(
        Actions.onSignUpWithAppleAccountFailure(
          makeActionResult({
            isOk: false,
            code: 'client.restApiClient.onSignUpWithAppleAccount',
            error,
          }),
        ),
      );
    }
  }
}

function* onSendEmailWithPasswordChangeLink({
  payload: { email },
}: PayloadAction<OnSendEmailWithPasswordChangeLinkPayload>) {
  try {
    yield cps(client.restApiClient.resetPasswordForUserEmail, email);

    yield put(
      Actions.onSendEmailWithPasswordChangeLinkSuccess(
        makeActionResult({
          isOk: true,
          code: 'onSendEmailWithPasswordChangeLinkSuccess',
        }),
      ),
    );
  } catch (error) {
    yield put(
      Actions.onSendEmailWithPasswordChangeLinkFailure(
        makeActionResult({
          isOk: false,
          code: 'onSendEmailWithPasswordChangeLinkFailure',
          error: error,
        }),
      ),
    );
    handleError(error, { email });
  }
}

function* onSetPassword({ payload: { token, newPassword } }: PayloadAction<OnSetPasswordPayload>) {
  try {
    const response = yield cps(client.restApiClient.changePasswordForToken, token, newPassword);
    yield call(
      onSignIn,
      Actions.onSignIn({
        username: response.userEmail,
        password: newPassword,
      }),
    );

    yield put(
      Actions.onSetPasswordSuccess(
        makeActionResult({
          isOk: true,
          code: 'onSetPasswordSuccess',
          data: response,
        }),
      ),
    );
  } catch (error) {
    yield put(
      Actions.onSetPasswordFailure(
        makeActionResult({
          isOk: true,
          code: 'onSetPasswordFailure',
          error,
        }),
      ),
    );
    handleError(error);
  }
}
function* onPasswordChange({ payload: { currentPassword, newPassword } }: PayloadAction<OnPasswordChangePayload>) {
  let currentUserId;
  try {
    currentUserId = yield select(selectCurrentUserId);
    yield put(onSetRequestStatus(changePassword, currentUserId, RequestStatus.LOADING));
    yield cps(client.restApiClient.changePassword, currentPassword, newPassword);

    yield put(onSetRequestStatus(changePassword, currentUserId, RequestStatus.SUCCESS));
    yield put(
      Actions.onPasswordChangeSuccess(
        makeActionResult({
          isOk: true,
          code: Constants.onPasswordChangeSuccess,
        }),
      ),
    );
  } catch (error) {
    yield put(onSetRequestStatus(changePassword, currentUserId, RequestStatus.FAILURE, error));
    yield put(
      Actions.onPasswordChangeFailure(
        makeActionResult({
          isOk: false,
          code: 'onPasswordChangeFailure',
          error,
        }),
      ),
    );
    handleError(error);
  }
}

export function* onCheckIfEmailExist({ payload: { email } }: PayloadAction<OnCheckIfEmailExistPayload>) {
  try {
    // response is null if email doesn't exist, otherwise client throw error
    yield cps(client.restApiClient.checkIfEmailExists, email);
    yield put(
      Actions.onCheckIfEmailExistSuccess(
        makeActionResult({
          isOk: true,
          code: 'onCheckIfEmailExistSuccess',
        }),
      ),
    );
  } catch (error) {
    // if it's ERROR_EMAIL_NOT_ALLOWED error then put result to redux-saga
    // otherwise sent error to sentry
    if (error.params.body.code === ResponseCode.CONFLICT) {
      yield put(
        Actions.onCheckIfEmailExistFailure(
          makeActionResult({
            isOk: false,
            code: 'onCheckIfEmailExistFailure',
            error,
          }),
        ),
      );
    } else {
      handleError(error, { email });
    }
  }
}

export function* onInvitedUserSetPassword({
  payload: { password, firstName, lastName, token },
}: PayloadAction<OnInvitedUserSetPasswordPayload>) {
  try {
    // set password
    const response = yield cps(client.restApiClient.changePasswordForToken, token, password);
    // sign in
    yield call(
      onSignIn,
      Actions.onSignIn({
        username: response.userEmail,
        password,
      }),
    );
    // set first and last name
    yield put(UsersActions.onUpdateUser({ firstName, lastName }, true));

    const userTrackingBasicData = yield call(getUserTrackingBasicData);
    UserTracker.track(UserTrackerEvent.memberSignedUp, {
      ...userTrackingBasicData,
      referrer: userTrackingBasicData.referrer || 'invitation',
      from: 'invitation',
    });

    yield put(
      Actions.onInvitedUserSetPasswordSuccess(
        makeActionResult({
          isOk: true,
          code: 'onInvitedUserSetPasswordSuccess',
          data: {
            email: response.userEmail,
            firstName,
            lastName,
          },
        }),
      ),
    );
  } catch (error) {
    handleError(error, { firstName, lastName, token });
    yield put(
      Actions.onInvitedUserSetPasswordFailure(
        makeActionResult({
          isOk: false,
          code: 'onInvitedUserSetPasswordFailure',
          error,
        }),
      ),
    );
  }
}

export function* onDeleteAccount(): SagaIterator {
  const currentUserId = yield select(selectCurrentUserId);
  try {
    yield put(onSetRequestStatus(deleteCurrentUser, currentUserId, RequestStatus.LOADING));
    yield cps(client.restApiClient.deleteCurrentUser);
    yield call(onAuthenticationDelete);
    yield put(onSetRequestStatus(deleteCurrentUser, currentUserId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(deleteCurrentUser, currentUserId, RequestStatus.FAILURE, error));
  }
}

function* getUserTrackingBasicData(): SagaIterator {
  const utmSource = yield cps(localStorage.getItem, '__utm_source');
  let referrer = yield cps(localStorage.getItem, '__referrer');
  if (!referrer) {
    referrer = getCookie('referer2');
  }

  const last_referrer = getCookie('referer3');

  yield cps(localStorage.removeItem, '__utm_source');
  yield cps(localStorage.removeItem, '__referrer');

  return {
    utm_source: utmSource,
    referrer,
    last_referrer,
  };
}

function* onSendUserFeedback({ payload: { feedback, feedbackType } }: PayloadAction<OnSendUserFeedbackPayload>) {
  try {
    yield put(onSetRequestStatus(onSendUserFeedbackRequestType, feedbackType, RequestStatus.LOADING));

    yield cps(client.restApiClient.sendUserFeedback, feedback, feedbackType);

    yield put(onSetRequestStatus(onSendUserFeedbackRequestType, feedbackType, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(onSendUserFeedbackRequestType, feedbackType, RequestStatus.FAILURE, error));
  }
}

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(Constants.onSignIn, onSignIn);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSignInWithGoogleAccount, onSignInWithGoogleAccount);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSignInWithAppleAccount, onSignInWithAppleAccount);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSignUpWithAppleAccount, onSignUpWithAppleAccount);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSignOut, onSignOut);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onAuthenticationDelete, onAuthenticationDelete);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSignUpWithGoogleAccount, onSignUpWithGoogleAccount);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSignUp, onSignUp);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSendEmailWithPasswordChangeLink, onSendEmailWithPasswordChangeLink);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onSetPassword, onSetPassword);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onPasswordChange, onPasswordChange);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onCheckIfEmailExist, onCheckIfEmailExist);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onInvitedUserSetPassword, onInvitedUserSetPassword);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onDeleteAccount, onDeleteAccount);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onSendUserFeedback, onSendUserFeedback);
    });
  },
];
