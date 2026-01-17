import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

function Enhance(ComposedComponent) {
  class EnahnceWithCurrentOrganizationId extends React.Component {
    // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
      currentOrganizationId: PropTypes.string.isRequired,
      userId: PropTypes.string,
      className: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          organizationId={this.props.currentOrganizationId}
        />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      currentOrganizationId: selectCurrentOrganizationId(state),
    };
  }

  function mapDispatchToProps() {
    return {};
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnahnceWithCurrentOrganizationId);
}

export default Enhance;
