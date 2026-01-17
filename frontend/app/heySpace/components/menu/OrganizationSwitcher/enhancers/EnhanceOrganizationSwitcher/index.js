import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doNothing } from 'common/utils';

import BaseComponent from 'commonEnhancers/BaseComponent';

import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { FIRST_PROJECT_NAME } from 'models/domain/ProjectsModel/constants';

function enhance(ComposedComponent) {
  class EnhanceOrganizationSwitcher extends BaseComponent {
    static propTypes = {
      onOrganizationClick: PropTypes.func,
    };

    static defaultProps = {
      onOrganizationClick: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          organizationIds={this.props.organizationIds}
          currentOrganizationId={this.props.currentOrganizationId}
          onSwitchOrganization={this.onSwitchOrganization}
        />
      );
    }

    onSwitchOrganization(id) {
      if (id !== this.props.currentOrganizationId) {
        this.props.onSwitchOrganization(id);
        this.props.onOrganizationClick(id);
        if (this.props.shouldRedirect) {
          this.props.history.push(`/projects/${FIRST_PROJECT_NAME}`);
        }
      }
    }
  }

  const mapStateToProps = (state) => {
    return {
      organizationIds: selectCurrentUserExistingOrganizationIds(state),
      currentOrganizationId: selectCurrentOrganizationId(state),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onSwitchOrganization: (id) => dispatch(onSwitchOrganization(id, false)),
  });

  return EnhanceWithRouter(
    null,
    false
  )(connect(mapStateToProps, mapDispatchToProps)(EnhanceOrganizationSwitcher));
}

export default enhance;
