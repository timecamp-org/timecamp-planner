import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import * as ProjectsModelActions from "models/domain/ProjectsModel/actions";

export default function enhance(Component) {
  class EnhanceProjectColorEditor extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      projectId: PropTypes.string.isRequired,
      projectColor: PropTypes.string,
      isDisabled: PropTypes.bool,
      currentUserRole: PropTypes.string,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          projectId={this.props.projectId}
          projectColor={this.props.projectColor}
          onColorUpdate={this.onColorUpdate}
          onBlur={this.onBlur}
          isDisabled={this.props.isDisabled}
        />
      );
    }

    onColorUpdate(color) {
      if (!this.props.isDisabled) {
        this.props.onProjectColorUpdate(color);
        this.projectChanged = true;
      }
    }

    onBlur() {
      if (!this.props.isDisabled && this.projectChanged) {
        this.props.onProjectUpdate({ color: this.props.projectColor });
        this.projectChanged = false;
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      projectColor: selectProjectColor(state, { projectId: props.projectId }),
    };
  };

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onProjectColorUpdate: (code) =>
        dispatch(ProjectsModelActions.onColorUpdate(ownProps.projectId, code)),
      onProjectUpdate: (fields = {}) =>
        dispatch(
          ProjectsModelActions.onProjectUpdate(ownProps.projectId, fields, true)
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceProjectColorEditor);
}
