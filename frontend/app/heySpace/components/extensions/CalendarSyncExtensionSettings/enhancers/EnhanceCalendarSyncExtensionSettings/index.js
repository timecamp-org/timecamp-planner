import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Config } from "common/services";
import generateId from "common/utils/generate-pushid";

import { selectCustomFieldValue } from "models/domain/ExtensionsModel/selectors/domain";
import { onSetExtensionCustomFieldValue } from "models/domain/ExtensionsModel/actions";
import { selectHasAccessToExtension } from "models/domain/SubscriptionLimitsModel/selectors";

import { selectCurrentUserInOrganizationId } from "models/domain/OrganizationsModel/selectors";

import {
  TargetType,
  FieldType,
  ExtensionNamespace,
} from "models/domain/ExtensionsModel/types";

import BaseComponent from "commonEnhancers/BaseComponent";
import EnhanceWithClickOutside from "react-click-outside";

export default function EnhanceCalendarSyncExtensionSettings(Component) {
  @EnhanceWithClickOutside
  class EnhanceCalendarSyncExtensionSettings extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      extensionId: PropTypes.string.isRequired,
      extensionName: PropTypes.string,
    };

    state = {
      isExtensionSettingsModalOpen: false,
      isExtensionSettingsPopoverOpen: false,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          extensionId={this.props.extensionId}
          isExtensionSettingsModalOpen={this.state.isExtensionSettingsModalOpen}
          isExtensionSettingsPopoverOpen={
            this.state.isExtensionSettingsPopoverOpen
          }
          syncUrl={this.getSyncUrl()}
          onResetSyncToken={this.onResetSyncToken}
          onOpenExtensionSettingsModal={this.onOpenExtensionSettingsModal}
          onCloseExtensionSettingsModal={this.onCloseExtensionSettingsModal}
          onSetIsExtensionSettingsModalOpen={
            this.onSetIsExtensionSettingsModalOpen
          }
          onOpenExtensionSettingsPopover={this.onOpenExtensionSettingsPopover}
          onCloseExtensionSettingsPopover={this.onCloseExtensionSettingsPopover}
          onSetInputRef={this.onSetInputRef}
          onCopyLink={this.onCopyLink}
          onMoreVerticalButtonClick={this.onMoreVerticalButtonClick}
        />
      );
    }

    getSyncUrl() {
      const { userInOrganizationId, extensionId, syncToken } = this.props;
      return `${Config.restApiUri}/export/cardDueDates/ical?extensionId=${extensionId}&userInOrganizationId=${userInOrganizationId}&key=${syncToken}`;
    }

    onResetSyncToken() {
      const newToken = generateId();
      this.props.onSetExtensionCustomFieldValue(
        this.props.userInOrganizationId,
        newToken,
        true
      );
    }

    onOpenExtensionSettingsModal() {
      if (!this.props.hasAccessToExtension) {
        return null;
      }
      if (!this.props.syncToken) {
        const newToken = generateId();
        this.props.onSetExtensionCustomFieldValue(
          this.props.userInOrganizationId,
          newToken,
          false
        );
      }
      this.setState({ isExtensionSettingsModalOpen: true });
      this.onCloseExtensionSettingsPopover();
    }

    onCloseExtensionSettingsModal() {
      this.setState({ isExtensionSettingsModalOpen: false });
    }

    onSetIsExtensionSettingsModalOpen(isExtensionSettingsModalOpen) {
      this.setState({ isExtensionSettingsModalOpen });
    }

    onOpenExtensionSettingsPopover() {
      this.setState({ isExtensionSettingsPopoverOpen: true });
    }

    onCloseExtensionSettingsPopover() {
      this.setState({ isExtensionSettingsPopoverOpen: false });
    }

    onMoreVerticalButtonClick() {
      return this.props.isExtensionSettingsPopoverOpen
        ? this.onCloseExtensionSettingsPopover()
        : this.onOpenExtensionSettingsPopover();
    }

    handleClickOutside(event) {
      if (
        this.state.isExtensionSettingsPopoverOpen &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onCloseExtensionSettingsPopover();
      }
    }

    onSetInputRef(ref) {
      this.inputRef = ref;
    }

    onCopyLink() {
      if (this.inputRef) {
        this.onCopyToClipboard();
      }
    }

    onCopyToClipboard() {
      if (this.inputRef) {
        this.inputRef.select();
        document.execCommand("copy");
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  const mapStateToProps = (state) => {
    const userInOrganizationId = selectCurrentUserInOrganizationId(state);
    return {
      userInOrganizationId,
      hasAccessToExtension: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.CALENDAR_SYNC,
      }),
      syncToken: selectCustomFieldValue(state, {
        extensionNamespace: ExtensionNamespace.CALENDAR_SYNC,
        targetType: TargetType.USER_IN_ORGANIZATION,
        targetId: userInOrganizationId,
        fieldType: FieldType.SYNC_TOKEN,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onSetExtensionCustomFieldValue: (userInOrganizationId, value, showAlert) =>
      dispatch(
        onSetExtensionCustomFieldValue(
          props.extensionId,
          TargetType.USER_IN_ORGANIZATION,
          userInOrganizationId,
          FieldType.SYNC_TOKEN,
          value,
          showAlert
        )
      ),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCalendarSyncExtensionSettings);
}
