import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  selectExtensionName,
  selectExtensionDescription,
  selectExtensionThumbnailUrl,
  selectIsExtensionEnabledForOrganization,
  selectExtensionNamespace,
} from "models/domain/ExtensionsModel/selectors/domain";

import { onSetIsExtensionEnabledForOrganization } from "models/domain/ExtensionsModel/actions";

import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { selectHasAccessToExtension } from "models/domain/SubscriptionLimitsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

export default function enhance(Component) {
  class EnhanceExtensionItem extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      extensionId: PropTypes.string.isRequired,
      extensionName: PropTypes.string,
    };

    state = {
      isHoveringNoAccessWrapper: false,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          extensionId={this.props.extensionId}
          extensionName={this.props.extensionName}
          extensionNamespace={this.props.extensionNamespace}
          extensionDescription={this.props.extensionDescription}
          extensionThumbnailUrl={this.props.extensionThumbnailUrl}
          isExtensionEnabled={this.props.isExtensionEnabled}
          hasAccessToExtension={this.props.hasAccessToExtension}
          isHoveringNoAccessWrapper={this.state.isHoveringNoAccessWrapper}
          onEnableExtensionEnabledForOrganization={
            this.onEnableExtensionEnabledForOrganization
          }
          onDisableExtensionEnabledForOrganization={
            this.onDisableExtensionEnabledForOrganization
          }
          onSetIsHoveringNoAccessWrapper={this.onSetIsHoveringNoAccessWrapper}
        />
      );
    }

    onSetIsHoveringNoAccessWrapper(isHoveringNoAccessWrapper) {
      this.setState({
        isHoveringNoAccessWrapper,
      });
    }

    onEnableExtensionEnabledForOrganization() {
      this.props.onSetIsExtensionEnabledForOrganization(
        this.props.organizationId,
        true,
        false
      );
    }

    onDisableExtensionEnabledForOrganization() {
      this.props.onSetIsExtensionEnabledForOrganization(
        this.props.organizationId,
        false,
        true
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);
    const extensionName = selectExtensionName(state, {
      extensionId: props.extensionId,
    });
    const extensionNamespace = selectExtensionNamespace(state, {
      extensionId: props.extensionId,
    });
    return {
      isExtensionEnabled: selectIsExtensionEnabledForOrganization(state, {
        extensionId: props.extensionId,
        organizationId,
      }),
      extensionDescription: selectExtensionDescription(state, {
        extensionId: props.extensionId,
      }),
      extensionThumbnailUrl: selectExtensionThumbnailUrl(state, {
        extensionId: props.extensionId,
      }),
      extensionNamespace,
      organizationId,
      extensionName,
      hasAccessToExtension: selectHasAccessToExtension(state, {
        extensionNamespace,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onSetIsExtensionEnabledForOrganization: (organizationId, isEnabled) =>
      dispatch(
        onSetIsExtensionEnabledForOrganization(
          props.extensionId,
          organizationId,
          isEnabled
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceExtensionItem);
}
