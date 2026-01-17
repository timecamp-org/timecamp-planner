import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as SubscriptionModelSelectors from "models/domain/SubscriptionModel/selectors";
import { onDownloadInvoice } from "models/domain/SubscriptionModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceInvoice extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      invoiceId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          createdAt={this.props.createdAt}
          planName={this.props.planName}
          status={this.props.status}
          total={this.props.total}
          quantity={this.props.quantity}
          onDownloadInvoice={this.props.onDownloadInvoice}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      createdAt: SubscriptionModelSelectors.selectInvoiceCreatedAt(state, {
        invoiceId: props.invoiceId,
      }),
      planName: SubscriptionModelSelectors.selectInvoicePlanName(state, {
        invoiceId: props.invoiceId,
      }),
      status: SubscriptionModelSelectors.selectInvoiceStatus(state, {
        invoiceId: props.invoiceId,
      }),
      total: SubscriptionModelSelectors.selectInvoiceTotal(state, {
        invoiceId: props.invoiceId,
      }),
      quantity: SubscriptionModelSelectors.selectInvoiceQuantity(state, {
        invoiceId: props.invoiceId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => {
    return {
      onDownloadInvoice: () => dispatch(onDownloadInvoice(props.invoiceId)),
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceInvoice);
}

export default Enhance;
