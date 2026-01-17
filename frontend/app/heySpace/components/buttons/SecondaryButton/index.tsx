import { memo, MouseEventHandler, RefObject } from 'react';

import Dotdotdot from 'react-dotdotdot';

import { AnyDict } from 'common/types';
import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import objectColorStyles from 'styles/object-colors-styles.css';

import styles from './styles.css';

const DEFAULT_COLOR = 'var(--color-primary-500)';

export type SecondaryButtonInterface = {
  color?: string;
  defaultColor?: string;
  className?: string;
  style?: AnyDict;
  shouldTruncateText?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  projectId?: Id;
  taskId?: Id;
  shouldFillContentWithColor?: boolean;
  shouldChangeColorOnHover?: boolean;
  buttonShadeClassName?: string;
  activeClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  innerRef?: ((ref: HTMLButtonElement) => void) | RefObject<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
};

const defaultProps = {
  shouldTruncateText: false,
  isDisabled: false,
  isActive: false,
  shouldFillContentWithColor: false,
  shouldChangeColorOnHover: true,
  color: DEFAULT_COLOR,
  defaultColor: DEFAULT_COLOR,
  onClick: doNothing,
  innerRef: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

const SecondaryButton: ReactFCWithChildren<SecondaryButtonInterface> = (props) => {
  const activeClassName = props.activeClassName || styles.active;

  return (
    <button
      ref={props.innerRef}
      className={`
          ${props.className || styles.Component} 
          ${props.isActive ? `${activeClassName} ${objectColorStyles.active}` : ''} 
          ${props.isDisabled ? `disabled ${styles.disabled}` : ''} 
          ${props.shouldFillContentWithColor ? objectColorStyles.fillWithColor : ''} 
          ${styles.darkButtonShade}
        `}
      style={props.style}
      type={'button'}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={props.onClick}
    >
      {renderButtonContent(props)}
    </button>
  );
};

function renderButtonContent(props) {
  if (props.shouldTruncateText) {
    return (
      <Dotdotdot clamp={1} useNativeClamp={true}>
        {props.children}
      </Dotdotdot>
    );
  } else {
    return props.children;
  }
}

SecondaryButton.defaultProps = defaultProps;

export default memo<ReactFCWithChildren<SecondaryButtonInterface>>(SecondaryButton);
