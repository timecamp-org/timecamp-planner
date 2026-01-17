import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactDOM from "react-dom";

import BaseComponent from "commonEnhancers/BaseComponent";

import { onCloseImageGallery } from "models/domain/FilesModel/actions";
import { selectImageGalleryStartImageId } from "models/domain/FilesModel/selectors";
import {
  onFetchContainerFilesIfDidNotFetchAlready,
  onFetchContainerFiles,
} from "models/domain/RequestModel/actions";
import { selectRequestIsLoading } from "models/domain/RequestModel/selectors";
import { fetchContainerFiles } from "models/domain/RequestModel/constants/requestTypes";

const imageGaleryRoot = document.getElementById("image-gallery-root");

function Enhance(ComposedComponent) {
  class EnhanceImageGallery extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.el = document.createElement("div");
    }

    state = {
      currentImageId: this.props.startImageId,
    };

    render() {
      return ReactDOM.createPortal(
        <ComposedComponent
          objectId={this.props.objectId}
          fileIds={this.props.fileIds}
          onClickBackdrop={this.props.onCloseImageGallery}
          onKeyDown={this.onKeyDown}
          onSetContainerRef={this.onSetContainerRef}
          onClickImage={this.onClickImage}
          isLoading={this.props.isLoading}
          currentIndex={this.getCurrentIndex()}
          onSlideLeft={this.onSlideLeft}
          onSlideRight={this.onSlideRight}
          onSetImageGalleryRef={this.onSetImageGalleryRef}
          currentImageId={this.state.currentImageId}
        />,
        this.el
      );
    }

    containerRef = null;

    onSetContainerRef(containerRef) {
      this.containerRef = containerRef;
      if (containerRef) {
        this.containerRef.focus();
      }
    }

    getCurrentIndex() {
      return this.props.fileIds.indexOf(this.state.currentImageId);
    }

    onClickImage() {
      if (this.containerRef) {
        this.containerRef.focus();
      }
    }

    onKeyDown(event) {
      if (event.key === "Escape") {
        this.props.onCloseImageGallery();
      }

      if (event.key === "ArrowLeft") {
        this.onSlideLeft();
      }

      if (event.key === "ArrowRight") {
        this.onSlideRight();
      }
    }

    onSlideLeft() {
      const currentIndex = this.getCurrentIndex();
      if (currentIndex !== 0) {
        this.setState({
          currentImageId: this.props.fileIds.get(currentIndex - 1),
        });
      }
    }

    onSlideRight() {
      const currentIndex = this.getCurrentIndex();
      if (this.props.fileIds.size - 1 !== currentIndex) {
        this.setState({
          currentImageId: this.props.fileIds.get(currentIndex + 1),
        });
      }
    }

    componentDidMount() {
      if (imageGaleryRoot) {
        imageGaleryRoot.appendChild(this.el);
      }

      if (this.containerRef) {
        this.containerRef.focus();
      }

      this.props.onFetchContainerFilesIfDidNotFetchAlready();
    }

    componentWillUnmount() {
      if (imageGaleryRoot) {
        setImmediate(() => {
          imageGaleryRoot.removeChild(this.el);
        });
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      startImageId: selectImageGalleryStartImageId(state),
      isLoading: selectRequestIsLoading(state, {
        requestType: fetchContainerFiles,
        objectId: props.objectId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onCloseImageGallery: () => dispatch(onCloseImageGallery()),
      onFetchContainerFilesIfDidNotFetchAlready: () =>
        dispatch(onFetchContainerFilesIfDidNotFetchAlready(props.objectId)),
      onFetchContainerFiles: () =>
        dispatch(onFetchContainerFiles(props.objectId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceImageGallery);
}

export default Enhance;
