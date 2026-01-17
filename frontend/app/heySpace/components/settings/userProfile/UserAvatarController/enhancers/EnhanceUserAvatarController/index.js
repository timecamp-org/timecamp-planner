import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import handleError from "common/utils/handleError";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";
import * as UsersActions from "models/domain/UsersModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceUserAvatarController extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
      currentUserId: PropTypes.string.isRequired,

      onAvatarUpdate: PropTypes.func.isRequired,
      onAvatarUpload: PropTypes.func.isRequired,
      onGravatarSet: PropTypes.func.isRequired,
      onSetOpenCallback: PropTypes.func.isRequired,
      onOpenFilePrompt: PropTypes.func.isRequired,
    };

    state = {
      isDropdownVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isDropdownVisible={this.state.isDropdownVisible}
          onOpenFilePrompt={this.props.onOpenFilePrompt}
          onInitialsSet={this.onInitialsSet}
          onGravatarSet={this.onGravatarSet}
          onChooseFile={this.onChooseFile}
          onSetOpenCallback={this.props.onSetOpenCallback}
          onSetIsDropdownVisible={this.onSetIsDropdownVisible}
          currentUserId={this.props.currentUserId}
        />
      );
    }

    onChooseFile(files) {
      if (files && files.length > 0) {
        this.props.onAvatarUpload(files[0]);
      } else {
        handleError(new Error("Error selecting file"));
      }
      this.onSetIsDropdownVisible(false);
    }

    onGravatarSet() {
      this.props.onGravatarSet();
      this.onSetIsDropdownVisible(false);
    }

    onInitialsSet() {
      this.props.onAvatarUpdate(this.props.currentUserId, null);
      this.onSetIsDropdownVisible(false);
    }

    onSetIsDropdownVisible(isDropdownVisible) {
      this.setState({ isDropdownVisible });
    }
  }

  const mapStateToProps = (state) => {
    return {
      currentUserId: selectCurrentUserId(state),
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      onAvatarUpdate: (userId, avatarUrl) =>
        dispatch(UsersActions.onAvatarUpdate(userId, avatarUrl)),
      onAvatarUpload: (file) => dispatch(UsersActions.onAvatarUpload(file)),
      onGravatarSet: () => dispatch(UsersActions.onGravatarSet()),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceUserAvatarController);
}

export default Enhance;
