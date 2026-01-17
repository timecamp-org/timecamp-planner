import React from "react";
import { connect } from "react-redux";

import { selectAddUsersToProjectModalUserIds } from "models/component/AddUsersToProjectModalModel/selectors";
import { onAddUsersToProject } from "models/domain/ProjectsModel/actions";
import { onCloseAddUsersToProjectModal } from "models/component/AddUsersToProjectModalModel/actions";
import BaseComponent from "commonEnhancers/BaseComponent";

export default function enhance(Component) {
  class EnhanceAddUsersToProjectModal extends BaseComponent {
    render() {
      return (
        <Component
          userIds={this.props.userIds}
          projectId={this.props.projectId}
          color={this.props.color}
          onCloseModal={this.props.onCloseModal}
          onAddUsers={this.onAddUsers}
        />
      );
    }

    onAddUsers() {
      this.props.onAddUsersToProject(this.props.projectId, this.props.userIds);
    }
  }

  const mapStateToProps = (state) => ({
    userIds: selectAddUsersToProjectModalUserIds(state),
  });

  function mapDispatchToProps(dispatch) {
    return {
      onCloseModal: () => dispatch(onCloseAddUsersToProjectModal()),
      onAddUsersToProject: (projectId, userIds) =>
        dispatch(onAddUsersToProject(projectId, userIds)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceAddUsersToProjectModal);
}
