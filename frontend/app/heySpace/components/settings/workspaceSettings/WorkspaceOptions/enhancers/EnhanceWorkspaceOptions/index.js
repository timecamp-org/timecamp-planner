import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { EntityStatus } from "models/domain/EntityModel/types";

import BaseComponent from "commonEnhancers/BaseComponent";
import {
  onSetOrganizationStatus,
  onDeactivateUserFromOrganization,
} from "models/domain/OrganizationsModel/actions";

import { selectIsCurrentUserOrganizationOwner } from "models/domain/OrganizationsModel/selectors";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceWorkspaceOptions extends BaseComponent {
    static propTypes = {
      organizationId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          isOrganizationOwner={this.props.isOrganizationOwner}
          hasActiveSubscription={this.hasActiveSubscription()}
          onArchiveWorkspace={this.props.onArchiveWorkspace}
          onLeaveWorkspace={this.onLeaveWorkspace}
        />
      );
    }

    hasActiveSubscription() {
      return false;
    }

    onLeaveWorkspace() {
      this.props.onLeaveWorkspace(this.props.currentUserId);
    }
  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    isOrganizationOwner: selectIsCurrentUserOrganizationOwner(state, {
      organizationId: props.organizationId,
    }),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onArchiveWorkspace: () =>
      dispatch(
        onSetOrganizationStatus(props.organizationId, EntityStatus.ARCHIVED)
      ),
    onLeaveWorkspace: (currentUserId) =>
      dispatch(
        onDeactivateUserFromOrganization(currentUserId, props.organizationId)
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWorkspaceOptions);
}

export default Enhance;
