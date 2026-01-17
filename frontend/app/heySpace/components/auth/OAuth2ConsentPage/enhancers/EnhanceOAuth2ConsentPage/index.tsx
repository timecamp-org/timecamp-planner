/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';

import queryString from 'query-string';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithIsCurrentUserAuthenticated from 'commonEnhancers/EnhanceWithIsCurrentUserAuthenticated';
import { onSignOut } from 'models/domain/CurrentUserModel/actions';
import { onAuthorizeOAuth2, onLoadOAuthClientData } from 'models/domain/OAuthModel/actions';
import permissions from 'models/domain/OAuthModel/constants/permissions';
import { selectClientName, selectClientThumbnailUrl } from 'models/domain/OAuthModel/selectors';
import { selectCurrentUserFullName } from 'models/domain/UsersModel/selectors/domain';

function enhance(ComposedComponent) {
  // @ts-ignore
  @EnhanceWithIsCurrentUserAuthenticated
  class EnhanceOAuth2ConsentPage extends BaseComponent {
    render() {
      const { scope } = queryString.parse(window.location.search);
      return (
        <ComposedComponent
          className={this.props.className}
          isCurrentUserAuthenticated={this.props.isCurrentUserAuthenticated}
          isValidRequestParams={this.isValidRequestParams()}
          clientName={this.props.clientName}
          clientThumbnailUrl={this.props.clientThumbnailUrl}
          permissions={permissions[scope]}
          fullName={this.props.fullName}
          onAuthorize={this.props.onAuthorizeOAuth2}
          onDeny={this.onDeny}
          onSignOut={this.props.onSignOut}
        />
      );
    }

    isValidRequestParams() {
      const params = queryString.parse(window.location.search);
      return Boolean(params.redirect_uri && params.client_id && params.scope);
    }

    onDeny() {
      window.close();
    }

    componentDidMount() {
      const { client_id } = queryString.parse(window.location.search);
      this.props.onLoadOAuthClientData(client_id);
    }
  }

  function mapStateToProps(state) {
    const { client_id } = queryString.parse(window.location.search);
    return {
      // @ts-ignore
      clientName: selectClientName(state, { clientId: client_id }),
      // @ts-ignore
      clientThumbnailUrl: selectClientThumbnailUrl(state, {
        clientId: client_id,
      }),
      fullName: selectCurrentUserFullName(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onAuthorizeOAuth2: () => dispatch(onAuthorizeOAuth2()),
      onLoadOAuthClientData: (clientId) => dispatch(onLoadOAuthClientData(clientId)),
      onSignOut: () => dispatch(onSignOut()),
    };
  }
  //@ts-ignore
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceOAuth2ConsentPage);
}

export default enhance;
