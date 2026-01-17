import React, { MouseEventHandler } from 'react';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';

import { PersonIconHookInterface, useComponent } from './hook';
import styles from './styles.css';

export type PersonIconInterface = {
  userId: Id;
  className?: string;
  innerClassName?: string;
  wrapperClassName?: string;

  showInitialsOnly?: boolean;
  showOnlineIndicator?: boolean;

  width?: number;
  height?: number;

  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;

  allowDisable?: boolean;
};

const defaultProps = {
  className: '',
  innerClassName: '',
  wrapperClassName: '',
  showInitialsOnly: false,
  showOnlineIndicator: true,
  allowDisable: true,

  width: 40,
  height: 40,

  onClick: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

const PersonIcon: React.FC<PersonIconInterface> = (props) => {
  const hook = useComponent(props);

  return (
    <div
      className={props.className || styles.Component}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {hook.isExist ? renderCaseExists(props, hook) : renderEmptyIcon(props, hook)}
    </div>
  );
};

function renderCaseExists(props: PersonIconInterface, hook: PersonIconHookInterface) {
  if (hook.avatarUrl && !props.showInitialsOnly) {
    return renderUserAvatar(props, hook);
  } else if (hook.isBot) {
    return renderCaseBot(props, hook);
  } else {
    return renderCaseInitials(props, hook);
  }
}

function renderUserAvatar(props: PersonIconInterface, hook: PersonIconHookInterface) {
  return (
    <div className={getClassName(props, hook)}>
      <img
        role="presentation"
        className={`${styles.personIcon} ${props.innerClassName}`}
        src={hook.avatarUrl.replace('key=360x360', `key=${props.width}x${props.height}`)}
      />
    </div>
  );
}

function renderCaseBot(props: PersonIconInterface, hook: PersonIconHookInterface) {
  return (
    <div
      role="presentation"
      className={`${styles.personIcon} ${props.innerClassName} ${styles.botIcon} ${getClassName(props, hook)}`}
    />
  );
}

function renderCaseInitials(props: PersonIconInterface, hook: PersonIconHookInterface) {
  return (
    <div className={`${styles.personIcon} ${props.innerClassName} ${getClassName(props, hook)}`}>
      <span className={styles.initials}>{hook.initials}</span>
    </div>
  );
}

function renderEmptyIcon(props: PersonIconInterface, hook: PersonIconHookInterface) {
  return (
    <div className={getClassName(props, hook)}>
      <div className={`${styles.personIcon} ${props.innerClassName}`} />
    </div>
  );
}

function getClassName(props: PersonIconInterface, hook: PersonIconHookInterface) {
  return `
    ${props.wrapperClassName || styles.defaultSize} 
    ${styles.personIconWrapper} 
    ${getOnlineIndicatorClassName(hook)}
    ${!hook.isUserActive && props.allowDisable ? styles.deactivated : ''}
  `;
}

function getOnlineIndicatorClassName(hook: PersonIconHookInterface) {
  return hook.shouldRenderOnlineIndicator ? (hook.isOnline || hook.isBot ? styles.online : styles.offline) : '';
}

PersonIcon.defaultProps = defaultProps;

export default PersonIcon;
