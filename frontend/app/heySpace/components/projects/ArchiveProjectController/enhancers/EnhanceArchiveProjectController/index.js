import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as ProjectsModelActions from "models/domain/ProjectsModel/actions";
import { selectProjectStatus } from "models/domain/ProjectsModel/selectors";
import { EntityStatus } from "models/domain/EntityModel/types";
import { FIRST_PROJECT_NAME } from "models/domain/ProjectsModel/constants";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceArchiveProjectController extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      projectId: PropTypes.string.isRequired,
      className: PropTypes.string,
      currentUserRole: PropTypes.string,
      canAllUsersEdit: PropTypes.bool,
      color: PropTypes.string,

      // injects
      projectStatus: PropTypes.string,
      history: PropTypes.object.isRequired,

      onArchive: PropTypes.func.isRequired,
    };

    static defaultProps = {
      canAllUsersEdit: false,
    };

    state = {
      isConfirmationDialogOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          projectId={this.props.projectId}
          projectStatus={this.props.projectStatus}
          isDisabled={this.props.isDisabled}
          isArchived={this.isArchived()}
          isConfirmationDialogOpen={this.state.isConfirmationDialogOpen}
          color={this.props.color}
          onArchive={this.onArchive}
          onUnarchive={this.onUnarchive}
          onCancel={this.onCloseConfirmationDialog}
          onConfirmArchive={this.onConfirmArchive}
        />
      );
    }

    isArchived() {
      return this.props.projectStatus === EntityStatus.ARCHIVED;
    }

    onArchive() {
      if (!this.props.isDisabled) {
        if (!this.state.isConfirmationDialogOpen) {
          this.setState({
            isConfirmationDialogOpen: true,
          });
        }
      }
    }

    onUnarchive() {
      if (!this.props.isDisabled) {
        this.props.onUnarchive();
      }
    }

    onCloseConfirmationDialog() {
      this.setState({
        isConfirmationDialogOpen: false,
      });
    }

    onConfirmArchive() {
      if (!this.props.isDisabled) {
        this.props.history.push(`/projects/${FIRST_PROJECT_NAME}`);
        this.props.onArchive();
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      projectStatus: selectProjectStatus(state, { projectId: props.projectId }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onArchive: () =>
        dispatch(
          ProjectsModelActions.onStatusUpdate(
            props.projectId,
            EntityStatus.ARCHIVED,
            true
          )
        ),
      onUnarchive: () =>
        dispatch(
          ProjectsModelActions.onStatusUpdate(
            props.projectId,
            EntityStatus.EXISTS,
            true
          )
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceArchiveProjectController);
}

export default Enhance;
