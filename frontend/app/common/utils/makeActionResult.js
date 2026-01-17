import get from 'lodash/get';

import { i18n } from '../i18n';
import { ActionResult } from '../models/domain/ActionResultModel';
import * as ChecklistsModelConstants from '../models/domain/ChecklistsModel/constants';
import * as CurrentUserModelConstants from '../models/domain/CurrentUserModel/constants';
import * as FilesModelConstants from '../models/domain/FilesModel/constants';
import { HumanMessage } from '../models/domain/HumanMessageModel/models';
import { HumanMessageKind } from '../models/domain/HumanMessageModel/types';
import * as MessagesConstants from '../models/domain/MessagesModel/constants';
import * as RequestConstants from '../models/domain/RequestModel/constants';
import * as RequestTypesConstants from '../models/domain/RequestModel/constants/requestTypes';
import { HeySpaceClient as client } from '../services';

export const missingActionResultCodeButOk = `missingActionResultCodeButOk`;
export const missingActionResultCodeButFail = `missingActionResultCodeButFail`;

export const onPasswordChangeWrongPassword = `CLIENT_ERROR: ERROR_PASSWORD_CHANGE_FORBIDDEN onPasswordChangeFailure`;

export const onEmailChangeInvalidEmail = `CLIENT_ERROR: ERROR_VALIDATION_FAILED onEmailChangeFailure`;
export const onEmailChangeWrongPassword = `CLIENT_ERROR: CURRENT_PASSWORD_DOES_NOT_MATCH onEmailChangeFailure`;
export const onEmailChangeDuplicateEmail = `CLIENT_ERROR: ERROR_DUPLICATE_USER onEmailChangeFailure `;

export const onSignInAuthenticationError = `CLIENT_ERROR: Unauthorized client.restApiClient.userAuthenticateWithCookie`;
export const onSignInAccountDeletedError =
  'CLIENT_ERROR: Account deleted client.restApiClient.userAuthenticateWithCookie';
export const onSignInAccountExistsError = 'CLIENT_ERROR: Email already in use client.restApiClient.userRegister';
export const onSendEmailWithPasswordChangeLinkEmailNotFoundError = `CLIENT_ERROR: ERROR_OBJECT_NOT_FOUND onSendEmailWithPasswordChangeLinkFailure`;
export const onSignUpDuplicateEmailError = `CLIENT_ERROR: ERROR_DUPLICATE_USER client.restApiClient.userRegister`;
export const onSignUpValidationError = `CLIENT_ERROR: ERROR_VALIDATION_FAILED client.restApiClient.userRegister`;
export const fetchError = `FETCH_ERROR`;
export const onEmailNotAllowedError = 'CLIENT_ERROR: Email already in use onCheckIfEmailExistFailure';

export const onSetPasswordActionResultInvalidToken = `CLIENT_ERROR: ERROR_INVALID_TOKEN onSetPasswordFailure`;
export const onCheckIfEmailExistSuccess = 'onCheckIfEmailExistSuccess';
export const onPopUpBlocked = 'onPopUpBlocked';
const UNKNOWN_ERROR = i18n.t('Unknown error');

// try best guess what result means
export default function (options) {
  const { isOk, code, data, error } = options;
  var actionResult = {};
  actionResult.data = data;
  // error takes precedence over other props
  if (error) {
    actionResult.isOk = false;
    actionResult.code = extractCodeFromError(error);
    actionResult.humanMessage =
      translateCodeToHumanMessage(code) || // if you want to create message from code and not server error
      translateCodeToHumanMessage(actionResult.code);
  } else {
    if (!code || code.length === 0) {
      actionResult.code = isOk ? missingActionResultCodeButOk : missingActionResultCodeButFail;
      actionResult.humanMessage = translateCodeToHumanMessage(actionResult.code);
    } else {
      actionResult.isOk = isOk ? true : false;
      actionResult.code = code;
      actionResult.humanMessage = translateCodeToHumanMessage(code);
    }
  }
  if (!actionResult.humanMessage) {
    actionResult.humanMessage = createDefaultHumanMessage();
  }
  return new ActionResult(actionResult);

  function translateCodeToHumanMessage(codeToTranslate) {
    var humanMessage = {};
    switch (codeToTranslate) {
      case onPasswordChangeWrongPassword: {
        humanMessage.text = i18n.t('Please provide correct current password');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case CurrentUserModelConstants.onPasswordChangeSuccess: {
        humanMessage.text = i18n.t('Your password is changed');
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case `${RequestTypesConstants.createLinkedViewSettingsForBaseView}Failure`: {
        humanMessage.text = i18n.t('Cannot create views. Please try again later.');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case `${RequestTypesConstants.updateViewSettingsBody}Failure`: {
        humanMessage.text = i18n.t("Something went wrong and we can't update view settings.");
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case `${RequestTypesConstants.deleteViewSettingsById}Failure`: {
        humanMessage.text = i18n.t("Something went wrong and we can't delete view.");
        humanMessage.kind = HumanMessageKind.error;

        break;
      }

      case RequestTypesConstants.onSendUserFeedback: {
        humanMessage.text = i18n.t('Something went wrong and we could not send your feedback');
        humanMessage.kind = HumanMessageKind.error;
        break;
      }

      case RequestConstants.onFetchLatestActiveUserConversationsFailure: {
        humanMessage.text = i18n.t('Something went wrong and we cannot get you latest active conversations');
        humanMessage.kind = HumanMessageKind.error;
        break;
      }

      case RequestConstants.onFetchUserLatestVisitedTasksFailure: {
        humanMessage.text = i18n.t('Something went wrong and we cannot get your latest visited tasks');
        humanMessage.kind = HumanMessageKind.error;
        break;
      }

      case CurrentUserModelConstants.onPasswordChangeFailure: {
        humanMessage.text = i18n.t('Something went wrong and we can’t change your password. Please try again later.');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onEmailChangeDuplicateEmail: {
        humanMessage.text = i18n.t('This email address is already registered');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onEmailChangeInvalidEmail: {
        humanMessage.text = i18n.t('Please enter a valid email address');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onEmailChangeWrongPassword: {
        humanMessage.text = i18n.t('Please enter a correct password');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onSignInAuthenticationError: {
        humanMessage.text = i18n.t("Your email and password didn't match. Please try again.");
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onSignInAccountDeletedError: {
        humanMessage.text = i18n.t('Your account has been deleted');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onSignInAccountExistsError: {
        humanMessage.text = i18n.t('This account already exists. Try to reset your password.');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onSendEmailWithPasswordChangeLinkEmailNotFoundError: {
        humanMessage.text = i18n.t('Email address not found');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onSignUpDuplicateEmailError: {
        humanMessage.text = i18n.t('This email is already registered');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onSignUpValidationError: {
        humanMessage.text = i18n.t('You must provide valid email and password');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case fetchError: {
        humanMessage.text = i18n.t('Fetch error');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case missingActionResultCodeButOk: {
        humanMessage.text = i18n.t('Action was successful but action code is missing');
        humanMessage.kind = HumanMessageKind.warning;

        break;
      }
      case missingActionResultCodeButFail: {
        humanMessage.text = i18n.t('Action failed and action code is missing');
        humanMessage.kind = HumanMessageKind.warning;

        break;
      }
      case onEmailNotAllowedError: {
        humanMessage.text = i18n.t('This email is already in use');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onCheckIfEmailExistSuccess: {
        humanMessage.text = i18n.t('This email address does not exist');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateNotificationSettingsFailure': {
        humanMessage.text = i18n.t(
          'Something went wrong and we can’t change your notifications preferences. Please try again later.'
        );
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'gapi.signIn':
      case 'onSignInWithGoogleAccountFailure': {
        humanMessage.text = i18n.t(`Something went wrong and you can't sign in. Please try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'gapi.signInSafeError': {
        humanMessage.text = '';
        humanMessage.kind = HumanMessageKind.error;
        break;
      }
      case 'gapi.signUp':
      case 'onSignUpWithGoogleAccountFailure': {
        humanMessage.text = i18n.t(`Something went wrong and you can't sign up. Please try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'gapi.signUpSafeError': {
        humanMessage.text = '';
        humanMessage.kind = HumanMessageKind.error;
        break;
      }
      case 'onInvitedUserSetPasswordFailure': {
        humanMessage.text = i18n.t(`Something went wrong and you can't sign up. Please try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case onPopUpBlocked: {
        humanMessage.text = i18n.t(`Your browser blocks popup windows. Please disable popup blockers for this site.`);
        humanMessage.kind = HumanMessageKind.warning;

        break;
      }
      case FilesModelConstants.onUploadFileFailure: {
        humanMessage.text = i18n.t(`Something went wrong and we can’t send your file. Please try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case FilesModelConstants.onDeleteFileFailure: {
        humanMessage.text = i18n.t(`Something went wrong and we can’t delete your file. Please try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case MessagesConstants.onDeleteLinkPreviewFailure: {
        humanMessage.text = i18n.t(`Something went wrong and we can’t hide link preview. Please try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onAddMessageReaction': {
        humanMessage.text = i18n.t(`Could not send reaction`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateMessage': {
        humanMessage.text = i18n.t(`Could not update message`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onSendMessage': {
        humanMessage.text = i18n.t(`Could not send message`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onMessageDeleteFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t delete this message`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onTaskCreateFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t create your task`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }

      case 'onTaskUpdateFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update your task`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onProjectCreateFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t create your project`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }

      case 'onProjectUpdateFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update your project`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateUserFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update your profile`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onInviteUserToConversationFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t invite user to conversation`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onInviteUserToConversationAlreadyExists': {
        humanMessage.text = i18n.t(`This user already is a member of your workspace.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRegisterOrganizationFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t create new workspace`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateWorkspaceFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update this workspace`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onCreateListFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t create list`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateListFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update list`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onCopyListFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t copy this list`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onMoveAllTasksInListFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t move tasks from this list`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onAddItemToChecklistFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t create checklist item`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRemoveItemFromChecklistFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t remove checklist item`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateChecklistItemFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update checklist item`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onSetIsExtensionEnabledForOrganizationFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update extension status`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'deleteExtensionRelation':
      case 'updateExtensionRelation': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update extension data`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'updateInviteTokenFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't generate invitation token.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'updateTaskVoteFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't create vote for a task.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'updateInviteTokenSuccess': {
        humanMessage.text = i18n.t(`Generated new invitation link.`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onTagCreate': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t create tag`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onDeleteTag': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t delete tag`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateTag': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update tag`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onTagAttach': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t attach tag`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onTagDetach': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t detach tag`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchSubscriptionDataFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t fetch subscription details`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchProjectTasksDataFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't fetch project tasks`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onDownloadInvoice': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t download invoice`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchOrganizationProjectsFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t fetch data from your workspace`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'ConnectionError': {
        humanMessage.text = i18n.t(`We couldn't connect to our server - give another try in a few minutes.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case FilesModelConstants.onAttachmentTooLarge: {
        humanMessage.text = get(
          error,
          'params.body.response',
          i18n.t('Your attachment is too large. In Premium it is not an issue! Upgrade now.')
        );
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'cancelOrganizationSubscriptionNotFound': {
        humanMessage.text = i18n.t('Workspace not found');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'cancelOrganizationSubscriptionForbidden': {
        humanMessage.text = i18n.t('Only organization owner can cancel subscription');
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'cancelOrganizationSubscription': {
        humanMessage.text = i18n.t(
          "Something went wrong and we can't cancel your subscription. Contact us directly at planner@timecamp.com."
        );
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateSubscriptionFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t update subscription`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onConvertChecklistItemToCard': {
        humanMessage.text = i18n.t(`You successfully converted selected checklist item to a task`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onUpdateSubscriptionSuccess': {
        humanMessage.text = i18n.t(`Your subscription has been updated`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onCancelOrganizationSubscriptionSuccess': {
        humanMessage.text = i18n.t(`Request for cancellation of your organization subscription sent.`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onFetchSubscriptionInvoicesFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t fetch subscription invoices`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRequestSubscriptionPaymentPageFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t get payment page. Please try again later`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onDeactivateUserFromOrganizationFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can’t delete user from workspace.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchProjectListsDataFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't fetch project lists`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateUserRoleFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't update user's role`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateUserRoleSuccess': {
        humanMessage.text = i18n.t(`Successfully updated user's workspace role`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case ChecklistsModelConstants.onMoveChecklistItem: {
        humanMessage.text = i18n.t(`Something went wrong and we can't move checklist item`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case ChecklistsModelConstants.onRemoveChecklistItemAssignee: {
        humanMessage.text = i18n.t(`Something went wrong and we can't remove assignee from checklist item`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case ChecklistsModelConstants.onAddChecklistItemAssignee: {
        humanMessage.text = i18n.t(`Something went wrong and we can't add assignee to checklist item`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onSetIsConversationVisibleFailure': {
        humanMessage.text = i18n.t(`Could not save your menu team members list visibility preferences`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }

      case 'onResendInvitationSuccess': {
        humanMessage.text = i18n.t(`Invitation to workspace sent successfully`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onResendInvitationFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't resend invitation`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onResendInvitationFailureTooManyRequests': {
        humanMessage.text = i18n.t(`Too many invitation requests at once. Please wait a few minutes.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onSetExtensionCustomFieldValueFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't update this field`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onSetExtensionCustomFieldValueSuccess': {
        humanMessage.text = i18n.t(`Field updated successfully`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onCopyCardFailure': {
        humanMessage.text = i18n.t(`Could not copy task`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onCopyCardSuccess': {
        humanMessage.text = i18n.t(`You've successfully copied task`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onUpdateWorkspaceLogoFailure': {
        humanMessage.text = i18n.t(`Error while uploading workspace logo`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onAuthorizeOAuth2Failure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't authorize: {{errorMessage}}`, {
          errorMessage: get(error, 'params.body.message', UNKNOWN_ERROR),
        });
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onLoadOAuthClientDataFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't fetch OAuth2 client`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onGenerateInvitationLinkFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't generate invitation link`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateNotificationFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't archive notification`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onInviteGuestsToOrganization': {
        humanMessage.text = i18n.t(`Something went wrong and we can't invite guests to organization`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRemoveGuestFromAllSpacesFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't remove guest from projects`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchOrganizationUserStatusesFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't fetch user statuses`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onSetUserStatusFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't set your status`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRemoveUserStatusFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't remove your status`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchCurrentUserOrganizationRolesFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we can't fetch your organization roles`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'deauthorizeOAuth1': {
        humanMessage.text = i18n.t(`Something went wrong and we can't deauthorize`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'copySpace': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't copy project`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case RequestTypesConstants.getExportedData: {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't export project as a csv file.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'joinChatWithMeForbidden': {
        humanMessage.text = i18n.t(`Invitation token has expired.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'joinChatWithMeFailed': {
        humanMessage.text = i18n.t(`Something went wrong with joining invitation link.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'getChatWithMeInvitationDataFailed': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't get invitation data.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'getChatWithMeInvitationDataForbidden': {
        humanMessage.text = i18n.t(`Invitation token has expired.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onConfirmIntegrationStatusFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't confirm integration status.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchUserApps': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't fetch user applications.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onCreateUserApp': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't create app.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateUserApp': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't update app.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onDeleteUserApp': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't delete app.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRegenerateSecret': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't regenerate your client secret.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRegenerateSecretSuccess': {
        humanMessage.text = i18n.t(`Generated new client secret.`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onAddAppCollaborator': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't add collaborator to your app.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onInviteAppCollaborator': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't invite collaborator to your app.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onRemoveAppCollaborator': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't remove collaborator from your app.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchUserInitialData': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't fetch initial data.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'archiveUserInOrganizationNotifications': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't archive your notifications.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'archiveUserInOrganizationNotificationsSuccess': {
        humanMessage.text = i18n.t(`Successfully archived your notifications.`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'archiveUserInOrganizationNotificationsLoading': {
        humanMessage.text = i18n.t(`We've started archiving your notifications.`);
        humanMessage.kind = HumanMessageKind.information;

        break;
      }
      case 'getOrganizationProjectsPeople': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't get people in projects.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'getOrganizationProjectsHaveUnreadMessages': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't get projects with unread messages.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'getOrganizationProjectsFailure':
      case 'onFetchProjectFailure':
      case 'onFetchCustomFieldsFailure':
      case 'onFetchCustomRelationFailure':
      case 'getUserInOrganizationJobStatusesFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't fetch necessary data.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onDeleteAccountForbidden': {
        humanMessage.text = i18n.t(
          `You don't have permission to delete your account because you have active subscribtion or active members in one of your Workspaces. Pass ownership or cancel subscription.`
        );
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onDeleteAccountSuccess': {
        humanMessage.text = i18n.t(`Your account has been deleted.`);
        humanMessage.kind = HumanMessageKind.success;

        break;
      }
      case 'onDeleteAccountFailed': {
        humanMessage.text = i18n.t(`Error while deleting your account. Try again later.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'getConversationSettingsFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't fetch your conversation settings.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onCreateProjectGroupFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't create Projects group.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchPersonalProjectStructure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't fetch your Projects structure.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onUpdateProjectGroup': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't update Projects group.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onMoveProjectInStructure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't update Project order.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }
      case 'onFetchNotificationsFailure':
      case 'onFetchUnreadNotificationsFailure':
      case 'onFetchUserLatestNotificationCenterDisplaysFailure': {
        humanMessage.text = i18n.t(`Something went wrong and we couldn't fetch notifications.`);
        humanMessage.kind = HumanMessageKind.error;

        break;
      }

      default: {
        return null;
      }
    }
    return HumanMessage(humanMessage);
  }

  function createDefaultHumanMessage() {
    var humanMessage = {};
    humanMessage.text = i18n.t(`Something went wrong. Please try again later.`);
    humanMessage.kind = HumanMessageKind.warning;

    return HumanMessage(humanMessage);
  }

  function extractCodeFromError() {
    // TODO improve
    if (error instanceof client.restApiClient.Errors.FetchError) {
      return error.code;
    } else if (error.params && error.params.body) {
      return `${error.code}: ${error.params.body.message} ${code}`;
    } else {
      return error.toString();
    }
  }
}
