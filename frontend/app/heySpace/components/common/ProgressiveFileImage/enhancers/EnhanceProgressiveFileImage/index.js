import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import * as FilesModelSelectors from "models/domain/FilesModel/selectors";
import { getThumbnailUrl } from "models/domain/FilesModel/helpers";
import { ImageSize } from "models/domain/FilesModel/types";
import { doNothing } from "common/utils";
import {
  isGif,
  getThumbnailDimensions,
  isPhotoSmallerThanSize,
  isPhotoDimesionsNotNull,
} from "models/domain/FilesModel/helpers";

function Enhance(ComposedComponent) {
  class EnhanceProgressiveFileImage extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      id: PropTypes.string.isRequired,
      maxSize: PropTypes.number,
      onClick: PropTypes.func,
      allowOriginalDimensions: PropTypes.bool,
    };

    static defaultProps = {
      maxSize: ImageSize.MEDIUM,
      onClick: doNothing,
      allowOriginalDimensions: false,
    };

    render() {
      return (
        <ComposedComponent
          shouldOpenInNewTabOnClick={this.props.shouldOpenInNewTabOnClick}
          fileUrl={this.props.fileUrl}
          thumbnailUrl={this.getThumbnailUrl()}
          tinyThumbnailUrl={this.getTinyThumbnailUrl()}
          dimensionsAfterResize={getThumbnailDimensions(
            this.props.fileWidth,
            this.props.fileHeight,
            this.props.maxSize,
            this.props.allowOriginalDimensions
          )}
          onClick={this.onClick}
        />
      );
    }

    onClick(event) {
      if (event.ctrlKey) {
        window.open(this.props.fileUrl, "_blank");
      } else {
        this.props.onClick();
      }
    }

    getTinyThumbnailUrl() {
      return getThumbnailUrl(this.props.fileUrl, ImageSize.TINY);
    }

    getThumbnailUrl() {
      if (
        this.props.useOriginalUrl ||
        (isGif(this.props.fileContentType) &&
          !this.props.shouldRenderGifAsPicture)
      ) {
        return this.props.fileUrl;
      } else if (
        isPhotoSmallerThanSize(
          { height: this.props.fileHeight, width: this.props.fileWidth },
          ImageSize.MEDIUM
        ) &&
        isPhotoDimesionsNotNull({
          height: this.props.fileHeight,
          width: this.props.fileWidth,
        })
      ) {
        return this.props.fileUrl;
      }

      return getThumbnailUrl(this.props.fileUrl, this.props.maxSize);
    }
  }

  const mapStateToProps = (state, props) => ({
    fileContentType: FilesModelSelectors.selectFileContentType(state, {
      fileId: props.id,
    }),
    fileHeight: FilesModelSelectors.selectFileHeight(state, {
      fileId: props.id,
    }),
    fileWidth: FilesModelSelectors.selectFileWidth(state, { fileId: props.id }),
    fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.id }),
  });

  return connect(mapStateToProps)(EnhanceProgressiveFileImage);
}

export default Enhance;
