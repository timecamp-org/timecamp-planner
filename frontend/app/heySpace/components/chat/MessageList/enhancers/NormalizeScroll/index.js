import React from "react";
import PropTypes from "prop-types";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

function Enhance(ComposedComponent) {
  class NormalizeScroll extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onSetListRef: PropTypes.func.isRequired,
      onScroll: PropTypes.func.isRequired,
    };

    static defaultProps = {
      onSetListRef: doNothing,
      onScroll: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onScroll={this.onScroll}
          onSetListRef={this.onSetListRef}
        />
      );
    }

    listRef = null;
    lastScrollHeight = null;

    onSetListRef(ref) {
      this.listRef = ref;
      this.props.onSetListRef(ref);
    }

    onScroll(event) {
      if (
        this.lastScrollHeight &&
        this.listRef.scrollHeight !== this.lastScrollHeight
      ) {
        this.lastScrollHeight = this.listRef.scrollHeight;
        return;
      }

      this.lastScrollHeight = this.listRef.scrollHeight;
      this.props.onScroll(event);
    }
  }

  return NormalizeScroll;
}

export default Enhance;
