import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'
import RouteName from '../../../../AppNavigation/routeNames'
import { isValidEmail } from 'common/utils/validation'

import { onSendEmailWithPasswordChangeLink } from 'models/domain/CurrentUserModel/actions'
import { NavigationService } from 'common/services'

function Enhance(ComposedComponent) {
  class EnhanceForgottenPasswordPage extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onSendEmailWithPasswordChangeLink: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          onSetEmailInputOuterRef={this.onSetEmailInputOuterRef}

          // TODO: pass value from requestModel
          isLoading={false}

          validateEmail={this.validateEmail}
          onSubmitEditingEmailInput={this.onSubmit}
          onSubmit={this.onSubmit}
          onGoToSignInPage={this.onGoToSignInPage}
        />
      )
    }

    onSetEmailInputOuterRef(ref) {
      this.emailInputOuterRef = ref
    }

    validateEmail(email) {
      const { isValid, message } = isValidEmail(email, true)
      return {
        isValid: isValid,
        message: isValid ? null : message,
      }
    }

    onSubmit() {
      const email = this.emailInputOuterRef.getValue()
      const isEmailValid = isValidEmail(email)

      if (isEmailValid) {
        this.props.onSendEmailWithPasswordChangeLink(email)
        NavigationService.reset(RouteName.FORGOT_PASSWORD_COMPLETED, { userEmail: email })
      }
    }

    onGoToSignInPage() {
      NavigationService.navigate(RouteName.SIGN_IN)
    }

  }

  function mapDispatchToProps(dispatch) {
    return {
      onSendEmailWithPasswordChangeLink: (email) => dispatch(onSendEmailWithPasswordChangeLink({ email })),
    }
  }

  return connect(null, mapDispatchToProps)(EnhanceForgottenPasswordPage)
}

export default Enhance
