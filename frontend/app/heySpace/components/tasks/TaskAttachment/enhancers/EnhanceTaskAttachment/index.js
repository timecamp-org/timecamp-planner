import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as FilesModelActions from "models/domain/FilesModel/actions";
import * as FilesModelSelectors from "models/domain/FilesModel/selectors";
import { ImageGalleryType } from "models/domain/FilesModel/types";

function Enhance(ComposedComponent) {
  class EnhanceTaskAttachment extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      id: PropTypes.string.isRequired,
      isModalOpen: PropTypes.bool,
      color: PropTypes.string,
      fileUrl: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      fileTimestamp: PropTypes.number.isRequired,
      fileUserId: PropTypes.string.isRequired,
      fileContentType: PropTypes.string.isRequired,

      onDeleteFile: PropTypes.func.isRequired,
      onOpenImageGallery: PropTypes.func.isRequired,
    };

    state = {
      isModalOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          id={this.props.id}
          fileUrl={this.props.fileUrl}
          fileContentType={this.props.fileContentType}
          fileName={this.props.fileName}
          fileUserId={this.props.fileUserId}
          fileTimestamp={this.props.fileTimestamp}
          isModalOpen={this.state.isModalOpen}
          color={this.props.color}
          onSetIsModalOpen={this.onSetIsModalOpen}
          onDeleteFile={this.props.onDeleteFile}
          onOpenImageGallery={this.props.onOpenImageGallery}
        />
      );
    }

    onSetIsModalOpen(isModalOpen) {
      this.setState({
        isModalOpen,
      });
    }
  }

  const mapStateToProps = (state, props) => ({
    fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.id }),
    fileName: FilesModelSelectors.selectFileName(state, { fileId: props.id }),
    fileContentType: FilesModelSelectors.selectFileContentType(state, {
      fileId: props.id,
    }),
    fileTimestamp: FilesModelSelectors.selectFileTimestamp(state, {
      fileId: props.id,
    }),
    fileUserId: FilesModelSelectors.selectFileUserId(state, {
      fileId: props.id,
    }),
  });

  function mapDispatchToProps(dispatch, props) {
    return {
      onOpenImageGallery: () =>
        dispatch(
          FilesModelActions.onOpenImageGallery(
            props.taskId,
            props.id,
            ImageGalleryType.TASK_ATTACHMENT
          )
        ),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskAttachment);
}

export default Enhance;
