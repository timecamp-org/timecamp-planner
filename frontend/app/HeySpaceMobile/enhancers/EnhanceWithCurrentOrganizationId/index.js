import React from 'react'
import { connect } from 'react-redux'

import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'

import BaseComponent from 'BaseComponent'

function enhance(ComposedComponent) {
  class EnhanceWithCurrentOrganizationId extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          {...this.props}
          currentOrganizationId={this.props.currentOrganizationId}
        />
      )
    }

  }

  const mapStateToProps = (state) => ({
    currentOrganizationId: selectCurrentOrganizationId(state),
  })

  return connect(mapStateToProps)(EnhanceWithCurrentOrganizationId)
}

export default enhance
