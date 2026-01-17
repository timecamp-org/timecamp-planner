import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import EnhanceWithClickOutside from "react-click-outside";

import { selectUserNickname } from "models/domain/UsersModel/selectors/domain";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceMessageMention extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string,
      username: PropTypes.string,
      color: PropTypes.string,
    };

    state = {
      isPopoverOpened: false,
    };

    render() {
      return (
        <ComposedComponent
          userId={this.props.userId}
          username={this.props.username}
          type={this.props.type}
          value={this.props.value}
          isPopoverOpened={this.state.isPopoverOpened}
          onMentionClick={this.onMentionClick}
          onClosePopover={this.onClosePopover}
          color={this.props.color}
          containerObjectId={this.props.containerObjectId}
        />
      );
    }

    onMentionClick() {
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
      username: selectUserNickname(state, { userId: props.userId }),
    };
  }

  return connect(mapStateToProps)(EnhanceMessageMention);
}

export default enhance;
