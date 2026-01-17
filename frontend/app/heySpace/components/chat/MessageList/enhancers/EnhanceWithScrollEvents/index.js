import React from "react";
import PropTypes from "prop-types";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

function Enhance(ComposedComponent) {
  class EnhanceWithScrollEvents extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onScrolledTop: PropTypes.func.isRequired,
      onScrolledBottom: PropTypes.func.isRequired,
      onScroll: PropTypes.func.isRequired,
      isScrolledToBottom: PropTypes.func.isRequired,
      isScrolledToTop: PropTypes.func.isRequired,
    };

    static defaultProps = {
      onScrolledTop: doNothing,
      onScrolledBottom: doNothing,
      onScroll: doNothing,
      isScrolledToBottom: doNothing,
      isScrolledToTop: doNothing,
    };

    render() {
      return <ComposedComponent {...this.props} onScroll={this.onScroll} />;
    }

    onScroll() {
      if (this.props.isScrolledToTop()) {
        this.props.onScrolledTop();
      } else if (this.props.isScrolledToBottom()) {
        this.props.onScrolledBottom();
      }

      this.props.onScroll();
    }
  }

  return EnhanceWithScrollEvents;
}

export default Enhance;
