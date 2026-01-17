import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';

import UserInput from 'commonComponents/UserInput';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18mark, i18n } from 'i18n';

class UserFullNameInput extends BaseComponent {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    className: PropTypes.string,
    humanMessageClassName: PropTypes.string,
    innerClassName: PropTypes.string,

    fullName: PropTypes.string,
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
    fullName: '',
    placeholder: i18mark('Add name...'),
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
        humanMessageClassName={this.props.humanMessageClassName}
        innerClassName={this.props.innerClassName}
        type="text"
        name="name"
        value={this.props.fullName}
        isDisabled={this.props.disabled}
        required={this.props.required}
        label={this.props.label}
        placeholder={i18n.t(this.props.placeholder)}
        humanMessage={this.props.fullNameHumanMessageModel}
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

export default UserFullNameInput;
