import React, { memo, MouseEventHandler, FC } from 'react';
import ObjectColors from '../../../styles/objectColors';

import colors from 'styles/colors.css';
import { doNothing } from 'common/utils';
import styles from './styles.css';

type PrimaryButtonInterface = {
  color?: string;
  isDisabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
};

const defaultProps = {
  color: colors.wisteriaColor,
  isDisabled: false,
  onClick: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

const PrimaryButton: ReactFCWithChildren<PrimaryButtonInterface> = (props) => (
  <button
    className={`
          ${props.className || styles.Component} 
          ${ObjectColors.getColorSpecificClassName(props.color, 'primary-button')} 
          ${props.isDisabled ? `disabled ${styles.disabled}` : ''} 
          ${styles.brightButtonShade}
        `}
    style={{ background: props.isDisabled ? colors.cloudyBlueColor : props.color }}
    onClick={props.onClick}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    {props.children}
  </button>
);

PrimaryButton.defaultProps = defaultProps;

export default memo<ReactFCWithChildren<PrimaryButtonInterface>>(PrimaryButton);
