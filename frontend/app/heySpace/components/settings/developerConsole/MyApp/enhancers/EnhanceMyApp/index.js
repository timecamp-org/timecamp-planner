import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { selectOAuthClientIdByAppId } from "models/domain/UserAppsModel/selectors";
import {
  selectClientName,
  selectClientThumbnailUrl,
} from "models/domain/OAuthModel/selectors";

import { onOpenModal } from "models/component/ModalsModel/actions";
import { ModalType } from "models/component/ModalsModel/types";

function Enhance(ComposedComponent) {
  class EnhanceMyApp extends BaseComponent {
    static propTypes = {
      appId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          clientName={this.props.clientName}
          clientThumbnailUrl={this.props.clientThumbnailUrl}
          onClick={this.props.onOpenModal}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    const oAuthClientId = selectOAuthClientIdByAppId(state, {
      appId: props.appId,
    });
    return {
      clientName: selectClientName(state, { clientId: oAuthClientId }),
      clientThumbnailUrl: selectClientThumbnailUrl(state, {
        clientId: oAuthClientId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onOpenModal: () =>
        dispatch(onOpenModal(ModalType.EDIT_APP_MODAL, { appId: props.appId })),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMyApp);
}

export default Enhance;
