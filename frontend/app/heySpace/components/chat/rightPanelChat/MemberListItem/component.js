import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import { doNothing } from 'common/utils';
import { MoreVertical, Trash } from 'commonComponents/Icons';
import { projectRoleLabels } from 'models/domain/ProjectsModel/types';

import PersonIcon from 'components/person/PersonIcon';
import PersonFullName from 'components/person/PersonFullName';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';

import commonStyles from 'styles/common.css';
import { useTranslation } from 'i18n';

const avatarSize = 6 * parseInt(commonStyles.gridCellSize, 10);

MemberListItem.propTypes = {
  userId: PropTypes.string.isRequired,
  isPopoverOpen: PropTypes.bool,
  isCurrentUser: PropTypes.bool,
  shouldRenderMoreButton: PropTypes.bool,
  isUserGuest: PropTypes.bool,
  projectRole: PropTypes.string,

  onMemberClick: PropTypes.func,
  onMemverRemove: PropTypes.func,
};

MemberListItem.defaultProps = {
  isPopoverOpen: false,
  shouldRenderMoreButton: true,
  isUserGuest: false,
  isCurrentUser: false,

  onMemberClick: doNothing,
  onMemverRemove: doNothing,
};

function MemberListItem(props) {
  const { t } = useTranslation();
  const roleLabel = props.isUserGuest ? t('Guest') : t(projectRoleLabels[props.projectRole]);
  return (
    <div key={`MembersRightPanelChat_${props.userId}`} className={styles.Component}>
      <div onClick={props.onMemberClick} className={styles.memberDetails}>
        <PersonIcon userId={props.userId} className={styles.personIcon} width={avatarSize} height={avatarSize} />
        <div className={styles.personNameWithRole}>
          <PersonFullName
            className={styles.memberName}
            userId={props.userId}
            shouldAddYouInParenthesesIfCurrent={true}
          />
          <span className={styles.role}>{roleLabel}</span>
        </div>
        {props.shouldRenderMoreButton && renderMoreButton(props, t)}
      </div>
    </div>
  );
}

function renderMoreButton(props, t) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={
        <div className={styles.moreButton} onClick={props.onPopoverOpen}>
          <MoreVertical className={styles.moreIcon} />
        </div>
      }
      popperComponent={
        <SecondaryButton onClick={props.onMemberRemove} className={styles.popoverButton}>
          <Trash className={styles.trashIcon} />
          {props.isUserGuest ? t('Remove guest') : t('Remove member')}
        </SecondaryButton>
      }
      popperPlacement={'bottom'}
      shouldRenderArrow={false}
      popperContentWrapperClassName={styles.popoverContent}
      popperModifiers={{
        offset: {
          offset: `0, 10`,
        },
      }}
    />
  );
}

export default MemberListItem;
