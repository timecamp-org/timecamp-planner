import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

import * as UsersModelSelectors from "models/domain/UsersModel/selectors/domain";
import * as UsersModelActions from "models/domain/UsersModel/actions";

export default function enhance(Component) {
  class EnhanceUserNicknameInput extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      required: PropTypes.bool,
      label: PropTypes.string,
      autoFocus: PropTypes.bool,
      maxLength: PropTypes.number,

      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onKeyDown: PropTypes.func,
      onKeyUp: PropTypes.func,
    };

    static defaultProps = {
      onFocus: doNothing,
      onBlur: doNothing,
      onKeyDown: doNothing,
      onKeyUp: doNothing,
    };

    state = {
      nickname: null,
      isNicknameBeingEdited: false,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          nickname={this.getNickname()}
          required={this.props.required}
          label={this.props.label}
          maxLength={this.props.maxLength}
          autoFocus={this.props.autoFocus}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onUpdate={this.onNicknameUpdate}
        />
      );
    }

    getNickname() {
      if (this.props.nickname) {
        return this.props.nickname;
      } else if (this.state.isNicknameBeingEdited) {
        return "";
      } else {
        return this.props.email.split("@")[0];
      }
    }

    onNicknameUpdate(event) {
      if (!this.state.isNicknameBeingEdited) {
        this.setState({
          isNicknameBeingEdited: true,
        });
      }
      const text = event.target.value;
      this.props.onNicknameUpdate(this.props.currentUserId, text);
    }

    onFocus(event) {
      const text = event.target.value;
      this.setState({ nickname: text });
      this.props.onFocus();
    }

    onBlur(event) {
      const text = event.target.value;
      if (text !== this.state.nickname) {
        this.props.onUpdateUser();
        this.props.onBlur();
        this.setState({ nickname: null });
      } else {
        // ok
      }
    }
  }

  const mapStateToProps = (state) => ({
    nickname: UsersModelSelectors.selectCurrentUserNickname(state),
    email: UsersModelSelectors.selectCurrentUserEmail(state),
    currentUserId: UsersModelSelectors.selectCurrentUserId(state),
  });

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onNicknameUpdate: (userId, nickname) =>
        dispatch(UsersModelActions.onNicknameUpdate(userId, nickname)),
      onUpdateUser: () => dispatch(UsersModelActions.onUpdateUser(null, true)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceUserNicknameInput);
}
