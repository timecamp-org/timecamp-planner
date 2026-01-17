import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AppEventEmitter } from 'common/services'
import BaseComponent from 'BaseComponent'
import { isValidEmail } from 'common/utils/validation'
import {
  selectCurrentOrganizationId,
} from 'models/domain/OrganizationsModel/selectors/domain'
import {
  selectCurrentOrganizationActivePeopleEmails,
} from 'models/domain/OrganizationsModel/selectors'
import { onInviteUsersToOrganization } from 'models/domain/OrganizationsModel/actions'
import generateId from 'common/utils/generate-pushid'
import { UserTracker } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { INVITE_USER_TO_EVENT } from 'components/settings/IOSSettingsNavButton/enhancers/EnhanceInviteUserButton'
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions'
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKinds } from 'models/domain/HumanMessageModel/types'
import isIOS from 'utils/isIOS'

function enhance(ComposedComponent) {
  class EnhanceInviteToWorkspaceScreen extends BaseComponent {

    static propTypes = {
      currentOrganizationId: PropTypes.string.isRequired,
    }

    state = {
      inputValue: '',
      validationMessage: null,
    }

    render() {
      return (
        <ComposedComponent
          inputValue={this.state.inputValue}
          validationMessage={this.state.validationMessage}
          onBlur={this.validateInputValue}
          onChangeText={this.onChangeText}
        />
      )
    }


    onChangeText(inputValue) {
      this.setState({
        inputValue,
      })
    }


    isUserAlreadyInOrganization(email) {
      return this.props.currentOrganizationPeopleEmails.includes(email)
    }

    validateInputValue() {
      const email = this.state.inputValue.toLowerCase()
      const { isValid, message: validationMessage } = isValidEmail(this.state.inputValue, true)

      if (isValid) {
        this.setState({
          validationMessage: null,
        })
      } else {
        this.setState({
          validationMessage,
        })
      }
    }

    onShowAlert(message, isError, email) {
      this.props.onAddAlert(message, isError ? HumanMessageKinds.error : HumanMessageKinds.success, email)
    }

    handleOnPressInviteButtonEvent() {
      const email = this.state.inputValue.toLowerCase()
      const { isValid, message } = isValidEmail(email, true)

      if (isValid) {
        if (!this.isUserAlreadyInOrganization(email)) {
          this.setState({
            validationMessage: null,
            inputValue: '',
          })
          this.onShowAlert('You\'ve successfully invited user', false, email)
          const userId = generateId()
          this.props.onInviteUserToOrganization(userId, email)
          UserTracker.track(UserTrackerEvent.memberInvited, { source: 'invite-screen' })
        } else {
          this.setState({
            validationMessage: 'User is already in organization',
          })
          this.onShowAlert('User is already in organization', true, email)
        }
      } else {
        this.setState({
          validationMessage: message,
        })
        this.onShowAlert(message, true, email)
      }
    }

    componentDidMount() {
      AppEventEmitter.on(INVITE_USER_TO_EVENT, this.handleOnPressInviteButtonEvent)
    }

    componentWillUnmount() {
      AppEventEmitter.removeListener(INVITE_USER_TO_EVENT, this.handleOnPressInviteButtonEvent)
    }

  }

  const mapStateToProps = (state, props) => ({
    currentOrganizationId: selectCurrentOrganizationId(state),
    currentOrganizationPeopleEmails: selectCurrentOrganizationActivePeopleEmails(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onInviteUserToOrganization: (userId, email) => dispatch(onInviteUsersToOrganization([{ email, userId }], isIOS)),
    onAddAlert: (message, kind, email) => dispatch(PopUpAlertsModelActions.onAddAlert({
      humanMessage: HumanMessage({
        kind: kind,
        text: message,
      }),
    }, `userWithEmail-${email}-invitation`)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceInviteToWorkspaceScreen)
}

export default enhance
