import { call, put } from 'redux-saga/effects'
import makeActionResult, { onPasswordChangeWrongPassword } from '../../../../utils/makeActionResult'

import * as Constants from '../constants'
import * as RequestTypesConstants from '../constants/requestTypes'
import * as PopUpAlertsModelActions from '../../../component/PopUpAlertsModel/actions'
import * as FilesModelConstants from '../../FilesModel/constants'
import * as MessagesConstants from '../../MessagesModel/constants'
import { RequestError, ResponseCode } from '../types';
import get from 'lodash/get'
import { Type as ErrorType } from '../../../../ErrorDefinitions'
import * as ChecklistsModelConstants from '../../ChecklistsModel/constants'
import { ExtensionNamespace } from '../../../domain/ExtensionsModel/types'
import { onPasswordChangeFailure } from '../../CurrentUserModel/constants'
import { paymentAgentError } from '../../SubscriptionModel/constants/humanMessages'
import { AnyDict, InternalError } from '../../../../types';
import { wifiOff } from '../../../component/PopUpAlertsModel/constants/alertLeftIcons'
import { i18mark } from '../../../../i18n'
import { HumanMessage } from '../../HumanMessageModel/models'
import { HumanMessageKind } from '../../HumanMessageModel/types'
import { Id } from '../../../../utils/identifier'

const connectionErrorHumanMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18mark(`We couldn't connect to our server - give another try in a few minutes.`),
})

const forbiddenErrorHumanMessage = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18mark(`You have no access for that resource.`),
})

function* onAddConnectionAlert() {
  yield put(PopUpAlertsModelActions.onAddAlert({ humanMessage: connectionErrorHumanMessage, leftIcon: wifiOff }, 'ConnectionError', false))
}

function* onAddForbiddenAlert() {
  yield put(PopUpAlertsModelActions.onAddAlert({ humanMessage: forbiddenErrorHumanMessage }, 'Forbidden', false))
}

function* onAddRateLimitAlert(error) {
  const message = get(error, 'params.body.response', 'Too many requests')
  const tooManyRequestMessage = HumanMessage({
    kind: HumanMessageKind.error,
    text: message,
  })
  yield put(PopUpAlertsModelActions.onAddAlert({ humanMessage: tooManyRequestMessage }, 'rate-limit', false))
}

export function* onFailedRequest(requestType: string, error: InternalError, data: AnyDict) {
  const code = error.code

  const errorStatusCode = get(error, 'params.statusCode', null)
  const extensionNamespace = get(data, 'extensionNamespace', null)

  if (code === RequestError.FETCH_ERROR) {
    return yield call(onAddConnectionAlert)
  }

  switch (errorStatusCode) {
    case ResponseCode.TOO_MANY_REQUESTS: {
      return yield call(onAddRateLimitAlert, error)
    }
    default: break;
  }

  requestType = sanitizeRequestType(requestType)

  switch (requestType) {
    case RequestTypesConstants.changePassword: {
      if (errorStatusCode === ResponseCode.FORBIDDEN) {
        yield call(createFailureAlert, onPasswordChangeWrongPassword, error)
      } else {
        yield call(createFailureAlert, onPasswordChangeFailure, error)
      }
      break
    }
    case RequestTypesConstants.deleteCurrentUser: {
      if (errorStatusCode === ResponseCode.FORBIDDEN) {
        return yield call(createFailureAlert, 'onDeleteAccountForbidden', error)
      }
      return yield call(createFailureAlert, 'onDeleteAccountFailed', error)
      break
    }

    case RequestTypesConstants.getLatestActiveUserConversations: {
      yield call(createFailureAlert, Constants.onFetchLatestActiveUserConversationsFailure, error)
      break
    }

    case RequestTypesConstants.onSendUserFeedback: {
      yield call(createFailureAlert, RequestTypesConstants.onSendUserFeedback, error)
      break
    }

    case RequestTypesConstants.getUserLatestVisitedTasks: {
      yield call(createFailureAlert, Constants.onFetchUserLatestVisitedTasksFailure, error)
      break
    }

    case RequestTypesConstants.deleteLinkPreview: {
      yield call(createFailureAlert, MessagesConstants.onDeleteLinkPreviewFailure, error)
      break
    }
    case RequestTypesConstants.createFile: {
      if (errorStatusCode === ResponseCode.FORBIDDEN) {
        yield call(createFailureAlert, FilesModelConstants.onAttachmentTooLarge, error, null, false)
        break
      } else {
        yield call(createFailureAlert, FilesModelConstants.onUploadFileFailure, error)
        break
      }
    }
    case RequestTypesConstants.removeFile: {
      yield call(createFailureAlert, FilesModelConstants.onDeleteFileFailure, error)
      break
    }
    case RequestTypesConstants.sendMessage: {
      yield call(createFailureAlert, 'onSendMessage', error)
      break
    }
    case RequestTypesConstants.updateMessage: {
      yield call(createFailureAlert, 'onUpdateMessage', error)
      break
    }
    case RequestTypesConstants.removeMessage: {
      yield call(createFailureAlert, 'onMessageDeleteFailure', error)
      break
    }
    case RequestTypesConstants.addMessageReaction: {
      yield call(createFailureAlert, 'onAddMessageReaction', error)
      break
    }
    case RequestTypesConstants.updateNotificationsSettings: {
      yield call(createFailureAlert, 'onUpdateNotificationSettingsFailure', error)
      break
    }
    case RequestTypesConstants.createTask: {
      yield call(createFailureAlert, 'onTaskCreateFailure', error)
      break
    }
    case RequestTypesConstants.addUserToTaskPeople:
    case RequestTypesConstants.removeTaskPeopleRole:
    case RequestTypesConstants.addUserToTaskFollowers:
    case RequestTypesConstants.removeTaskFollower:
    case RequestTypesConstants.addTaskAttachment:
    case RequestTypesConstants.removeTaskAttachment:
    case RequestTypesConstants.updateTask: {
      yield call(createFailureAlert, 'onTaskUpdateFailure', error)
      break
    }
    case RequestTypesConstants.createList: {
      yield call(createFailureAlert, 'onCreateListFailure', error)
      break
    }
    case RequestTypesConstants.addUserToTaskListFollowers:
    case RequestTypesConstants.removeTaskListFollower:
    case RequestTypesConstants.updateList: {
      yield call(createFailureAlert, 'onUpdateListFailure', error)
      break
    }
    case RequestTypesConstants.copyListWithTasks: {
      yield call(createFailureAlert, 'onCopyListFailure', error)
      break
    }
    case RequestTypesConstants.copyTask: {
      yield call(createFailureAlert, 'onCopyCardFailure', error)
      break
    }
    case RequestTypesConstants.moveAllTasksInList: {
      yield call(createFailureAlert, 'onMoveAllTasksInListFailure', error)
      break
    }
    case RequestTypesConstants.createProject: {
      yield call(createFailureAlert, 'onProjectCreateFailure', error)
      break
    }
    case RequestTypesConstants.addUserToProjectPeople:
    case RequestTypesConstants.updateProjectPeopleRole:
    case RequestTypesConstants.removeProjectPeopleRole:
    case RequestTypesConstants.addUserToProjectFollowers:
    case RequestTypesConstants.removeProjectFollower:
    case RequestTypesConstants.updateProject: {
      yield call(createFailureAlert, 'onProjectUpdateFailure', error)
      break
    }

    case RequestTypesConstants.updateCurrentUser: {
      yield call(createFailureAlert, 'onUpdateUserFailure', error)
      break
    }

    case RequestTypesConstants.createWorkspace: {
      yield call(createFailureAlert, 'onRegisterOrganizationFailure', error)
      break
    }

    case RequestTypesConstants.updateOrganization: {
      yield call(createFailureAlert, 'onUpdateWorkspaceFailure', error)
      break
    }

    case RequestTypesConstants.createChecklistItem: {
      yield call(createFailureAlert, 'onAddItemToChecklistFailure', error)
      break
    }
    case RequestTypesConstants.removeChecklistItem: {
      yield call(createFailureAlert, 'onRemoveItemFromChecklistFailure', error)
      break
    }
    case RequestTypesConstants.updateChecklistItem: {
      yield call(createFailureAlert, 'onUpdateChecklistItemFailure', error)
      break
    }
    case RequestTypesConstants.updateExtensionStatusInOrganization: {
      yield call(createFailureAlert, 'onSetIsExtensionEnabledForOrganizationFailure', error)
      break
    }

    case RequestTypesConstants.updateExtensionRelation: {
      if (extensionNamespace) {
        switch (extensionNamespace) {
          case ExtensionNamespace.CHAT_WITH_ME: {
            yield call(createFailureAlert, 'updateInviteTokenFailure', error)
            break
          }
          case ExtensionNamespace.TASK_VOTING: {
            yield call(createFailureAlert, 'updateTaskVoteFailure', error)
            break
          }
          default: {
            yield call(createFailureAlert, 'updateExtensionRelationFailure', error)
            break
          };
        }
      }
      break
    }

    case RequestTypesConstants.deleteExtensionRelation: {
      yield call(createFailureAlert, 'deleteExtensionRelation', error)
      break
    }

    case RequestTypesConstants.createTag: {
      yield call(createFailureAlert, 'onTagCreate', error)
      break
    }

    case RequestTypesConstants.deleteTag: {
      yield call(createFailureAlert, 'onDeleteTag', error)
      break
    }

    case RequestTypesConstants.updateTag: {
      yield call(createFailureAlert, 'onUpdateTag', error)
      break
    }

    case RequestTypesConstants.attachTagToTask: {
      yield call(createFailureAlert, 'onTagAttach', error)
      break
    }

    case RequestTypesConstants.detachTagFromTask: {
      yield call(createFailureAlert, 'onTagDetach', error)
      break
    }

    case RequestTypesConstants.getSubscriptionViewData: {
      yield call(createFailureAlert, 'onFetchSubscriptionDataFailure', error)
      break
    }
    case RequestTypesConstants.downloadInvoice: {
      yield call(createFailureAlert, 'onDownloadInvoice', error)
      break
    }
    case RequestTypesConstants.updateSubscription: {
      yield call(createFailureAlert, 'onUpdateSubscriptionFailure', error)
      break
    }
    case RequestTypesConstants.getSubscriptionInvoices: {
      yield call(createFailureAlert, 'onFetchSubscriptionInvoicesFailure', error)
      break
    }
    case RequestTypesConstants.checkoutSubscriptionPaymentPage: {
      const customError = get(error, 'params.body.message')
      if (customError) {
        yield put(PopUpAlertsModelActions.onAddAlert({
          humanMessage: paymentAgentError(customError),
        }, 'paymentAgentError', false))
      } else {
        yield call(createFailureAlert, 'onRequestSubscriptionPaymentPageFailure', error)
      }
      break
    }
    case RequestTypesConstants.deactivateUserFromOrganization: {
      yield call(createFailureAlert, 'onDeactivateUserFromOrganizationFailure', error)
      break
    }
    case RequestTypesConstants.cancelOrganizationSubscription: {
      switch (errorStatusCode) {
        case ResponseCode.RESOURCE_NOT_FOUND: {
          yield call(createFailureAlert, 'cancelOrganizationSubscriptionNotFound', error)
          break
        }
        case ResponseCode.FORBIDDEN: {
          yield call(createFailureAlert, 'cancelOrganizationSubscriptionForbidden', error)
          break
        }
        default: {
          yield call(createFailureAlert, 'cancelOrganizationSubscription', error)
          break
        }
      }
      break
    }
    case RequestTypesConstants.inviteUsersToConversations: {
      let humanMessageCode = 'onInviteUserToConversationFailure'
      switch (code) {
        case ErrorType.USER_ALREADY_IN_ORGANIZATION: {
          humanMessageCode = 'onInviteUserToConversationAlreadyExists'
          break
        }

        default: break
      }
      yield call(createFailureAlert, humanMessageCode, error)
      break
    }
    case RequestTypesConstants.updateUserRole: {
      yield call(createFailureAlert, 'onUpdateUserRoleFailure', error)
      break
    }
    case RequestTypesConstants.moveChecklistItem: {
      yield call(createFailureAlert, ChecklistsModelConstants.onMoveChecklistItem, error)
      break
    }
    case RequestTypesConstants.removeChecklistItemAssignee: {
      yield call(createFailureAlert, ChecklistsModelConstants.onRemoveChecklistItemAssignee, error)
      break
    }
    case RequestTypesConstants.addChecklistItemAssignee: {
      yield call(createFailureAlert, ChecklistsModelConstants.onAddChecklistItemAssignee, error)
      break
    }
    case RequestTypesConstants.updateConversationVisibility: {
      yield call(createFailureAlert, 'onSetIsConversationVisibleFailure', error)
      break
    }
    case RequestTypesConstants.updateCustomFields: {
      yield call(createFailureAlert, 'onSetExtensionCustomFieldValueFailure', error)
      break
    }
    case RequestTypesConstants.getCustomFields: {
      yield call(createFailureAlert, 'onFetchCustomFieldsFailure', error)
      break
    }
    case RequestTypesConstants.fetchCustomRelation: {
      yield call(createFailureAlert, 'onFetchCustomRelationFailure', error)
      break
    }
    case RequestTypesConstants.authorizeOAuth2: {
      yield call(createFailureAlert, 'onAuthorizeOAuth2Failure', error)
      break
    }
    case RequestTypesConstants.getOauthClientData: {
      yield call(createFailureAlert, 'onLoadOAuthClientDataFailure', error)
      break
    }
    case RequestTypesConstants.generateInvitationLink: {
      yield call(createFailureAlert, 'onGenerateInvitationLinkFailure', error)
      break
    }

    case RequestTypesConstants.resendInvitationToOrganization: {
      switch (errorStatusCode) {
        case ResponseCode.TOO_MANY_REQUESTS:
          yield call(createFailureAlert, 'onResendInvitationFailureTooManyRequests', error, 'onResendInvitationFailureTooManyRequests')
          break
        default:
          yield call(createFailureAlert, 'onResendInvitationFailure', error)
          break
      }
      break
    }

    case RequestTypesConstants.updateNotification: {
      yield call(createFailureAlert, 'onUpdateNotificationFailure', error)
      break
    }

    case RequestTypesConstants.inviteGuestsToOrganization: {
      yield call(createFailureAlert, 'onInviteGuestsToOrganization', error)
      break
    }

    case RequestTypesConstants.deleteGuestFromAllSpaces: {
      yield call(createFailureAlert, 'onRemoveGuestFromAllSpacesFailure', error)
      break
    }

    case RequestTypesConstants.getOrganizationUserStatuses: {
      yield call(createFailureAlert, 'onFetchOrganizationUserStatusesFailure', error)
      break
    }

    case RequestTypesConstants.setUserStatus: {
      yield call(createFailureAlert, 'onSetUserStatusFailure', error)
      break
    }

    case RequestTypesConstants.deleteUserStatus: {
      yield call(createFailureAlert, 'onRemoveUserStatusFailure', error)
      break
    }

    case RequestTypesConstants.getUserOrganizationRoles: {
      yield call(createFailureAlert, 'onFetchCurrentUserOrganizationRolesFailure', error)
      break
    }

    case RequestTypesConstants.deauthorizeOAuth1: {
      yield call(createFailureAlert, 'deauthorizeOAuth1', error)
      break
    }

    case RequestTypesConstants.copySpace: {
      yield call(createFailureAlert, 'copySpace', error)
      break
    }

    case RequestTypesConstants.getProjectLists: {
      yield call(createFailureAlert, 'onFetchProjectListsDataFailure', error)
      break
    }

    case RequestTypesConstants.getProjectTasks: {
      yield call(createFailureAlert, 'onFetchProjectTasksDataFailure', error)
      break
    }

    case RequestTypesConstants.getExportedData: {
      yield call(createFailureAlert, RequestTypesConstants.getExportedData, error)
      break
    }

    case RequestTypesConstants.joinChatWithMe: {
      if (errorStatusCode === ResponseCode.FORBIDDEN) {
        yield call(createFailureAlert, 'joinChatWithMeForbidden', error)
      } else {
        yield call(createFailureAlert, 'joinChatWithMeFailed', error)
      }
      break
    }

    case RequestTypesConstants.getChatWithMeInvitationData: {
      if (errorStatusCode === ResponseCode.FORBIDDEN) {
        yield call(createFailureAlert, 'getChatWithMeInvitationDataForbidden', error)
      } else {
        yield call(createFailureAlert, 'getChatWithMeInvitationDataFailed', error)
      }
    }

    case RequestTypesConstants.confirmIntegrations: {
      yield call(createFailureAlert, 'onConfirmIntegrationStatusFailure', error)
      break
    }

    case RequestTypesConstants.createUserApp: {
      yield call(createFailureAlert, 'onCreateUserApp', error)
      break
    }

    case RequestTypesConstants.updateUserApp: {
      yield call(createFailureAlert, 'onUpdateUserApp', error)
      break
    }

    case RequestTypesConstants.deleteUserApp: {
      yield call(createFailureAlert, 'onDeleteUserApp', error)
      break
    }

    case RequestTypesConstants.getUserApps: {
      yield call(createFailureAlert, 'onFetchUserApps', error)
      break
    }

    case RequestTypesConstants.regenerateOauthClientSecret: {
      yield call(createFailureAlert, 'onRegenerateSecret', error)
      break
    }

    case RequestTypesConstants.addUserAppCollaborator: {
      yield call(createFailureAlert, 'onAddAppCollaborator', error)
      break
    }

    case RequestTypesConstants.inviteUserAppCollaborator: {
      yield call(createFailureAlert, 'onInviteAppCollaborator', error)
      break
    }

    case RequestTypesConstants.removeUserAppCollaborator: {
      yield call(createFailureAlert, 'onRemoveAppCollaborator', error)
      break
    }

    case RequestTypesConstants.getUserInitialData: {
      yield call(createFailureAlert, 'onFetchUserInitialData', error)
      break
    }

    case RequestTypesConstants.archiveUserInOrganizationNotifications: {
      yield call(createFailureAlert, 'archiveUserInOrganizationNotifications', error)
      break
    }

    case RequestTypesConstants.getOrganizationProjectsPeople: {
      yield call(createFailureAlert, 'getOrganizationProjectsPeople', error)
      break
    }

    case RequestTypesConstants.getOrganizationProjects: {
      yield call(createFailureAlert, 'getOrganizationProjectsFailure', error)
      break
    }

    case RequestTypesConstants.getOrganizationProjectsHaveUnreadMessages: {
      yield call(createFailureAlert, 'getOrganizationProjectsHaveUnreadMessages', error)
      break
    }
    case RequestTypesConstants.getUserInOrganizationJobStatuses: {
      yield call(createFailureAlert, 'getUserInOrganizationJobStatusesFailure', error)
      break
    }
    case RequestTypesConstants.createLinkedViewSettingsForBaseView: {
      yield call(createFailureAlert, `${RequestTypesConstants.createLinkedViewSettingsForBaseView}Failure`, error)
      break
    }
    case RequestTypesConstants.updateViewSettingsBody: {
      yield call(createFailureAlert, `${RequestTypesConstants.updateViewSettingsBody}Failure`, error)
      break
    }
    case RequestTypesConstants.deleteViewSettingsById: {
      yield call(createFailureAlert, `${RequestTypesConstants.deleteViewSettingsById}Failure`, error)
      break
    }
    case RequestTypesConstants.getProject: {
      yield call(createFailureAlert, `onFetchProjectFailure`, error)
      break
    }
    case RequestTypesConstants.getConversationSettings: {
      yield call(createFailureAlert, `getConversationSettingsFailure`, error)
      break
    }
    case RequestTypesConstants.createProjectGroup: {
      yield call(createFailureAlert, `onCreateProjectGroupFailure`, error)
      break
    }
    case RequestTypesConstants.getPersonalProjectStructure: {
      yield call(createFailureAlert, `onFetchPersonalProjectStructure`, error)
      break
    }
    case RequestTypesConstants.updateProjectGroup: {
      yield call(createFailureAlert, `onUpdateProjectGroup`, error)
      break
    }
    case RequestTypesConstants.moveProjectInStructure: {
      yield call(createFailureAlert, `onMoveProjectInStructure`, error)
      break
    }
    case RequestTypesConstants.getUserLatestAllNotificationCenterDisplays: {
      yield call(createFailureAlert, `onFetchUserLatestNotificationCenterDisplaysFailure`, error)
      break
    }
    case RequestTypesConstants.getUserNotifications: {
      yield call(createFailureAlert, `onFetchNotificationsFailure`, error)
      break
    }
    case RequestTypesConstants.getUserAllUnreadNotifications: {
      yield call(createFailureAlert, `onFetchUnreadNotificationsFailure`, error)
      break
    }

    default: {
      if (errorStatusCode === ResponseCode.FORBIDDEN) {
        return yield call(onAddForbiddenAlert)
      }
      break;
    }
  }
}

export function* onSuccessRequest(requestType: string, data: AnyDict) {
  const extensionNamespace = get(data, 'extensionNamespace', null)
  switch (requestType) {
    case RequestTypesConstants.convertChecklistItemToCard: {
      yield call(createSuccessAlert, 'onConvertChecklistItemToCard')
      break
    }
    case RequestTypesConstants.updateSubscription: {
      yield call(createSuccessAlert, 'onUpdateSubscriptionSuccess')
      break
    }
    case RequestTypesConstants.cancelOrganizationSubscription: {
      yield call(createSuccessAlert, 'onCancelOrganizationSubscriptionSuccess')
      break
    }
    case RequestTypesConstants.resendInvitationToOrganization: {
      yield call(createSuccessAlert, 'onResendInvitationSuccess')
      break
    }
    case RequestTypesConstants.updateCustomFields: {
      yield call(createSuccessAlert, 'onSetExtensionCustomFieldValueSuccess')
      break
    }
    case RequestTypesConstants.copyTask: {
      yield call(createSuccessAlert, 'onCopyCardSuccess')
      break
    }
    case RequestTypesConstants.updateUserRole: {
      yield call(createSuccessAlert, 'onUpdateUserRoleSuccess')
      break
    }
    case RequestTypesConstants.regenerateOauthClientSecret: {
      yield call(createSuccessAlert, 'onRegenerateSecretSuccess')
      break
    }
    case RequestTypesConstants.deleteCurrentUser: {
      yield call(createSuccessAlert, 'onDeleteAccountSuccess')
      break
    }
    case RequestTypesConstants.updateExtensionRelation: {
      if (extensionNamespace && extensionNamespace === ExtensionNamespace.CHAT_WITH_ME) {
        yield call(createSuccessAlert, 'updateInviteTokenSuccess')
      }
      break
    }
    default: break
  }
}

export function* onLoadingRequest(requestType: string, data: AnyDict) {
  switch (requestType) {
    case RequestTypesConstants.archiveUserInOrganizationNotifications: {
      yield call(createLoadingAlert, 'archiveUserInOrganizationNotificationsLoading')
      break
    }
    default: break
  }
}


export function* createFailureAlert(code: string, error?: Error, id?: Id, isSelfDisposable?: boolean) {
  yield put(PopUpAlertsModelActions.onAddAlert(makeActionResult({
    isOk: false,
    code: code,
    error
  }), id, isSelfDisposable))
}

export function* createSuccessAlert(code: string, id?: Id, isSelfDisposable?: boolean) {
  yield put(PopUpAlertsModelActions.onAddAlert(makeActionResult({
    isOk: true,
    code: code,
  }), id, isSelfDisposable))
}

export function* createLoadingAlert(code: string, id?: Id, isSelfDisposable?: boolean) {
  yield put(PopUpAlertsModelActions.onAddAlert(makeActionResult({
    isOk: true,
    code: code,
  }), id, isSelfDisposable))
}

function sanitizeRequestType(requestType: string): string {
  const [baseRequestType] = requestType.split('?')
  return baseRequestType
}
