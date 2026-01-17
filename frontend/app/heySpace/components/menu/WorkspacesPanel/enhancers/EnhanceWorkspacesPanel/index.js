import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { selectSortedCurrentUserExistingOrganizationIds } from "models/domain/UsersModel/selectors";
import { onSwitchOrganization } from "models/domain/OrganizationsModel/actions";
import {
  selectCurrentOrganizationId,
  selectAllOrganizationNames,
} from "models/domain/OrganizationsModel/selectors/domain";
import { onSetIsWorkspaceModalOpen } from "models/domain/AppModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceWorkspacesPanel extends BaseComponent {
    static propTypes = {
      isVisible: PropTypes.bool,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          organizationIds={this.props.organizationIds}
          currentOrganizationId={this.props.currentOrganizationId}
          isVisible={this.props.isVisible}
          onSwitchOrganization={this.onSwitchOrganization}
          onSetIsWorkspaceModalOpen={this.props.onSetIsWorkspaceModalOpen}
          getWorkspaceName={this.getWorkspaceName}
        />
      );
    }

    getWorkspaceName(organizationId) {
      return this.props.workspaceNames.get(organizationId);
    }

    onSwitchOrganization(organizationId) {
      if (this.props.currentOrganizationId !== organizationId) {
        this.props.onSwitchOrganization(organizationId);
      }
    }
  }

  function mapStateToProps(state) {
    return {
      organizationIds: selectSortedCurrentUserExistingOrganizationIds(state),
      currentOrganizationId: selectCurrentOrganizationId(state),
      workspaceNames: selectAllOrganizationNames(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSwitchOrganization: (organizationId) =>
        dispatch(onSwitchOrganization(organizationId, false)),
      onSetIsWorkspaceModalOpen: (isOpen) =>
        dispatch(onSetIsWorkspaceModalOpen(isOpen)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWorkspacesPanel);
}

export default Enhance;
