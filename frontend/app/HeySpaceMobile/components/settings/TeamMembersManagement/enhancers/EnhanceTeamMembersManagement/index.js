import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { isValidEmail } from 'common/utils/validation'
import generateId from 'common/utils/generate-pushid'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { UserTracker } from 'common/services'

import BaseComponent from 'BaseComponent'
import {
  selectIsCurrentUserOrganizationAdmin,
  selectCurrentOrganizationActivePeopleEmails,
  selectCurrentOrganizationActivePeopleWithoutBot,
} from 'models/domain/OrganizationsModel/selectors'

import { selectDeactivatedUserIds } from 'models/domain/OrganizationsModel/selectors/domain'
import { onInviteUsersToOrganization } from 'models/domain/OrganizationsModel/actions'
import isIOS from 'utils/isIOS'

function enhance(ComposedComponent) {

  class EnhanceTeamMembersManagement extends BaseComponent {

    static propTypes = {
      userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      currentOrganizationPeopleEmails: ImmutablePropTypes.listOf(PropTypes.string).isRequired,

      onInviteUserToOrganization: PropTypes.func.isRequired,
    }

    state = {
      inviteInputValue: '',
      isInviteInputValid: true,
      isDisabledUsersVisible: false,
    }

    render() {
      return (
        <ComposedComponent
          userIds={this.props.userIds}
          deactivatedUserIds={this.props.deactivatedUserIds}
          inviteInputValue={this.state.inviteInputValue}
          isInviteInputValid={this.state.isInviteInputValid}
          isDisabledUsersVisible={this.state.isDisabledUsersVisible}
          isCurrentUserOrganizationAdmin={this.props.isCurrentUserOrganizationAdmin}

          onChangeInviteInput={this.onChangeInviteInput}
          onPressInviteButton={this.onPressInviteButton}
          onSetInviteInput={this.onSetInviteInput}
          onBlurInviteInput={this.onBlurInviteInput}
          onSetToastRef={this.onSetToastRef}
          onDisabledUsersSwitcherClick={this.onDisabledUsersSwitcherClick}
        />
      )
    }

    onSetInviteInput(ref) {
      this.inviteInputRef = ref
    }

    onSetToastRef(ref) {
      this.toastRef = ref
    }

    onBlurInviteInput() {
      if (this.inviteInputRef) {
        this.inviteInputRef.blur()
      }
    }

    focusInviteInput() {
      if (this.inviteInputRef) {
        this.inviteInputRef.focus()
      }
    }

    onShowToast(toastText, duration) {
      if (this.toastRef) {
        this.toastRef.show(toastText, duration)
      }
    }

    onChangeInviteInput(text) {
      this.setState({
        inviteInputValue: text,
      })
    }

    userAlreadyInOrganization(email) {
      return this.props.currentOrganizationPeopleEmails.includes(email)
    }

    onPressInviteButton() {
      const email = this.state.inviteInputValue.toLowerCase()
      const { isValid, message } = isValidEmail(email, true)
      if (isValid) {
        if (!this.userAlreadyInOrganization(email)) {
          this.setState({
            isInviteInputValid: true,
            inviteInputValue: '',
          })
          this.onShowToast('You\'ve successfully invited user', 500)
          this.onBlurInviteInput()
          const userId = generateId()
          this.props.onInviteUserToOrganization(userId, email)
          UserTracker.track(UserTrackerEvent.memberInvited, { source: 'workspace-members' })
        } else {
          this.setState({
            isInviteInputValid: false,
          })
          this.onShowToast('User is already in organization', 500)
          this.focusInviteInput()
        }
      } else {
        this.setState({
          isInviteInputValid: false,
        })
        this.onShowToast(message, 500)
        this.focusInviteInput()
      }
    }

    onDisabledUsersSwitcherClick() {
      this.setState(({ isDisabledUsersVisible }) => ({
        isDisabledUsersVisible: !isDisabledUsersVisible,
      }))
    }

  }

  const mapStateToProps = (state, props) => ({
    userIds: selectCurrentOrganizationActivePeopleWithoutBot(state),
    deactivatedUserIds: selectDeactivatedUserIds(state),
    currentOrganizationPeopleEmails: selectCurrentOrganizationActivePeopleEmails(state),
    isCurrentUserOrganizationAdmin: selectIsCurrentUserOrganizationAdmin(state),
  })

  function mapDispatchToProps(dispatch, props) {
    return {
      onInviteUserToOrganization: (userId, email) => dispatch(onInviteUsersToOrganization([{ email, userId }], isIOS)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTeamMembersManagement)
}

export default enhance
