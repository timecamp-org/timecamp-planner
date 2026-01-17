import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import handleError from "common/utils/handleError";
import { doNothing } from "common/utils";

import { selectPaymentPageUrl } from "models/domain/SubscriptionModel/selectors/domain";
import * as SubscriptionModelActions from "models/domain/SubscriptionModel/actions";
import * as PopUpAlertsModelActions from "models/component/PopUpAlertsModel/actions";
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { i18n } from "i18n";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhancePaymentForm extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      paymentPageUrl: PropTypes.string.isRequired,

      onPaymentSuccess: PropTypes.func.isRequired,
      onFinishCheckout: PropTypes.func.isRequired,
      onCheckoutClose: PropTypes.func,
      onCheckoutFailure: PropTypes.func,
      onCheckoutStep: PropTypes.func,
    };

    static defaultProps = {
      onCheckoutClose: doNothing,
      onCheckoutFailure: doNothing,
      onCheckoutStep: doNothing,
    };

    render() {
      return <ComposedComponent className={this.props.className} />;
    }

    embedPaymentForm() {
      const { paymentPageUrl, onCheckoutFailure } = this.props;
      if (paymentPageUrl) {
        try {
          const checkoutWindow = window.open(
            paymentPageUrl,
            "_blank",
            "noopener,noreferrer"
          );
          if (!checkoutWindow) {
            throw new Error("Payment page was blocked");
          }
          this.onCheckoutClose();
        } catch (error) {
          handleError(error);
          onCheckoutFailure();
          this.props.onAddAlert({
            humanMessage: HumanMessage({
              kind: HumanMessageKind.error,
              text: i18n.t(`Something went wrong and we couldn't show the payment page`),
            }),
          });
        }
      }
    }

    onCheckoutClose() {
      this.props.onRemovePersistPaymentPage();
      this.props.onCheckoutClose();
    }

    componentDidMount() {
      this.embedPaymentForm();
    }
  }

  const mapStateToProps = (state) => ({
    paymentPageUrl: selectPaymentPageUrl(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onPaymentSuccess: () =>
      dispatch(SubscriptionModelActions.onPaymentSuccess()),
    onFinishCheckout: () =>
      dispatch(SubscriptionModelActions.onFinishCheckout()),
    onRemovePersistPaymentPage: () =>
      dispatch(SubscriptionModelActions.onRemovePersistPaymentPage()),
    onAddAlert: (alert) =>
      dispatch(
        PopUpAlertsModelActions.onAddAlert(alert, "payment-form", false)
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhancePaymentForm);
}

export default Enhance;
