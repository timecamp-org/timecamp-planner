import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";
import {
  selectCurrentUserStatusTitle,
  selectCurrentUserStatusEmojiCode,
} from "models/domain/UserStatusModel/selectors";

import { onOpenModal } from "models/component/ModalsModel/actions";
import { ModalType } from "models/component/ModalsModel/types";

function Enhance(ComposedComponent) {
  class EnhanceUserStatusButton extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      onClick: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          title={this.props.title}
          emojiCode={this.props.emojiCode}
          onClick={this.onClick}
        />
      );
    }

    onClick() {
      this.props.onClick();
      this.props.onOpenUserStatusModal();
    }
  }

  function mapStateToProps(state) {
    return {
      title: selectCurrentUserStatusTitle(state),
      emojiCode: selectCurrentUserStatusEmojiCode(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onOpenUserStatusModal: () =>
        dispatch(onOpenModal(ModalType.USER_STATUS_MODAL)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceUserStatusButton);
}

export default Enhance;
