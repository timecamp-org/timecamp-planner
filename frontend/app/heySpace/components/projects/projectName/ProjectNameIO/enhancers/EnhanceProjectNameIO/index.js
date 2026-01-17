import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectProjectIsGroupOrDirectChat } from 'models/domain/ProjectsModel/selectors';

export default function enhance(Component) {
  class EnhanceProjectNameIO extends BaseComponent {

    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      projectId: PropTypes.string,
      label: PropTypes.string,
      maxLength: PropTypes.number,

      onClick: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onKeyDown: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
      onFocus: doNothing,
      onBlur: doNothing,
      onKeyDown: doNothing,
    };

    state = {
      showProjectNameInput: false,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          innerClassName={this.props.innerClassName}
          projectId={this.props.projectId}
          projectName={this.props.projectName}
          disabled={this.props.disabled}
          required={this.props.required}
          showProjectNameInput={this.state.showProjectNameInput}
          label={this.props.label}
          maxLength={this.props.maxLength}
          isConversation={this.props.isConversation}
          onClick={this.onClick}
          onFocus={this.props.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onNameUpdate={this.props.onNameUpdate}
        />
      );
    }

    onClick(event) {
      this.props.onClick(event);
      this.setState({
        showProjectNameInput: true,
      });
    }

    onBlur(event) {
      this.props.onBlur(event);
      this.setState({
        showProjectNameInput: false,
      });
    }

    onKeyDown(event) {
      this.props.onKeyDown(event);
      if (event.key === 'Enter') {
        this.setState({
          showProjectNameInput: false,
        });
      }
    }
  
}

  const mapStateToProps = (state, props) => ({
    isConversation: selectProjectIsGroupOrDirectChat(state, {
      projectId: props.projectId,
    }),
  });

  return connect(mapStateToProps)(EnhanceProjectNameIO);
}
