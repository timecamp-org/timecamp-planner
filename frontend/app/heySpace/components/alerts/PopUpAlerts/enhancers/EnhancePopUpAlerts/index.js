import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ImmutablePropTypes from "react-immutable-proptypes";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as PopUpAlertsModelActions from "models/component/PopUpAlertsModel/actions";
import * as PopUpAlertsModelSelectors from "models/component/PopUpAlertsModel/selectors";

const popUpAlertRoot = document.getElementById("popup-alert-root");

function enhance(ComposedComponent) {
  class EnhancePopUpAlerts extends BaseComponent {
    static propTypes = {
      alertIds: ImmutablePropTypes.list.isRequired,
      onRemoveAlert: PropTypes.func.isRequired,
      isRenderedOnMobileDevice: PropTypes.bool,
    };

    constructor(props) {
      super(props);
      this.el = document.createElement("div");
    }

    render() {
      return ReactDOM.createPortal(
        <ComposedComponent
          alertIds={this.props.alertIds}
          onClosePopUpAlert={this.props.onRemoveAlert}
          isRenderedOnMobileDevice={this.props.isRenderedOnMobileDevice}
        />,
        this.el
      );
    }

    componentDidMount() {
      if (popUpAlertRoot) {
        popUpAlertRoot.appendChild(this.el);
      }
    }

    componentWillUnmount() {
      if (popUpAlertRoot) {
        setImmediate(() => {
          popUpAlertRoot.removeChild(this.el);
        });
      }
    }
  }

  function mapStateToProps(state) {
    return {
      alertIds: PopUpAlertsModelSelectors.selectAlertIds(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onRemoveAlert: (id) =>
        dispatch(PopUpAlertsModelActions.onRemoveAlert(id)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhancePopUpAlerts);
}

export default enhance;
