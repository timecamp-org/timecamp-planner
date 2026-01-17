import Table, { UniqueKey } from '../db/Table';
import { first, zipObject } from 'lodash';
import { Id } from '../common/identifier';
import { ProjectHasTagDbRow, TagDbRow, TaskHasTagDbRow } from '../db/schema';
import { violatesUniqueKey } from '../../../../utils';
import { inject, injectable } from 'inversify';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { TagServiceInterface } from './TagServiceInterface';
import {
  CreateTagResult,
  CreateTagResultStatus,
  DeleteTagResult,
  DeleteTagResultStatus,
  GetOrganizationTagsResult,
  GetOrganizationTagsResultStatus,
  GetTagsUsageStatisticsResult,
  GetTagsUsageStatisticsResultStatus,
  TagJson,
  TagsProjectIdsMap,
  TagsTaskIdsMap,
  TaskTagIdsMap,
  UpdateTagResult,
  UpdateTagResultStatus,
  TaskTagsMap,
} from './types';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';

import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { reverse } from 'lodash';

@injectable()
class TagService implements TagServiceInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getTag(id: Id): Promise<TagDbRow> {
    const tags: Array<TagDbRow> = await this.connection
      .getQueryBuilder()
      .select()
      .from(Table.TAG)
      .where('id', id);
    return first(tags);
  }

  async getTags(ids: Id[]): Promise<TagDbRow[]> {
    return await this.connection
      .getQueryBuilder()
      .select()
      .from(Table.TAG)
      .whereIn('id', ids);
  }

  async updateTag(id: Id, tagJson: TagJson): Promise<UpdateTagResult> {
    try {
      const updatedTagsCount = await this.connection
        .getQueryBuilder()
        .from(Table.TAG)
        .where('id', id)
        .update(tagJson);

      if (updatedTagsCount < 1) {
        return { status: UpdateTagResultStatus.TAG_NOT_EXISTS };
      } else {
        return { status: UpdateTagResultStatus.OK };
      }
    } catch (error) {
      throw error;
    }
  }

  async createTag(id: Id, tagJson: TagJson): Promise<CreateTagResult> {
    tagJson.id = id;

    try {
      const tags: Array<TagDbRow> = await this.connection
        .getQueryBuilder()
        .insert(tagJson)
        .into(Table.TAG)
        .returning('*');

      if (tags.length < 1) {
        return null;
      }
      return { status: CreateTagResultStatus.OK, tag: tags[0] };
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.TAG_ID)) {
        return { status: CreateTagResultStatus.TAG_ALREADY_EXISTS };
      }
      throw error;
    }
  }

  async createTags(tags: TagDbRow[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query.insert(tags).into(Table.TAG).returning('*');
  }

  async deleteTag(id: Id): Promise<DeleteTagResult> {
    const deletedTagsCount = await this.connection
      .getQueryBuilder()
      .from(Table.TAG)
      .where({ id })
      .del();

    if (deletedTagsCount < 1) {
      return { status: DeleteTagResultStatus.TAG_NOT_EXISTS };
    }

    return { status: DeleteTagResultStatus.OK };
  }

  /**
   * @param {Id} organizationId
   * @return {Promise<GetOrganizationTagsResult>}
   */
  async getOrganizationTags(
    organizationId: Id,
    trx?: Transaction
  ): Promise<GetOrganizationTagsResult> {
    const organization = await this.organizationProvider.getOrganization(
      organizationId,
      trx
    );

    if (!organization) {
      return {
        status: GetOrganizationTagsResultStatus.ORGANIZATION_NOT_FOUND,
      };
    }

    const query = this.connection.getQueryWithTransaction(trx);

    const organizationTags = await query
      .table(Table.TAG)
      .select()
      .where({ organization_id: organizationId })
      .returning('*');

    return {
      status: GetOrganizationTagsResultStatus.OK,
      organizationTags,
    };
  }

  async getTasksTagsIds(
    taskIds: Id[],
    trx?: Transaction
  ): Promise<TaskTagIdsMap> {
    try {
      const taskTagsIds = await this.connection
        .getQueryWithTransaction(trx)
        .from(Table.TASK_HAS_TAG)
        .select('*')
        .whereIn('task_id', taskIds);

      // TODO: ugly workaround. Provice crated_at to task_has_tag table and sort
      if (taskIds.length === 1) {
        reverse(taskTagsIds);
      }

      return taskTagsIds.reduce(
        (acc, row) => {
          const { taskId, tagId } = row;
          acc[taskId].push(tagId);
          return acc;
        },
        zipObject(
          taskIds,
          taskIds.map(() => [])
        )
      ); // prepare initial reduce value: object with keys from taskIds and values being empty arrays
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getTasksTags(taskIds: Id[]): Promise<TaskTagsMap> {
    const tagsDataWithTaskIds = await this.connection
      .getQueryBuilder()
      .select(`${Table.TAG}.*`, `${Table.TASK_HAS_TAG}.taskId`)
      .from(Table.TAG)
      .join(
        Table.TASK_HAS_TAG,
        `${Table.TASK_HAS_TAG}.tagId`,
        `${Table.TAG}.id`
      )
      .whereIn(`${Table.TASK_HAS_TAG}.taskId`, taskIds);

    return tagsDataWithTaskIds.reduce((acc, tag) => {
      const { taskId, ...tagData } = tag;
      if (acc[taskId]) {
        acc[taskId].push(tagData);
      } else {
        acc[taskId] = [tagData];
      }

      return acc;
    }, {} as TaskTagsMap);
  }

  async getTagsTaskIds(organizationId: Id): Promise<TagsTaskIdsMap> {
    const tagsTaskIds = await this.connection
      .getQueryBuilder()
      .select('taskId', 'tagId')
      .from(Table.TASK_HAS_TAG)
      .join(Table.TAG, 'id', 'tagId')
      .where({ organizationId });

    return tagsTaskIds.reduce((result, row: TaskHasTagDbRow) => {
      const { taskId, tagId } = row;
      if (!result[tagId]) {
        result[tagId] = [];
      }
      result[tagId].push(taskId);
      return result;
    }, {});
  }

  async getTagsProjectIds(organizationId: Id): Promise<TagsProjectIdsMap> {
    const tagsProjectIds = await this.connection
      .getQueryBuilder()
      .select('projectId', 'tagId')
      .from(Table.PROJECT_HAS_TAG)
      .join(Table.TAG, 'id', 'tagId')
      .where({ organizationId });

    return tagsProjectIds.reduce((result, row: ProjectHasTagDbRow) => {
      const { projectId, tagId } = row;
      if (!result[tagId]) {
        result[tagId] = [];
      }
      result[tagId].push(projectId);
      return result;
    }, {});
  }

  async getTagsUsageStatistics(
    organizationId: Id
  ): Promise<GetTagsUsageStatisticsResult> {
    const promises = [
      this.getTagsProjectIds(organizationId),
      this.getTagsTaskIds(organizationId),
    ];

    const [tagsProjectIds, tagsTaskIds] = await Promise.all(promises);
    return {
      status: GetTagsUsageStatisticsResultStatus.OK,
      tagsProjectIds,
      tagsTaskIds,
    };
  }
}

export default TagService;
