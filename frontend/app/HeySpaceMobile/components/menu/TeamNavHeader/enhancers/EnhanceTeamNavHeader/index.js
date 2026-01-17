import React from 'react'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors'

export const CREATE_CONVERSATION_MODAL = 'createConversationModal'
export const INVITE_USER_MODAL = 'inviteUserModal'

function enhance(ComposedComponent) {
  class EnhanceTeamNavHeader extends BaseComponent {

    state = {
      openedModalType: null,
    }

    render() {
      return (
        <ComposedComponent
          openedModalType={this.state.openedModalType}
          canCurrentUserInvitePeople={this.props.canCurrentUserInvitePeople}
          onSetIsModalOpened={this.onSetIsModalOpened}
          onOpenCreateConversationModal={this.onOpenCreateConversationModal}
          onCloseCreateConversationModal={this.onCloseCreateConversationModal}
          onOpenInviteUserModal={this.onOpenInviteUserModal}
          onCloseInviteUserModal={this.onCloseInviteUserModal}
        />
      )
    }

    onSetIsModalOpened(isOpened, modalType) {
      this.setState(prevState => {
        if (isOpened) {
          return {
            openedModalType: modalType,
          }
        } else if (modalType === prevState.openedModalType) {
          return {
            openedModalType: null,
          }
        } else {
          return {}
        }
      })
    }


    onOpenCreateConversationModal() {
      this.onSetIsModalOpened(true, CREATE_CONVERSATION_MODAL)
    }

    onCloseCreateConversationModal() {
      this.onSetIsModalOpened(false, CREATE_CONVERSATION_MODAL)
    }

    onOpenInviteUserModal() {
      this.onSetIsModalOpened(true, INVITE_USER_MODAL)
    }

    onCloseInviteUserModal() {
      this.onSetIsModalOpened(false, INVITE_USER_MODAL)
    }

  }

  function mapStateToProps(state) {
    return {
      canCurrentUserInvitePeople: !selectIsCurrentUserOrganizationGuest(state),
    }
  }

  return connect(mapStateToProps)(EnhanceTeamNavHeader)
}

export default enhance
