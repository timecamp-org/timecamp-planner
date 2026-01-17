import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'BaseComponent';

import {
  selectCurrentUserFullName,
  selectCurrentUserId,
  selectCurrentUserEmail,
  selectCurrentUserNickname,
} from 'models/domain/UsersModel/selectors/domain';
import { isValidFullName, isValidEmail, prepareFullName } from 'common/utils/validation';
import * as UsersModelActions from 'models/domain/UsersModel/actions';
import handleError from 'common/utils/handleError';

function enhance(ComposedComponent) {
  class EnhanceProfileScene extends BaseComponent {
    static propTypes = {
      userFullName: PropTypes.string.isRequired,
      currentUserId: PropTypes.string.isRequired,

      onFirstNameUpdate: PropTypes.func.isRequired,
      onLastNameUpdate: PropTypes.func.isRequired,
      onUpdateUser: PropTypes.func.isRequired,

      onAvatarUpdate: PropTypes.func.isRequired,
      onAvatarUpload: PropTypes.func.isRequired,
    };

    state = {
      userFullNameIsValid: true,
      userFullNameValidationMessage: null,
      userFullName: this.props.userFullName,

      nicknameIsValid: true,
      nicknameValidationMessage: null,
      nickname: this.props.nickname || this.props.email.split('@')[0],

      emailIsValid: true,
      emailValidationMessage: null,
      email: this.props.email,
    };

    render() {
      return (
        <ComposedComponent
          currentUserId={this.props.currentUserId}
          userFullName={this.state.userFullName}
          userFullNameIsValid={this.state.userFullNameIsValid}
          userFullNameValidationMessage={this.state.userFullNameValidationMessage}
          onChangeFullNameInput={this.onChangeFullNameInput}
          onBlurFullNameInput={this.onBlurFullNameInput}
          onSubmitEditingFullNameInput={this.onSubmitEditingFullNameInput}
          nickname={this.state.nickname}
          nicknameIsValid={this.state.nicknameIsValid}
          nicknameValidationMessage={this.state.nicknameValidationMessage}
          onChangeNicknameInput={this.onChangeNicknameInput}
          onBlurNicknameInput={this.onBlurNicknameInput}
          onSubmitEditingNicknameInput={this.onSubmitEditingNicknameInput}
          email={this.state.email}
          emailIsValid={this.state.emailIsValid}
          emailValidationMessage={this.state.emailValidationMessage}
          onChangeEmailInput={this.onChangeEmailInput}
          onBlurEmailInput={this.onBlurEmailInput}
          onSubmitEditingEmailInput={this.onSubmitEditingEmailInput}
          onSetInitialsAvatar={this.onSetInitialsAvatar}
          onChooseFile={this.onChooseFile}
        />
      );
    }

    // full name handlers

    onChangeFullNameInput(text) {
      this.setState({
        userFullName: text,
      });
    }

    onBlurFullNameInput() {
      console.log('BLUR full name input');
      const { isValid, message } = this.validateFullNameInput();

      if (!isValid) {
        this.setState({
          userFullNameIsValid: isValid,
          userFullNameValidationMessage: message,
        });
      } else {
        this.setState({
          userFullNameIsValid: true,
          userFullNameValidationMessage: null,
        });

        this.onUpdateFullName();
      }
    }

    onUpdateFullName() {
      const fullName = prepareFullName(this.state.userFullName);
      const [firstName, lastName] = fullName.split(' ');
      this.props.onFirstNameUpdate(this.props.currentUserId, firstName);
      this.props.onLastNameUpdate(this.props.currentUserId, lastName);
      this.props.onUpdateUser();
    }

    onSubmitEditingFullNameInput() {
      console.log('onSubmitEditingFullNameInput');
    }

    validateFullNameInput() {
      const { userFullName } = this.state;
      return isValidFullName(userFullName, true);
    }

    // nickname handlers

    onChangeNicknameInput(nickname) {
      this.setState({
        nickname,
      });
    }

    validateNickname() {
      const { nickname } = this.state;
      if (nickname.split(' ').length > 1) {
        return {
          isValid: false,
          message: "Nickname can't contain projects",
        };
      } else {
        return {
          isValid: true,
          message: null,
        };
      }
    }

    onBlurNicknameInput() {
      const { isValid, message } = this.validateNickname();
      if (!isValid) {
        this.setState({
          nicknameIsValid: isValid,
          nicknameValidationMessage: message,
        });
      } else {
        this.setState({
          nicknameIsValid: true,
          nicknameValidationMessage: null,
        });

        this.updateNickname();
      }
    }

    updateNickname() {
      this.props.onNicknameUpdate(this.props.currentUserId, this.state.nickname);
      this.props.onUpdateUser();
    }

    onSubmitEditingNicknameInput() {
      console.log('onSubmitEditingNicknameInput');
    }

    // email handlers

    onChangeEmailInput(email) {
      this.setState({
        email,
      });
    }

    validateEmail() {
      const { email } = this.state;
      return isValidEmail(email, true);
    }

    onBlurEmailInput() {
      const { isValid, message } = this.validateEmail();
      if (!isValid) {
        this.setState({
          emailIsValid: isValid,
          emailValidationMessage: message,
        });
      } else {
        this.setState({
          emailIsValid: true,
          emailValidationMessage: null,
        });

        this.updateEmail();
      }
    }

    updateEmail() {
      const { email } = this.state;
      this.props.onEmailUpdate(email);
      this.props.onUpdateUser();
    }

    onSubmitEditingEmailInput() {
      console.log('onSubmitEditingEmailInput');
    }

    // avatar handlers

    onSetInitialsAvatar() {
      this.props.onAvatarUpdate(this.props.currentUserId, null);
    }

    onChooseFile(files) {
      if (files && files.length > 0) {
        this.props.onAvatarUpload(files[0]);
      } else {
        handleError(new Error('Error selecting file'));
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    userFullName: selectCurrentUserFullName(state),
    nickname: selectCurrentUserNickname(state),
    email: selectCurrentUserEmail(state),
    currentUserId: selectCurrentUserId(state),
  });

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onFirstNameUpdate: (userId, firstName) => dispatch(UsersModelActions.onFirstNameUpdate(userId, firstName)),
      onLastNameUpdate: (userId, lastName) => dispatch(UsersModelActions.onLastNameUpdate(userId, lastName)),
      onNicknameUpdate: (userId, nickname) => dispatch(UsersModelActions.onNicknameUpdate(userId, nickname)),
      onEmailUpdate: (userId, email) => dispatch(UsersModelActions.onEmailUpdate(userId, email)),
      onUpdateUser: () => dispatch(UsersModelActions.onUpdateUser(null, true)),
      onAvatarUpdate: (userId, avatarUrl) => dispatch(UsersModelActions.onAvatarUpdate(userId, avatarUrl)),
      onAvatarUpload: (file) => dispatch(UsersModelActions.onAvatarUpload(file)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceProfileScene);
}

export default enhance;
