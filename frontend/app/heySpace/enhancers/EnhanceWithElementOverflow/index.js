import React from "react";

import BaseComponent from "commonEnhancers/BaseComponent";

const enhance =
  ({ triggerPropName }) =>
  (ComposedComponent) => {
    class EnhanceWithElementOverflow extends BaseComponent {
      state = {
        isOverflow: false,
      };

      render() {
        return (
          <ComposedComponent
            {...this.props}
            isOverflow={this.state.isOverflow}
            onSetRef={this.onSetRef}
          />
        );
      }

      onSetRef(ref) {
        this.element = ref;
      }

      isTextOverflow() {
        if (!this.element) {
          console.error(new Error("Overflow ref not set"));
          return false;
        }
        return this.element.clientWidth < this.element.scrollWidth;
      }

      checkOverflow() {
        const isOverflow = this.isTextOverflow();
        if (isOverflow !== this.state.isOverflow) {
          this.setState({ isOverflow });
        }
      }

      componentDidMount() {
        this.checkOverflow();
      }

      componentDidUpdate(prevProps, prevState) {
        if (!triggerPropName) {
          return;
        }
        if (prevProps[triggerPropName] !== this.props[triggerPropName]) {
          this.checkOverflow();
        }
      }
    }

    return EnhanceWithElementOverflow;
  };

export default enhance;
