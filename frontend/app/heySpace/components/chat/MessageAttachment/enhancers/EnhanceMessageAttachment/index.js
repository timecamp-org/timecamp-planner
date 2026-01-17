import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as FilesModelSelectors from "models/domain/FilesModel/selectors";
import * as FilesModelActions from "models/domain/FilesModel/actions";
import { ImageGalleryType } from "models/domain/FilesModel/types";
import { EntityType } from "models/domain/EntityModel/types";

function Enhance(ComposedComponent) {
  class EnhanceMessageAttachment extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      id: PropTypes.string.isRequired,
      // this enhancer
      fileContentType: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          id={this.props.id}
          fileContentType={this.props.fileContentType}
          fileUrl={this.props.fileUrl}
          onOpenImageGallery={this.props.onOpenImageGallery}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      fileContentType: FilesModelSelectors.selectFileContentType(state, {
        fileId: props.id,
      }),
      fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.id }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    const imageGalleryType =
      props.entityType === EntityType.TASK_DATA
        ? ImageGalleryType.TASK_MESSAGE_ATTACHMENT
        : ImageGalleryType.PROJECT_MESSAGE_ATTACHMENT;
    return {
      onOpenImageGallery: () =>
        dispatch(
          FilesModelActions.onOpenImageGallery(
            props.objectId,
            props.id,
            imageGalleryType
          )
        ),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMessageAttachment);
}

export default Enhance;
