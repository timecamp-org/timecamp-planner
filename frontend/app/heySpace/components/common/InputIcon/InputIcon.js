import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import HumanMessage from 'commonComponents/HumanMessage';
import { Search } from 'commonComponents/Icons/fontawesome/Search';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18n } from 'i18n';
import { HumanMessage as HumanMessageModel } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

import styles from './styles.css';

class UserInputIcon extends BaseComponent {
  static propTypes = {
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    innerClassName: PropTypes.string,
    childrenClassName: PropTypes.string,

    label: PropTypes.string,
    helperMessage: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    isDisabled: PropTypes.bool,
    shouldFocusOnMount: PropTypes.bool,
    shouldRenderRequiredStar: PropTypes.bool,
    humanMessage: PropTypes.instanceOf(HumanMessageModel),
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.string,
    autoCapitalize: PropTypes.string,
    autoCorrect: PropTypes.string,
    shouldPreventMousetrapCapture: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,

    onSetInnerRef: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onResetValue: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    labelClassName: '',
    innerClassName: '',

    type: 'text',
    placeholder: '',
    name: '',
    isDisabled: false,
    shouldFocusOnMount: false,
    required: true,
    autoFocus: false,
    autoComplete: 'on',
    shouldPreventMousetrapCapture: true,
    shouldRenderRequiredStar: false,

    onSetInnerRef: doNothing,
    onChange: doNothing,
    onBlur: doNothing,
    onFocus: doNothing,
    onKeyDown: doNothing,
    onResetValue: null,
  };

  state = {
    value: '',
  };

  INPUT_ID = Math.random().toString();

  render() {
    return (
      <UnderlinedInputWrapper className={this.props.className}>
        {this.props.label ? this.renderLabel() : null}
        {this.renderInput()}
        {this.props.helperMessage ? this.renderHelperMessage() : null}
        {this.props.humanMessage ? this.renderHumanMessage() : null}
        {this.props.children && <div className={this.props.childrenClassName}>{this.props.children}</div>}
      </UnderlinedInputWrapper>
    );
  }

  renderLabel() {
    return (
      <label className={this.props.labelClassName || styles.label} htmlFor={this.props.id || this.INPUT_ID}>
        {this.props.label}
        {this.props.required ? (
          this.props.shouldRenderRequiredStar ? (
            this.renderRequiredStar()
          ) : null
        ) : (
          <span className={styles.optional}>{i18n.t('(optional)')}</span>
        )}
      </label>
    );
  }

  renderRequiredStar() {
    return <span className={styles.requiredStar}>{'*'}</span>;
  }

  renderInput() {
    return (
      <label className={styles.inputLabelWrapper}>
        {!this.state.value && <Search className={styles.inputSearchIcon} />}
        {!this.state.value && !!this.props.placeholder && (
          <span className={styles.inputPlaceholder}>{this.props.placeholder}</span>
        )}
        {this.props.onResetValue && this.state.value && (
          <span className={styles.xMark} onClick={this.resetValue}>
            <Xmark />
          </span>
        )}
        <input
          className={`${this.isValid() ? styles.input : styles.inputError} ${this.props.innerClassName} ${
            this.props.isDisabled ? styles.inputDisabled : ''
          } ${this.props.shouldPreventMousetrapCapture ? '' : 'mousetrap'}`}
          ref={(input) => {
            this.input = input;
            this.props.onSetInnerRef(input);
          }}
          id={this.props.id || this.INPUT_ID}
          type={this.props.type}
          placeholder={' '}
          name={this.props.name}
          value={this.props.value}
          readOnly={this.props.isDisabled}
          min={this.props.min}
          max={this.props.max}
          autoFocus={this.props.autoFocus}
          autoComplete={this.props.autoComplete}
          autoCapitalize={this.props.autoCapitalize}
          autoCorrect={this.props.autoCorrect}
          onChange={(e) => {
            const { value } = e.target;
            this.props.onChange(e);
            this.setState({ value });
          }}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          onKeyDown={this.props.onKeyDown}
        />
      </label>
    );
  }

  resetValue() {
    const value = '';
    this.setState({ value });
    this.props.onResetValue();
    this.input.value = value;
  }

  renderHelperMessage() {
    return <div className={styles.helperMessage}>{this.props.helperMessage}</div>;
  }

  renderHumanMessage() {
    return <HumanMessage className={styles.humanMessage} model={this.props.humanMessage} />;
  }

  isValid() {
    const { humanMessage } = this.props;
    if (humanMessage && humanMessage.kind === HumanMessageKind.error) {
      return false;
    } else {
      return true;
    }
  }

  componentDidMount() {
    if (this.props.shouldFocusOnMount) {
      this.focusTimeout = setTimeout(() => {
        if (this.input) {
          this.input.focus();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
    }
  }
}

export default UserInputIcon;
