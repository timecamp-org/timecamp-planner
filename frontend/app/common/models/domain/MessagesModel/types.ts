import { Id } from 'common/utils/identifier';

export enum MentionType {
  HAIL = 'hail',
  USER = 'user',
  SPACE = 'space',
  CHANNEL = 'channel',
  HERE = 'here',
}

export enum KeyCode {
  TAB = 9,
  ENTER = 13,
  ESCAPE = 27,
  UP = 38,
  DOWN = 40,
}

export interface UsersProjectMentionDataInterface {
  userId: Id;
  displayValue: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  type: MentionType;
  isBot: boolean;
}

export type MessagePayload = {
  messageId: string;
  objectId: string;
  hails: string[];
  mentionedUserIds: string[];
  isLinkPreviewEnabled: boolean;
};
