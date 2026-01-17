import { Id, IdMap } from '../common/identifier'
import {
  MessageFileDbRow,
  FileDbRow,
  MessageHailType,
  MessageContainerType,
  AbstractMessageContainerMetadataDbRow,
  MessageDbRow,
  ActivityChangedPropDbRow,
  ActivityDbRow,
  MessageReactionDbRow,
} from '../db/schema'
import Table from '../db/Table';
import { EncodedPaginationToken, PaginatedResults } from '../pagination/types';

export enum CreateMessageStatus {
  OK,
  MESSAGE_ALREADY_EXISTS,
  CONTAINER_NOT_FOUND,
}

export enum UpdateMessageStatus {
  OK,
  MESSAGE_NOT_FOUND,
}

export enum DeleteMessageStatus {
  OK,
  MESSAGE_NOT_FOUND,
}

export enum AddReactionStatus {
  OK,
  MESSAGE_NOT_FOUND,
  REACTION_ALREADY_EXISTS,
  REACTION_FOR_USER_EXISTS,
}

export enum DeleteReactionStatus {
  OK,
  REACTION_NOT_FOUND,
}

export enum UpdateMessageMetadataStatus {
  OK,
  MESSAGE_NOT_FOUND,
}

export interface CreateMessageResult {
  status: CreateMessageStatus
  message?: Partial<MessageDbRow>,
}

export interface UpdateMessageResult {
  status: UpdateMessageStatus
}

export interface DeleteMessageResult {
  status: DeleteMessageStatus
}

export interface AddReactionResult {
  status: AddReactionStatus,
  reaction?: Partial<MessageReactionDbRow>
}

export interface DeleteReactionResult {
  status: DeleteReactionStatus,
}

export interface UpdateMessageMetadataResult {
  status: UpdateMessageMetadataStatus,
}

export interface MessageJson {
  containerType: MessageContainerType,
  containerId: Id,
  createdAt?: string,
  content?: string,
  mentionedUserIds?: Id[],
  hails?: MessageHailType[],
  attachments?: Id[],
  organizationId?: Id,
  isLinkPreviewEnabled?: boolean,
}

export type MessagesContainerDescriptor = {
  containerType: MessageContainerType,
  containerId: Id,
}

export interface GetContainersLatestMessageIdWithDateResult {
  status: GetContainerMessagesStatus,
  result: ContainerLatestMessageDescriptor[],
}

export interface ContainerLatestMessageDescriptor {
  containerId?: Id,
  messageId?: Id,
  createdAt?: Date,
}

export enum GetContainerMessagesStatus {
  OK,
  PROJECT_NOT_FOUND,
  TASK_NOT_FOUND,
}

export type GetContainerMessagesResult = {
  status: GetContainerMessagesStatus,
  messages?: PaginatedResults<MessageDbRow>
}

export interface GetMessagesAndFilesResult {
  status: GetContainerMessagesStatus,
  messages?: Partial<MessageDbRow>[],
  files?: Partial<FileDbRow>[],
  attachments?: Partial<MessageFileDbRow>[],
  reactions?: Partial<MessageReactionDbRow>[],
  taskSourceDataByMessageIds?: TaskSourceDataByMessageId,
  lastRead?: AbstractMessageContainerMetadataDbRow,
  nextPage?: EncodedPaginationToken
}

export interface GetMessagesAndActivitiesResult extends GetMessagesAndFilesResult {
  activities?: Partial<ActivityDbRow>[],
  activityTargetIds?: IdMap,
  changedProps?: Partial<ActivityChangedPropDbRow>[],
}

export enum MessageWithContainerStatus {
  OK,
  MESSAGE_NOT_FOUND,
  CONTAINER_DOES_NOT_EXIST,
}

export interface MessageWithContainerResult {
  status: MessageWithContainerStatus,
  container?: MessageContainer,
  message?: Partial<MessageDbRow>
}

export enum GetMetadataStatus {
  OK, CONTAINER_NOT_FOUND
}
export interface GetMetadataResult {
  status: GetMetadataStatus,
  lastKeyPress?: AbstractMessageContainerMetadataDbRow[],
  lastRead?: AbstractMessageContainerMetadataDbRow[],
}

export enum GetUserMetadataStatus {
  OK, CONTAINER_NOT_FOUND
}
export interface GetUserLastReadResult {
  status: GetUserMetadataStatus,
  lastRead?: AbstractMessageContainerMetadataDbRow,
}

export interface MessageContainerDefinition {
  containerType: MessageContainerType,
  table: Table
  relTable: Table,
  activityTable: Table,
  keypressTable: Table,
  lastReadTable: Table,
  notFoundStatus: GetContainerMessagesStatus,
  userTable: Table,
  idColumn: string
}

export const MessageContainerDefinitions: { [id in MessageContainerType]: MessageContainerDefinition } = {
  [MessageContainerType.PROJECT]: {
    table: Table.PROJECT,
    relTable: Table.MESSAGE_CONTAINER_PROJECT,
    activityTable: Table.ACTIVITY_CONTAINER_PROJECT,
    keypressTable: Table.PROJECT_KEY_PRESS,
    lastReadTable: Table.PROJECT_MESSAGE_READ,
    containerType: MessageContainerType.PROJECT,
    notFoundStatus: GetContainerMessagesStatus.PROJECT_NOT_FOUND,
    userTable: Table.USER_IN_PROJECT,
    idColumn: 'projectId'
  },
  [MessageContainerType.TASK]: {
    table: Table.TASK,
    relTable: Table.MESSAGE_CONTAINER_TASK,
    activityTable: Table.ACTIVITY_CONTAINER_TASK,
    keypressTable: Table.TASK_KEY_PRESS,
    lastReadTable: Table.TASK_MESSAGE_READ,
    containerType: MessageContainerType.TASK,
    notFoundStatus: GetContainerMessagesStatus.TASK_NOT_FOUND,
    userTable: Table.USER_IN_TASK,
    idColumn: 'taskId'
  }
};

export interface MessageContainer
  extends MessageContainerDefinition {
  id: Id,
}

export interface MessageContainerInstance
  extends MessageContainer {
  instance: Object
}

export enum GetHailStatus {
  OK,
  MESSAGE_NOT_FOUND,
}

export interface GetHailResult {
  status: GetHailStatus,
  hails?: MessageHailType[],
}

export enum GetMentionsStatus {
  OK,
  MESSAGE_NOT_FOUND,
}

export interface GetMentionsResult {
  status: GetMentionsStatus,
  mentionedUserIds?: Id[],
}

export interface GetMessagesFilesResult {
  files: Array<FileDbRow>,
  attachments: MessageFileDbRow[],
}

export interface MetaDataOptionalParams {
  messageId?: Id,
}

export interface ReactionJson {
  userId: Id,
  emojiCode: string,
}

export type TaskFromMessageSourceData = {
  taskId: Id,
  projectId: Id,
}

export interface TaskSourceDataByMessageId {
  [messageId: string]: TaskFromMessageSourceData,
}

export const EditableMessageFields = ['isLinkPreviewEnabled']
