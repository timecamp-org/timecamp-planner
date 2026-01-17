import { memo } from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import EmojiPicker from 'components/chat/EmojiPicker';
import FileUploadButton from 'components/chat/FileUploadButton';
import GiphyPicker from 'components/chat/GiphyPicker';

import styles from './styles.css';

MessageEditorToolbar.propTypes = {
  className: PropTypes.string,
  shouldRenderFileUploadIcon: PropTypes.bool,
  shouldRenderInsertMentionIcon: PropTypes.bool,
  shouldRenderEmojiIcon: PropTypes.bool,
  shouldRenderGifIcon: PropTypes.bool,
  isEmojiPickerOpen: PropTypes.bool,
  color: PropTypes.string,

  onFileUploadIconClick: PropTypes.func,
  onInsertMentionIconClick: PropTypes.func,
  onEmojiToolbarIconClick: PropTypes.func,
  onEmojiPick: PropTypes.func,
  onSetToolbarRef: PropTypes.func,
  onGoogleDrivePick: PropTypes.func,
  onDropboxFilesPick: PropTypes.func,
  onGiphyPick: PropTypes.func,
  onFocus: PropTypes.func,
};

MessageEditorToolbar.defaultProps = {
  shouldRenderFileUploadIcon: true,
  shouldRenderInsertMentionIcon: true,
  shouldRenderEmojiIcon: true,
  shouldRenderGifIcon: true,

  onFileUploadIconClick: doNothing,
  onInsertMentionIconClick: doNothing,
  onEmojiToolbarIconClick: doNothing,
  onEmojiPick: doNothing,
  onSetToolbarRef: doNothing,
  onGoogleDrivePick: doNothing,
  onDropboxFilesPick: doNothing,
  onGiphyPick: doNothing,
  onFocus: doNothing,
};

function MessageEditorToolbar(props) {
  return (
    <div className={props.className || styles.toolbar} ref={props.onSetToolbarRef}>
      {props.shouldRenderEmojiIcon && (
        <EmojiPicker
          color={props.color}
          onEmojiPick={props.onEmojiPick}
          onEmojiPickerOpen={props.onEmojiToolbarIconClick}
          isPickerOpen={props.isEmojiPickerOpen}
          buttonClassName={styles.toolbarIcon}
        />
      )}
      {props.shouldRenderGifIcon && <GiphyPicker color={props.color} onEntrySelect={props.onGiphyPick} />}
      {props.shouldRenderFileUploadIcon && (
        <FileUploadButton
          color={props.color}
          onFileUploadIconClick={props.onFileUploadIconClick}
          onGoogleDrivePick={props.onGoogleDrivePick}
          onDropboxFilesPick={props.onDropboxFilesPick}
        />
      )}
    </div>
  );
}

export default memo(MessageEditorToolbar);
