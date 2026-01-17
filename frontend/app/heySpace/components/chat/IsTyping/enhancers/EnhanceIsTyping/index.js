import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { timestampNow } from "common/utils/epoch";
import DifferenceInSeconds from "date-fns/difference_in_seconds";

import BaseComponent from "commonEnhancers/BaseComponent";

import {
  selectObjectLastKeyPressTimestamp,
  selectObjectUsersKeypress,
} from "models/domain/MessagesModel/selectors";

const IsTypingDuration = 5 * 1000; // 5 seconds

function Enhance(ComposedComponent) {
  class EnhanceIsTyping extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
    };

    state = {
      isTyping: false,
    };

    render() {
      return (
        <ComposedComponent
          isTyping={this.state.isTyping && this.props.userIds.size > 0}
          userIds={this.props.userIds}
        />
      );
    }

    showIsTyping() {
      if (!this.state.isTyping) {
        this.setState({
          isTyping: true,
        });
      }
    }

    refreshTimeout() {
      if (this.isTypingTimeout) {
        clearTimeout(this.isTypingTimeout);
      }

      this.isTypingTimeout = setTimeout(() => {
        this.setState({
          isTyping: false,
        });
      }, IsTypingDuration);
    }

    hideIsTyping() {
      if (this.state.isTyping) {
        this.setState({
          isTyping: false,
        });
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.lastKeyPressTimestamp !== prevProps.lastKeyPressTimestamp &&
        this.props.lastKeyPressTimestamp
      ) {
        const now = timestampNow();

        if (DifferenceInSeconds(now, this.props.lastKeyPressTimestamp) < 5) {
          this.showIsTyping();
          this.refreshTimeout();
        } else {
          this.hideIsTyping();
        }
      }
    }

    componentWillUnmount() {
      if (this.isTypingTimeout) {
        clearTimeout(this.isTypingTimeout);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      lastKeyPressTimestamp: selectObjectLastKeyPressTimestamp(state, {
        projectId: props.objectId,
      }),
      userIds: selectObjectUsersKeypress(state, { objectId: props.objectId }),
    };
  };

  return connect(mapStateToProps)(EnhanceIsTyping);
}

export default Enhance;
