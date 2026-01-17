import React from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import NewMessageEditor from 'components/chat/NewMessageEditor';
import MessageList from 'components/chat/MessageList';
import FileDragBackdrop from 'components/chat/FileDragBackdrop/projectId';
import FileUploadLoaderBar from 'components/chat/FileUploadLoaderBar';
import MessageBoardBottom from 'components/chat/MessageBoardBottom';
import MessageResponsePreview from 'components/chat/MessageResponsePreview';
import styles from './styles.css';
import { defaultElementsHeight } from '../utils';
import useRightPanelChatPersister from '../rightPanelChat/RightPanelChat/useRightPanelChatPersister';

MessageBoard.propTypes = {
  objectId: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  respondedMessageId: PropTypes.string,
  className: PropTypes.string,
  shouldFocusOnMount: PropTypes.bool,

  // from EnhanceWithFileUpload
  nameOfFileInUpload: PropTypes.string,
  isBackdropVisible: PropTypes.bool,
  onDropFile: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onSetOpenCallback: PropTypes.func,
  onOpenFilePrompt: PropTypes.func,
  onPaste: PropTypes.func,
};

MessageBoard.defaultProps = {
  shouldFocusOnMount: true,
  // from EnhanceWithFileUpload
  nameOfFileInUpload: '',
  isBackdropVisible: false,
  onDropFile: doNothing,
  onDragEnter: doNothing,
  onDragLeave: doNothing,
  onSetOpenCallback: doNothing,
  onOpenFilePrompt: doNothing,
  onPaste: doNothing,
};

function MessageBoard(props) {
  const shouldRenderFileUploadLoader = props.nameOfFileInUpload && !props.isCardDetailsModalOpened;
  const { isRightPanelChatOpen } = useRightPanelChatPersister();

  return (
    <div className={props.className || styles.messageBoard}>
      <DropzoneWrapper
        noClick
        noKeyboard
        className={styles.dropzone}
        onSetOpenCallback={props.onSetOpenCallback}
        onDrop={props.onDropFile}
        onDragEnter={props.onDragEnter}
        onDragLeave={props.onDragLeave}
        onPaste={props.onPaste}
      >
        <MessageList
          objectId={props.objectId}
          objectType={props.objectType}
          color={props.color}
          elementsHeight={defaultElementsHeight}
        />
        {props.isBackdropVisible && <FileDragBackdrop projectId={props.objectId} />}
        {shouldRenderFileUploadLoader && <FileUploadLoaderBar fileName={props.nameOfFileInUpload} />}
      </DropzoneWrapper>

      <div className={isRightPanelChatOpen ? styles.editorMargin : styles.editorMarginRightPanelHidden}>
        {props.respondedMessageId && renderRespondedMessagePreview(props.respondedMessageId)}
        <NewMessageEditor
          objectId={props.objectId}
          onOpenFilePrompt={props.onOpenFilePrompt}
          onPaste={props.onPaste}
          shouldFocusOnMount={props.shouldFocusOnMount}
        />
      </div>
      <MessageBoardBottom isRightPanelOpened={isRightPanelChatOpen} objectId={props.objectId} />
    </div>
  );
}

function renderRespondedMessagePreview(messageId) {
  return <MessageResponsePreview messageId={messageId} />;
}

export default MessageBoard;
