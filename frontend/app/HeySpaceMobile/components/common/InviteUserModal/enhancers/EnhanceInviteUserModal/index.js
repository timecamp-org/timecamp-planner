import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isValidEmail } from 'common/utils/validation'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { UserTracker } from 'common/services'

import BaseComponent from 'BaseComponent'
import { onInviteUsersToOrganization } from 'models/domain/OrganizationsModel/actions'
import generateId from 'common/utils/generate-pushid'
import { selectRequestStatusDomain } from 'models/domain/RequestModel/selectors/domain'
import { inviteUsersToConversations } from 'models/domain/RequestModel/constants/requestTypes'
import { RequestStatus } from 'models/domain/RequestModel/types'
import createRequestId from 'models/domain/RequestModel/createRequestId'
import { is } from 'immutable'
import isIOS from '../../../../../utils/isIOS'

function enhance(ComposedComponent) {
  class EnhanceInviteUserModal extends BaseComponent {

    static propTypes = {
      onInviteUserToOrganization: PropTypes.func.isRequired,
    }

    state = {
      inputValue: '',
      isValid: true,
      validationMessage: '',
      lastInvitedUserEmail: '',
    }

    render() {
      return (
        <ComposedComponent
          inputValue={this.state.inputValue}
          isValid={this.state.isValid}
          validationMessage={this.state.validationMessage}
          isVisible={this.props.isVisible}
          onClose={this.props.onClose}
          onChangeInputValue={this.onChangeInputValue}
          onInvite={this.onInvite}
        />
      )
    }

    onChangeInputValue(text) {
      this.setState({
        inputValue: text,
        lastInvitedUserEmail: null,
        lastInvitedUserId: null,
      })
    }

    validateInput() {
      const { inputValue } = this.state
      const validation = isValidEmail(inputValue, true)
      this.setState({
        isValid: validation.isValid,
        validationMessage: validation.message,
      })

      return validation
    }

    onInvite() {
      const { isValid } = this.validateInput()
      if (isValid) {
        const email = this.state.inputValue.toLowerCase()
        const userId = generateId()
        this.setState({
          isValid: true,
          validationMessage: '',
          lastInvitedUserEmail: email,
          lastInvitedUserId: userId,
          inputValue: '',
        })
        this.props.onInviteUserToOrganization(userId, email)
      }
    }

    componentDidUpdate(prevProps) {
      if (!is(prevProps.requestStatuses, this.props.requestStatuses) && this.state.lastInvitedUserId) {
        const requestId = createRequestId(inviteUsersToConversations, this.state.lastInvitedUserId)
        const requestStatus = this.props.requestStatuses.get(requestId)
        switch (requestStatus) {
          case RequestStatus.SUCCESS: {
            UserTracker.track(UserTrackerEvent.memberInvited, { source: 'team-menu' })
            return this.setState({ 
              validationMessage: `You successfuly invited ${this.state.lastInvitedUserEmail}`,
              isValid: true,
            })
          }
          case RequestStatus.FAILURE:
            return this.setState({ 
              validationMessage: `Something wen't wrong. Try again later.`,
              isValid: false,
            })
          default:
            return null
        }
      }
    }

  }

  const mapStateToProps = (state) => ({
    requestStatuses: selectRequestStatusDomain(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onInviteUserToOrganization: (userId, email) => dispatch(onInviteUsersToOrganization([{ email, userId }], isIOS)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceInviteUserModal)
}

export default enhance
