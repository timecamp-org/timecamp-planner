import isString from 'lodash/isString';
import { i18n, i18mark } from '../../i18n';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const minPasswordLength = 4;

/* Messages */
const emptyEmailText = i18mark('Looks like you forget about email');
const emptyPasswordText = i18mark("Don't forget about password");
const invalidPasswordLengthText = i18mark(`Password must be at least ${minPasswordLength} characters`);
const invalidNewPasswordSameAsOldText = i18mark('New password must be different than the old one');
const invalidEmailAtSignText = i18mark('An email address must contain a single @');
const invalidEmailPortionText = i18mark('The portion after the @ is invalid');

const emptyFullNameText = i18mark('Looks like you forget about name');
const invalidFullNameSurname = i18mark('Field must contain your name and surname e.g. John Smith');

const invalidNicknameSpaces = i18mark("Nickname can't contain spaces");
const emptyNicknameText = i18mark("Nickname can't be empty");

function validateEmail(email: string): boolean {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isValidEmail(email: string, withMessage: boolean = false): boolean | ValidationResult {
  const isValid = validateEmail(email);
  let result: boolean | ValidationResult = isValid;

  if (withMessage) {
    result = { isValid };
    if (isValid) {
      result.message = null;
    } else {
      const atSigns = email.match(/[@]{1}/g);
      if (email === '') {
        result.message = emptyEmailText;
      } else if (!atSigns) {
        result.message = invalidEmailAtSignText;
      } else if (atSigns.length > 1) {
        result.message = invalidEmailAtSignText;
      } else if (!email.match(/[@]{1}.+\..{2,}/g) || !result.message) {
        result.message = invalidEmailPortionText;
      }
      if (result.message) {
        result.message = i18n.t(result.message);
      }
    }
  }

  return result;
}

export function isValidNickname(nickname: string, withMessage: boolean = false): boolean | ValidationResult {
  const isNotEmpty = nickname.length >= 1;
  const doesNotContainSpaces = nickname.split(' ').length === 1;
  const isValid = isString(nickname) && isNotEmpty && doesNotContainSpaces;
  let result: boolean | ValidationResult = isValid;

  if (withMessage) {
    if (isValid) {
      result = {
        isValid,
        message: null,
      };
    } else if (!doesNotContainSpaces) {
      result = {
        isValid,
        message: invalidNicknameSpaces,
      };
    } else if (!isNotEmpty) {
      result = {
        isValid,
        message: emptyNicknameText,
      };
    } else {
      result = {
        isValid,
        message: null,
      };
    }
  }

  return result;
}

export function isValidPassword(password: string, withMessage: boolean = false): boolean | ValidationResult {
  const isValid = isString(password) && password.length >= minPasswordLength;
  let result: boolean | ValidationResult = isValid;

  if (withMessage) {
    result = { isValid };
    if (isValid) {
      result.message = null;
    } else {
      if (password === '') {
        result.message = emptyPasswordText;
      } else if (password.length < 4) {
        result.message = invalidPasswordLengthText;
      }

      if (result.message) {
        result.message = i18n.t(result.message);
      }
    }
  }
  return result;
}

export function isValidNewPassword(
  oldPassword: string,
  newPassword: string,
  withMessage: boolean = false
): boolean | ValidationResult {
  if (newPassword === oldPassword) {
    return withMessage ? { isValid: false, message: invalidNewPasswordSameAsOldText } : false;
  } else {
    return isValidPassword(newPassword, withMessage);
  }
}

export function prepareFullName(fullName: string): string {
  return fullName.trim().replace(/\s\s+/g, ' ');
}

export function isValidFullName(fullName: string, withMessage: boolean = false): boolean | ValidationResult {
  let isValid = isString(fullName) && fullName.length >= 0;

  if (isValid) {
    const names = prepareFullName(fullName).split(' ');
    if (names.length > 1) {
      isValid = isValid && names[0].length > 0 && names[1].length > 0;
    } else {
      isValid = false;
    }
  }

  let result: boolean | ValidationResult = isValid;

  if (withMessage) {
    result = { isValid };
    if (isValid) {
      result.message = null;
    } else {
      if (fullName === '') {
        result.message = emptyFullNameText;
      } else {
        result.message = invalidFullNameSurname;
      }
      if (result.message) {
        result.message = i18n.t(result.message);
      }
    }
  }

  return result;
}

export function isValidPrintableKey(keycode: number): boolean {
  var valid =
    (keycode > 47 && keycode < 58) || // number keys
    keycode === 32 ||
    keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
    (keycode > 64 && keycode < 91) || // letter keys
    (keycode > 95 && keycode < 112) || // numpad keys
    (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    (keycode > 218 && keycode < 223); // [\]' (in order)

  return valid;
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) {
    return true;
  }
  const regEx = /^\+[1-9]\d{10,14}$/;

  return regEx.test(phoneNumber);
}
