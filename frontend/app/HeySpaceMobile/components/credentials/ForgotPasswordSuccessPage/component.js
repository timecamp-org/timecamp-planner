import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { View, Text, SafeAreaView, Image } from 'react-native'

import TopBar from '../TopBar'

import Assets from 'common/commonAssets'
import styles from './styles'
import { NavigationService } from '../../../../common/services'
import RouteName from '../../AppNavigation/routeNames'

ForgotPasswordSuccessPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onSetEmailInputOuterRef: PropTypes.func.isRequired,

  validateEmail: PropTypes.func.isRequired,
  onSubmitEditingEmailInput: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGoToSignInPage: PropTypes.func.isRequired,
}

function ForgotPasswordSuccessPage(props) {
  const navigateToSignInPage = useCallback(() => {
    NavigationService.reset(RouteName.SIGN_IN)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        text={`Go back to`}
        buttonText={`Sign in`}
        onButtonClick={navigateToSignInPage}
      />
      <View style={styles.content}>
        <Image
          style={styles.mascot}
          source={{ uri: Assets.CHARACTER_30 }}
          resizeMode={'contain'}
        />
        <Text style={styles.header}>
          {`Check your inbox`}
        </Text>
        <Text style={styles.description}>
          {`A link to change your password has been sent to ${props.userEmail}`}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPasswordSuccessPage
