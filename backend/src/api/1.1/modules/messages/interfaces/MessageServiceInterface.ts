import { Id } from '../../common/identifier';
import { MessageDbRow, MessageReactionDbRow } from '../../db/schema';
import {
  AddReactionResult,
  CreateMessageResult,
  DeleteMessageResult,
  DeleteReactionResult,
  GetContainerMessagesResult,
  GetContainersLatestMessageIdWithDateResult,
  GetHailResult,
  GetMentionsResult,
  GetMessagesAndActivitiesResult,
  GetMessagesAndFilesResult,
  GetMetadataResult,
  GetNeighbouringMessagesResult,
  MessageJson,
  MessageWithContainerResult,
  ReactionJson,
  TaskSourceDataByMessageId,
  UpdateMessageMetadataResult,
  UpdateMessageResult,
} from '../types';

export interface MessageServiceInterface {
  getMessage(id: Id): PromiseLike<MessageDbRow>;

  getHails(messageId: Id): PromiseLike<GetHailResult>;

  getMentions(messageId: Id): PromiseLike<GetMentionsResult>;

  createMessage(id: Id, senderId: Id, messageJson: MessageJson): PromiseLike<CreateMessageResult>;

  updateMessage(id: Id, editorId: Id, messageJson: MessageJson): PromiseLike<UpdateMessageResult>;

  deleteMessage(id: Id): PromiseLike<DeleteMessageResult>;

  addReaction(messageId: Id, userId: Id, reactionId: Id, reactionJson: ReactionJson): PromiseLike<AddReactionResult>;

  getReaction(reactionId: Id): PromiseLike<MessageReactionDbRow>;

  deleteReaction(userId: Id, reactionId: Id): PromiseLike<DeleteReactionResult>;

  getProjectsLatestMessageIdWithDate(projectIds: Id[]): PromiseLike<GetContainersLatestMessageIdWithDateResult>;

  getContainerMessages(containerType, containerId, page, limit): PromiseLike<GetContainerMessagesResult>;

  updateMessageRead(containerType, containerId, userId, messageId: Id): PromiseLike<UpdateMessageMetadataResult>;

  updateKeyPress(
    containerType,
    containerId,
    userId,
    resetTimestamp?: boolean
  ): PromiseLike<UpdateMessageMetadataResult>;

  getContainerMetadata(containerType, containerId): PromiseLike<GetMetadataResult>;

  getMessageWithContainer(id: Id, fetchContainer: boolean): PromiseLike<MessageWithContainerResult>;

  getContainerMessagesFilesAndReactions(
    containerType,
    containerId,
    page,
    limit,
    userId: Id,
    getAllUnreadMessages?: boolean
  ): PromiseLike<GetMessagesAndFilesResult>;

  getContainerMessagesActivitiesFilesAndReactions(
    containerType,
    containerId,
    page,
    limit,
    userId: Id
  ): PromiseLike<GetMessagesAndActivitiesResult>;

  getTaskSourceDataByMessageIds(messageIds: Id[]): PromiseLike<TaskSourceDataByMessageId>;
  getNeighbouringMessages(id: Id, limitCount: number, userId: Id): PromiseLike<GetNeighbouringMessagesResult>;
}
