import React from 'react';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(Component) {
  class EnhanceSignUpOfflinePage extends BaseComponent {

    static propTypes = {};

    render() {
      return <Component onRetry={this.onRetry} />;
    }

    onRetry() {
      window.location.replace('/');
    }
  
}

  return EnhanceSignUpOfflinePage;
}

export default enhance;
