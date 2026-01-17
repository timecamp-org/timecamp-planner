import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import {
  selectOrganizationLogo,
  selectOrganizationInitials,
} from "models/domain/OrganizationsModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceWorkspaceThumbnail extends BaseComponent {
    static propTypes = {
      organizationId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          initialsClassName={this.props.initialsClassName}
          imageClassName={this.props.imageClassName}
          workspaceThumbnail={this.props.workspaceThumbnail}
          workspaceInitials={this.props.workspaceInitials}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      workspaceThumbnail: selectOrganizationLogo(state, {
        organizationId: props.organizationId,
      }),
      workspaceInitials: selectOrganizationInitials(state, {
        organizationId: props.organizationId,
      }),
    };
  }

  return connect(mapStateToProps)(EnhanceWorkspaceThumbnail);
}

export default Enhance;
