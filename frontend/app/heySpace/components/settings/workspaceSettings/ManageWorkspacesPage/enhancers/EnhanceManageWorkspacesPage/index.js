import React from "react";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import {
  selectCurrentUserExistingOrganizationIds,
  selectCurrentUserArchivedOrganizationIds,
} from "models/domain/UsersModel/selectors";

import { selectCurrentUserOrganizationRoles } from "models/domain/OrganizationsModel/selectors";

import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";

import {
  onFetchCurrentUserOrganizationRoles,
  onSetOrganizationStatus,
} from "models/domain/OrganizationsModel/actions";
import {
  selectIsRequestRepeatable,
  selectRequestIsLoading,
} from "models/domain/RequestModel/selectors";
import { getUserOrganizationRoles } from "models/domain/RequestModel/constants/requestTypes";
import { OrganizationPeopleRole } from "models/domain/OrganizationsModel/types";
import { onSetIsWorkspaceModalOpen } from "models/domain/AppModel/actions";
import { EntityStatus } from "models/domain/EntityModel/types";

function Enhance(ComposedComponent) {
  class EnhanceManageWorkspacesPage extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          existingOrganizationIds={this.props.existingOrganizationIds}
          archivedOrganizationIds={this.props.archivedOrganizationIds}
          isLoading={this.props.isLoading}
          currentUserId={this.props.currentUserId}
          isUserOrganizationOwner={this.isUserOrganizationOwner}
          onUnarchiveWorkspace={this.props.onUnarchiveWorkspace}
          onSetIsWorkspaceModalOpen={this.props.onSetIsWorkspaceModalOpen}
        />
      );
    }

    isUserOrganizationOwner(organizationId) {
      return (
        this.props.organizationRoles.get(organizationId) ===
        OrganizationPeopleRole.OWNER
      );
    }

    componentDidMount() {
      if (this.props.isRequestRepeatable) {
        this.props.onFetchCurrentUserOrganizationRoles();
      }
    }
  }

  function mapStateToProps(state) {
    const currentUserId = selectCurrentUserId(state);
    return {
      existingOrganizationIds: selectCurrentUserExistingOrganizationIds(state),
      archivedOrganizationIds: selectCurrentUserArchivedOrganizationIds(state),
      organizationRoles: selectCurrentUserOrganizationRoles(state),
      isRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType: getUserOrganizationRoles,
        objectId: currentUserId,
      }),
      isLoading: selectRequestIsLoading(state, {
        requestType: getUserOrganizationRoles,
        objectId: currentUserId,
      }),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onFetchCurrentUserOrganizationRoles: () =>
        dispatch(onFetchCurrentUserOrganizationRoles()),
      onUnarchiveWorkspace: (organizationId) =>
        dispatch(onSetOrganizationStatus(organizationId, EntityStatus.EXISTS)),
      onSetIsWorkspaceModalOpen: (isOpen) =>
        dispatch(onSetIsWorkspaceModalOpen(isOpen)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceManageWorkspacesPage);
}

export default Enhance;
