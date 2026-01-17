import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import {
  selectIsCurrentSubscriptionFree,
  selectIsTrialAvaliable,
} from 'models/domain/SubscriptionModel/selectors';

import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';

function EnhanceSubscriptionDescription(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceSubscriptionDescription extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {};

    state = {
      isHovering: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isFree={this.props.isFree}
          isTrialAvailable={this.props.isTrialAvailable}
          isHovering={this.state.isHovering}
          isCurrentUserOrganizationAdmin={
            this.props.isCurrentUserOrganizationAdmin
          }
          onNavigateToSubscriptions={this.onNavigateToSubscriptions}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }

    onNavigateToSubscriptions() {
      this.props.history.push('/subscription/checkout');
    }
  }

  const mapStateToProps = (state, props) => ({
    isFree: selectIsCurrentSubscriptionFree(state),
    isTrialAvailable: selectIsTrialAvaliable(state),
    isCurrentUserOrganizationAdmin: selectIsCurrentUserOrganizationAdmin(state),
  });

  return connect(mapStateToProps)(EnhanceSubscriptionDescription);
}

export default EnhanceSubscriptionDescription;
