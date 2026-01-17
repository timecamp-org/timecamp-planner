import React from "react";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as CurrentUserModelActions from "models/domain/CurrentUserModel/actions";
import * as FilesModelSelectors from "models/domain/FilesModel/selectors";

function enhance(ComposedComponent) {
  class EnhanceWithSignOut extends BaseComponent {
    state = {
      isModalOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          onSignOut={this.props.onSignOut}
          className={this.props.className}
          onTrySignOut={this.onTrySignOut}
          onSetIsModalOpen={this.onSetIsModalOpen}
          isModalOpen={this.state.isModalOpen}          
        />
      );
    }

    onSetIsModalOpen(isOpen) {
      this.setState({
        isModalOpen: isOpen,
      });
    }

    onTrySignOut() {
      if (!this.props.fileInUploadName) {
        this.props.onSignOut();
      } else {
        this.setState({
          isModalOpen: true,
        });
      }
    }
  }

  function mapStateToProps(state) {
    return {
      fileInUploadName: FilesModelSelectors.selectFileInUploadName(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSignOut: () => dispatch(CurrentUserModelActions.onSignOut()),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWithSignOut);
}

export default enhance;
