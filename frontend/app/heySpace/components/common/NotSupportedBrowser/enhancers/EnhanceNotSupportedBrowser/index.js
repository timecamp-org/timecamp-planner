import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectDoUserWantToUseNotSupportedBrowser } from "models/domain/AppModel/selectors";
import { onSetDoUserWantToUseNotSupportedBrowser } from "models/domain/AppModel/actions";

function enhance(ComposedComponent) {
  class EnhanceNotSupportedBrowser extends BaseComponent {
    static propTypes = {
      doUserWantToUseNotSupportedBrowser: PropTypes.bool.isRequired,
      onSetDoUserWantToUseNotSupportedBrowser: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          doUserWantToUseNotSupportedBrowser={
            this.props.doUserWantToUseNotSupportedBrowser
          }
          onSetDoUserWantToUseNotSupportedBrowser={
            this.onSetDoUserWantToUseNotSupportedBrowser
          }
        />
      );
    }

    onSetDoUserWantToUseNotSupportedBrowser() {
      this.props.onSetDoUserWantToUseNotSupportedBrowser(
        !this.props.doUserWantToUseNotSupportedBrowser
      );
    }
  }

  const mapStateToProps = (state) => ({
    doUserWantToUseNotSupportedBrowser:
      selectDoUserWantToUseNotSupportedBrowser(state),
  });

  const mapDispatchToProps = (dispatch) => ({
    onSetDoUserWantToUseNotSupportedBrowser: (decision) =>
      dispatch(onSetDoUserWantToUseNotSupportedBrowser(decision)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceNotSupportedBrowser);
}

export default enhance;
