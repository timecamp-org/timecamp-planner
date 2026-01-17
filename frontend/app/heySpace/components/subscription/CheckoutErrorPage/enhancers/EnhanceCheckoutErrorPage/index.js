import React from 'react';

import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { onSetCheckoutStage } from 'models/domain/SubscriptionModel/actions';
import { CheckoutStage } from 'models/domain/SubscriptionModel/types';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceCheckoutErrorPage extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          onGoToSettings={this.onGoToSettings}
        />
      );
    }

    onGoToSettings() {
      this.props.onGoBackToSubscriptionChoice();
      this.props.history.push('/settings/subscription');
    }
  
}

  function mapDispatchToProps(dispatch, props) {
    return {
      onGoBackToSubscriptionChoice: () =>
        dispatch(onSetCheckoutStage(CheckoutStage.STAGE_SUBSCRIPTION_CHOICE)),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceCheckoutErrorPage);
}

export default Enhance;
