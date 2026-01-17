import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as TasksModelSelectors from "models/domain/TasksModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceTaskMessageAttachmentsGallery extends BaseComponent {
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
      fileIds: TasksModelSelectors.selectTaskFileIds(state, {
        taskId: props.objectId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceTaskMessageAttachmentsGallery);
}

export default Enhance;
