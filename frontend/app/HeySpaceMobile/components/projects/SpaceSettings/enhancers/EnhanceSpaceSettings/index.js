import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  selectProjectName,
  selectProjectDescription,
  selectProjectColor,
  selectProjectIsPrivate,
} from 'models/domain/ProjectsModel/selectors';

import { selectIsProjectEditable } from 'models/domain/ProjectsModel/selectors/permission';

import { onProjectUpdate } from 'models/domain/ProjectsModel/actions';

import { withMappedNavigationParams } from 'react-navigation-props-mapper';
import BaseComponent from 'BaseComponent';

function enhance(ComposedComponent) {
  class EnhanceSpaceSettings extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      spaceName: PropTypes.string.isRequired,
      spacePurpose: PropTypes.string.isRequired,
      spaceColor: PropTypes.string.isRequired,
      isPrivate: PropTypes.bool.isRequired,

      onUpdateSpace: PropTypes.func.isRequired,
    };

    state = {
      spaceName: this.props.spaceName,
      isSpaceNameValid: this.props.spaceName.length > 0,
      spaceNameInputValidationMessage: null,

      spacePurpose: this.props.spacePurpose,
      spaceColor: this.props.spaceColor,
      isPrivate: this.props.isPrivate,
    };

    render() {
      return (
        <ComposedComponent
          spaceName={this.state.spaceName}
          isSpaceNameValid={this.state.isSpaceNameValid}
          spaceNameInputValidationMessage={this.state.spaceNameInputValidationMessage}
          spaceColor={this.state.spaceColor}
          spacePurpose={this.state.spacePurpose}
          isPrivate={this.state.isPrivate}
          isProjectEditable={this.props.isProjectEditable}
          onSetIsPrivate={this.onSetIsPrivate}
          onUpdateSpaceColor={this.onUpdateSpaceColor}
          onSpacePurposeInputBlur={this.onSpacePurposeInputBlur}
          onChangeSpacePurposeInput={this.onChangeSpacePurposeInput}
          onSpaceNameInputBlur={this.onSpaceNameInputBlur}
          onChangeSpaceNameInput={this.onChangeSpaceNameInput}
        />
      );
    }

    onChangeSpaceNameInput(spaceName) {
      this.setState({
        spaceName,
      });
    }

    onSpaceNameInputBlur() {
      const { isValid, message } = this.validateSpaceNameInput();
      this.setState({
        isSpaceNameValid: isValid,
        spaceNameInputValidationMessage: message,
      });

      if (isValid) {
        const { spaceName } = this.state;
        this.props.onUpdateSpace({
          name: spaceName,
        });
      } else {
        // ok
      }
    }

    validateSpaceNameInput() {
      const { spaceName } = this.state;
      if (spaceName.length < 1) {
        return {
          isValid: false,
          message: "Don' forget about project name",
        };
      } else {
        return {
          isValid: true,
          message: null,
        };
      }
    }

    onChangeSpacePurposeInput(spacePurpose) {
      this.setState({
        spacePurpose,
      });
    }

    onSpacePurposeInputBlur() {
      const { spacePurpose } = this.state;
      this.props.onUpdateSpace({
        description: spacePurpose,
      });
    }

    onUpdateSpaceColor(color) {
      this.setState({
        spaceColor: color,
      });

      this.props.onUpdateSpace({
        color,
      });
    }

    onSetIsPrivate(isPrivate) {
      if (!this.props.isProjectEditable) {
        return;
      }
      this.setState({
        isPrivate,
      });

      this.props.onUpdateSpace({
        isPrivate,
      });
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      spaceName: selectProjectName(state, { projectId: props.projectId }),
      spacePurpose: selectProjectDescription(state, { projectId: props.projectId }),
      spaceColor: selectProjectColor(state, { projectId: props.projectId }),
      isPrivate: selectProjectIsPrivate(state, { projectId: props.projectId }),
      isProjectEditable: selectIsProjectEditable(state, { projectId: props.projectId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onUpdateSpace: (fields) => dispatch(onProjectUpdate(props.projectId, fields)),
  });

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceSpaceSettings));
}

export default enhance;
