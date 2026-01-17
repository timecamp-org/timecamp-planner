import { ImmutableMap } from 'common/types';
import { ActionResult } from '../ActionResultModel';

export interface CurrentUserState extends ImmutableMap<string, any> {
  onSignInActionResult: ActionResult;
  onSignInWithGoogleAccountActionResult: ActionResult;
  onSignOutActionResult: ActionResult;
  onSignUpActionResult: ActionResult;
  onSignUpWithGoogleAccountActionResult: ActionResult;

  isLoggingIn: boolean;

  onSendEmailWithPasswordChangeLinkActionResult: ActionResult;

  onPasswordChangeActionResult: null;
  onEmailChangeActionResult: null;

  onCheckIfEmailExistActionResult: null;
  onInvitedUserSetPasswordActionResult: null;
}

export enum AuthStatus {
  POP_UP_CLOSED_BY_USER_ERROR = 'popup_closed_by_user',
  ACCESS_DENIED_ERROR = 'access_denied',
  ACCOUNT_DOES_NOT_EXIST = 'account_does_not_exists',
  SIGN_IN_CANCELLED = 'sign_in_cancelled',
  IN_PROGRESS = 'in_progress',
  PLAY_SERVICES_NOT_AVAILABLE = 'play_services_not_available',
}

export enum StoreKey {
  IS_LOGGING_IN = 'isLoggingIn',
  ON_CHECK_IF_EMAIL_EXIST_ACTION_RESULT = 'onCheckIfEmailExistActionResult',
  ON_EMAIL_CHANGE_ACTION_RESULT = 'onEmailChangeActionResult',
  ON_INVITED_USER_SET_PASSWORD_ACTION_RESULT = 'onInvitedUserSetPasswordActionResult',
  ON_PASSWORD_CHANGE_ACTION_RESULT = 'onPasswordChangeActionResult',
  ON_SEND_EMAIL_WITH_PASSWORD_CHANGE_LINK_ACTION_RESULT = 'onSendEmailWithPasswordChangeLinkActionResult',
  ON_SET_PASSWORD_ACTION_RESULT = 'onSetPasswordActionResult',
  ON_SIGN_IN_ACTION_RESULT = 'onSignInActionResult',
  ON_SIGN_IN_WITH_APPLE_ACCOUNT_ACTION_RESULT = 'onSignInWithAppleAccountActionResult',
  ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT = 'onSignInWithGoogleAccountActionResult',
  ON_SIGN_OUT_ACTION_RESULT = 'onSignOutActionResult',
  ON_SIGN_UP_ACTION_RESULT = 'onSignUpActionResult',
  ON_SIGN_UP_WITH_APPLE_ACCOUNT_ACTION_RESULT = 'onSignUpWithAppleAccountActionResult',
  ON_SIGN_UP_WITH_GOOGLE_ACCOUNT_ACTION_RESULT = 'onSignUpWithGoogleAccountActionResult',
}
