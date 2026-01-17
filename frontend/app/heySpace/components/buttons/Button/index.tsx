import React, { MouseEventHandler, Ref } from 'react';
import { ButtonKind } from 'components/buttons/Button/types';
import styles from './styles.css';
import { getButtonClassName } from 'components/buttons/Button/utils';
import { doNothing } from 'common/utils';

export type ButtonInterface = {
  kind?: ButtonKind;
  isActive?: boolean;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  isDisabled?: boolean;
  style?: React.CSSProperties;

  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const defaultProps: Partial<ButtonInterface> = {
  kind: ButtonKind.DEFAULT,
  isActive: false,
  type: 'button',
  isDisabled: false,
  style: {},

  onClick: doNothing,
};

const Button: ReactFCWithChildren<ButtonInterface> = React.forwardRef((props, ref) => {
  const classNames = `${styles.button} ${getButtonClassName(props)}`;
  return (
    <button
      className={classNames}
      ref={ref}
      type={props.type}
      onClick={props.isDisabled ? doNothing : props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
});

Button.defaultProps = defaultProps;
export default Button;
