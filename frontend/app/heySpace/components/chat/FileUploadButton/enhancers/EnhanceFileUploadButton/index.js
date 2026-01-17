import PropTypes from 'prop-types';
import EnhanceWithClickOutside from 'react-click-outside';
import { connect } from 'react-redux';

import { GoogleApiClient } from 'common/services';
import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';

function EnhanceFileUploadButton(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceFileUploadButton extends BaseComponent {
    static propTypes = {
      onGoogleDrivePick: PropTypes.func,
      onDropboxFilesPick: PropTypes.func,
    };

    static defaultProps = {
      onGoogleDrivePick: doNothing,
      onDropboxFilesPick: doNothing,
    };

    state = {
      isPopoverOpened: false,
      isHovering: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isPopoverOpened={this.state.isPopoverOpened}
          isDrivePickerEnabled={this.props.hasAccessToGoogleDriveExtension}
          isDropboxEnabled={this.props.hasAccessToDropboxExtension}
          isHovering={this.state.isHovering}
          color={this.props.color}
          onPopoverOpen={this.onPopoverOpen}
          onFileUploadIconClick={this.props.onFileUploadIconClick}
          onGoogleDriveClick={this.onGoogleDriveClick}
          onDropboxClick={this.onDropboxClick}
          onDropboxFilesPick={this.props.onDropboxFilesPick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    onPopoverOpen() {
      this.setState({ isPopoverOpened: true });
    }

    onPopoverClose() {
      this.setState({ isPopoverOpened: false });
    }

    onGoogleDriveClick() {
      this.onPopoverClose();
      GoogleApiClient.createDrivePicker(this.props.onGoogleDrivePick);
    }

    onDropboxClick() {
      this.onPopoverClose();
    }

    handleClickOutside(event) {
      if (this.state.isPopoverOpened && this.popperRootNode && !this.popperRootNode.contains(event.target)) {
        this.onPopoverClose();
        event.stopPropagation();
      }
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById('popper-root');
    }
  }

  function mapStateToProps(state) {
    return {
      hasAccessToGoogleDriveExtension: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.GOOGLE_DRIVE_PICKER,
      }),
      hasAccessToDropboxExtension: selectHasAccessToExtension(state, {
        extensionNamespace: ExtensionNamespace.DROPBOX_CHOOSER,
      }),
    };
  }

  return connect(mapStateToProps)(EnhanceFileUploadButton);
}

export default EnhanceFileUploadButton;
