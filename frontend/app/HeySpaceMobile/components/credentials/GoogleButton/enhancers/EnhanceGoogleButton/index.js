import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import {
  GoogleSignin,
} from '@react-native-community/google-signin';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions'
import { onSignInWithGoogleAccountActionResult } from 'models/domain/CurrentUserModel/selectors'
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceGoogleButton extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      text: PropTypes.string,
    }

    static defaultProps = {
      text: 'Sign in with Google'
    }

    state = {
      isDisabled: true,
    }

    render() {
      return (
        <ComposedComponent
          isDisabled={this.state.isDisabled}
          text={this.props.text}

          onSignIn={this.props.onSignInWithGoogleAccount}
        />
      )
    }

    async componentDidMount() {
      // disable button if play services are not available 
      const hasPlayServices = await GoogleSignin.hasPlayServices()
      this.setState({
        isDisabled: !hasPlayServices,
      })
    }

    componentDidUpdate(prevProps) {
      const signInResult = this.props.onSignInWithGoogleAccountActionResult
      if (!prevProps.onSignInWithGoogleAccountActionResult && signInResult && !signInResult.isOk) {
        this.props.onAddAlert({
          humanMessage: signInResult.humanMessage,
        })
      }
    }

  }

  function mapStateToProps(state) {
    return {
      onSignInWithGoogleAccountActionResult: onSignInWithGoogleAccountActionResult(state),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSignInWithGoogleAccount: () => dispatch(CurrentUserModelActions.onSignInWithGoogleAccount()),
      onAddAlert: (alert) => dispatch(PopUpAlertsModelActions.onAddAlert(alert)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceGoogleButton)
}

export default Enhance
