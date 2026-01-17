import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import {
  selectUserStatusTitle,
  selectUserStatusEmojiCode,
} from "models/domain/UserStatusModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceUserStatus extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          title={this.props.title}
          emojiCode={this.props.emojiCode}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      title: selectUserStatusTitle(state, { userId: props.userId }),
      emojiCode: selectUserStatusEmojiCode(state, { userId: props.userId }),
    };
  }

  return connect(mapStateToProps)(EnhanceUserStatus);
}

export default Enhance;
