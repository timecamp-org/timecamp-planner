import React from "react";
import PropTypes from "prop-types";

import BaseComponent from "commonEnhancers/BaseComponent";

import EnhanceWithClickOutside from "react-click-outside";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhancePersonIconWithPopup extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    state = {
      isPopoverOpened: false,
    };

    popperRootNode = null;

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isPopoverOpened={this.state.isPopoverOpened}
          onUserIconClick={this.onUserIconClick}
          onClosePopover={this.onClosePopover}
          width={this.props.width}
          height={this.props.height}
        />
      );
    }

    onUserIconClick() {
      this.setState((prevState) => ({
        isPopoverOpened: !prevState.isPopoverOpened,
      }));
    }

    onClosePopover() {
      this.setState({
        isPopoverOpened: false,
      });
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onClosePopover();
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  return EnhancePersonIconWithPopup;
}

export default enhance;
