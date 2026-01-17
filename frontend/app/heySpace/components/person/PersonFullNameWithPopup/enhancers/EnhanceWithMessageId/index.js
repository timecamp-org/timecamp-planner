import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectMessageUser } from "models/domain/MessagesModel/selectors/domain";

import EnhanceWithClickOutside from "react-click-outside";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceWithMessageId extends BaseComponent {
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
          onUserNameClick={this.onUserNameClick}
          onClosePopover={this.onClosePopover}
        />
      );
    }

    onUserNameClick() {
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

  function mapStateToProps(state, props) {
    return {
      userId: selectMessageUser(state, { messageId: props.messageId }),
    };
  }

  return connect(mapStateToProps)(EnhanceWithMessageId);
}

export default enhance;
