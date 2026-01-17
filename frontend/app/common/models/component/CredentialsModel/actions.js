import * as constants from './constants'

export function onEmailChange(email) {
  return {
    type: constants.onEmailChange,
    email,
    meta: {
      isBatchDisabled: true,
    }
  }
}

export function onPasswordChange(password) {
  return {
    type: constants.onPasswordChange,
    password,
    meta: {
      isBatchDisabled: true,
    }
  }
}

export function onFullNameChange(fullName) {
  return {
    type: constants.onFullNameChange,
    fullName,
    meta: {
      isBatchDisabled: true,
    }
  }
}

export function onPhoneChange(phone) {
  return {
    type: constants.onPhoneChange,
    phone,
    meta: {
      isBatchDisabled: true,
    }
  }
}

export function onSignInSuccess() {
  return {
    type: constants.onSignInSuccess,
  }
}

export function onSetIsAcceptingTerms(isAcceptingTerms) {
  return {
    type: constants.onSetIsAcceptingTerms,
    isAcceptingTerms,
  }
}
