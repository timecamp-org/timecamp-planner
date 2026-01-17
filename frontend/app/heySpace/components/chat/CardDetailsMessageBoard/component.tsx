import { MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import { i18mark, useTranslation } from 'common/i18n';
import { doNothing } from 'common/utils';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import { UnderlinedSelect } from 'commonComponents/Select';
import { ChatItemsType } from 'commonEnhancers/chat/EnhanceWithChatItems/messageSelectorItemTypeConfig';
import FileDragBackdrop from 'components/chat/FileDragBackdrop/projectId';
import MessageBoardBottom from 'components/chat/MessageBoardBottom';
import MessageList from 'components/chat/MessageList';
import MessageResponsePreview from 'components/chat/MessageResponsePreview';
import NewMessageEditor from 'components/chat/NewMessageEditor';
import { EntityType } from 'models/domain/EntityModel/types';

import { defaultElementsHeight } from '../utils';

import styles from './styles.css';

CardDetailsMessageBoard.propTypes = {
  objectId: PropTypes.string.isRequired,
  respondedMessageId: PropTypes.string,

  isBackdropVisible: PropTypes.bool,

  onDropFile: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onSetOpenCallback: PropTypes.func,
  onOpenFilePrompt: PropTypes.func,
  onPaste: PropTypes.func,
};

CardDetailsMessageBoard.defaultProps = {
  isBackdropVisible: false,
  onDropFile: doNothing,
  onDragEnter: doNothing,
  onDragLeave: doNothing,
  onSetOpenCallback: doNothing,
  onOpenFilePrompt: doNothing,
  onPaste: doNothing,
};

const ITEMS_TYPE_LABELS = {
  [ChatItemsType.All]: i18mark('Everything'),
  [ChatItemsType.Messages]: i18mark('Only comments'),
  [ChatItemsType.Actions]: i18mark('Only other activity'),
};

function CardDetailsMessageBoard(props) {
  const { t } = useTranslation();
  const [messagesType, setMessagesType] = useLocalStorage(
    `card-details-displayed-messages-type-${props.objectId}`,
    ChatItemsType.All,
  );

  return (
    <div className={styles.messageBoard}>
      <div className={styles.contentSelector}>
        <UnderlinedSelect label={t('Activity:')} onChange={setMessagesType} value={messagesType}>
          {Object.entries(ITEMS_TYPE_LABELS).map(([itemType, label]) => (
            <MenuItem key={itemType} value={itemType}>
              {t(label)}
            </MenuItem>
          ))}
        </UnderlinedSelect>
      </div>

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
          objectType={EntityType.TASK_DATA}
          shouldRenderNewMessagesBar={false}
          color={props.color}
          elementsHeight={defaultElementsHeight}
          itemsType={messagesType}
        />
        {props.isBackdropVisible ? <FileDragBackdrop taskId={props.objectId} /> : null}
      </DropzoneWrapper>

      <div className={styles.editor}>
        {props.respondedMessageId && renderRespondedMessagePreview(props.respondedMessageId)}
        <NewMessageEditor
          objectId={props.objectId}
          onOpenFilePrompt={props.onOpenFilePrompt}
          onPaste={props.onPaste}
          onMessageSent={props.onMessageSent}
        />
        <MessageBoardBottom objectId={props.objectId} />
      </div>
    </div>
  );
}

function renderRespondedMessagePreview(messageId) {
  return <MessageResponsePreview messageId={messageId} />;
}
export default CardDetailsMessageBoard;
