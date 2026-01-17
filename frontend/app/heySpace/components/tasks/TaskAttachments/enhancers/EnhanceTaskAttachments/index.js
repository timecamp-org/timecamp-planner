import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ImmutablePropTypes from "react-immutable-proptypes";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as TasksSelectors from "models/domain/TasksModel/selectors";
import * as TasksActions from "models/domain/TasksModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceTaskAttachments extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,
      color: PropTypes.string,

      // injects
      taskAttachmentsIds: ImmutablePropTypes.list,
    };

    render() {
      return (
        <ComposedComponent
          taskAttachmentsIds={this.props.taskAttachmentsIds}
          color={this.props.color}
          onDeleteFile={this.props.onDeleteTaskAttachment}
          taskId={this.props.taskId}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      taskAttachmentsIds: TasksSelectors.selectSortedTaskAttachmentsIds(state, {
        taskId: props.taskId,
      }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onDeleteTaskAttachment: (fileId) =>
        dispatch(TasksActions.onDeleteTaskAttachment(fileId, props.taskId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskAttachments);
}

export default Enhance;
