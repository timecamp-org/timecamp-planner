import React from 'react';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(Component) {
  class EnhanceGoogleSignUpPage extends BaseComponent {
    render() {
      return <Component />;
    }

    componentDidMount() {
      document.title = `Register to the only truly Free Task Management Tool - Planner`;
    }
  }

  return EnhanceGoogleSignUpPage;
}

export default enhance;
