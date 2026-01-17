import Table, { UniqueKey } from '../db/Table';
import { Id } from '../common/identifier';
import { chain, first, includes, omit } from 'lodash';
import {
  EncodedPaginationToken,
  PaginatedResults,
  ComparatorType,
  StandardPaginationToken,
  StandardPaginatorOptions,
} from '../pagination/types';

import {
  ActivityDbRow,
  MessageContainerProjectDbRow,
  MessageContainerTaskDbRow,
  MessageDbRow,
  MessageFileDbRow,
  MessageHailDbRow,
  MessageHailType,
  MessageMentionsUserDbRow,
  MessageReactionDbRow,
  TaskDbRow,
  MessageContainerType,
} from '../db/schema';
import { NamingConvention, violatesUniqueKey } from '../../../../utils';
import { inject, injectable } from 'inversify';
import { PaginationServiceInterface } from '../pagination/interfaces/PaginationServiceInterface';
import { PaginationModule } from '../pagination/PaginationModule';
import { FilesModule } from '../files/FilesModule';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { CommonModule } from '../common/CommonModule';
import { MessageServiceInterface } from './interfaces/MessageServiceInterface';
import {
  AddReactionResult,
  AddReactionStatus,
  ContainerLatestMessageDescriptor,
  CreateMessageResult,
  CreateMessageStatus,
  DeleteMessageResult,
  DeleteMessageStatus,
  DeleteReactionResult,
  DeleteReactionStatus,
  EditableMessageFields,
  GetContainerMessagesResult,
  GetContainerMessagesStatus,
  GetHailResult,
  GetHailStatus,
  GetMentionsResult,
  GetMentionsStatus,
  GetMessagesAndActivitiesResult,
  GetMessagesAndFilesResult,
  GetMessagesFilesResult,
  GetMetadataResult,
  GetMetadataStatus,
  GetUserLastReadResult,
  GetUserMetadataStatus,
  MessageContainer,
  MessageJson,
  MessageWithContainerResult,
  MessageWithContainerStatus,
  MetaDataOptionalParams,
  ReactionJson,
  TaskSourceDataByMessageId,
  UpdateMessageMetadataResult,
  UpdateMessageMetadataStatus,
  UpdateMessageResult,
  UpdateMessageStatus,
  GetContainersLatestMessageIdWithDateResult,
} from './types';
import { MessagesModule } from './MessagesModule';
import { MessageContainerServiceInterface } from './interfaces/MessageContainerServiceInterface';
import { DbModule } from '../db/DbModule';
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import ConventionConverter = NamingConvention.ConventionConverter;
import { ActivityProviderInterface } from '../activities/interfaces/ActivityProviderInterface';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { getLastPage, getComparator } from '../pagination/utils';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { ProjectService } from '../projects/ProjectService';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';

@injectable()
export class MessageService implements MessageServiceInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(PaginationModule.StandardPaginationService)
    private standardPaginationService: PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,
    @inject(MessagesModule.MessageContainerServiceInterface)
    private messageContainerService: MessageContainerServiceInterface,
    @inject(FilesModule.FileProviderInterface)
    protected fileProvider: FileProviderInterface,
    @inject(DbModule.NamingConverter)
    protected dbNamingConvention: ConventionConverter,
    @inject(ActivitiesModule.ActivityProviderInterface)
    private activityProvider: ActivityProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectsProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface
  ) {}

  public async getMessage(id): Promise<MessageDbRow> {
    const message: MessageDbRow = await this.connection.getQueryBuilder().first().from(Table.MESSAGE).where('id', id);

    return message;
  }

  public async getMessageWithContainer(id: Id, fetchContainer: boolean): Promise<MessageWithContainerResult> {
    // return null;
    const message = await this.getMessage(id);
    if (!message) {
      return { status: MessageWithContainerStatus.MESSAGE_NOT_FOUND };
    }

    let container: MessageContainer;
    if (fetchContainer) {
      container = await this.messageContainerService.getContainerInstance(message);
    } else {
      container = await this.messageContainerService.getContainerForMessage(message);
    }

    if (!container) {
      return { status: MessageWithContainerStatus.CONTAINER_DOES_NOT_EXIST };
    }

    return {
      status: MessageWithContainerStatus.OK,
      container,
      message,
    };
  }

  public async getHails(messageId: Id): Promise<GetHailResult> {
    const message = await this.getMessage(messageId);
    if (!message) {
      return { status: GetHailStatus.MESSAGE_NOT_FOUND };
    }
    const hails = await this.connection
      .getQueryBuilder()
      .select('hailType')
      .from(Table.MESSAGE_HAIL)
      .where('messageId', messageId)
      .pluck('hail_type');
    return {
      status: GetHailStatus.OK,
      hails,
    };
  }

  public async getMentions(messageId: Id): Promise<GetMentionsResult> {
    const message = await this.getMessage(messageId);
    if (!message) {
      return { status: GetMentionsStatus.MESSAGE_NOT_FOUND };
    }
    const mentionedUserIds = await this.connection
      .getQueryBuilder()
      .select('userId')
      .from(Table.MESSAGE_MENTIONS_USER)
      .where('messageId', messageId)
      .pluck('user_id');
    return {
      status: GetMentionsStatus.OK,
      mentionedUserIds,
    };
  }

  public async createMessage(id: Id, senderId: Id, messageJson: MessageJson): Promise<CreateMessageResult> {
    try {
      const { containerType, containerId } = messageJson;
      const container = this.messageContainerService.getContainer(containerType, containerId);

      const organizationId = await this.messageContainerService.getOrganizationIdFromContainer(
        containerType,
        containerId
      );
      if (!organizationId) {
        return {
          status: CreateMessageStatus.CONTAINER_NOT_FOUND,
        };
      }
      const messageRow: Partial<MessageDbRow> = {
        id,
        ...omit<Partial<MessageJson>>(messageJson, [
          'senderId',
          'mentionedUserIds',
          'hails',
          'attachments',
          'organizationId',
        ]),
        senderId: senderId,
        createdAt: messageJson.createdAt
          ? this.timeService.getDateFromString(messageJson.createdAt)
          : this.timeService.getCurrentTime(),
        organizationId: organizationId ? organizationId : messageJson.organizationId,
      };
      const messageContainerRow: Partial<MessageContainerProjectDbRow | MessageContainerTaskDbRow> = {
        [container.idColumn]: containerId,
      };
      const table: Table = container.relTable;

      const connection = this.connection.getConnection();
      const message = await connection.transaction(async (trx) => {
        const messages = await connection.insert(messageRow, '*').transacting(trx).into(Table.MESSAGE).returning('*');
        const message = first<Partial<MessageDbRow>>(messages);
        messageContainerRow.messageId = message.id;
        await connection.insert(messageContainerRow, '*').transacting(trx).into(table);
        await Promise.all([
          messageJson.mentionedUserIds?.length > 0 && this.doAddMentions(trx, message.id, messageJson.mentionedUserIds),
          messageJson.hails?.length > 0 && this.doAddHails(trx, message.id, messageJson.hails),
          messageJson.attachments?.length > 0 && this.doAddMessageAttachments(trx, message.id, messageJson.attachments),
          this.doUpdateMessageMetadata(trx, container.lastReadTable, container, senderId, messageRow.createdAt, {
            messageId: id,
          }),
        ]);

        return message;
      });

      if (containerType === MessageContainerType.PROJECT) {
        const project = await this.projectsProvider.getProject(containerId);
        const isConversation = ProjectService.isProjectConversation(project);

        if (isConversation) {
          await this.showHiddenConversationsToRecipients(project.id, organizationId, senderId);
        }
      }

      return { status: CreateMessageStatus.OK, message };
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.MESSAGE_ID)) {
        return { status: CreateMessageStatus.MESSAGE_ALREADY_EXISTS };
      }
      throw error;
    }
  }

  private async showHiddenConversationsToRecipients(projectId: Id, organizationId: Id, senderId: Id): Promise<void> {
    const conversationPeople = await this.projectPeopleService.getProjectPeople(projectId);
    const peopleIds = conversationPeople.map((role) => role.userId);
    const conversationHash = this.conversationService.generateConversationHash(organizationId, peopleIds);
    const conversationsSettings = await this.conversationService.getConversationsSettingsByHash(conversationHash);

    const conversationsToShow = conversationsSettings.filter((settings) => !settings.isVisible);

    const updateConversationPromises = conversationsToShow.map((settings) =>
      this.conversationService.updateConversationSettings(settings.userId, conversationHash, organizationId, {
        isVisible: true,
      })
    );
    await Promise.all(updateConversationPromises);
  }

  private async doAddMentions(trx: Transaction, messageId: Id, userIds: Id[]) {
    if (!userIds) {
      return;
    }
    const messageMentionRows = userIds.map<MessageMentionsUserDbRow>((userId) => ({
      userId: userId,
      messageId: messageId,
    }));

    // Inserting user mentions
    await this.connection.getQueryWithTransaction(trx).insert(messageMentionRows).into(Table.MESSAGE_MENTIONS_USER);
  }

  private async doAddMessageAttachments(trx: Transaction, messageId: Id, attachmentsIds: Id[]) {
    if (!attachmentsIds) {
      return;
    }
    const messageAttachments = attachmentsIds.map<MessageFileDbRow>((fileId) => ({
      fileId: fileId,
      messageId: messageId,
    }));

    await this.connection.getQueryWithTransaction(trx).insert(messageAttachments).into(Table.MESSAGE_FILE);
  }

  private async doAddHails(trx: Transaction, messageId: Id, hailTypes: MessageHailType[]) {
    if (!hailTypes) {
      return;
    }
    const rows = hailTypes.map<MessageHailDbRow>((hailType) => ({
      messageId,
      hailType: hailType === MessageHailType.PROJECT ? MessageHailType.SPACE : hailType,
    }));

    await this.connection.getQueryWithTransaction(trx).insert(rows).into(Table.MESSAGE_HAIL);
  }

  public async updateMessage(id: Id, editorId: Id, messageJson: MessageJson): Promise<UpdateMessageResult> {
    try {
      let updatedMessageFields = {};

      if (messageJson.content) {
        updatedMessageFields = {
          content: messageJson.content,
          editorId: editorId,
          editedAt: this.timeService.getCurrentTime(),
        };
      }

      Object.keys(messageJson).forEach((key) => {
        if (includes(EditableMessageFields, key)) {
          updatedMessageFields[key] = messageJson[key];
        }
      });

      const updatedMessagesCount = await this.connection
        .getQueryBuilder()
        .from(Table.MESSAGE)
        .where('id', id)
        .update(updatedMessageFields);

      if (updatedMessagesCount < 1) {
        return { status: UpdateMessageStatus.MESSAGE_NOT_FOUND };
      } else {
        return { status: UpdateMessageStatus.OK };
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async addReaction(
    messageId: Id,
    userId: Id,
    reactionId: Id,
    reactionJson: ReactionJson
  ): Promise<AddReactionResult> {
    try {
      const message = await this.connection.getQueryBuilder().first().from(Table.MESSAGE).where('id', messageId);

      if (!message) {
        return { status: AddReactionStatus.MESSAGE_NOT_FOUND };
      }

      const reaction = first(
        await this.connection
          .getQueryBuilder()
          .insert(
            {
              emojiCode: reactionJson.emojiCode,
              userId: userId,
              id: reactionId,
              messageId: messageId,
            },
            '*'
          )
          .into(Table.MESSAGE_REACTION)
      );

      return { status: AddReactionStatus.OK, reaction };
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.MESSAGE_REACTION_ID)) {
        return { status: AddReactionStatus.REACTION_ALREADY_EXISTS };
      } else if (violatesUniqueKey(error, UniqueKey.MESSAGE_REACTION_FOR_USER)) {
        return { status: AddReactionStatus.REACTION_FOR_USER_EXISTS };
      } else {
        throw error;
      }
    }
  }

  public async getReaction(reactionId: Id): Promise<MessageReactionDbRow> {
    return await this.connection
      .getQueryBuilder()
      .select()
      .from(Table.MESSAGE_REACTION)
      .where({
        id: reactionId,
      })
      .first();
  }

  public async deleteReaction(userId: Id, reactionId: Id): Promise<DeleteReactionResult> {
    try {
      const affectedRowsNumber = await this.connection
        .getQueryBuilder()
        .from(Table.MESSAGE_REACTION)
        .where('id', reactionId)
        .where('userId', userId)
        .del();

      if (affectedRowsNumber === 0) {
        return { status: DeleteReactionStatus.REACTION_NOT_FOUND };
      } else {
        return { status: DeleteReactionStatus.OK };
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async deleteMessage(id): Promise<DeleteMessageResult> {
    const deletedMessagesCount = await this.connection.getQueryBuilder().from(Table.MESSAGE).where('id', id).del();

    if (deletedMessagesCount < 1) {
      return { status: DeleteMessageStatus.MESSAGE_NOT_FOUND };
    } else {
      return { status: DeleteMessageStatus.OK };
    }
  }

  public async getProjectsLatestMessageIdWithDate(
    projectIds: Id[]
  ): Promise<GetContainersLatestMessageIdWithDateResult> {
    const q = this.connection
      .getQueryBuilder()
      .select('id as messageId', 'createdAt', 'containerId')
      .from(Table.MESSAGE)
      .whereIn('containerId', projectIds)
      .orderBy('createdAt', 'desc');

    const result = await q;

    const containerLatestMessagesMap = chain(result).groupBy('containerId').value();

    const parsedResults = Object.values(containerLatestMessagesMap).map(
      (values) => values[0]
    ) as ContainerLatestMessageDescriptor[];

    return {
      status: GetContainerMessagesStatus.OK,
      result: parsedResults,
    };
  }

  public async getContainerMessages(
    containerType: MessageContainerType,
    containerId: Id,
    page: string,
    limit: number
  ): Promise<GetContainerMessagesResult> {
    const container = this.messageContainerService.getContainer(containerType, containerId);
    const containerInstance = await this.messageContainerService.getInstance(container);

    if (!containerInstance.instance) {
      return { status: containerInstance.notFoundStatus };
    }

    const subQuery = this.connection
      .getQueryBuilder()
      .select('messageId')
      .from(container.relTable)
      .where(container.idColumn, container.id);
    const messages = await this.getMessagesBySubquery(subQuery, page, limit);

    return { status: GetContainerMessagesStatus.OK, messages };
  }

  protected async getMessagesBySubquery(
    subQuery: QueryBuilder,
    paginationToken: EncodedPaginationToken,
    limit?: number
  ): Promise<PaginatedResults<MessageDbRow>> {
    const query = this.connection.getQueryBuilder().select().from(Table.MESSAGE).whereIn('id', subQuery);
    const paginator = this.standardPaginationService.getPaginator(paginationToken, {
      limit,
      columns: ['createdAt', 'id'],
    });

    return await paginator.execute<MessageDbRow>(query);
  }

  public async updateMessageRead(
    containerType,
    containerId,
    userId,
    messageId: Id
  ): Promise<UpdateMessageMetadataResult> {
    const message = await this.getMessage(messageId);
    if (!message) {
      return { status: UpdateMessageMetadataStatus.MESSAGE_NOT_FOUND };
    }
    const container = this.messageContainerService.getContainer(containerType, containerId);
    const optionalParams: MetaDataOptionalParams = { messageId };
    return this.connection
      .getConnection()
      .transaction(async (trx) =>
        this.doUpdateMessageMetadata(trx, container.lastReadTable, container, userId, message.createdAt, optionalParams)
      );
  }

  public async updateKeyPress(
    containerType,
    containerId,
    userId,
    resetTimestamp?: boolean
  ): Promise<UpdateMessageMetadataResult> {
    const container = this.messageContainerService.getContainer(containerType, containerId);
    const timestamp = resetTimestamp ? null : this.timeService.getCurrentTime();
    return this.connection
      .getConnection()
      .transaction(async (trx) =>
        this.doUpdateMessageMetadata(trx, container.keypressTable, container, userId, timestamp)
      );
  }

  public async doUpdateMessageMetadata(
    trx: Transaction,
    metadataTable: Table,
    container: MessageContainer,
    userId,
    timestamp: Date,
    optionalParams: MetaDataOptionalParams = {}
  ): Promise<UpdateMessageMetadataResult> {
    const connection = this.connection.getConnection();

    const params = {
      table: metadataTable,
      column: container.idColumn,

      containerId: connection.raw('?', container.id),
      userId: connection.raw('?', userId),
      timestamp: connection.raw('?', timestamp ? timestamp.toISOString() : timestamp),
    };

    const optionalParamsKeys = Object.keys(optionalParams);
    const optionalParamsColumns = optionalParamsKeys.map(
      this.dbNamingConvention.convertIdentifier.bind(this.dbNamingConvention)
    );

    let optionalColumnsString = '';
    let optionalKeysString = '';
    let optionalValuesString = '';

    optionalParamsColumns.forEach((key) => {
      optionalColumnsString += `, ${key}`;
    });

    optionalParamsKeys.forEach((key) => {
      optionalKeysString += `, :${key}:`;
    });

    optionalParamsKeys.forEach((key, index) => {
      const column = optionalParamsColumns[index];
      optionalValuesString += `, ${column} = :${key}:`;
      params[key] = connection.raw('?', optionalParams[key]);
    });

    await trx.raw(
      `INSERT INTO :table: (:column:, user_id, timestamp ${optionalColumnsString})` +
        `VALUES (:containerId:, :userId:, :timestamp: ${optionalKeysString})` +
        'ON CONFLICT (:column:, user_id) DO UPDATE SET ' +
        `timestamp = :timestamp: ${optionalValuesString}`,
      params
    );

    return { status: UpdateMessageMetadataStatus.OK };
  }

  public async getContainerMetadata(containerType: MessageContainerType, containerId: Id): Promise<GetMetadataResult> {
    const container = this.messageContainerService.getContainer(containerType, containerId);
    const containerInstance = await this.messageContainerService.getInstance(container);

    if (!containerInstance.instance) {
      return { status: GetMetadataStatus.CONTAINER_NOT_FOUND };
    }

    const queries = [
      // 0 - message read
      this.connection.getQueryBuilder().select().from(container.lastReadTable).where(container.idColumn, container.id),
      // 1 - key press
      this.connection.getQueryBuilder().select().from(container.keypressTable).where(container.idColumn, container.id),
    ];

    const data = await Promise.all(queries);

    return {
      status: GetMetadataStatus.OK,
      lastRead: data[0],
      lastKeyPress: data[1],
    };
  }

  public async getUserContainerLastRead(userId, containerType, containerId): Promise<GetUserLastReadResult> {
    const container = this.messageContainerService.getContainer(containerType, containerId);
    const containerInstance = await this.messageContainerService.getInstance(container);

    if (!containerInstance.instance) {
      return { status: GetUserMetadataStatus.CONTAINER_NOT_FOUND };
    }

    const lastRead = await this.connection
      .getQueryBuilder()
      .select()
      .from(container.lastReadTable)
      .where(container.idColumn, container.id)
      .where('user_id', userId)
      .first();

    return {
      status: GetUserMetadataStatus.OK,
      lastRead,
    };
  }

  public async getContainerUnreadMessagesCount(containerType, containerId, userId): Promise<number> {
    const containerLastReadResult = await this.getUserContainerLastRead(userId, containerType, containerId);

    const container = this.messageContainerService.getContainer(containerType, containerId);
    const containerInstance = await this.messageContainerService.getInstance(container);

    if (!containerInstance.instance) {
      return null;
    }

    if (containerLastReadResult.lastRead) {
      return await this.connection
        .getQueryBuilder()
        .count('messageId')
        .from(container.relTable)
        .innerJoin(Table.MESSAGE, `${container.relTable}.message_id`, `${Table.MESSAGE}.id`)
        .where(container.idColumn, container.id)
        .andWhere('createdAt', '>', containerLastReadResult.lastRead.timestamp)
        .first()
        .then((result) => parseInt(result.count as string));
    } else {
      return null;
    }
  }

  public async getContainerMessagesFilesAndReactions(
    containerType,
    containerId,
    page,
    limit,
    userId,
    getAllUnreadMessages = false
  ): Promise<GetMessagesAndFilesResult> {
    if (getAllUnreadMessages) {
      const count = await this.getContainerUnreadMessagesCount(containerType, containerId, userId);
      limit = Math.max(count, limit);
    }

    const messageQueryResult = await this.getContainerMessages(containerType, containerId, page, limit);
    if (messageQueryResult.status !== GetContainerMessagesStatus.OK) {
      return { status: messageQueryResult.status };
    }

    const messages = messageQueryResult.messages.results;
    const messagesIds = messages.map((message) => message.id);

    const [{ files, attachments }, reactions, taskSourceDataByMessageIds, containerLastReadResult] = await Promise.all([
      this.getMessagesFiles(messagesIds),
      this.getMessagesReactions(messagesIds),
      this.getTaskSourceDataByMessageIds(messagesIds),
      this.getUserContainerLastRead(userId, containerType, containerId),
    ]);

    return {
      status: GetContainerMessagesStatus.OK,
      messages,
      files,
      reactions,
      attachments,
      taskSourceDataByMessageIds,
      lastRead: containerLastReadResult.lastRead,
      nextPage: messageQueryResult.messages.nextPage,
    };
  }

  public async getContainerMessagesActivitiesFilesAndReactions(
    containerType,
    containerId,
    page,
    limit,
    userId
  ): Promise<GetMessagesAndActivitiesResult> {
    const result = await this.getContainerMessagesAndActivities(containerType, containerId, page, limit);
    if (result.status !== GetContainerMessagesStatus.OK) {
      return result;
    }

    const messagesIds = result.messages.map((message) => message.id);
    const { files, attachments } = await this.getMessagesFiles(messagesIds);
    const reactions = await this.getMessagesReactions(messagesIds);
    const containerLastReadResult = await this.getUserContainerLastRead(userId, containerType, containerId);

    return {
      ...result,
      files,
      reactions,
      attachments: attachments,
      lastRead: containerLastReadResult.lastRead,
    };
  }

  public async getMessagesFiles(messagesIds): Promise<GetMessagesFilesResult> {
    const attachments = await this.connection
      .getQueryBuilder()
      .from(Table.MESSAGE_FILE)
      .select()
      .whereIn('messageId', messagesIds);

    const filesIds = attachments.map((messageFile) => messageFile.fileId);
    const files = await this.fileProvider.getFilesByIds(filesIds);

    return { files, attachments };
  }

  public async getMessagesReactions(messagesIds): Promise<Array<MessageReactionDbRow>> {
    const messagesReactions = await this.connection
      .getQueryBuilder()
      .from(Table.MESSAGE_REACTION)
      .select()
      .whereIn('messageId', messagesIds);

    return messagesReactions;
  }

  public async getContainerMessagesAndActivities(
    containerType,
    containerId,
    page,
    limit
  ): Promise<GetMessagesAndActivitiesResult> {
    const container = this.messageContainerService.getContainer(containerType, containerId);

    const containerInstance = await this.messageContainerService.getInstance(container);

    if (!containerInstance) {
      return { status: container.notFoundStatus };
    }

    const messageContainerQuery = this.connection
      .getQueryBuilder()
      .select('messageId')
      .from(container.relTable)
      .where(container.idColumn, container.id);
    const activityContainerQuery = this.connection
      .getQueryBuilder()
      .select('activityId')
      .from(container.activityTable)
      .where(container.idColumn, container.id);
    return await this.getMessagesAndActivitiesByIds(messageContainerQuery, activityContainerQuery, page, limit);
  }

  public async getMessagesAndActivitiesByIds(
    messageQuery: QueryBuilder,
    activityQuery: QueryBuilder,
    page,
    limit
  ): Promise<GetMessagesAndActivitiesResult> {
    const messagesQuery = this.connection.getQueryBuilder().from(Table.MESSAGE).select().whereIn('id', messageQuery);

    const activitiesQuery = this.connection
      .getQueryBuilder()
      .from(Table.ACTIVITY)
      .select()
      .whereIn('id', activityQuery);

    const changedProps = await this.connection
      .getQueryBuilder()
      .from(Table.ACTIVITY_CHANGED_PROP)
      .select()
      .whereIn('activityId', activityQuery);

    const paginator = this.standardPaginationService.getPaginator(page, { limit, columns: ['createdAt', 'id'] });

    const paginatedResults = await Promise.all([paginator.execute(messagesQuery), paginator.execute(activitiesQuery)]);

    const lastPageToken = getLastPage(paginatedResults, this.getMessageAndActivitiesComparator());

    const activityTargetIds = await this.activityProvider.getActivityIdTargetIdMap(
      paginatedResults[1].results as ActivityDbRow[]
    );

    return {
      status: GetContainerMessagesStatus.OK,
      messages: paginatedResults[0].results,
      activities: paginatedResults[1].results,
      activityTargetIds,
      changedProps: changedProps,
      nextPage: lastPageToken,
    };
  }

  async getTaskSourceDataByMessageIds(messageIds: Id[]): Promise<TaskSourceDataByMessageId> {
    const tasksFromMessageSourceData = await this.connection
      .getQueryBuilder()
      .select('id', 'sourceMessageId', 'projectId')
      .from(Table.TASK)
      .whereIn('sourceMessageId', messageIds);

    return tasksFromMessageSourceData.reduce(
      (taskSourceDataByMessageIds: TaskSourceDataByMessageId, task: Partial<TaskDbRow>) => {
        taskSourceDataByMessageIds[task.sourceMessageId] = {
          taskId: task.id,
          projectId: task.projectId,
        };
        return taskSourceDataByMessageIds;
      },
      {}
    );
  }

  protected getMessageAndActivitiesComparator(): ComparatorType {
    return getComparator('desc', ['createdAt', 'id']);
  }
}
