import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions'

function enhance(ComposedComponent) {
  class EnhanceIOSSettingsSignOutButton extends BaseComponent {

    static propTypes = {
      onSignOut: PropTypes.func.isRequired,
    }

    render() {
      return <ComposedComponent onSignOut={this.onSignOut} />
    }

    onSignOut() {
      this.props.onSignOut()
    }

  }

  const mapDispatchToProps = (dispatch, props) => ({
    onSignOut: () => dispatch(CurrentUserModelActions.onSignOut()),
  })

  return connect(null, mapDispatchToProps)(EnhanceIOSSettingsSignOutButton)
}

export default enhance
