import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { selectCurrentSubscription } from 'models/domain/SubscriptionModel/selectors';

import { selectSubscriptionPlanId } from 'models/domain/SubscriptionModel/selectors/domain';
import * as SubscriptionModelActions from 'models/domain/SubscriptionModel/actions';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceConfirmationSection extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string.isRequired,
      currentSubscription: ImmutablePropTypes.record,

      onFinishCheckout: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          subscriptionPlanId={this.props.subscriptionPlanId}
          isSubscriptionConfirmed={!!this.props.currentSubscription}
          onGoBack={this.onGoBack}
        />
      );
    }

    onGoBack() {
      this.props.onFinishCheckout();
      this.props.history.push('/settings/subscription');
    }
  }

  const mapStateToProps = (state) => ({
    subscriptionPlanId: selectSubscriptionPlanId(state),
    currentSubscription: selectCurrentSubscription(state),
  });

  function makeDispatchToProps(dispatch) {
    return {
      onFinishCheckout: () =>
        dispatch(SubscriptionModelActions.onFinishCheckout()),
    };
  }

  return connect(
    mapStateToProps,
    makeDispatchToProps
  )(EnhanceConfirmationSection);
}

export default Enhance;
