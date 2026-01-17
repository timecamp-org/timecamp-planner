import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectFileUploadProgress } from "models/domain/FilesModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceFileUploadLoaderBar extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      fileName: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          progress={this.props.progress}
          fileName={this.props.fileName}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    progress: selectFileUploadProgress(state, { fileId: props.id }),
  });

  return connect(mapStateToProps)(EnhanceFileUploadLoaderBar);
}

export default Enhance;
