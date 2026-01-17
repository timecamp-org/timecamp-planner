import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectSortedAvailableVisibleSpacesIds } from "models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector";
import {
  selectCustomFieldValue,
  selectIsExtensionEnabledForOrganization,
  selectExtensionNamespace,
} from "models/domain/ExtensionsModel/selectors/domain";
import { selectIsExtensionEnabledForOrganizationSpaces } from "models/domain/ExtensionsModel/selectors";
import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { TargetType, FieldType } from "models/domain/ExtensionsModel/types";

import {
  onSetExtensionEnabledStatus,
  onSetIsExtensionEnabledForSpace,
} from "models/domain/ExtensionsModel/actions";

import EnhanceWithClickOutside from "react-click-outside";
import BaseComponent from "commonEnhancers/BaseComponent";

export default function enhance(Component) {
  @EnhanceWithClickOutside
  class EnhanceExtensionItemSettings extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      extensionId: PropTypes.string.isRequired,
      onSetIsPopoverOpened: PropTypes.func,
    };

    state = {
      isPopoverOpened: false,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          isPopoverOpened={this.state.isPopoverOpened}
          spaceIds={this.props.spaceIds}
          extensionEnabledStatus={this.props.extensionEnabledStatus}
          isExtensionEnabledInOrganization={
            this.props.isExtensionEnabledInOrganization
          }
          spaceEnabledExtensions={this.props.spaceEnabledExtensions}
          onSetIsPopoverOpened={this.onSetIsPopoverOpened}
          onSetExtensionEnabledStatus={this.onSetExtensionEnabledStatus}
          onSetIsExtensionEnabledForSpace={this.onSetIsExtensionEnabledForSpace}
        />
      );
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onSetIsPopoverOpened(false);
      }
    }

    onSetIsPopoverOpened(isPopoverOpened) {
      this.setState({ isPopoverOpened });
    }

    onSetExtensionEnabledStatus(enabledStatus) {
      this.props.onSetExtensionEnabledStatus(
        this.props.organizationId,
        enabledStatus
      );
    }

    onSetIsExtensionEnabledForSpace(spaceId, isEnabled) {
      this.props.onSetIsExtensionEnabledForSpace(spaceId, isEnabled);
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);
    const extensionNamespace = selectExtensionNamespace(state, {
      extensionId: props.extensionId,
    });
    return {
      extensionEnabledStatus: selectCustomFieldValue(state, {
        extensionNamespace,
        targetType: TargetType.ORGANIZATION,
        targetId: organizationId,
        fieldType: FieldType.ENABLED_STATUS,
      }),
      isExtensionEnabledInOrganization: selectIsExtensionEnabledForOrganization(
        state,
        { extensionId: props.extensionId, organizationId }
      ),
      spaceEnabledExtensions: selectIsExtensionEnabledForOrganizationSpaces(
        state,
        { extensionId: props.extensionId, organizationId }
      ),
      spaceIds: selectSortedAvailableVisibleSpacesIds(state),
      organizationId,
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onSetExtensionEnabledStatus: (organizationId, enabledStatus) =>
      dispatch(
        onSetExtensionEnabledStatus(
          props.extensionId,
          organizationId,
          enabledStatus
        )
      ),
    onSetIsExtensionEnabledForSpace: (spaceId, isEnabled) =>
      dispatch(
        onSetIsExtensionEnabledForSpace(props.extensionId, spaceId, isEnabled)
      ),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceExtensionItemSettings);
}
