import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'

import BaseComponent from 'BaseComponent'
import { selectCurrentUserId, selectUsersName } from 'models/domain/UsersModel/selectors/domain'
import { onResendInvitation, onReactivateUserFromOrganization } from 'models/domain/OrganizationsModel/actions'
import {
  selectCurrentOrganizationId,
  selectDeactivatedUserIds,
} from 'models/domain/OrganizationsModel/selectors/domain'
import {
  selectCurrentOrganizationActivePeopleWithoutBot,
  selectIsCurrentUserOrganizationAdmin,
} from 'models/domain/OrganizationsModel/selectors'
import handleError from 'common/utils/handleError'

export const listOptionsTypes = {
  RESEND_INVITATION: 'Resend invitation',
  TRANSFER_OWNERSHIP: 'Transfer ownership',
  DISABLE_USER: 'Disable user',
  REACTIVATE_USER: 'Reactivate user',
}

export const destructiveOptions = [
  listOptionsTypes.DISABLE_USER,
]

export const tabItemTypes = {
  ACTIVE_MEMBERS: 'active',
  DEACTIVATED_MEMBERS: 'deactivated',
}

const tabItems = fromJS([
  {
    key: tabItemTypes.ACTIVE_MEMBERS,
    text: 'Active',
  },
  {
    key: tabItemTypes.DEACTIVATED_MEMBERS,
    text: 'Deactivated',
  },
])

const activeUserListOptions = [
  listOptionsTypes.RESEND_INVITATION,
  listOptionsTypes.TRANSFER_OWNERSHIP,
  listOptionsTypes.DISABLE_USER,
]

const deactivatedUserListOptions = [
  listOptionsTypes.REACTIVATE_USER,
]

function getListOptions(selectedUserId, deactivatedUserIds) {
  if (deactivatedUserIds.includes(selectedUserId)) {
    return deactivatedUserListOptions
  } else {
    return activeUserListOptions
  }
}


function enhance(ComposedComponent) {
  class EnhanceWorkspaceMembers extends BaseComponent {

    static propTypes = {
      currentUserId: PropTypes.string.isRequired,
      currentOrganizationId: PropTypes.string.isRequired,
      userIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      userNamesByIds: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,
      isCurrentUserOrganizationAdmin: PropTypes.bool.isRequired,

      onResendInvitation: PropTypes.func.isRequired,
      onTransferOwnershipToUser: PropTypes.func.isRequired,
      onReactivateUser: PropTypes.func.isRequired,
    }

    state = {
      selectedTab: tabItemTypes.ACTIVE_MEMBERS,
      isActionSheetOpen: false,
      isUserDeactivationConfirmationModalOpen: false,
      isTransferOwnershipModalOpen: false,
      selectedUserId: null,
    }

    render() {
      return (
        <ComposedComponent
          tabItems={tabItems}
          isActionSheetOpen={this.state.isActionSheetOpen}
          selectedUserId={this.state.selectedUserId}
          isUserDeactivationConfirmationModalOpen={this.state.isUserDeactivationConfirmationModalOpen}
          isTransferOwnershipModalOpen={this.state.isTransferOwnershipModalOpen}
          selectedTab={this.state.selectedTab}
          userIds={this.props.userIds}
          deactivatedUserIds={this.props.deactivatedUserIds}
          userNamesByIds={this.props.userNamesByIds}
          areItemsClickable={this.props.isCurrentUserOrganizationAdmin}
          listOptions={getListOptions(this.state.selectedUserId, this.props.deactivatedUserIds)}
          destructiveOptions={destructiveOptions}

          onItemPress={this.onItemPress}
          onCloseActionSheet={this.onCloseActionSheet}
          onCloseUserDeactivationConfirmationModal={this.onCloseUserDeactivationConfirmationModal}
          onCloseTransferOwnershipModal={this.onCloseTransferOwnershipModal}
          onOptionSelect={this.onOptionSelect}
          onChangeSelectedTab={this.onChangeSelectedTab}
        />
      )
    }

    onChangeSelectedTab(selectedTab) {
      this.setState({
        selectedTab,
      })
    }

    onItemPress(userId) {
      if (userId !== this.props.currentUserId) {
        this.setState({
          isActionSheetOpen: true,
          selectedUserId: userId,
        })
      }
    }

    onCloseActionSheet() {
      this.setState({
        isActionSheetOpen: false,
        selectedUserId: null,
      })
    }

    onOptionSelect(index) {
      const option = getListOptions(this.state.selectedUserId, this.props.deactivatedUserIds)[index]
      switch (option) {
        case listOptionsTypes.RESEND_INVITATION: {
          this.props.onResendInvitation(this.state.selectedUserId)
          this.onCloseActionSheet()
          break
        }
        case listOptionsTypes.TRANSFER_OWNERSHIP: {
          this.onOpenTransferOwnershipModal()
          break
        }
        case listOptionsTypes.DISABLE_USER: {
          this.onOpenUserDeactivationConfirmationModal()
          break
        }
        case listOptionsTypes.REACTIVATE_USER: {
          this.props.onReactivateUser(this.state.selectedUserId)
          this.onCloseActionSheet()
          break
        }
        default: {
          handleError(new Error(`Selected option not implemented: ${option}`))
          break
        }
      }
    }

    onOpenTransferOwnershipModal() {
      this.setState({
        isTransferOwnershipModalOpen: true,
        isActionSheetOpen: false,
      })
    }

    onCloseTransferOwnershipModal() {
      this.setState({
        isTransferOwnershipModalOpen: false,
      })
    }

    onOpenUserDeactivationConfirmationModal() {
      this.setState({
        isUserDeactivationConfirmationModalOpen: true,
        isActionSheetOpen: false,
      })
    }

    onCloseUserDeactivationConfirmationModal() {
      this.setState({
        isUserDeactivationConfirmationModalOpen: false,
      })
    }

  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    currentOrganizationId: selectCurrentOrganizationId(state),
    userIds: selectCurrentOrganizationActivePeopleWithoutBot(state),
    deactivatedUserIds: selectDeactivatedUserIds(state),
    userNamesByIds: selectUsersName(state),
    isCurrentUserOrganizationAdmin: selectIsCurrentUserOrganizationAdmin(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onResendInvitation: (userId) => dispatch(onResendInvitation(userId)),
    onReactivateUser: (userId) => dispatch(onReactivateUserFromOrganization(userId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWorkspaceMembers)
}

export default enhance
