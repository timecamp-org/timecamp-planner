import * as Constants from './constants';

import { ActionResultInterface } from '../ActionResultModel';
import { PayloadAction, ActionCreator } from 'common/types';
import {
  OnSignInWithGoogleAccountPayload,
  OnSignInPayload,
  OnSignInWithAppleAccountPayload,
  OnSignOutPayload,
  OnSignUpPayload,
  OnSignUpWithGoogleAccountPayload,
  OnSendEmailWithPasswordChangeLinkPayload,
  OnSetPasswordPayload,
  OnPasswordChangePayload,
  OnSendUserFeedbackPayload,
  OnInvitedUserSetPasswordPayload,
  OnCheckIfEmailExistPayload,
  OnSignUpWithAppleAccountPayload,
} from './payloads';
import { createAction } from 'common/utils/createAction';

export const onSignIn: ActionCreator<OnSignInPayload> = (payload) => createAction(Constants.onSignIn, payload);

export const onSignInSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignInSuccess, actionResult);

export const onSignInFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignInFailure, actionResult);

export const onSignInWithGoogleAccount: ActionCreator<OnSignInWithGoogleAccountPayload> = (payload) =>
  createAction(Constants.onSignInWithGoogleAccount, payload);

export const onSignInWithGoogleAccountSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignInWithGoogleAccountSuccess, actionResult);

export const onSignInWithGoogleAccountFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignInWithGoogleAccountFailure, actionResult);

export const onSignInWithAppleAccount: ActionCreator<OnSignInWithAppleAccountPayload> = ({
  token = '',
  firstName = '',
  lastName = '',
}) =>
  createAction(Constants.onSignInWithAppleAccount, {
    token,
    firstName,
    lastName,
  });

export const onSignInWithAppleAccountSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignInWithAppleAccountSuccess, actionResult);

export const onSignInWithAppleAccountFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignInWithAppleAccountFailure, actionResult);

export const onSignUpWithAppleAccount: ActionCreator<OnSignUpWithAppleAccountPayload> = (payload) =>
  createAction(Constants.onSignUpWithAppleAccount, payload);

export const onSignUpWithAppleAccountSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignUpWithAppleAccountSuccess, actionResult);

export const onSignUpWithAppleAccountFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignUpWithAppleAccountFailure, actionResult);

export const onSignOut: ActionCreator<OnSignOutPayload> = (payload) =>
  createAction(
    Constants.onSignOut,
    payload || {
      deauthenticateGapi: true,
    }
  );

export const onSignOutSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignOutSuccess, actionResult);

export const onSignOutFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignOutFailure, actionResult);

export const onAuthenticationDelete = (): PayloadAction => createAction(Constants.onAuthenticationDelete, {});

export const onAuthenticationDeleteSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onAuthenticationDeleteSuccess, actionResult);

export const onAuthenticationDeleteFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onAuthenticationDeleteFailure, actionResult);

export const onSignUp: ActionCreator<OnSignUpPayload> = (payload) => createAction(Constants.onSignUp, payload);

export const onSignUpSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignUpSuccess, actionResult);

export const onSignUpFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignUpFailure, actionResult);

export const onSignUpWithGoogleAccount: ActionCreator<OnSignUpWithGoogleAccountPayload> = (payload) =>
  createAction(Constants.onSignUpWithGoogleAccount, payload);

export const onSignUpWithGoogleAccountSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignUpWithGoogleAccountSuccess, actionResult);

export const onSignUpWithGoogleAccountFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSignUpWithGoogleAccountFailure, actionResult);

export const onSendEmailWithPasswordChangeLink: ActionCreator<OnSendEmailWithPasswordChangeLinkPayload> = (payload) =>
  createAction(Constants.onSendEmailWithPasswordChangeLink, payload);

export const onSendEmailWithPasswordChangeLinkSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSendEmailWithPasswordChangeLinkSuccess, actionResult);

export const onSendEmailWithPasswordChangeLinkFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSendEmailWithPasswordChangeLinkFailure, actionResult);

export const onSetPassword: ActionCreator<OnSetPasswordPayload> = (payload) =>
  createAction(Constants.onSetPassword, payload);

export const onSetPasswordSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSetPasswordSuccess, actionResult);

export const onSetPasswordFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onSetPasswordFailure, actionResult);

export const onPasswordChange: ActionCreator<OnPasswordChangePayload> = (payload) =>
  createAction(Constants.onPasswordChange, payload);

export const onPasswordChangeSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onPasswordChangeSuccess, actionResult);

export const onPasswordChangeFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onPasswordChangeFailure, actionResult);

export const onPasswordChangeActonResultClear = (): PayloadAction =>
  createAction(Constants.onPasswordChangeActonResultClear, {});

export const onResetToInitialState = (): PayloadAction => createAction(Constants.onResetToInitialState, {});

export const onCheckIfEmailExist: ActionCreator<OnCheckIfEmailExistPayload> = (payload) =>
  createAction(Constants.onCheckIfEmailExist, payload);

export const onCheckIfEmailExistSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onCheckIfEmailExistSuccess, actionResult);

export const onCheckIfEmailExistFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onCheckIfEmailExistFailure, actionResult);

export const onInvitedUserSetPassword: ActionCreator<OnInvitedUserSetPasswordPayload> = (payload) =>
  createAction(Constants.onInvitedUserSetPassword, payload);

export const onInvitedUserSetPasswordSuccess: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onInvitedUserSetPasswordSuccess, actionResult);

export const onInvitedUserSetPasswordFailure: ActionCreator<ActionResultInterface> = (actionResult) =>
  createAction(Constants.onInvitedUserSetPasswordFailure, actionResult);

export const onSendUserFeedback: ActionCreator<OnSendUserFeedbackPayload> = (payload) =>
  createAction(Constants.onSendUserFeedback, payload);

export const onDeleteAccount = (): PayloadAction => createAction(Constants.onDeleteAccount, {});
