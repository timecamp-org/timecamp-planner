import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';

export interface WithToken {
  token: string;
}

export interface WithEmail {
  email: string;
}

export interface WithCredentials {
  username: string;
  password: string;
}

export interface WithFullName {
  firstName: string;
  lastName: string;
}

export interface WithPhone {
  phone: string;
}

export interface WithReferrer {
  referrer?: string;
}

export interface OnSignInWithGoogleAccountPayload extends WithToken {}

export interface OnSignInPayload extends WithCredentials {}

export interface OnSignInWithAppleAccountPayload extends Partial<WithFullName>, WithToken {}

export interface OnSignUpWithAppleAccountPayload extends WithFullName, WithToken, Partial<WithPhone> {}

export interface OnSignOutPayload {
  deauthenticateGapi: Boolean;
}

export interface OnSignUpPayload extends Partial<WithPhone & WithFullName>, WithCredentials, WithReferrer {}

export interface OnSignUpWithGoogleAccountPayload extends Partial<WithPhone & WithToken> {}

export interface OnSendEmailWithPasswordChangeLinkPayload extends WithEmail {}

export interface OnSetPasswordPayload extends WithToken {
  newPassword: string;
}

export interface OnPasswordChangePayload {
  newPassword: string;
  currentPassword: string;
}

export interface OnInvitedUserSetPasswordPayload extends WithFullName, WithToken {
  password: string;
}

export interface OnSendUserFeedbackPayload {
  feedback: AnyDict;
  feedbackType: string;
}

export interface OnCheckIfEmailExistPayload extends WithEmail {}

export interface SetTemporaryMainColorPayload {
  color: string;
}
