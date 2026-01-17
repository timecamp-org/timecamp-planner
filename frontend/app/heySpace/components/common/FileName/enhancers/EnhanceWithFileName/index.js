import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as FilesModelSelectors from "models/domain/FilesModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceWithFileName extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      fileId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          fileName={this.props.fileName}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    fileName: FilesModelSelectors.selectFileName(state, {
      fileId: props.fileId,
    }),
  });

  return connect(mapStateToProps)(EnhanceWithFileName);
}

export default Enhance;
