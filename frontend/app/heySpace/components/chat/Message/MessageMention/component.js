import { memo } from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInfoPopper from 'commonComponents/UserInfoPopper';
import { MentionType } from 'models/domain/MessagesModel/types';
import colorStyles from 'styles/colors.css';
import commonStyles from 'styles/common.css';
import styles from './styles.css';

import InlineMention from './inlineMention';

MessageMention.propTypes = {
  isPopoverOpened: PropTypes.bool,
  userId: PropTypes.string,
  username: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  onMentionClick: PropTypes.func,
  onClosePopover: PropTypes.func,
};

MessageMention.defaultProps = {
  type: MentionType.USER,
  color: colorStyles.wisteriaColor,
  isPopoverOpened: false,
  onMentionClick: doNothing,
  onClosePopover: doNothing,
};

function MessageMention(props) {
  const mention =
    props.type === MentionType.USER ? (
      <InlineMention
        username={props.username}
        isMentionPopoverOpen={props.isPopoverOpened}
        onClick={props.onMentionClick}
      />
    ) : (
      <span className={styles.hailMention}>{`@${props.value}`}</span>
    );

  return (
    <UniversalPopover
      scrollContainerId={`message-list-${props.containerObjectId}`}
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={mention}
      popperComponent={<UserInfoPopper userId={props.userId} onHide={props.onClosePopover} />}
      popperPlacement={'top'}
      popperModifiers={{
        offset: {
          offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 3}`,
        },
      }}
    />
  );
}

export default memo(MessageMention);
