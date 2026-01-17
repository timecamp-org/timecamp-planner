import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { onDeactivateUserFromOrganization } from 'models/domain/OrganizationsModel/actions'

function enhance(ComposedComponent) {
  class EnhanceDeactivateUserConfirmationModal extends BaseComponent {

    static propTypes = {
      userId: PropTypes.string,
      onClose: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onDeactivateUser={this.onDeactivateUser}
        />
      )
    }

    onDeactivateUser() {
      this.props.onDeactivateUser()
      this.props.onClose()
    }

  }

  const mapDispatchToProps = (dispatch, props) => ({
    onDeactivateUser: () => dispatch(onDeactivateUserFromOrganization(props.userId)),
  })

  return connect(null, mapDispatchToProps)(EnhanceDeactivateUserConfirmationModal)
}

export default enhance
