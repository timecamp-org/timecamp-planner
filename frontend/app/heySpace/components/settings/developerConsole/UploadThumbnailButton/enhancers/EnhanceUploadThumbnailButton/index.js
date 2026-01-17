import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import handleError from "common/utils/handleError";

import { onUploadClientThumbnail } from "models/domain/UserAppsModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceUploadThumbnailButton extends BaseComponent {
    static propTypes = {
      appId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          onOpenFilePrompt={this.props.onOpenFilePrompt}
          onSetOpenCallback={this.props.onSetOpenCallback}
          onChooseFile={this.onChooseFile}
        />
      );
    }

    onChooseFile(files) {
      if (files && files.length > 0) {
        this.props.onUploadClientThumbnail(files[0]);
      } else {
        handleError(new Error("Error selecting file"));
      }
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUploadClientThumbnail: (file) =>
        dispatch(onUploadClientThumbnail(props.appId, file)),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceUploadThumbnailButton);
}

export default Enhance;
