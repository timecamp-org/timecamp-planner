import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import {
  selectUserStatusTitle,
  selectUserStatusEmojiCode,
} from "models/domain/UserStatusModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceUserStatusEmoji extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          emojiCode={this.props.emojiCode}
          size={this.props.size}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      emojiCode: selectUserStatusEmojiCode(state, { userId: props.userId }),
    };
  }

  return connect(mapStateToProps)(EnhanceUserStatusEmoji);
}

export default Enhance;
