import React from "react";
import { connect } from "react-redux";
import {
  selectIsModalOpen,
  selectModalProperty,
} from "models/component/ModalsModel/selectors";
import {
  selectOAuthClientIdByAppId,
  selectIsCurrentUserAppOwner,
} from "models/domain/UserAppsModel/selectors";
import {
  selectClientName,
  selectClientThumbnailUrl,
  selectClientSecret,
  selectClientRedirectUris,
} from "models/domain/OAuthModel/selectors";
import { ModalType } from "models/component/ModalsModel/types";
import BaseComponent from "commonEnhancers/BaseComponent";
import {
  onOpenModal,
  onCloseModal,
} from "models/component/ModalsModel/actions";
import {
  onUpdateUserApp,
  onDeleteUserApp,
  onRegenerateClientSecret,
} from "models/domain/UserAppsModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceEditAppModal extends BaseComponent {
    static propTypes = {};

    constructor(props) {
      super(props);
      this.state = {
        clientName: this.props.clientName,
        clientThumbnailUrl: this.props.clientThumbnailUrl,
        clientRedirectUris: this.props.clientRedirectUris,
        isDeleting: false,
      };
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalOpen={this.props.isModalOpen}
          appId={this.props.appId}
          clientName={this.state.clientName}
          clientThumbnailUrl={this.state.clientThumbnailUrl}
          clientRedirectUris={this.state.clientRedirectUris}
          clientId={this.props.clientId}
          clientSecret={this.props.clientSecret}
          isCurrentUserAppOwner={this.props.isCurrentUserAppOwner}
          isDeleting={this.state.isDeleting}
          onSetIsModalOpen={this.onSetIsModalOpen}
          onUpdateClientName={this.onUpdateClientName}
          onUpdateClientRedirectUris={this.onUpdateClientRedirectUris}
          onModalSave={this.onModalSave}
          onDeleteUserApp={this.onDeleteUserApp}
          onSetIsDeleting={this.onSetIsDeleting}
          onRegenerateClientSecret={this.onRegenerateClientSecret}
          onLeaveAppCollaborators={this.props.onCloseModal}
        />
      );
    }

    onUpdateClientName(event) {
      const text = event.target.value;
      this.setState({ clientName: text });
    }

    onUpdateClientRedirectUris(event) {
      const text = event.target.value;
      this.setState({ clientRedirectUris: text });
    }

    onSetIsDeleting(isDeleting) {
      this.setState({ isDeleting });
    }

    onModalSave() {
      this.props.onUpdateUserApp(this.props.appId, {
        clientName: this.state.clientName,
        clientThumbnailUrl: this.state.clientThumbnailUrl,
        clientRedirectUris: this.state.clientRedirectUris,
      });
      this.onSetIsModalOpen(false);
    }

    onDeleteUserApp() {
      this.props.onDeleteUserApp(this.props.appId);
      this.onSetIsModalOpen(false);
    }

    onRegenerateClientSecret() {
      this.props.onRegenerateClientSecret(this.props.clientId);
    }

    componentDidUpdate(prevProps) {
      if (prevProps.clientName !== this.props.clientName) {
        this.setState({ clientName: this.props.clientName });
      }
      if (prevProps.clientThumbnailUrl !== this.props.clientThumbnailUrl) {
        this.setState({ clientThumbnailUrl: this.props.clientThumbnailUrl });
      }
      if (prevProps.clientRedirectUris !== this.props.clientRedirectUris) {
        this.setState({ clientRedirectUris: this.props.clientRedirectUris });
      }
    }

    onSetIsModalOpen() {
      if (!this.props.isModalOpen) {
        this.props.onOpenModal();
      } else {
        this.props.onCloseModal();
        this.onSetIsDeleting(false);
      }
    }
  }

  function mapStateToProps(state, props) {
    const appId = selectModalProperty(state, {
      modalType: ModalType.EDIT_APP_MODAL,
      property: "appId",
    });
    const oAuthClientId = selectOAuthClientIdByAppId(state, { appId });
    return {
      appId,
      isModalOpen: selectIsModalOpen(state, {
        modalType: ModalType.EDIT_APP_MODAL,
      }),
      clientName: selectClientName(state, { clientId: oAuthClientId }),
      clientThumbnailUrl: selectClientThumbnailUrl(state, {
        clientId: oAuthClientId,
      }),
      clientRedirectUris: selectClientRedirectUris(state, {
        clientId: oAuthClientId,
      }),
      clientId: oAuthClientId,
      clientSecret: selectClientSecret(state, { clientId: oAuthClientId }),
      isCurrentUserAppOwner: selectIsCurrentUserAppOwner(state, { appId }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUpdateUserApp: (appId, app) => dispatch(onUpdateUserApp(appId, app)),
      onDeleteUserApp: (appId) => dispatch(onDeleteUserApp(appId)),
      onRegenerateClientSecret: (oAuthClientId) =>
        dispatch(onRegenerateClientSecret(oAuthClientId)),
      onOpenModal: () =>
        dispatch(onOpenModal(ModalType.EDIT_APP_MODAL, { appId: props.appId })),
      onCloseModal: () => dispatch(onCloseModal(ModalType.EDIT_APP_MODAL)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceEditAppModal);
}

export default Enhance;
