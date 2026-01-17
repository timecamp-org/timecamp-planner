import { fromJS } from 'immutable';
import * as Constants from './constants';
import { StoreKey } from './types';
import { Reducer } from 'react';
import { PayloadAction } from 'common/types';
import { CurrentUserState } from './types';

const initialState: CurrentUserState = fromJS({
  onSignInActionResult: null,
  onSignInWithGoogleAccountActionResult: null,
  onSignOutActionResult: null,
  onSignUpActionResult: null,
  onSignUpWithGoogleAccountActionResult: null,

  isLoggingIn: null,

  onSendEmailWithPasswordChangeLinkActionResult: null,

  onPasswordChangeActionResult: null,
  onEmailChangeActionResult: null,

  onCheckIfEmailExistActionResult: null,
  onInvitedUserSetPasswordActionResult: null,
});

const reducer: Reducer<CurrentUserState, PayloadAction> = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case Constants.onSignIn: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], true);
    }
    case Constants.onSignInSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignInFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignInWithGoogleAccount: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], true);
    }
    case Constants.onSignInWithGoogleAccountSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignInWithGoogleAccountFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignInWithAppleAccount: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_APPLE_ACCOUNT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], true);
    }
    case Constants.onSignInWithAppleAccountSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_APPLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignInWithAppleAccountFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_APPLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignOut: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null);
    }
    case Constants.onSignOutSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], action.payload);
    }
    case Constants.onSignOutFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null);
    }
    case Constants.onSignUp: {
      return state
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], true);
    }
    case Constants.onSignUpSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignUpFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_UP_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignUpWithGoogleAccount: {
      return state
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], true);
    }
    case Constants.onSignUpWithGoogleAccountSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_UP_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignUpWithGoogleAccountFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_UP_WITH_GOOGLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignUpWithAppleAccount: {
      return state
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_UP_WITH_APPLE_ACCOUNT_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], true);
    }
    case Constants.onSignUpWithAppleAccountSuccess: {
      return state
        .setIn([StoreKey.ON_SIGN_UP_WITH_APPLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }
    case Constants.onSignUpWithAppleAccountFailure: {
      return state
        .setIn([StoreKey.ON_SIGN_UP_WITH_APPLE_ACCOUNT_ACTION_RESULT], action.payload)
        .setIn([StoreKey.ON_SIGN_OUT_ACTION_RESULT], null)
        .setIn([StoreKey.ON_SIGN_IN_ACTION_RESULT], null)
        .setIn([StoreKey.IS_LOGGING_IN], false);
    }

    case Constants.onSendEmailWithPasswordChangeLink: {
      return state.setIn([StoreKey.ON_SEND_EMAIL_WITH_PASSWORD_CHANGE_LINK_ACTION_RESULT], null);
    }
    case Constants.onSendEmailWithPasswordChangeLinkSuccess:
    case Constants.onSendEmailWithPasswordChangeLinkFailure: {
      return state.setIn([StoreKey.ON_SEND_EMAIL_WITH_PASSWORD_CHANGE_LINK_ACTION_RESULT], action.payload);
    }
    case Constants.onPasswordChangeSuccess:
    case Constants.onPasswordChangeFailure: {
      return state.set(StoreKey.ON_PASSWORD_CHANGE_ACTION_RESULT, action.payload);
    }
    case Constants.onPasswordChangeActonResultClear: {
      return state.set(StoreKey.ON_PASSWORD_CHANGE_ACTION_RESULT, null);
    }
    case Constants.onSetPasswordSuccess:
    case Constants.onSetPasswordFailure: {
      return state.set(StoreKey.ON_SET_PASSWORD_ACTION_RESULT, action.payload);
    }

    case Constants.onResetToInitialState: {
      return initialState;
    }
    case Constants.onCheckIfEmailExistSuccess:
    case Constants.onCheckIfEmailExistFailure: {
      return state.setIn([StoreKey.ON_CHECK_IF_EMAIL_EXIST_ACTION_RESULT], action.payload);
    }

    case Constants.onInvitedUserSetPasswordSuccess:
    case Constants.onInvitedUserSetPasswordFailure: {
      return state.setIn([StoreKey.ON_INVITED_USER_SET_PASSWORD_ACTION_RESULT], action.payload);
    }
    default:
      return state;
  }
};

export default reducer;
