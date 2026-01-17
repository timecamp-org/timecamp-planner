import React from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

import TopBar from '../TopBar';
import Header from '../Header';
import Input from '../Input';
import PrimaryButton from 'commonComponents/PrimaryButton';
import GoogleButton from '../GoogleButton';
import Separator from '../Separator';
import TermsAndConditionsWithCheckbox from '../TermsAndConditionsWithCheckbox';

import styles from './styles';
import isIOS from '../../../utils/isIOS';
import AppleButton from '../AppleButton';
import { AppleButton as AppleButtonExternal } from '@invertase/react-native-apple-authentication';

SignUpPage.propTypes = {
  isAcceptingTerms: PropTypes.bool,
  termsAndConditionsMessage: PropTypes.string,

  validateFullName: PropTypes.func.isRequired,
  validateEmail: PropTypes.func.isRequired,
  validatePassword: PropTypes.func.isRequired,
  onSubmitEditingFullNameInput: PropTypes.func.isRequired,
  onSubmitEditingEmailInput: PropTypes.func.isRequired,
  onSubmitEditingPasswordInput: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGoToSignInPage: PropTypes.func.isRequired,
  onSetIsAcceptingTerms: PropTypes.func,
};

export default function SignUpPage(props) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
        <View>
          <TopBar text={`Already have an account?`} buttonText={`Sign in`} onButtonClick={props.onGoToSignInPage} />
          <View style={styles.content}>
            <Header text={`Get started with Planner`} />
            {isIOS && <AppleButton buttonType={AppleButtonExternal.Type.SIGN_UP} />}
            <GoogleButton text={'Sign up with Google'} />
            <Separator />
            <Input
              outerRef={props.onSetFullNameInputOuterRef}
              innerRef={props.onSetFullNameInputInnerRef}
              primaryHeaderText={'Full name:'}
              placeholder={'John Smith'}
              textContentType={'name'}
              onSubmitEditing={props.onSubmitEditingFullNameInput}
              validator={props.validateFullName}
            />
            <Input
              outerRef={props.onSetEmailInputOuterRef}
              innerRef={props.onSetEmailInputInnerRef}
              primaryHeaderText={'Email:'}
              placeholder={'email@company.com'}
              textContentType={'emailAddress'}
              keyboardType={'email-address'}
              onSubmitEditing={props.onSubmitEditingEmailInput}
              validator={props.validateEmail}
            />
            <Input
              outerRef={props.onSetPasswordInputOuterRef}
              innerRef={props.onSetPasswordInputInnerRef}
              primaryHeaderText={'Password:'}
              placeholder={'password'}
              textContentType={'newPassword'}
              secureTextEntry
              onSubmitEditing={props.onSubmitEditingPasswordInput}
              validator={props.validatePassword}
            />
            <TermsAndConditionsWithCheckbox
              isAcceptingTerms={props.isAcceptingTerms}
              message={props.termsAndConditionsMessage}
              onSetIsAcceptingTerms={props.onSetIsAcceptingTerms}
            />
            <PrimaryButton
              text={props.isLoading ? 'Signing up...' : 'Sign up'}
              onPress={props.onSubmit}
              isDisabled={props.isLoading}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
