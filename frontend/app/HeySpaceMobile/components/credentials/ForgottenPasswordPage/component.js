import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, SafeAreaView } from 'react-native'

import TopBar from '../TopBar'
import Header from '../Header'
import Input from '../Input'
import PrimaryButton from 'commonComponents/PrimaryButton'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

import styles from './styles'

ForgottenPasswordPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onSetEmailInputOuterRef: PropTypes.func.isRequired,

  validateEmail: PropTypes.func.isRequired,
  onSubmitEditingEmailInput: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGoToSignInPage: PropTypes.func.isRequired,
}

export default function ForgottenPasswordPage(props) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        <View>
          <TopBar
            text={`Go back to`}
            buttonText={`Sign in`}
            onButtonClick={props.onGoToSignInPage}
          />
          <View style={styles.content}>
            <Header
              text={`Forgotten password`}
            />
            <Text style={styles.description}>
              {`Enter your email adress below and we’ll send you a link to reset your password.`}
            </Text>
            <Input
              outerRef={props.onSetEmailInputOuterRef}
              primaryHeaderText={'Email:'}
              placeholder={'email@company.com'}
              validator={props.validateEmail}
              onSubmitEditing={props.onSubmitEditingEmailInput}
            />
            <PrimaryButton
              text={props.isLoading ? 'Sending link...' : 'Send link'}
              onPress={props.onSubmit}
              isDisabled={props.isLoading}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
