import React from "react";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectIsCurrentUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors";

function enhance(ComposedComponent) {
  class EnhanceSpaceListHeader extends BaseComponent {
    state = {
      openModal: null,
      modalProjectName: "",
    };

    render() {
      return (
        <ComposedComponent
          openModal={this.state.openModal}
          canCurrentUserCreateProject={this.props.canCurrentUserCreateProject}
          modalProjectName={this.state.modalProjectName}
          onUpdateModalProjectName={this.onUpdateModalProjectName}
          onOpenBrowseSpacesModal={this.onOpenBrowseSpacesModal}
          onOpenCreateSpaceModal={this.onOpenCreateSpaceModal}
          onCloseModal={this.onCloseModal}
        />
      );
    }

    onUpdateModalProjectName(name) {
      this.setState({
        modalProjectName: name,
      });
    }

    onSetOpenModal(openModal) {
      this.setState((prevState) => ({
        openModal,
        modalProjectName: openModal === null ? "" : prevState.modalProjectName,
      }));
    }

    onCloseModal() {
      this.onSetOpenModal(null);
    }

    onOpenBrowseSpacesModal() {
      this.onSetOpenModal("browseSpacesModal");
    }

    onOpenCreateSpaceModal() {
      this.onSetOpenModal("createSpaceModal");
    }
  }

  function mapStateToProps(state) {
    return {
      canCurrentUserCreateProject: !selectIsCurrentUserOrganizationGuest(state),
    };
  }

  return connect(mapStateToProps)(EnhanceSpaceListHeader);
}

export default enhance;
