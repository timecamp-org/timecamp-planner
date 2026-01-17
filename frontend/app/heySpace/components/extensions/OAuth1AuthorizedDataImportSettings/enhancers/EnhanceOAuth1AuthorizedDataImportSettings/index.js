import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import {
  onRedirectToAuthorizeOAuth1,
  onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready,
  onDeauthorizeOAuth1,
} from "models/domain/OAuthModel/actions";
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { i18mark } from "i18n";
import {
  redirectToAuthorizeOAuth1,
  fetchIntegrations,
  fetchOAuth1AuthorizedApplications,
} from "models/domain/RequestModel/constants/requestTypes";
import {
  selectRequestIsFailure,
  selectIsRequestFinished,
} from "models/domain/RequestModel/selectors";
import { selectIsOAuth1Authorized } from "models/domain/OAuthModel/selectors";
import { onStartIntegration } from "models/domain/IntegrationsModel/actions";
import {
  selectIsIntegrationInProgress,
  selectIsIntegrationSuccessful,
} from "models/domain/IntegrationsModel/selectors";
import oauth1AuthorizationConfig from "models/domain/OAuthModel/constants/oauth1AuthorizationConfig";
import EnhanceWithClickOutside from "react-click-outside";

const apiKeyInputError = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18mark(`Please insert your api key`),
});

const oauthSecretInputError = HumanMessage({
  kind: HumanMessageKind.error,
  text: i18mark(`Please insert your oauth secret`),
});

export default function EnhanceOAuth1AuthorizedDataImportSettings(Component) {
  @EnhanceWithClickOutside
  class EnhanceOAuth1AuthorizedDataImportSettings extends BaseComponent {
    static propTypes = {
      extensionId: PropTypes.string.isRequired,
      oauth1AuthorizedApplicationName: PropTypes.string.isRequired,
    };

    state = {
      isOAuth1AuthorizedDataImportModalOpen: false,
      isIntegrationInProgress: false,
      apiKey: "",
      oauthSecret: "",
      apiKeyInputError: null,
      oauthSecretInputError: null,
      isOptionsOpen: false,
    };

    render() {
      const config =
        oauth1AuthorizationConfig[this.props.oauth1AuthorizedApplicationName];
      return (
        <Component
          isOAuth1AuthorizedDataImportModalOpen={
            this.state.isOAuth1AuthorizedDataImportModalOpen
          }
          apiKey={this.state.apiKey}
          oauthSecret={this.state.oauthSecret}
          apiKeyInputError={this.state.apiKeyInputError}
          oauthSecretInputError={this.state.oauthSecretInputError}
          isOAuthAuthorizationFailure={this.props.isOAuthAuthorizationFailure}
          isOAuth1Authorized={this.props.isOAuth1Authorized}
          isFetchingIsOAuth1AuthorizedFinished={
            this.props.isFetchingIsOAuth1AuthorizedFinished
          }
          isGetIntegrationsFinished={this.props.isGetIntegrationsFinished}
          isIntegrationInProgress={this.props.isIntegrationInProgress}
          isHoveringInProgressButton={this.state.isHoveringInProgressButton}
          displayedApplicationName={config.displayedApplicationName}
          linkToApiKeyAndOAuth1Secret={config.linkToApiKeyAndOAuth1Secret}
          isIntegrationSuccessful={this.props.isIntegrationSuccessful}
          isOptionsOpen={this.state.isOptionsOpen}
          shouldRenderOptions={this.shouldRenderOptions()}
          onChangeApiKey={this.onChangeApiKey}
          onChangeOAuthSecret={this.onChangeOAuthSecret}
          onOpenOAuth1AuthorizedDataImportModal={
            this.onOpenOAuth1AuthorizedDataImportModal
          }
          onCloseOAuth1AuthorizedDataImportModal={
            this.onCloseOAuth1AuthorizedDataImportModal
          }
          onSetIsOAuth1AuthorizedDataImportModalOpen={
            this.onSetIsOAuth1AuthorizedDataImportModalOpen
          }
          onMoreVerticalButtonClick={this.onMoreVerticalButtonClick}
          onSubmit={this.onSubmit}
          onStartIntegration={this.props.onStartIntegration}
          onShowInProgressButtonTooltip={this.onShowInProgressButtonTooltip}
          onHideInProgressButtonTooltip={this.onHideInProgressButtonTooltip}
          onToggleOptions={this.onToggleOptions}
          onDeauthorizeOAuth1={this.props.onDeauthorizeOAuth1}
        />
      );
    }

    shouldRenderOptions() {
      return (
        this.props.isOAuth1Authorized &&
        !this.props.isIntegrationInProgress &&
        this.props.isFetchingIsOAuth1AuthorizedFinished &&
        this.props.isGetIntegrationsFinished
      );
    }

    onShowInProgressButtonTooltip() {
      this.setState({
        isHoveringInProgressButton: true,
      });
    }

    onHideInProgressButtonTooltip() {
      this.setState({
        isHoveringInProgressButton: false,
      });
    }

    onChangeApiKey(event) {
      const apiKey = event.target.value;
      this.setState({
        apiKey,
        apiKeyInputError: apiKey ? null : apiKeyInputError,
      });
    }

    onChangeOAuthSecret(event) {
      const oauthSecret = event.target.value;
      this.setState({
        oauthSecret,
        oauthSecretInputError: oauthSecret ? null : oauthSecretInputError,
      });
    }

    onOpenOAuth1AuthorizedDataImportModal() {
      this.setState({ isOAuth1AuthorizedDataImportModalOpen: true });
    }

    onCloseOAuth1AuthorizedDataImportModal() {
      this.setState({ isOAuth1AuthorizedDataImportModalOpen: false });
    }

    onSetIsOAuth1AuthorizedDataImportModalOpen(
      isOAuth1AuthorizedDataImportModalOpen
    ) {
      this.setState({ isOAuth1AuthorizedDataImportModalOpen });
    }

    onSubmit() {
      if (!this.state.apiKey) {
        this.setState({ apiKeyInputError });
      }

      if (!this.state.oauthSecret) {
        this.setState({ oauthSecretInputError });
      }

      if (this.state.oauthSecret && this.state.apiKey) {
        this.props.onRedirectToAuthorizeOAuth1(
          this.state.apiKey,
          this.state.oauthSecret
        );
      }
    }

    onToggleOptions() {
      this.state.isOptionsOpen
        ? this.setState({ isOptionsOpen: false })
        : this.setState({ isOptionsOpen: true });
    }

    handleClickOutside(event) {
      if (
        this.state.isOptionsOpen &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.setState({ isOptionsOpen: false });
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
      this.props.onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready();
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isOAuthAuthorizationFailure: selectRequestIsFailure(state, {
        objectId: props.oauth1AuthorizedApplicationName,
        requestType: redirectToAuthorizeOAuth1,
      }),
      isOAuth1Authorized: selectIsOAuth1Authorized(state, {
        applicationName: props.oauth1AuthorizedApplicationName,
      }),
      isFetchingIsOAuth1AuthorizedFinished: selectIsRequestFinished(state, {
        requestType: fetchOAuth1AuthorizedApplications,
      }),
      isGetIntegrationsFinished: selectIsRequestFinished(state, {
        requestType: fetchIntegrations,
      }),
      isIntegrationInProgress: selectIsIntegrationInProgress(state, {
        extensionId: props.extensionId,
      }),
      isIntegrationSuccessful: selectIsIntegrationSuccessful(state, {
        extensionId: props.extensionId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => {
    const config =
      oauth1AuthorizationConfig[props.oauth1AuthorizedApplicationName];
    const pathToRedirectAfterAuthorization =
      config.makePathToRedirectAfterAuthorization(props.extensionId);
    return {
      onRedirectToAuthorizeOAuth1: (apiKey, oauthSecret) =>
        dispatch(
          onRedirectToAuthorizeOAuth1(
            props.oauth1AuthorizedApplicationName,
            apiKey,
            oauthSecret,
            pathToRedirectAfterAuthorization
          )
        ),
      onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready: () =>
        dispatch(onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready()),
      onStartIntegration: () => dispatch(onStartIntegration(props.extensionId)),
      onDeauthorizeOAuth1: () =>
        dispatch(onDeauthorizeOAuth1(props.oauth1AuthorizedApplicationName)),
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceOAuth1AuthorizedDataImportSettings);
}
