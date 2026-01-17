import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as SubscriptionModelSelectors from "models/domain/SubscriptionModel/selectors";
import { onFetchSubscriptionInvoices } from "models/domain/SubscriptionModel/actions";
import {
  selectIsRequestRepeatable,
  selectRequestIsLoading,
} from "models/domain/RequestModel/selectors";
import { getSubscriptionInvoices } from "models/domain/RequestModel/constants/requestTypes";
import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function EnhanceBillingHistory(ComposedComponent) {
  class EnhanceBillingHistory extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          invoiceIds={this.props.invoiceIds}
          isLoading={this.props.isLoading}
        />
      );
    }

    componentDidMount() {
      if (this.props.isInvoicesRequestRepeatable) {
        this.props.onFetchSubscriptionInvoices();
      }
    }
  }

  const mapStateToProps = (state) => {
    const organizationId = selectCurrentOrganizationId(state);
    return {
      invoiceIds: SubscriptionModelSelectors.selectInvoiceIds(state),
      isInvoicesRequestRepeatable: selectIsRequestRepeatable(state, {
        requestType: getSubscriptionInvoices,
        objectId: organizationId,
      }),
      isLoading: selectRequestIsLoading(state, {
        requestType: getSubscriptionInvoices,
        objectId: organizationId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    onFetchSubscriptionInvoices: () => dispatch(onFetchSubscriptionInvoices()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceBillingHistory);
}

export default EnhanceBillingHistory;
