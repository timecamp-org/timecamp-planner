import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'BaseComponent';
import { onProjectCreate } from 'models/domain/ProjectsModel/actions';
import ProjectColors from 'common/commonStyles/projectColors';
import generateId from 'common/utils/generate-pushid';
import { NavigationService } from 'common/services';
import RouteName from '../../../../AppNavigation/routeNames';

function enhance(ComposedComponent) {
  class EnhanceCreateSpaceModal extends BaseComponent {
    static propTypes = {
      isVisible: PropTypes.bool.isRequired,
      onClose: PropTypes.func.isRequired,
      onCreateSpace: PropTypes.func.isRequired,
    };

    state = {
      selectedColor: ProjectColors.getRandomProjectColor(),
      isPrivate: false,
    };

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}
          onClose={this.props.onClose}
          selectedColor={this.state.selectedColor}
          isPrivate={this.state.isPrivate}
          onChangeSelectedColor={this.onChangeSelectedColor}
          onSetSpaceNameInputOuterRef={this.onSetSpaceNameInputOuterRef}
          onSetSpaceNameInputInnerRef={this.onSetSpaceNameInputInnerRef}
          onSetIsPrivate={this.onSetIsPrivate}
          onCreateSpace={this.onCreateSpace}
          validateSpaceName={this.validateSpaceName}
        />
      );
    }

    focusSpaceNameInput() {
      if (this.spaceNameInputInnerRef) {
        this.spaceNameInputInnerRef.focus();
      }
    }

    validateSpaceName(spaceName) {
      if (spaceName && spaceName.length > 0) {
        return {
          isValid: true,
          message: null,
        };
      } else {
        return {
          isValid: false,
          message: 'Specify project name',
        };
      }
    }

    onSetIsPrivate(isPrivate) {
      this.setState({
        isPrivate,
      });
    }

    onSetSpaceNameInputOuterRef(ref) {
      this.spaceNameInputOuterRef = ref;
    }

    onSetSpaceNameInputInnerRef(ref) {
      this.spaceNameInputInnerRef = ref;
    }

    onChangeSelectedColor(selectedColor) {
      this.setState({
        selectedColor,
      });
    }

    getSpaceNameInputValue() {
      if (this.spaceNameInputOuterRef) {
        return this.spaceNameInputOuterRef.getValue();
      } else {
        return '';
      }
    }

    onCreateSpace() {
      const name = this.getSpaceNameInputValue();

      if (name) {
        const id = generateId();
        const { isPrivate, selectedColor: color } = this.state;

        this.props.onCreateSpace({
          id,
          name,
          color,
          isPrivate,
        });

        this.props.onClose();
        NavigationService.navigate(RouteName.PROJECT, { projectId: id });
      } else {
        this.focusSpaceNameInput();
      }
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.isVisible && this.props.isVisible) {
        this.setState({
          selectedColor: ProjectColors.getRandomProjectColor(),
          isPrivate: false,
        });
      }
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onCreateSpace: (projectFields) => dispatch(onProjectCreate(projectFields)),
  });

  return connect(null, mapDispatchToProps)(EnhanceCreateSpaceModal);
}

export default enhance;
