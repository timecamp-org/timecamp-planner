import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import queryString from "query-string";

import { onAuthorizeOAuth1 } from "models/domain/OAuthModel/actions";
import { onStartIntegration } from "models/domain/IntegrationsModel/actions";
import { authorizeOAuth1 } from "models/domain/RequestModel/constants/requestTypes";
import { selectRequestIsFailure } from "models/domain/RequestModel/selectors";
import { selectIsOAuth1Authorized } from "models/domain/OAuthModel/selectors";
import { TRELLO } from "models/domain/OAuthModel/constants/oauth1AuthorizedApplications";

export default function EnhanceOAuth1AuthorizedDataImportController(Component) {
  class EnhanceOAuth1AuthorizedDataImportController extends BaseComponent {
    static propTypes = {};

    state = {
      isImportDataModalOpen: false,
    };

    render() {
      return (
        <Component
          isImportDataModalOpen={this.state.isImportDataModalOpen}
          isOAuthAuthorizationFailure={this.props.isOAuthAuthorizationFailure}
          isOAuth1Authorized={this.props.isOAuth1Authorized}
          onOpenImportDataModal={this.onOpenImportDataModal}
          onCloseImportDataModal={this.onCloseImportDataModal}
          onSetIsImportDataModalOpen={this.onSetIsImportDataModalOpen}
          onStartImport={this.onStartImport}
        />
      );
    }

    onOpenImportDataModal() {
      this.setState({ isImportDataModalOpen: true });
    }

    onCloseImportDataModal() {
      this.setState({ isImportDataModalOpen: false });
    }

    onSetIsImportDataModalOpen(isImportDataModalOpen) {
      this.setState({ isImportDataModalOpen });
    }

    componentDidMount() {
      /* eslint-disable camelcase */
      const { oauth_token, oauth_verifier, applicationName } =
        queryString.parse(window.location.search);
      if (oauth_token && oauth_verifier && applicationName) {
        this.onOpenImportDataModal();
        this.props.onAuthorizeOAuth1(
          applicationName,
          oauth_token,
          oauth_verifier
        );
      }
    }

    onStartImport() {
      const { extensionId } = queryString.parse(window.location.search);
      this.props.onStartIntegration(extensionId);
      this.onCloseImportDataModal();
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isOAuthAuthorizationFailure: selectRequestIsFailure(state, {
        objectId: TRELLO,
        requestType: authorizeOAuth1,
      }),
      isOAuth1Authorized: selectIsOAuth1Authorized(state, {
        applicationName: TRELLO,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onAuthorizeOAuth1: (applicationName, oauthToken, oauthVerifier) =>
      dispatch(onAuthorizeOAuth1(applicationName, oauthToken, oauthVerifier)),
    onStartIntegration: (extensionId) =>
      dispatch(onStartIntegration(extensionId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceOAuth1AuthorizedDataImportController);
}
