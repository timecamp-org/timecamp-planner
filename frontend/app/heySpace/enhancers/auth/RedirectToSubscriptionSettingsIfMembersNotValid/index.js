import React from 'react'
import { connect } from 'react-redux'

function enhance(ComposedComponent) {
  class RedirectToSubscriptionSettingsIfMembersNotValid extends React.Component {

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

  }

  return connect()(RedirectToSubscriptionSettingsIfMembersNotValid)
}

export default enhance
