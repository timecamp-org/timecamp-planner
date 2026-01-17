import React from 'react';
import PropTypes from 'prop-types';
import { doNothing, ellipsizeInTheEnd } from 'common/utils';
import isEmpty from 'lodash/isEmpty';

import PersonIcon from 'components/person/PersonIcon';
import { useTranslation } from 'i18n';
import styles from './styles.css';

UserLabel.propTypes = {
  innerClassName: PropTypes.string,
  personIconClassName: PropTypes.string,
  nameAndEmailClassName: PropTypes.string,
  userId: PropTypes.string.isRequired,
  searchPhrase: PropTypes.string,
  isCurrentUserLabel: PropTypes.bool.isRequired,
  shouldRenderInvitationStatus: PropTypes.bool,
  ellipsizeMinLength: PropTypes.number,
  isProjectMember: PropTypes.bool,
  shouldRenderProjectStatus: PropTypes.bool,
  isUserActive: PropTypes.bool,
  isUserGuest: PropTypes.bool,

  shouldRenderIcon: PropTypes.bool,
  shouldRenderName: PropTypes.bool,
  shouldRenderEmail: PropTypes.bool,
  shouldRenderNickname: PropTypes.bool,
  shouldRenderCurrentUserHint: PropTypes.bool,
  shouldRenderGuestHint: PropTypes.bool,

  onClick: PropTypes.func,
  children: PropTypes.element,

  userFirstName: PropTypes.string,
  userLastName: PropTypes.string,
  userEmail: PropTypes.string,
};

UserLabel.defaultProps = {
  shouldRenderIcon: true,
  shouldRenderName: true,
  shouldRenderEmail: true,
  shouldRenderNickname: false,
  isCurrentUserLabel: false,
  shouldRenderCurrentUserHint: false,
  shouldRenderGuestHint: false,
  onClick: doNothing,
  shouldRenderInvitationStatus: false,
  shouldRenderProjectStatus: false,
  isUserActive: true,
  isUserGuest: false,

  userFirstName: '',
  userLastName: '',
  userEmail: '',
};

function UserLabel(props) {
  const { t } = useTranslation();

  return (
    <div
      className={`${props.shouldRenderProjectStatus && props.isProjectMember ? null : styles.componentOnHover} ${
        props.className || styles.Component
      }`}
      onClick={props.onClick}
    >
      {(props.userFirstName && props.userLastName) || !props.shouldRenderInvitationStatus
        ? renderUserLabel(props, t)
        : renderUserPendingInvitation(props, t)}
      {props.shouldRenderProjectStatus ? renderProjectStatus(props, t) : null}
    </div>
  );
}

const renderUserLabel = (props, t) => {
  const isNameVisible = props.shouldRenderName && hasUserName(props);
  const isEmailVisible = (props.shouldRenderEmail && !props.shouldRenderNickname) || !hasUserName(props);
  return (
    <div className={props.innerClassName || styles.userLabel}>
      {props.shouldRenderIcon && renderIcon(props)}
      <div className={props.nameAndEmailClassName || styles.nameAndEmailWrapper}>
        {isNameVisible && renderName(props, t)}
        {isEmailVisible && renderEmail(props, t)}
        {props.shouldRenderNickname && renderNickname(props)}
      </div>
      {props.children}
    </div>
  );
};

const renderUserPendingInvitation = (props, t) => (
  <div className={props.isUserActive ? styles.pendingInvitation : styles.deactivated}>
    {props.shouldRenderIcon ? renderIcon(props) : null}
    <div className={styles.pendingInvitationLeft}>
      {props.ellipsizeMinLength ? ellipsizeInTheEnd(props.userEmail, props.ellipsizeMinLengths) : props.userEmail}
    </div>
    <div>{t('pending invitation')}</div>
  </div>
);

const renderIcon = (props) => (
  <PersonIcon userId={props.userId} innerClassName={props.personIconClassName} allowDisable={false} />
);

const renderName = (props, t) => {
  const fullName = `${props.userFirstName || ''} ${props.userLastName || ''}`;
  return (
    <div className={styles.userName}>
      <span className={styles.userNameText}>
        {props.ellipsizeMinLength ? ellipsizeInTheEnd(fullName, props.ellipsizeMinLength) : fullName}
      </span>
      {shouldRenderCurrentUserHint(props) ? renderCurrentUserHint(t) : null}
      {props.shouldRenderGuestHint && props.isUserGuest ? renderGuestHint(t) : null}
    </div>
  );
};

const renderCurrentUserHint = (t) => <span className={styles.hint}>{t('(You)')}</span>;

const renderGuestHint = (t) => <span className={styles.hint}>{t('(Guest)')}</span>;

const renderEmail = (props, t) => (
  <div className={styles.userEmail}>
    {props.ellipsizeMinLength ? ellipsizeInTheEnd(props.userEmail, props.ellipsizeMinLength) : props.userEmail}
    {!hasUserName(props) && shouldRenderCurrentUserHint(props) ? renderCurrentUserHint(t) : null}
    {!hasUserName(props) && props.shouldRenderGuestHint && props.isUserGuest ? renderGuestHint(t) : null}
  </div>
);

const renderNickname = (props) => (
  <div className={styles.userEmail}>
    {props.ellipsizeMinLength ? ellipsizeInTheEnd(props.userNickname, props.ellipsizeMinLength) : props.userNickname}
  </div>
);

const hasUserName = (props) => !isEmpty(props.userFirstName) || !isEmpty(props.userLastName);

const shouldRenderCurrentUserHint = (props) => props.shouldRenderCurrentUserHint && props.isCurrentUserLabel;

const renderProjectStatus = (props, t) => (
  <div>{props.isProjectMember ? <div>{t('MEMBER')}</div> : <div>{t('INVITE')}</div>}</div>
);

export default UserLabel;
