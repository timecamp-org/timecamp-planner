import { put, select, fork, takeLatest, cps, call } from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import { push } from 'connected-react-router/immutable';
import { selectCurrentUserInOrganizationId } from '../OrganizationsModel/selectors';
import { HeySpaceClient as client } from '../../../services';
import * as C from './constants';
import * as A from './actions';
import { onFetchInvitationDataSuccess } from './actions';
import generateId from '../../../utils/generate-pushid';

import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';
import { onCreateUser, onCreateUserOrganizations } from '../UsersModel/actions';
import { PartialPayloadAction } from '../../../types';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { User } from '../UsersModel/models';
import { selectCurrentUserId, selectCurrentUserOrganizationIds } from '../UsersModel/selectors/domain';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import { selectInvitationUserId, selectInvitationOrganizationId } from './selectors';
import { onSwitchOrganization, onBatchOrganizationsData } from '../OrganizationsModel/actions';
import { generateConversationId } from '../../../utils/generateCombinedId';
import { selectEmail, selectPassword, selectFullName } from '../../component/CredentialsModel/selectors';
import {
  onSignOut,
  onSignIn,
  onSignUp,
  onSignInWithGoogleAccount,
  onSignUpWithGoogleAccount,
} from '../CurrentUserModel/sagas';
import { isAuthenticated, onSignInWithGoogleAccountActionResult } from '../CurrentUserModel/selectors';
import { AuthStatus } from '../CurrentUserModel/types';
import { onOpenModal } from '../../component/ModalsModel/actions';
import { ModalType } from '../../component/ModalsModel/types';
import { extractFullNameParts } from '../../../utils';
import { ResponseCode } from '../RequestModel/types';
import { ExtensionNamespace, RelationType, TargetType } from '../ExtensionsModel/types';
import { InvitationTokenJson } from './types';
import { makeConversationLink } from '../../../utils/routerHelpers';
import { onFetchCustomRelation } from 'models/domain/ExtensionsModel/actions';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onJoinChat, onJoinChat);
    });
    yield fork(function* () {
      yield takeLatest(C.onGenerateInvitationToken, onGenerateInvitationToken);
    });
    yield fork(function* () {
      yield takeLatest(C.onFetchInvitationData, onFetchInvitationData);
    });
    yield fork(function* () {
      yield takeLatest(C.onFetchInvitationToken, onFetchInvitationToken);
    });
  },
];

export function* onGenerateInvitationToken({ payload: { showAlert } }: PartialPayloadAction) {
  const currentUserInOrganizationId = yield select(selectCurrentUserInOrganizationId);
  const requestData = { extensionNamespace: ExtensionNamespace.CHAT_WITH_ME };
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionRelation,
        currentUserInOrganizationId,
        RequestStatus.LOADING
      )
    );
    const newToken = generateId();
    const data: InvitationTokenJson = {
      token: newToken,
      userInOrganizationId: currentUserInOrganizationId,
    };
    yield cps(client.restApiClient.updateExtensionRelation, ExtensionNamespace.CHAT_WITH_ME, RelationType.TOKEN, data);
    yield put(A.onSetInvitationToken(newToken));
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionRelation,
        currentUserInOrganizationId,
        RequestStatus.SUCCESS,
        null,
        requestData,
        showAlert
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionRelation,
        currentUserInOrganizationId,
        RequestStatus.FAILURE,
        error,
        requestData
      )
    );
  }
}

export function* onFetchInvitationData({ payload: { invitationToken } }: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getChatWithMeInvitationData, invitationToken, RequestStatus.LOADING)
    );

    const invitationData = yield cps(client.restApiClient.getChatWithMeInvitationData, invitationToken);
    if (isEmpty(invitationData)) {
      throw new Error('No invitation data found');
    }

    const user = invitationData.user;
    const userId = user ? user.id : null;
    const organizationId = get(invitationData, 'userInOrganization.organizationId');
    const organizationName = get(invitationData, 'organization.name');
    yield put(onFetchInvitationDataSuccess(userId, organizationId, organizationName));
    yield put(onCreateUser(new User(user)));

    const isUserAuthenticated = yield select(isAuthenticated);

    if (isUserAuthenticated) {
      const userOrganizationIds = yield select(selectCurrentUserOrganizationIds);
      const isInOrganization = userOrganizationIds.includes(organizationId);
      if (isInOrganization) {
        yield call(onJoinChat, { payload: { invitationToken } });
      }
    }

    yield put(
      onSetRequestStatus(RequestTypesConstants.getChatWithMeInvitationData, invitationToken, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getChatWithMeInvitationData,
        invitationToken,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onJoinChat({
  payload: { invitationToken, isSigningUp, isAuthenticatingWithGoogle, token },
}: PartialPayloadAction) {
  let isUserAuthenticated = yield select(isAuthenticated);
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.joinChatWithMe, invitationToken, RequestStatus.LOADING));

    const username = yield select(selectEmail);
    const password = yield select(selectPassword);
    const fullName = yield select(selectFullName);

    const invitationUserId = yield select(selectInvitationUserId);
    const invitationOrganizationId = yield select(selectInvitationOrganizationId);

    if (isSigningUp) {
      yield call(onSignOut, CurrentUserModelActions.onSignOut({ deauthenticateGapi: true }));
      isUserAuthenticated = false;
    }

    if (!isUserAuthenticated) {
      if (isSigningUp) {
        const [firstName, lastName] = extractFullNameParts(fullName);
        if (isAuthenticatingWithGoogle) {
          yield call(onSignUpWithGoogleAccount, CurrentUserModelActions.onSignUpWithGoogleAccount({ token }));
        } else {
          yield call(onSignUp, CurrentUserModelActions.onSignUp({ username, password, firstName, lastName }));
        }
      } else {
        if (isAuthenticatingWithGoogle) {
          yield call(onSignInWithGoogleAccount, CurrentUserModelActions.onSignInWithGoogleAccount({ token: null }));
        } else {
          yield call(onSignIn, CurrentUserModelActions.onSignIn({ username, password }));
        }
      }
    }

    const currentUserId = yield select(selectCurrentUserId);
    const currentOrganizationId = yield select(selectCurrentOrganizationId);

    if (currentOrganizationId !== invitationOrganizationId) {
      if (currentUserId !== invitationUserId) {
        const result = yield cps(client.restApiClient.joinChatWithMe, invitationToken);
        const { invitedUser, userOrganizations } = result;
        const organizationIds = userOrganizations.map((organization) => organization.id);
        yield put(onBatchOrganizationsData(userOrganizations, invitedUser.id));
        yield put(onCreateUserOrganizations(invitedUser.id, organizationIds));
        yield put(onOpenModal(ModalType.POST_INVITATION_MODAL));
      }
      yield put(onSwitchOrganization(invitationOrganizationId, false, true));
    }

    const conversationUserIds = [invitationUserId];
    if (currentUserId !== invitationUserId) {
      conversationUserIds.push(currentUserId);
    }
    const conversationId = generateConversationId(conversationUserIds, invitationOrganizationId);

    yield put(onSetRequestStatus(RequestTypesConstants.joinChatWithMe, invitationToken, RequestStatus.SUCCESS));
    return yield put(push(makeConversationLink(conversationId)));
  } catch (error) {
    const errorCode = get(error, 'params.body.code');
    if (!isUserAuthenticated && errorCode === ResponseCode.RESOURCE_NOT_FOUND) {
      if (isSigningUp) {
        const openIdAuthenticateActionResult = yield select(onSignInWithGoogleAccountActionResult);
        if (
          openIdAuthenticateActionResult &&
          openIdAuthenticateActionResult.code === AuthStatus.ACCOUNT_DOES_NOT_EXIST
        ) {
          // ITS OK: next step is terms and condition confirmation
          return;
        }
      } else {
        // Login failed, leave only form error instead of alert
        yield put(onSetRequestStatus(RequestTypesConstants.joinChatWithMe, invitationToken, RequestStatus.FAILURE));
      }
    } else {
      handleError(error);
      yield put(
        onSetRequestStatus(RequestTypesConstants.joinChatWithMe, invitationToken, RequestStatus.FAILURE, error)
      );
    }
  }
}

export function* onFetchInvitationToken() {
  const currentUserInOrganizationId = yield select(selectCurrentUserInOrganizationId);
  yield put(
    onFetchCustomRelation(ExtensionNamespace.CHAT_WITH_ME, TargetType.USER_IN_ORGANIZATION, currentUserInOrganizationId)
  );
}
