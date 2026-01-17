import React, { MouseEventHandler } from 'react';

import { doNothing, ellipsizeInTheEnd } from 'common/utils';

import { useTranslation } from '../../../../common/i18n';

import { useComponent } from './hook';
import styles from './styles.css';

const MAX_TEXT_LENGTH = 25;

export interface PersonFullNameInterface {
  userId: string;
  className?: string;
  userName?: string;
  displayLastNameFirst?: boolean;
  shouldAddYouInParenthesesIfCurrent?: boolean;
  maxNameLength?: number;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

const defaultProps = {
  className: '',
  displayLastNameFirst: false,
  shouldAddYouInParenthesesIfCurrent: false,
  onClick: doNothing,
};

const PersonFullName: React.FC<PersonFullNameInterface> = (props) => {
  const { t } = useTranslation();
  const { isUserActive, shouldDisplayYouInParentheses, userFullName } = useComponent(props);

  let maxTextLength = props.maxNameLength || MAX_TEXT_LENGTH;
  if (shouldDisplayYouInParentheses) {
    maxTextLength -= 8;
  }

  return (
    <span
      className={`
        ${props.className || styles.PersonFullName}
        ${isUserActive ? '' : styles.deactivated}
      `}
      onClick={props.onClick}
    >
      {ellipsizeInTheEnd(userFullName, maxTextLength)}
      {shouldDisplayYouInParentheses && <span className={styles.currentUserIndicator}>{` (${t('You')})`}</span>}
    </span>
  );
};

PersonFullName.defaultProps = defaultProps;

export default PersonFullName;
