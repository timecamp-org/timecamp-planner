import { doNothing } from 'common/utils';
import { getColorWithAlpha } from 'common/utils/colors';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserName from 'commonComponents/UserName';
import { useTranslation } from 'i18n';
import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import colorStyles from 'styles/colors.css';
import commonStyles from 'styles/common.css';
import styles from './styles.css';

import { Emoji } from 'emoji-mart';

Reaction.propTypes = {
  className: PropTypes.string,
  emojiCode: PropTypes.string.isRequired,
  size: PropTypes.number,
  isHovering: PropTypes.bool,
  userIds: ImmutablePropTypes.list,
  projectColor: PropTypes.string,
  isCurrentUserReacted: PropTypes.bool,

  onClick: PropTypes.func,
};

Reaction.defaultProps = {
  size: 16,
  isHovering: false,
  userIds: new List(),
  projectColor: colorStyles.wisteriaColor,
  isCurrentUserReacted: false,

  onClick: doNothing,
};

function Reaction(props) {
  const { t } = useTranslation();
  return (
    <UniversalPopover
      isPopoverOpened={props.isHovering}
      hasDarkBackground
      targetComponent={renderReaction(props)}
      popperComponent={renderReactedUsers(props, t)}
      popperPlacement={'top'}
      popperModifiers={{
        offset: {
          offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 2.5}`,
        },
      }}
    />
  );
}

function renderReaction(props) {
  const borderColor = props.isCurrentUserReacted ? props.projectColor : colorStyles.cloudyBlueColor;
  return (
    <div
      className={props.className || styles.Component}
      style={{
        borderColor: props.isHovering ? getColorWithAlpha(borderColor, 0.9) : getColorWithAlpha(borderColor, 0.3),
        backgroundColor: props.isCurrentUserReacted ? getColorWithAlpha(props.projectColor, 0.1) : null,
      }}
      onClick={props.onClick}
    >
      <div className={`${styles.noPointerEvents} ${styles.emoji}`}>
        <Emoji emoji={props.emojiCode} size={props.size} />
      </div>
      <div className={styles.usersCount}>{props.userIds.size}</div>
    </div>
  );
}

function renderReactedUsers(props, t) {
  return (
    <Fragment>
      {props.userIds.map(renderUserName)}
      {t(' reacted with ')}
      {props.emojiCode}
    </Fragment>
  );
}

function renderUserName(userId) {
  return <UserName key={userId} userId={userId} />;
}

export default Reaction;
