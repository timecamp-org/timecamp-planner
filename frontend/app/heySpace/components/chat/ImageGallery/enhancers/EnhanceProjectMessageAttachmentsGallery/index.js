import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectProjectFileIds } from "models/domain/ProjectsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceProjectMessageAttachmentsGallery extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          fileIds={this.props.fileIds}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      fileIds: selectProjectFileIds(state, { projectId: props.objectId }),
    };
  };

  return connect(mapStateToProps)(EnhanceProjectMessageAttachmentsGallery);
}

export default Enhance;
