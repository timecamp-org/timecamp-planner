import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import {
  onCloseModal,
  onOpenModal,
} from "models/component/ModalsModel/actions";
import { ModalType } from "models/component/ModalsModel/types";
import {
  onSetUserStatus,
  onRemoveUserStatus,
} from "models/domain/UserStatusModel/actions";
import { timestampToDate } from "common/utils/date";
import {
  selectCurrentUserStatusTitle,
  selectCurrentUserStatusEmojiCode,
  selectCurrentUserStatusResetAt,
} from "models/domain/UserStatusModel/selectors";

import { getPeriodDate, TimePeriod } from "../../helpers";

function Enhance(ComposedComponent) {
  class EnhanceUserStatusButton extends BaseComponent {
    static propTypes = {
      isModalVisible: PropTypes.bool,
    };

    state = {
      title: this.props.title,
      emojiCode: this.props.emojiCode,
      resetAt: this.props.resetAt ? timestampToDate(this.props.resetAt) : null,
      isDatePickerOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalVisible={this.props.isModalVisible}
          title={this.state.title}
          emojiCode={this.state.emojiCode}
          resetAt={this.state.resetAt}
          shouldShowRemoveStatusButton={this.shouldShowRemoveStatusButton()}
          isSaveButtonDisabled={this.isSaveButtonDisabled()}
          isDatePickerOpen={this.state.isDatePickerOpen}
          onSetIsModalOpen={this.onSetIsModalOpen}
          onChangeTitle={this.onChangeTitle}
          onEmojiPick={this.onEmojiPick}
          onToggleResetAt={this.onToggleResetAt}
          onSetNewStatus={this.onSetNewStatus}
          onRemoveStatus={this.onRemoveStatus}
          onSelectDatePeriod={this.onSelectDatePeriod}
          onSelectDate={this.onSelectDate}
          onClickProposal={this.onClickProposal}
          onCloseDatePicker={this.onCloseDatePicker}
          onResetForm={this.onResetForm}
          onKeyDown={this.onKeyDown}
          onChangeTime={this.onChangeTime}
        />
      );
    }

    onSetIsModalOpen(isOpen) {
      if (isOpen) {
        this.props.onOpenUserStatusModal();
      } else {
        this.props.onCloseUserStatusModal();
      }
    }

    shouldShowRemoveStatusButton() {
      const { title, emojiCode, resetAt } = this.props;
      return Boolean(title || emojiCode || resetAt);
    }

    isSaveButtonDisabled() {
      const { title, emojiCode, resetAt } = this.state;
      return Boolean(!title && !emojiCode && !resetAt);
    }

    onChangeTitle(event) {
      this.setState({ title: event.target.value });
    }

    onEmojiPick(emoji) {
      this.setState({ emojiCode: emoji.colons });
    }

    onClickProposal(title, resetPeriod, emojiCode) {
      this.setState({
        title,
        resetAt: getPeriodDate(resetPeriod),
        emojiCode,
      });
    }

    onToggleResetAt() {
      if (this.state.resetAt) {
        this.setState({ resetAt: null });
      } else {
        this.setState({ resetAt: getPeriodDate(TimePeriod.HALF_HOUR) });
      }
    }

    onSelectDatePeriod(period) {
      if (period === TimePeriod.MORE) {
        this.setState({ isDatePickerOpen: true });
      } else {
        const resetAt = getPeriodDate(period);
        this.setState({ resetAt });
      }
    }

    onSelectDate(date) {
      this.setState({ resetAt: date });
      this.onCloseDatePicker();
    }

    onCloseDatePicker() {
      this.setState({ isDatePickerOpen: false });
    }

    onResetForm() {
      this.setState({
        title: "",
        emojiCode: null,
        resetAt: null,
      });
    }

    onSetNewStatus() {
      this.props.onSetUserStatus({
        title: this.state.title,
        emojiCode: this.state.emojiCode,
        resetAt: this.state.resetAt,
      });
      this.onSetIsModalOpen(false);
    }

    onRemoveStatus() {
      this.props.onRemoveUserStatus();
      this.onSetIsModalOpen(false);
    }

    resetLocalFormChanges() {
      this.setState({
        title: this.props.title,
        emojiCode: this.props.emojiCode,
        resetAt: this.props.resetAt
          ? timestampToDate(this.props.resetAt)
          : null,
      });
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onSetNewStatus();
      }
    }

    onChangeTime({ parsedValue }) {
      if (isNaN(parsedValue)) {
        return;
      }
      this.setState({
        resetAt: timestampToDate(parsedValue),
      });
    }

    componentDidUpdate(prevProps) {
      if (prevProps.title !== this.props.title) {
        this.setState({ title: this.props.title });
      }
      if (prevProps.emojiCode !== this.props.emojiCode) {
        this.setState({ emojiCode: this.props.emojiCode });
      }
      if (prevProps.resetAt !== this.props.resetAt) {
        this.setState({
          resetAt: this.props.resetAt
            ? timestampToDate(this.props.resetAt)
            : null,
        });
      }

      if (!prevProps.isModalVisible && this.props.isModalVisible) {
        this.resetLocalFormChanges();
      }
    }
  }

  function mapStateToProps(state) {
    return {
      title: selectCurrentUserStatusTitle(state),
      emojiCode: selectCurrentUserStatusEmojiCode(state),
      resetAt: selectCurrentUserStatusResetAt(state),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onOpenUserStatusModal: () =>
        dispatch(onOpenModal(ModalType.USER_STATUS_MODAL)),
      onCloseUserStatusModal: () =>
        dispatch(onCloseModal(ModalType.USER_STATUS_MODAL)),
      onSetUserStatus: (status) => dispatch(onSetUserStatus(status)),
      onRemoveUserStatus: () => dispatch(onRemoveUserStatus()),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceUserStatusButton);
}

export default Enhance;
