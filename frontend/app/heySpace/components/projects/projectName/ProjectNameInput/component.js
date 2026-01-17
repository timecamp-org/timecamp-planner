import React from "react";
import PropTypes from "prop-types";
import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";
import UserInput from "commonComponents/UserInput";
import { i18n, i18mark } from "i18n";

class ProjectNameInput extends BaseComponent {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    className: PropTypes.string,
    innerClassName: PropTypes.string,

    projectName: PropTypes.string,
    placeholder: PropTypes.string,
    isDisabled: PropTypes.bool,
    required: PropTypes.bool,
    label: PropTypes.string,
    autoFocus: PropTypes.bool,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onNameUpdate: PropTypes.func,
  };

  static defaultProps = {
    projectName: "",
    placeholder: i18mark("Add name..."),
    isDisabled: false,
    required: true,
    autoFocus: false,

    onFocus: doNothing,
    onBlur: doNothing,
    onKeyDown: doNothing,
    onKeyUp: doNothing,
    onNameUpdate: doNothing,
  };

  render() {
    return (
      <UserInput
        className={this.props.className}
        innerClassName={this.props.innerClassName}
        type="text"
        value={this.props.projectName}
        isDisabled={this.props.isDisabled}
        required={this.props.required}
        label={this.props.label}
        placeholder={i18n.t(this.props.placeholder)}
        autoFocus={this.props.autoFocus}
        onChange={this.props.onNameUpdate}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      />
    );
  }
}

export default ProjectNameInput;
