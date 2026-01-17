import React from "react";
import PropTypes from "prop-types";
import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";
import UserInput from "commonComponents/UserInput";
import { i18n, i18mark } from "i18n";

class UserLastNameInput extends BaseComponent {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    className: PropTypes.string,
    innerClassName: PropTypes.string,

    lastName: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    label: PropTypes.string,
    autoFocus: PropTypes.bool,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    lastName: "",
    placeholder: i18mark("Add last name..."),
    disabled: false,
    required: true,
    autoFocus: false,

    onFocus: doNothing,
    onBlur: doNothing,
    onKeyDown: doNothing,
    onKeyUp: doNothing,
    onUpdate: doNothing,
  };

  render() {
    return (
      <UserInput
        className={this.props.className}
        innerClassName={this.props.innerClassName}
        type="text"
        value={this.props.lastName}
        isDisabled={this.props.disabled}
        required={this.props.required}
        label={this.props.label}
        placeholder={i18n.t(this.props.placeholder)}
        autoFocus={this.props.autoFocus}
        onChange={this.props.onUpdate}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      />
    );
  }
}

export default UserLastNameInput;
