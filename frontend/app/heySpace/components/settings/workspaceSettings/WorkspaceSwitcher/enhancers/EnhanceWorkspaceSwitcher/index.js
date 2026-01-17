import React from "react";
import { connect } from "react-redux";

import {
  selectCurrentOrganizationName,
  selectCurrentOrganizationId,
} from "models/domain/OrganizationsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceWorkspaceSwitcher extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          workspaceName={this.props.workspaceName}
          organizationId={this.props.organizationId}
        />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      organizationId: selectCurrentOrganizationId(state),
      workspaceName: selectCurrentOrganizationName(state),
    };
  }

  return connect(mapStateToProps)(EnhanceWorkspaceSwitcher);
}

export default Enhance;
