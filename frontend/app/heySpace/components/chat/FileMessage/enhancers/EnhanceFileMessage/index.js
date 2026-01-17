import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import * as FilesModelSelectors from "models/domain/FilesModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceFileMessage extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      id: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          fileUrl={this.props.fileUrl}
          fileName={this.props.fileName}
          fileContentType={this.props.fileContentType}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.id }),
    fileName: FilesModelSelectors.selectFileName(state, { fileId: props.id }),
  });

  return connect(mapStateToProps)(EnhanceFileMessage);
}

export default Enhance;
