import React from "react";
import PropTypes from "prop-types";

import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

function Enhance(ComposedComponent) {
  class EnhanceProgressiveImage extends BaseComponent {
    static propTypes = {
      onClick: PropTypes.func,
      // Shown when imageUrl cannot be loaded, for example a missing thumbnail.
      fallbackImageUrl: PropTypes.string,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        isImageLoaded: false,
        isTinyImageLoaded: false,
        hasImageFailed: false,
        hasTinyImageFailed: false,
        prevImageUrl: props.imageUrl,
        prevTinyImageUrl: props.tinyImageUrl,
      };
    }

    render() {
      return (
        <ComposedComponent
          imageUrl={this.getImageUrl()}
          tinyImageUrl={this.state.hasTinyImageFailed ? undefined : this.props.tinyImageUrl}
          isImageLoaded={this.state.isImageLoaded}
          isTinyImageLoaded={this.state.isTinyImageLoaded}
          containerStyle={this.props.containerStyle}
          imageStyle={this.props.imageStyle}
          onClick={this.props.onClick}
          onLoadImage={this.onLoadImage}
          onLoadTinyImage={this.onLoadTinyImage}
          onErrorImage={this.onErrorImage}
          onErrorTinyImage={this.onErrorTinyImage}
        />
      );
    }

    getImageUrl() {
      if (this.state.hasImageFailed && this.props.fallbackImageUrl) {
        return this.props.fallbackImageUrl;
      }
      return this.props.imageUrl;
    }

    onErrorImage() {
      if (!this.state.hasImageFailed) {
        this.setState({ hasImageFailed: true });
      }
    }

    onErrorTinyImage() {
      this.setState({ hasTinyImageFailed: true });
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
        newState.hasImageFailed = false;
        newState.prevImageUrl = props.imageUrl;
      }

      if (state.prevTinyImageUrl !== props.tinyImageUrl) {
        newState.isTinyImageLoaded = false;
        newState.hasTinyImageFailed = false;
        newState.prevTinyImageUrl = props.tinyImageUrl;
      }

      return newState;
    }
  }

  return EnhanceProgressiveImage;
}

export default Enhance;
