import React, { MouseEventHandler, memo } from 'react';

import { Id } from 'common/utils/identifier';
import { ThreeDotsVertical } from 'commonComponents/Icons';
import { Edit } from 'commonComponents/Icons/fontawesome/Edit';
import { MessageArrowUpRight } from 'commonComponents/Icons/fontawesome/MessageArrowUpRight';
import { MessageQuote } from 'commonComponents/Icons/fontawesome/MessageQuote';
import { MessageSlash } from 'commonComponents/Icons/fontawesome/MessageSlash';
import { Reply } from 'commonComponents/Icons/fontawesome/Reply';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import colors from 'styles/colors.css';

import SecondaryButton from '../../buttons/SecondaryButton';
import ConvertMessageToCard from '../ConvertMessageToCard';
import ConvertMessageToCardComment from '../ConvertMessageToCardComment';
import EmojiPicker from '../EmojiPicker';
import WrappedAction from '../WrappedAction';

import { ActionType } from './constants';
import useComponent, { MessageActionButtonsHookInterface } from './hook';
import styles from './styles.css';

export interface MessageActionsButtonInterface {
  messageId: Id;
  containerId: Id;
  previousMessageId: Id;
  className: string;
  color: string;
  isMessageWithAttachment: boolean;
  isMoreOptionsOpen: boolean;

  onHideMessageActionButtons: VoidFunction;
  onCloseConvertMessagePopover: VoidFunction;
  onClickConvertMessageButton: VoidFunction;
  onOpenMoreOptions: VoidFunction;
  onCloseMoreOptions: VoidFunction;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
}

const defaultProps = {
  color: colors.wisteriaColor,

  isMessageWithAttachment: false,
};

const MessageActionButtons: React.FC<MessageActionsButtonInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  return (
    <div
      className={props.className || styles.actionButtons}
      key={`${props.messageId}_buttons`}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <WrappedAction actionType={ActionType.ADD_REACTION}>{renderAddReactionAction(props, hook)}</WrappedAction>

      <WrappedAction actionType={ActionType.RESPOND_MESSAGE}>{renderRespondMessageAction(props, hook)}</WrappedAction>

      {hook.isOwnMessage && renderCaseOwnMessage(props, hook)}

      {renderMoreOptionsPopover(props, hook, t)}
    </div>
  );
};

function renderCaseOwnMessage(props: MessageActionsButtonInterface, hook: MessageActionButtonsHookInterface) {
  return (
    <div className={styles.ownUserButtons}>
      {props.isMessageWithAttachment || (
        <WrappedAction actionType={ActionType.EDIT_MESSAGE}>{renderEditMessageAction(props, hook)}</WrappedAction>
      )}

      <WrappedAction actionType={ActionType.DELETE_MESSAGE}>{renderDeleteMessageAction(props, hook)}</WrappedAction>
    </div>
  );
}

function renderMoreOptionsButton(props: MessageActionsButtonInterface) {
  return (
    <SecondaryButton
      className={styles.customButton}
      color={props.color}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={props.onOpenMoreOptions}
    >
      <ThreeDotsVertical className={styles.customIcon} />
    </SecondaryButton>
  );
}

function renderMoreOptionsPopover(
  props: MessageActionsButtonInterface,
  hook: MessageActionButtonsHookInterface,
  t: TranslateFunction
) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isMoreOptionsOpen}
      targetComponent={renderMoreOptionsButton(props)}
      popperComponent={renderMoreOptionsContent(props, hook, t)}
      popperPlacement={'top'}
      popperModifiers={{
        offset: {
          offset: `0, 20`,
        },
      }}
    />
  );
}

function renderMoreOptionsContent(
  props: MessageActionsButtonInterface,
  hook: MessageActionButtonsHookInterface,
  t: TranslateFunction
) {
  return (
    <PopoverContent
      isVisible={props.isMoreOptionsOpen}
      className={styles.moreOptions}
      onClickOutside={props.onCloseMoreOptions}
    >
      {renderConvertToTaskCommentAction(props, hook, t)}

      {hook.isConvertToTaskButtonVisible && renderConvertToTaskAction(props, hook, t)}
      {hook.isOwnMessage || (
        <WrappedAction actionType={ActionType.MARK_AS_UNREAD}>
          {renderMarkMessageAsUnreadAction(props, hook, t)}
        </WrappedAction>
      )}
    </PopoverContent>
  );
}

function renderConvertToTaskButton(props: MessageActionsButtonInterface, onClick: VoidFunction, t: TranslateFunction) {
  return (
    <SecondaryButton
      className={styles.popoverButton}
      color={props.color}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={onClick}
    >
      <MessageArrowUpRight className={styles.popoverIcon} />
      <span className={styles.listElement}>{t('Convert to task')}</span>
    </SecondaryButton>
  );
}

function renderConvertToTaskCommentButton(
  props: MessageActionsButtonInterface,
  onClick: VoidFunction,
  t: TranslateFunction
) {
  return (
    <SecondaryButton
      className={styles.popoverButton}
      color={props.color}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={onClick}
    >
      <MessageQuote className={styles.popoverIcon} />
      <span className={styles.listElement}>{t('Add as a quote')}</span>
    </SecondaryButton>
  );
}

function renderMarkMessageAsUnreadAction(
  props: MessageActionsButtonInterface,
  hook: MessageActionButtonsHookInterface,
  t: TranslateFunction
) {
  return (
    <SecondaryButton
      color={props.color}
      className={styles.popoverButton}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={hook.onMarkMessageAsUnread}
    >
      <MessageSlash className={styles.popoverIcon} />
      <span className={styles.listElement}>{t('Mark unread')}</span>
    </SecondaryButton>
  );
}

function renderRespondMessageAction(props: MessageActionsButtonInterface, hook: MessageActionButtonsHookInterface) {
  return (
    <SecondaryButton
      color={props.color}
      className={styles.messageActionButton}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={hook.onRespondMessageClicked}
    >
      <Reply className={styles.popoverIcon} />
    </SecondaryButton>
  );
}

function renderAddReactionAction(props: MessageActionsButtonInterface, hook: MessageActionButtonsHookInterface) {
  return (
    <EmojiPicker
      color={props.color}
      buttonClassName={styles.messageActionButton}
      buttonShadeClassName={styles.buttonShadeClassName}
      onEmojiPick={hook.onMessageReactionPick}
      onEmojiPickerOpen={hook.onSetIsEmojiPickerOpen}
    />
  );
}

function renderEditMessageAction(props: MessageActionsButtonInterface, hook: MessageActionButtonsHookInterface) {
  return (
    <SecondaryButton
      color={props.color}
      className={styles.messageActionButton}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={hook.onMessageEditClicked}
    >
      <Edit />
    </SecondaryButton>
  );
}

function renderDeleteMessageAction(props: MessageActionsButtonInterface, hook: MessageActionButtonsHookInterface) {
  return (
    <SecondaryButton
      color={props.color}
      className={styles.messageActionButton}
      buttonShadeClassName={styles.buttonShadeClassName}
      onClick={hook.onMessageDeleteClicked}
    >
      <TrashCan />
    </SecondaryButton>
  );
}

function renderConvertToTaskAction(
  props: MessageActionsButtonInterface,
  hook: MessageActionButtonsHookInterface,
  t: TranslateFunction
) {
  const renderTargetComponent = (onClick) => (
    <WrappedAction actionType={ActionType.CONVERT_TO_TASK}>
      {' '}
      {renderConvertToTaskButton(props, onClick, t)}
    </WrappedAction>
  );

  return (
    <ConvertMessageToCard
      // @ts-ignore
      renderTargetComponent={renderTargetComponent}
      color={props.color}
      messageId={props.messageId}
      conversationWithUserId={hook.conversationWithUserId}
      spaceId={hook.spaceId}
      isConvertMessageToTaskPopoverOpen={hook.isConvertMessageToTaskPopoverOpen}
      onCloseConvertMessagePopover={hook.onCloseConvertMessagePopover}
      onClickConvertMessageButton={hook.onClickConvertMessageButton}
      onClickClosePopover={hook.onHideMessageActionButtons}
      onConvertMessage={hook.onHideMessageActionButtons}
    />
  );
}

function renderConvertToTaskCommentAction(
  props: MessageActionsButtonInterface,
  hook: MessageActionButtonsHookInterface,
  t: TranslateFunction
) {
  const renderTargetComponent = (onClick: VoidFunction) => (
    <WrappedAction actionType={ActionType.CONVERT_MESSAGE_TO_TASK_COMMENT}>
      {renderConvertToTaskCommentButton(props, onClick, t)}
    </WrappedAction>
  );

  return (
    <ConvertMessageToCardComment
      // @ts-ignore
      renderTargetComponent={renderTargetComponent}
      color={props.color}
      messageId={props.messageId}
      conversationWithUserId={hook.conversationWithUserId}
      spaceId={hook.spaceId}
      isConvertMessageToTaskPopoverOpen={hook.isConvertMessageToTaskCommentPopoverOpen}
      onCloseConvertMessagePopover={hook.onCloseConvertMessageToTaskCommentPopover}
      onClickConvertMessageButton={hook.onClickConvertMessageToTaskCommentButton}
      onClickClosePopover={hook.onHideMessageActionButtons}
      onConvertMessage={hook.onHideMessageActionButtons}
    />
  );
}

MessageActionButtons.defaultProps = defaultProps;

export default memo(MessageActionButtons);
