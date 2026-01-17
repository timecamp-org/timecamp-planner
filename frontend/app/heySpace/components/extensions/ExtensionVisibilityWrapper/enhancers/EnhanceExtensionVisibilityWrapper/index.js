import React from "react";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { selectIsExtensionEnabled } from "models/domain/ExtensionsModel/selectors/domain";
import { selectHasAccessToExtension } from "models/domain/SubscriptionLimitsModel/selectors";

function enhance(ComposedComponent) {
  class EnhanceExtensionVisibilityWrapper extends BaseComponent {
    render() {
      return (
        <ComposedComponent
          isEnabled={
            this.props.isExtensionEnabled && this.props.hasAccessToExtension
          }
          children={this.props.children}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);
    return {
      isExtensionEnabled: selectIsExtensionEnabled(state, {
        extensionNamespace: props.extensionNamespace,
        organizationId,
        projectId: props.projectId,
      }),
      hasAccessToExtension: selectHasAccessToExtension(state, {
        extensionNamespace: props.extensionNamespace,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceExtensionVisibilityWrapper);
}

export default enhance;
