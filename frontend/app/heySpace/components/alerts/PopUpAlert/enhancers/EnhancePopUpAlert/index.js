import React from "react";
import PropTypes from "prop-types";
import { doNothing } from "common/utils";
import { connect } from "react-redux";

import { Alert } from "models/component/PopUpAlertsModel/models";
import * as PopUpAlertsModelSelectors from "models/component/PopUpAlertsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

const modalRootNode = document.getElementById("modal-root");

function enhance(ComposedComponent) {
  class EnhancePopUpAlert extends BaseComponent {
    static propTypes = {
      alertId: PropTypes.string.isRequired,
      numberFromTop: PropTypes.number,

      onClosePopUpAlert: PropTypes.func.isRequired,

      // from redux
      alert: PropTypes.instanceOf(Alert),
    };

    static defaultProps = {
      numberFromTop: 0,
      onClosePopUpAlert: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          alert={this.props.alert}
          onClosePopUpAlert={this.props.onClosePopUpAlert}
          topOffset={this.getTopOffset(this.props.numberFromTop)}
          shouldHaveLeftMargin={this.shouldHaveLeftMargin()}
        />
      );
    }

    getTopOffset(numberFromTop) {
      const topOffset = 16;
      const popUpAlertHeight = 48;
      return {
        top: topOffset + numberFromTop * (popUpAlertHeight + 8),
      };
    }

    shouldHaveLeftMargin() {
      if (modalRootNode && modalRootNode.childElementCount > 0) {
        return false;
      } else {
        return document.getElementById("MainMenu") ? true : false;
      }
    }

    removePopUpAlertAfterTime(id) {
      if (this.props.alert.isSelfDisposable) {
        this.closeTimeout = setTimeout(() => {
          this.props.onClosePopUpAlert(id);
        }, 5000);
      }
    }

    componentDidMount() {
      this.removePopUpAlertAfterTime(this.props.alertId);
    }

    componentDidUpdate(prevProps) {
      if (
        !prevProps.alert.isSelfDisposable &&
        this.props.alert.isSelfDisposable
      ) {
        this.removePopUpAlertAfterTime(this.props.alertId);
      }

      if (
        prevProps.alert.isSelfDisposable &&
        !this.props.alert.isSelfDisposable
      ) {
        clearTimeout(this.closeTimeout);
      }
    }

    componentWillUnmount() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      alert: PopUpAlertsModelSelectors.selectAlert(state, {
        alertId: props.alertId,
      }),
    };
  }

  return connect(mapStateToProps)(EnhancePopUpAlert);
}

export default enhance;
