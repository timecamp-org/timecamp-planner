import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

import TopBar from '../TopBar';
import Header from '../Header';
import Input from '../Input';
import PrimaryButton from 'commonComponents/PrimaryButton';
import GoogleButton from '../GoogleButton';
import Separator from '../Separator';
import AppleButton from '../AppleButton';
import isIOS from '../../../utils/isIOS';
import { AppleButton as AppleButtonExternal } from '@invertase/react-native-apple-authentication';

import styles from './styles';

SignInPage.propTypes = {
  onSubmitEditingEmailInput: PropTypes.func.isRequired,
  onSubmitEditingPasswordInput: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  validateEmail: PropTypes.func.isRequired,
  validatePassword: PropTypes.func.isRequired,
};

export default function SignInPage(props) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
        <View>
          <TopBar text={`Don't have an account?`} buttonText={`Sign up`} onButtonClick={props.onGoToSignUpPage} />
          <View style={styles.content}>
            <Header text={`Sign in to Planner`} />
            {isIOS && <AppleButton buttonType={AppleButtonExternal.Type.SIGN_IN} />}
            <GoogleButton />
            <Separator />
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
              secondaryHeaderText={'Forgot password?'}
              onSecondaryHeaderClick={props.onGoToForgottenPassword}
              placeholder={'password'}
              textContentType={'password'}
              secureTextEntry
              onSubmitEditing={props.onSubmitEditingPasswordInput}
              validator={props.validatePassword}
              humanMessage={props.genericHumanMessageModel}
            />
            {props.isFetchError ? (
              <Text style={styles.fetchErrorMessage}>
                {'Something went wrong. Please check your internet connection'}
              </Text>
            ) : null}
            <PrimaryButton
              text={props.isLoading ? 'Signing in...' : 'Sign in'}
              onPress={props.onSubmit}
              isDisabled={props.isLoading}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
