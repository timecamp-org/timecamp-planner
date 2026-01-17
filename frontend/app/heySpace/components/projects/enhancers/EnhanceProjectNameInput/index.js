import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import {
  selectProjectName,
  selectCurrentUserRole,
} from 'models/domain/ProjectsModel/selectors';

export default function enhance(Component) {
  class EnhanceProjectNameInput extends BaseComponent {

    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      projectId: PropTypes.string,
      required: PropTypes.bool,
      label: PropTypes.string,
      currentUserRole: PropTypes.string,
      autoFocus: PropTypes.bool,
      maxLength: PropTypes.number,

      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onKeyDown: PropTypes.func,
      onKeyUp: PropTypes.func,
    };

    static defaultProps = {
      onFocus: doNothing,
      onBlur: doNothing,
      onKeyDown: doNothing,
      onKeyUp: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        projectName: props.projectName,
      };
    }

    render() {
      return (
        <Component
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          projectId={this.props.projectId}
          projectName={this.state.projectName}
          required={this.props.required}
          isDisabled={this.props.isDisabled}
          label={this.props.label}
          maxLength={this.props.maxLength}
          autoFocus={this.props.autoFocus}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onNameUpdate={this.onNameUpdate}
        />
      );
    }

    onNameUpdate(event) {
      const text = event.target.value;
      this.setState({ projectName: text });
    }

    onFocus(event) {
      const text = event.target.value;
      if (text !== this.state.projectName) {
        this.setState({ projectName: text });
      }
      this.props.onFocus();
    }

    onBlur() {
      if (this.state.projectName !== this.props.projectName) {
        this.props.onProjectUpdate({ name: this.state.projectName });
        this.props.onBlur();
      }
    }

    onKeyDown(event) {
      if (
        event.key === 'Enter' &&
        this.state.projectName !== this.props.projectName
      ) {
        this.props.onProjectUpdate({ name: this.state.projectName });
      }
      this.props.onKeyDown(event);
    }

    componentWillUnmount() {
      if (this.state.projectName !== this.props.projectName) {
        this.props.onProjectUpdate({ name: this.state.projectName });
      }
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.projectName !== this.props.projectName &&
        this.props.projectName !== this.state.projectName
      ) {
        this.setState({ projectName: this.props.projectName });
      }
    }
  
}

  const mapStateToProps = (state, props) => ({
    projectName: selectProjectName(state, { projectId: props.projectId }),
    currentUserRole: selectCurrentUserRole(state, {
      projectId: props.projectId,
    }),
  });

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onProjectUpdate: (fields = {}) =>
        dispatch(
          ProjectsModelActions.onProjectUpdate(ownProps.projectId, fields, true)
        ),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceProjectNameInput);
}
