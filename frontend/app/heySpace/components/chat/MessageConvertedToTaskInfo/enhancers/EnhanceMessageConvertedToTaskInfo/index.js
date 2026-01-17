import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as AppModelActions from "models/domain/AppModel/actions";
import { selectProjectIdByTaskId } from "../../../../../../common/models/domain/TasksModel/selectors";
import { selectHasAccessToProject } from "../../../../../../common/models/domain/ProjectsModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceMessageConvertedToTaskInfo extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      hasAccessToProject: PropTypes.bool.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          hasAccessToProject={this.props.hasAccessToProject}
          onClick={this.onOpenCardDetailsModalIfHasAccess}
        />
      );
    }

    onOpenCardDetailsModalIfHasAccess() {
      if (this.props.hasAccessToProject) {
        this.props.onOpenCardDetailsModal();
      }
    }
  }

  function mapStateToProps(state, props) {
    const projectId = selectProjectIdByTaskId(state, { taskId: props.taskId });
    const hasAccessToProject = selectHasAccessToProject(state, { projectId });

    return {
      hasAccessToProject,
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onOpenCardDetailsModal: () =>
        dispatch(AppModelActions.onSetOpenedCardDetailsModalId(props.taskId)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceMessageConvertedToTaskInfo);
}

export default Enhance;
