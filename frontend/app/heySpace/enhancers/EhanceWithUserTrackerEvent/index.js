import React from 'react';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { UserTracker } from 'common/services';

const Enhance = (userTrackerEvent, params) => (ComposedComponent) => {
  class EhanceWithUserTrackerEvent extends BaseComponent {
    render() {
      return <ComposedComponent {...this.props} />;
    }

    componentDidMount() {
      UserTracker.track(userTrackerEvent, params);
    }
  }

  return EhanceWithUserTrackerEvent;
};

export default Enhance;
