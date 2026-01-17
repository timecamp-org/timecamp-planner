import { ChangeEventHandler, Component, FocusEventHandler, KeyboardEventHandler, ReactNode } from 'react';

import { doNothing } from 'common/utils';
import HumanMessage from 'commonComponents/HumanMessage';
import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import { i18n } from 'i18n';
import { HumanMessageKind, HumanMessageRecordInterface } from 'models/domain/HumanMessageModel/types';
import { getConditionalClass } from 'utils/getConditionalClass';

import styles from './styles.css';

interface UnderlinedUserInputInterface {
  className?: string;
  labelClassName?: string;
  innerClassName?: string;
  childrenClassName?: string;
  humanMessageClassName?: string;

  id?: string;
  label?: string;
  helperMessage?: string;
  type?: 'text' | 'password' | 'number' | 'email';
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  placeholder?: string;
  name?: string;
  value?: string | number;

  isDisabled?: boolean;
  shouldFocusOnMount?: boolean;
  shouldRenderRequiredStar?: boolean;
  humanMessage?: HumanMessageRecordInterface;
  addEmptyMessageSpace?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  shouldPreventMousetrapCapture?: boolean;
  min?: number;
  max?: number;
  children?: ReactNode;

  onSetInnerRef?: (input: HTMLInputElement) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

class UnderlinedUserInput extends Component<UnderlinedUserInputInterface> {
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
  };

  INPUT_ID = Math.random().toString();

  input: HTMLInputElement;

  focusTimeout: NodeJS.Timeout;

  render() {
    return (
      <div className={styles.wrapper}>
        <UnderlinedInputWrapper
          className={`${this.props.className} ${getConditionalClass(styles.inputError, !this.isValid())}`}
        >
          {this.props.label ? this.renderLabel() : null}
          {this.renderInput()}
          {this.props.children && <div className={this.props.childrenClassName}>{this.props.children}</div>}
        </UnderlinedInputWrapper>
        <div className={getConditionalClass(styles.messageHeight, this.props.addEmptyMessageSpace)}>
          {this.props.helperMessage ? this.renderHelperMessage() : null}
          {this.props.humanMessage ? this.renderHumanMessage() : null}
        </div>
      </div>
    );
  }

  renderLabel = () => (
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

  renderRequiredStar = () => <span className={styles.requiredStar}>{'*'}</span>;

  renderInput = () => (
    <input
      className={`${styles.input} ${this.props.innerClassName} ${this.props.isDisabled ? styles.inputDisabled : ''} ${
        this.props.shouldPreventMousetrapCapture ? '' : 'mousetrap'
      }`}
      ref={(input) => {
        this.input = input;
        this.props.onSetInnerRef(input);
      }}
      id={this.props.id || this.INPUT_ID}
      type={this.props.type}
      placeholder={this.props.placeholder}
      name={this.props.name}
      value={this.props.value}
      readOnly={this.props.isDisabled}
      min={this.props.min}
      max={this.props.max}
      autoFocus={this.props.autoFocus}
      autoComplete={this.props.autoComplete}
      autoCapitalize={this.props.autoCapitalize}
      autoCorrect={this.props.autoCorrect}
      onChange={this.props.onChange}
      onBlur={this.props.onBlur}
      onFocus={this.props.onFocus}
      onKeyDown={this.props.onKeyDown}
      inputMode={this.props.inputMode}
    />
  );

  renderHelperMessage = () => <div className={styles.helperMessage}>{this.props.helperMessage}</div>;

  renderHumanMessage = () => (
    <HumanMessage className={this.props.humanMessageClassName || styles.humanMessage} model={this.props.humanMessage} />
  );

  isValid = () => {
    const { humanMessage } = this.props;
    if (humanMessage && humanMessage.kind === HumanMessageKind.error) {
      return false;
    } else {
      return true;
    }
  };

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

export default UnderlinedUserInput;
