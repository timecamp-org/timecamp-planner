import { i18mark } from 'i18n';

export enum ActionType {
  ADD_REACTION,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  RESPOND_MESSAGE,
  CONVERT_TO_TASK,
  CONVERT_MESSAGE_TO_TASK_COMMENT,
  MARK_AS_UNREAD,
}

export const actionInfoMessage = {
  [ActionType.ADD_REACTION]: i18mark('Add reaction'),
  [ActionType.EDIT_MESSAGE]: i18mark('Edit message'),
  [ActionType.DELETE_MESSAGE]: i18mark('Delete message'),
  [ActionType.RESPOND_MESSAGE]: i18mark('Respond to this message'),
  [ActionType.CONVERT_TO_TASK]: i18mark('Convert to task'),
  [ActionType.CONVERT_MESSAGE_TO_TASK_COMMENT]: i18mark('Add message to task as quote comment'),
  [ActionType.MARK_AS_UNREAD]: i18mark('Mark unread'),
};
