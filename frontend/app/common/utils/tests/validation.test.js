import * as validation from 'common/utils/validation';

describe('common/utils/validation', () => {
  it('isValidEmail', () => {
    const validEmail = 'test@test.com';
    let invalidEmail = '';

    expect(validation.isValidEmail(validEmail)).toBeTruthy();
    expect(validation.isValidEmail(invalidEmail)).toBeFalsy();
  });

  it('isValidEmail withMessage', () => {
    let invalidEmail = '';
    const validEmail = 'test@test.com';

    expect(validation.isValidEmail(validEmail)).toBeTruthy();
    expect(validation.isValidEmail(invalidEmail, true)).toMatchSnapshot();

    invalidEmail = 'test';

    expect(validation.isValidEmail(invalidEmail, true)).toMatchSnapshot();

    invalidEmail = 'test@';

    expect(validation.isValidEmail(invalidEmail, true)).toMatchSnapshot();
  });

  it('isValidPassword', () => {
    const validPassword = '123456789';
    let invalidPassword = '';

    expect(validation.isValidPassword(validPassword)).toBeTruthy();
    expect(validation.isValidPassword(invalidPassword)).toBeFalsy();
  });

  it('isValidEmail withMessage', () => {
    const validPassword = '123456789';
    let invalidPassword = '';

    expect(validation.isValidPassword(validPassword)).toBeTruthy();
    expect(validation.isValidPassword(invalidPassword, true)).toMatchSnapshot();

    invalidPassword = '123';

    expect(validation.isValidPassword(invalidPassword, true)).toMatchSnapshot();
  });
});
