import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { onCopySpace } from "models/domain/ProjectsModel/actions";
import { selectProjectName } from "models/domain/ProjectsModel/selectors";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceCopySpacePopoverContent extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,

      onCopySpace: PropTypes.func,
      onCopySpaceCancelled: PropTypes.func,
      onSetRef: PropTypes.func,
    };

    static defaultProps = {
      onCopiedSpace: doNothing,
      onCopySpaceCancelled: doNothing,
      onSetRef: doNothing,
    };

    state = {
      name: this.props.name,
    };

    render() {
      return (
        <ComposedComponent
          name={this.state.name}
          color={this.props.color}
          isCopyingSpaceDisabled={this.isCopyingSpaceDisabled()}
          onCancel={this.props.onCopySpaceCancelled}
          onChangeName={this.onChangeName}
          onCopySpace={this.onCopySpace}
          onSetRef={this.props.onSetRef}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    isCopyingSpaceDisabled() {
      return this.state.name.length === 0;
    }

    onChangeName(event) {
      this.setState({
        name: event.target.value,
      });
    }

    onCopySpace() {
      if (this.isCopyingSpaceDisabled()) {
        return;
      }

      this.props.onCopySpace(this.state.name);
      this.props.onCopiedSpace();
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onCopySpace();
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    name: selectProjectName(state, { projectId: props.projectId }),
    color: selectProjectColor(state, { projectId: props.projectId }),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onCopySpace: (name) => dispatch(onCopySpace(props.projectId, name)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCopySpacePopoverContent);
}

export default enhance;
