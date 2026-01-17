import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RedirectToSignInPage from "components/routing/RedirectTo/signInPage";

import * as AppModelSelectors from "models/domain/AppModel/selectors";

import EnhanceWithIsCurrentUserAuthenticated from "commonEnhancers/EnhanceWithIsCurrentUserAuthenticated";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

function enhance(ComposedComponent) {
  @EnhanceWithIsCurrentUserAuthenticated
  @EnhanceWithRouter()
  class RedirectToSignInPageIfCurrentUserIsDeauthenticated extends React.Component {
    static propTypes = {
      isCurrentUserAuthenticated: PropTypes.bool,
      hasLoaded: PropTypes.bool,
      match: PropTypes.shape({
        url: PropTypes.string,
      }),
    };

    static defaultProps = {
      isCurrentUserAuthenticated: false,
      hasLoaded: false,
    };

    render() {
      if (this.props.isCurrentUserAuthenticated && this.props.hasLoaded) {
        return <ComposedComponent {...this.props} />;
      } else {
        return <RedirectToSignInPage to={this.props.match.url} />;
      }
    }
  }

  function mapStateToProps(state) {
    return {
      hasLoaded: AppModelSelectors.hasLoaded(state),
    };
  }

  return connect(mapStateToProps)(
    RedirectToSignInPageIfCurrentUserIsDeauthenticated
  );
}

export default enhance;
