import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectUsersThatReadMessage } from "models/domain/MessagesModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceUsersReadList extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      messageId: PropTypes.string.isRequired,
    };

    state = {
      hoveredUserId: null,
    };

    render() {
      return (
        <ComposedComponent
          hoveredUserId={this.state.hoveredUserId}
          userIds={this.props.userIds}
          onHoverUser={this.onHoverUser}
          onLeaveUser={this.onLeaveUser}
        />
      );
    }

    onHoverUser(hoveredUserId) {
      this.setState({
        hoveredUserId,
      });
    }

    onLeaveUser() {
      this.setState({
        hoveredUserId: null,
      });
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      userIds: selectUsersThatReadMessage(state, {
        messageId: props.messageId,
        objectId: props.objectId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceUsersReadList);
}

export default Enhance;
