import React from "react";
import PropTypes from "prop-types";

import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

function Enhance(ComposedComponent) {
  class EnhanceProgressiveImage extends BaseComponent {
    static propTypes = {
      onClick: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        isImageLoaded: false,
        isTinyImageLoaded: false,
        prevImageUrl: props.imageUrl,
        prevTinyImageUrl: props.tinyImageUrl,
      };
    }

    render() {
      return (
        <ComposedComponent
          imageUrl={this.props.imageUrl}
          tinyImageUrl={this.props.tinyImageUrl}
          isImageLoaded={this.state.isImageLoaded}
          isTinyImageLoaded={this.state.isTinyImageLoaded}
          containerStyle={this.props.containerStyle}
          imageStyle={this.props.imageStyle}
          onClick={this.props.onClick}
          onLoadImage={this.onLoadImage}
          onLoadTinyImage={this.onLoadTinyImage}
        />
      );
    }

    onLoadImage() {
      this.setState({ isImageLoaded: true });
    }

    onLoadTinyImage() {
      this.setState({ isTinyImageLoaded: true });
    }

    static getDerivedStateFromProps(props, state) {
      const newState = {};

      if (state.prevImageUrl !== props.imageUrl) {
        newState.isImageLoaded = false;
        newState.prevImageUrl = props.imageUrl;
      }

      if (state.prevTinyImageUrl !== props.tinyImageUrl) {
        newState.isTinyImageLoaded = false;
        newState.prevTinyImageUrl = props.tinyImageUrl;
      }

      return newState;
    }
  }

  return EnhanceProgressiveImage;
}

export default Enhance;
