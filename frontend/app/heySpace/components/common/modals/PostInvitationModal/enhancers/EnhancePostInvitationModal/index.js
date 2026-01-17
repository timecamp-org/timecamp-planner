import React from "react";
import { connect } from "react-redux";
import { selectIsModalOpen } from "models/component/ModalsModel/selectors";
import { ModalType } from "models/component/ModalsModel/types";

import BaseComponent from "commonEnhancers/BaseComponent";

const MODAL_OPEN_TIMEOUT = 3000;

export default function EnhanceIntegrationsCompletedModal(Component) {
  class EnhancePostInvitationModal extends BaseComponent {
    state = {
      isModalOpen: false,
    };

    render() {
      return (
        <Component
          isModalOpen={this.state.isModalOpen}
          onCloseModal={this.onCloseModal}
        />
      );
    }

    onCloseModal() {
      this.setState({
        isModalOpen: false,
      });
    }

    onOpenModal() {
      this.setState({
        isModalOpen: true,
      });
    }

    componentDidUpdate(prevProps) {
      if (
        !prevProps.isPostInvitationModalOpen &&
        this.props.isPostInvitationModalOpen
      ) {
        this.modalTimeout = setTimeout(this.onOpenModal, MODAL_OPEN_TIMEOUT);
      }
    }

    componentWillUnmount() {
      if (this.modalTimeout) {
        clearTimeout(this.modalTimeout);
      }
    }
  }

  const mapStateToProps = (state) => {
    return {
      isPostInvitationModalOpen: selectIsModalOpen(state, {
        modalType: ModalType.POST_INVITATION_MODAL,
      }),
    };
  };

  return connect(mapStateToProps)(EnhancePostInvitationModal);
}
