import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles.css';
import { doNothing } from 'common/utils';
import colorStyles from 'styles/colors.css';

import { quillFormats } from 'models/domain/MessagesModel/constants/quillEditorConstants';
import { useTranslation } from 'i18n';

import TimeOutput from 'components/time/TimeOutput';
import MessageEditorToolbar from 'components/chat/MessageEditorToolbar';
import PersonIcon from 'components/person/PersonIcon';
import PersonFullName from 'components/person/PersonFullName';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'components/chat/NewMessageEditor/mentionBlot';
import 'components/chat/NewMessageEditor/emojiBlot';
import './messageEditKeyDownModule';

import commonStyles from 'styles/common.css';

const avatarSize = 7 * parseInt(commonStyles.gridCellSize, 10);

const Delta = Quill.import('delta');

MessageBeingEdited.propTypes = {
  messageContent: PropTypes.object.isRequired,
  color: PropTypes.string,
  senderId: PropTypes.string,
  setReactQuillRef: PropTypes.func,
  onSetQuillWrapperRef: PropTypes.func,
  onSetToolbarRef: PropTypes.func,
  dateAdded: PropTypes.number.isRequired,

  // emoji picker stuff
  onEmojiPick: PropTypes.func,
  onEmojiToolbarIconClick: PropTypes.func,

  onMessageEditConfirmed: PropTypes.func.isRequired,
  onMessageEditCancelled: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  updateMessageNewText: PropTypes.func.isRequired,
};

MessageBeingEdited.defaultProps = {
  color: colorStyles.wisteriaColor,
  setReactQuillRef: doNothing,
  onSetQuillWrapperRef: doNothing,
  onSetToolbarRef: doNothing,
  // emoji picker stuff
  onEmojiPick: doNothing,
  onEmojiToolbarIconClick: doNothing,
  onBlur: doNothing,
};

function MessageBeingEdited(props) {
  const { t } = useTranslation();
  return (
    <div
      ref={props.onSetQuillWrapperRef}
      id={'editedMessage'}
      tabIndex="1"
      className={styles.messageBeingEdited}
      onKeyDown={props.onKeyDown}
      onBlur={props.onBlur}
    >
      <PersonIcon userId={props.senderId} wrapperClassName={styles.personIcon} width={avatarSize} height={avatarSize} />
      <div className={styles.right}>
        <div className={styles.messageInfo}>
          <PersonFullName userId={props.senderId} className={styles.personName} />
          <TimeOutput className={styles.messageAddTime} timestamp={props.dateAdded} format={'HH:mm'} />
        </div>
        <div className={styles.quillWrapper}>
          <ReactQuill
            id={'messageBeingEditedEditor'}
            ref={(ref) => {
              props.setReactQuillRef(ref);
            }}
            className={styles.messageEditor}
            value={props.messageContent}
            onChange={props.updateMessageNewText}
            formats={quillFormats}
            modules={{
              messageEditKeyDown: {
                onMessageEditConfirmed: props.onMessageEditConfirmed,
              },
              toolbar: false,
              clipboard: {
                matchers: [[Node.ELEMENT_NODE, stripStylingMatcher]],
              },
            }}
          />
          <MessageEditorToolbar
            className={styles.messageEditorToolbar}
            color={props.color}
            shouldRenderFileUploadIcon={false}
            shouldRenderInsertMentionIcon={false}
            shouldRenderGifIcon={false}
            onEmojiToolbarIconClick={props.onEmojiToolbarIconClick}
            onEmojiPick={props.onEmojiPick}
            onGiphyPick={props.onGiphyPick}
            onSetToolbarRef={props.onSetToolbarRef}
          />
        </div>
        <div className={styles.messageBeingEditedButtons}>
          <SecondaryButton color={props.color} onClick={props.onMessageEditCancelled}>
            {t('CANCEL')}
          </SecondaryButton>
          <PrimaryButton
            className={styles.confirmEditButton}
            onClick={props.onMessageEditConfirmed}
            color={props.color}
          >
            {t('SAVE')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function stripStylingMatcher(node, delta) {
  return delta.compose(
    new Delta().retain(delta.length(), {
      header: false,
      bold: false,
      italic: false,
      font: false,
      background: false,
      color: false,
      link: false,
    }),
  );
}

export default memo(MessageBeingEdited);
