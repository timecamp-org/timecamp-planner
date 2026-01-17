import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectOrganizationName } from 'models/domain/OrganizationsModel/selectors/domain'

function Enhance(ComposedComponent) {
  class EnhanceOrganizationName extends React.Component { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      organizationId: PropTypes.string.isRequired,

      // injects
      organizationName: PropTypes.string,
      maxLength: PropTypes.number,
    }

    render() {
      return <ComposedComponent
        className={this.props.className}
        organizationName={this.props.organizationName}
        maxLength={this.props.maxLength}
      />
    }
  }

  function mapStateToProps(state, props) {
    return {
      organizationName: selectOrganizationName(state, { organizationId: props.organizationId }),
    }
  }

  return connect(mapStateToProps)(EnhanceOrganizationName)
}

export default Enhance
