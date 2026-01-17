import { Map } from 'immutable';
import { cps, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';

import { UserTracker, HeySpaceClient as client } from '../../../services';
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import { EntityStatus } from '../EntityModel/types';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { getOrganizationExtensions } from '../RequestModel/constants/requestTypes';
import { selectIsRequestRepeatable } from '../RequestModel/selectors';
import { RequestStatus } from '../RequestModel/types';
import { EnabledStatus, ExtensionNamespace, ExtensionsData } from './types';

import isMobileApp from 'common/utils/isMobileApp';
import { onFetchInvitationToken, onFetchInvitationTokenSuccess } from 'models/domain/ChatWithMeModel/actions';
import { getInvitationTokenFromExtensionsData } from 'models/domain/ChatWithMeModel/helpers';
import { OnFetchCustomRelationPayload } from 'models/domain/ExtensionsModel/payloads';
import { PartialPayloadAction, PayloadAction } from '../../../types';
import getEnabledStatusField from '../../domain/ExtensionsModel/constants/getEnabledStatusField';
import { FieldType, TargetType } from '../../domain/ExtensionsModel/types';
import {
  generateExtensionCustomFieldId,
  generateExtensionCustomFieldKey,
  getCustomFieldsMap,
} from '../../domain/ExtensionsModel/utils';
import { selectCurrentUserInOrganizationId } from '../OrganizationsModel/selectors';
import { onFetchHasTimecampIntegration } from '../Timecamp/actions';
import * as Actions from './actions';
import * as Constants from './constants';
import { Extension } from './models';
import * as Selectors from './selectors/domain';

const emptyMap = Map();

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(Constants.onInit, onInit);
    });
    yield fork(function* () {
      yield takeLatest(Constants.onFetchOrganizationExtensions, onFetchOrganizationExtensions);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onSetIsExtensionEnabledForOrganization, onSetIsExtensionEnabledForOrganization);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onSetIsExtensionEnabledForSpace, onSetIsExtensionEnabledForSpace);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onSetExtensionEnabledStatus, onSetExtensionEnabledStatus);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onSetExtensionCustomFieldValue, onSetExtensionCustomFieldValue);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onFetchCustomFields, onFetchCustomFields);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onFetchCustomRelation, onFetchCustomRelation);
    });
  },
];

export function* onInit() {
  const currentUserInOrganizationId = yield select(selectCurrentUserInOrganizationId);
  yield put(Actions.onFetchCustomFields(TargetType.USER_IN_ORGANIZATION, currentUserInOrganizationId));
  yield put(onFetchInvitationToken());
  if (!isMobileApp()) {
    yield put(Actions.onFetchOrganizationExtensions());
  }
}

export function* onFetchOrganizationExtensions({ payload }: PartialPayloadAction) {
  yield put(onFetchHasTimecampIntegration());

  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  const namespacesString = payload.extensionNamespaces?.join(',');

  const requestIdParams = [currentOrganizationId, namespacesString];

  const queryParams = {
    namespaces: namespacesString,
  };

  try {
    const isRequestRepeatable = yield select(selectIsRequestRepeatable, {
      requestType: getOrganizationExtensions,
      objectId: requestIdParams,
    });

    if (!isRequestRepeatable) {
      return;
    }

    yield put(
      onSetRequestStatus(RequestTypesConstants.getOrganizationExtensions, requestIdParams, RequestStatus.LOADING)
    );

    const organizationExtensionsResult = yield cps(
      client.restApiClient.getOrganizationExtensions,
      currentOrganizationId,
      queryParams
    );

    let organizationExtensions = emptyMap;
    let isExtensionEnabledForOrganization = emptyMap;

    organizationExtensionsResult.forEach((extension) => {
      organizationExtensions = organizationExtensions.set(extension.id, new Extension(extension));
      isExtensionEnabledForOrganization = isExtensionEnabledForOrganization.setIn(
        [currentOrganizationId, extension.id],
        extension.status === EntityStatus.EXISTS
      );
    });

    yield put(
      Actions.onFetchOrganizationExtensionsSuccess(
        makeActionResult({
          isOk: true,
          code: 'onFetchOrganizationExtensionsSuccess',
          data: {
            organizationExtensions,
            isExtensionEnabledForOrganization,
          },
        })
      )
    );

    yield put(
      onSetRequestStatus(RequestTypesConstants.getOrganizationExtensions, requestIdParams, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(RequestTypesConstants.getOrganizationExtensions, requestIdParams, RequestStatus.FAILURE, error)
    );
  }
}

export function* onSetIsExtensionEnabledForOrganization({
  payload: { extensionId, organizationId, isEnabled },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionStatusInOrganization,
        organizationId,
        RequestStatus.LOADING
      )
    );

    let status;
    if (isEnabled) {
      status = EntityStatus.EXISTS;
    } else {
      status = EntityStatus.DELETED;
    }

    if (isEnabled) {
      yield put(
        Actions.onSetExtensionCustomFieldValue(
          extensionId,
          TargetType.ORGANIZATION,
          organizationId,
          FieldType.ENABLED_STATUS,
          EnabledStatus.ENABLE_FOR_ALL_SPACES
        )
      );
    }

    yield put(
      Actions.onSetIsExtensionEnabledForOrganizationSuccess(
        makeActionResult({
          isOk: true,
          code: 'onSetIsExtensionEnabledForOrganizationSuccess',
          data: { extensionId, organizationId, isEnabled },
        })
      )
    );

    yield cps(client.restApiClient.updateExtensionStatusInOrganization, organizationId, extensionId, status);

    const extensionName = yield select(Selectors.selectExtensionName, { extensionId });
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionStatusInOrganization,
        organizationId,
        RequestStatus.SUCCESS
      )
    );
    UserTracker.track(UserTrackerEvent.addonStatusChanged, {
      isEnabled,
      extensionName,
    });
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionStatusInOrganization,
        organizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onSetIsExtensionEnabledForSpace({
  payload: { extensionId, spaceId, isEnabled },
}: PartialPayloadAction) {
  try {
    const extensionNamespace = yield select(Selectors.selectExtensionNamespace, { extensionId });
    const fieldType = getEnabledStatusField(extensionNamespace, TargetType.PROJECT);
    yield put(Actions.onSetExtensionCustomFieldValue(extensionId, TargetType.PROJECT, spaceId, fieldType, isEnabled));
  } catch (error) {
    handleError(error);
  }
}

export function* onSetExtensionEnabledStatus({
  payload: { extensionId, organizationId, enabledStatus },
}: PartialPayloadAction) {
  try {
    yield put(
      Actions.onSetExtensionCustomFieldValue(
        extensionId,
        TargetType.ORGANIZATION,
        organizationId,
        FieldType.ENABLED_STATUS,
        enabledStatus
      )
    );
  } catch (error) {
    handleError(error);
  }
}

export function* onSetExtensionCustomFieldValue({
  payload: { extensionId, targetType, targetId, fieldType, value, showAlert = false },
}: PartialPayloadAction) {
  const fieldId = generateExtensionCustomFieldId(extensionId, targetType, targetId, fieldType);
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateCustomFields, fieldId, RequestStatus.LOADING));

    const extensionNamespace = yield select(Selectors.selectExtensionNamespace, { extensionId });
    const fullKey = generateExtensionCustomFieldKey(extensionNamespace, fieldType);
    const customFields = { [fullKey]: value };

    yield cps(client.restApiClient.updateCustomFields, targetType, targetId, customFields);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateCustomFields,
        fieldId,
        RequestStatus.SUCCESS,
        null,
        null,
        showAlert
      )
    );
  } catch (error) {
    handleError(error, { extensionId, targetType, targetId, fieldType, value, showAlert });
    yield put(onSetRequestStatus(RequestTypesConstants.updateCustomFields, fieldId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchCustomFields({ payload: { targetType, targetId } }: PartialPayloadAction) {
  const requestId = [targetType, targetId];
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getCustomFields, requestId, RequestStatus.LOADING));

    const result = yield cps(client.restApiClient.getCustomFields, targetType, targetId);
    const customFieldsMap = getCustomFieldsMap(result, targetType);
    yield put(Actions.onBatchCustomFieldValues(customFieldsMap));
    yield put(onSetRequestStatus(RequestTypesConstants.getCustomFields, requestId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { targetType, targetId });
    yield put(onSetRequestStatus(RequestTypesConstants.getCustomFields, requestId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchCustomRelation({
  payload: { namespace, targetType, targetId },
}: PayloadAction<OnFetchCustomRelationPayload>) {
  const requestId = [namespace, targetType, targetId];
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.fetchCustomRelation, requestId, RequestStatus.LOADING));
    // @ts-ignore
    const result: ExtensionsData = yield cps(
      client.restApiClient.getExtensionRelation,
      namespace,
      targetType,
      targetId
    );
    if (result) {
      switch (namespace) {
        case ExtensionNamespace.CHAT_WITH_ME: {
          const chatWithMeToken = getInvitationTokenFromExtensionsData(result);
          if (chatWithMeToken) {
            yield put(onFetchInvitationTokenSuccess(chatWithMeToken));
          }
          break;
        }
        default: {
          break;
        }
      }
    }
    yield put(onSetRequestStatus(RequestTypesConstants.fetchCustomRelation, requestId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { targetType, targetId });
    yield put(onSetRequestStatus(RequestTypesConstants.fetchCustomRelation, requestId, RequestStatus.FAILURE, error));
  }
}
