import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { onUpdateUserRole } from '../../../../../../common/models/domain/OrganizationsModel/actions'
import { OrganizationPeopleRole } from '../../../../../../common/models/domain/OrganizationsModel/types'
import {
  selectCurrentOrganizationId,
  selectCurrentOrganizationName
} from '../../../../../../common/models/domain/OrganizationsModel/selectors/domain'
import { selectUserFullNameOrNickname } from '../../../../../../common/models/domain/UsersModel/selectors/domain'

function enhance(ComposedComponent) {
  class EnhanceTransferOwnershipModal extends BaseComponent {

    static propTypes = {
      // needs
      userId: PropTypes.string.isRequired,

      // pass-trough
      isVisible: PropTypes.bool.isRequired,
      onClose: PropTypes.func,

      // injects
      currentOrganizationId: PropTypes.string.isRequired,
      workspaceName: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      onTransferOwnership: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}
          workspaceName={this.props.workspaceName}
          userName={this.props.userName}

          onTransferOwnership={this.onTransferOwnership}
          onClose={this.props.onClose}
        />
      )
    }

    onTransferOwnership() {
      this.props.onTransferOwnershipToUser(this.props.userId, this.props.currentOrganizationId)
      this.props.onClose()
    }

  }

  const mapStateToProps = (state, props) => ({
    currentOrganizationId: selectCurrentOrganizationId(state),
    workspaceName: selectCurrentOrganizationName(state),
    userName: selectUserFullNameOrNickname(state, { userId: props.userId }),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onTransferOwnershipToUser: (userId, currentOrganizationId) => dispatch(onUpdateUserRole(userId, currentOrganizationId, OrganizationPeopleRole.OWNER)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTransferOwnershipModal)
}

export default enhance
