import React from 'react';

import { stretchElementToBottomWithMargin } from 'common/utils';

import BaseComponent from 'commonEnhancers/BaseComponent';

const enhance = (ComposedComponent, margin = 0) => {
  class EnhanceWithStretchComponentToBottomWithMargin extends BaseComponent {
    state = {
      componentHeight: 0,
    };

    componentRef = null;

    render() {
      return (
        <ComposedComponent
          {...this.props}
          height={this.state.componentHeight}
          setComponentRef={this.setComponentRef}
          resizeComponent={this.resizeComponent}
        />
      );
    }

    setComponentRef(ref) {
      this.componentRef = ref;
    }

    setComponentHeight() {
      if (this.componentRef) {
        this.setState({
          componentHeight: stretchElementToBottomWithMargin(this.componentRef, margin),
        });
      }
    }

    resizeComponent() {
      this.setComponentHeight();
    }

    componentDidMount() {
      window.addEventListener('resize', this.resizeComponent);
      this.resizeTimeout = setTimeout(() => this.resizeComponent(), 0);
    }

    componentWillUnmount() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      window.removeEventListener('resize', this.resizeComponent);
    }
  }

  return EnhanceWithStretchComponentToBottomWithMargin;
};

export default enhance;
