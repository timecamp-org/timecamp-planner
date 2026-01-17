import React from 'react';

import { Emoji } from 'emoji-mart';
import PropTypes from 'prop-types';

import { FaceSmile } from 'commonComponents/Icons/fontawesome/FaceSmile';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { allowedReactions } from 'models/domain/TasksModel/constants/taskReactionsColonFormat';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

TaskReactionPicker.propTypes = {
  isPickerOpen: PropTypes.bool,
  color: PropTypes.string,
  onPickerButtonClick: PropTypes.func,
  onPickReaction: PropTypes.func,
  onClosePicker: PropTypes.func,
};

function TaskReactionPicker(props) {
  return (
    <PopoverContent onClickOutside={props.onClosePicker} isVisible={props.isPickerOpen}>
      <UniversalPopover
        isPopoverOpened={props.isPickerOpen}
        targetComponent={renderPicker(props)}
        popperComponent={renderPopoverContent()}
        popperPlacement={'bottom'}
        popperModifiers={{
          offset: {
            offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 2}`,
          },
        }}
      />
    </PopoverContent>
  );

  function renderPopoverContent() {
    return <div className={styles.reactionsWrapper}>{allowedReactions.map(renderEmojiButton)}</div>;
  }

  function renderEmojiButton(emojiColonFormat) {
    return (
      <SecondaryButton key={emojiColonFormat} onClick={() => props.onPickReaction(emojiColonFormat)}>
        <Emoji emoji={emojiColonFormat} size={20} />
      </SecondaryButton>
    );
  }
}

function renderPicker(props) {
  return (
    <SecondaryButton className={styles.reactionPickerButton} color={props.color} onClick={props.onPickerButtonClick}>
      <React.Fragment>
        <FaceSmile className={styles.emotIcon} />
      </React.Fragment>
    </SecondaryButton>
  );
}

export default TaskReactionPicker;
