import React from 'react';
import { connect } from 'react-redux';

import { EntityStatus } from 'models/domain/EntityModel/types';
import {
  selectOrganizationOwnerEmail,
  selectIsCurrentUserOrganizationOwner,
} from 'models/domain/OrganizationsModel/selectors';

import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors';

import {
  selectCurrentOrganizationId,
  selectCurrentOrganizationName,
  selectCurrentOrganizationStatus,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions';
import { FIRST_PROJECT_NAME } from 'models/domain/ProjectsModel/constants';

import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceCurrentOrganizationController extends BaseComponent {
    state = {
      isOrganizationArchived: false,
    };

    render() {
      return (
        <ComposedComponent
          isOrganizationArchived={this.state.isOrganizationArchived}
          currentOrganizationName={this.props.currentOrganizationName}
          isOrganizationOwner={this.props.isOrganizationOwner}
          ownerEmail={this.props.ownerEmail}
          onRedirectFromThisWorkspace={this.onRedirectFromThisWorkspace}
        />
      );
    }

    onRedirectFromThisWorkspace() {
      const { currentOrganizationId } = this.props;
      const organizationIds = this.props.organizationIds.filter(
        (organizationId) => organizationId !== currentOrganizationId
      );
      if (!organizationIds.isEmpty()) {
        const nextOrganizationId = organizationIds.first();
        this.props.onSwitchOrganization(nextOrganizationId);
        this.props.history.push(`/projects/${FIRST_PROJECT_NAME}`);
      } else {
        this.props.history.push(`/newWorkspace`);
      }

      this.setState({
        isOrganizationArchived: false,
      });
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.currentOrganizationStatus === EntityStatus.EXISTS &&
        this.props.currentOrganizationStatus === EntityStatus.ARCHIVED
      ) {
        this.setState({
          isOrganizationArchived: true,
        });
      }
    }

    componentDidMount() {
      if (this.props.currentOrganizationStatus === EntityStatus.ARCHIVED) {
        this.setState({
          isOrganizationArchived: true,
        });
      }
    }
  }

  const mapStateToProps = (state) => {
    const currentOrganizationId = selectCurrentOrganizationId(state);
    return {
      currentOrganizationId,
      ownerEmail: selectOrganizationOwnerEmail(state),
      isOrganizationOwner: selectIsCurrentUserOrganizationOwner(state, {
        organizationId: currentOrganizationId,
      }),
      organizationIds: selectCurrentUserExistingOrganizationIds(state),
      currentOrganizationName: selectCurrentOrganizationName(state),
      currentOrganizationStatus: selectCurrentOrganizationStatus(state),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onSwitchOrganization: (id) => dispatch(onSwitchOrganization(id)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCurrentOrganizationController);
}

export default enhance;
