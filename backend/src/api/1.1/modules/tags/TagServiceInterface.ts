import { Id } from '../common/identifier';
import { TagDbRow } from '../db/schema';
import {
  TagJson,
  UpdateTagResult,
  CreateTagResult,
  DeleteTagResult,
  TaskTagIdsMap,
  GetOrganizationTagsResult,
  TagsTaskIdsMap,
  TagsProjectIdsMap,
  GetTagsUsageStatisticsResult,
  TaskTagsMap,
} from './types';

export interface TagServiceInterface {
  getTag(id: Id): Promise<TagDbRow>;
  getTags(ids: Id[]): Promise<TagDbRow[]>;
  updateTag(id: Id, tagJson: TagJson): Promise<UpdateTagResult>;
  createTag(id: Id, tagJson: TagJson): Promise<CreateTagResult>;
  createOrGetTagByNameForOrganization(tagJson: TagJson): Promise<TagDbRow>;
  deleteTag(id: Id): Promise<DeleteTagResult>;
  getTasksTagsIds(taskIds: Id[], trx?: Transaction): Promise<TaskTagIdsMap>;
  getTasksTags(taskIds: Id[]): Promise<TaskTagsMap>;
  getOrganizationTags(organizationId: Id, trx?: Transaction): Promise<GetOrganizationTagsResult>;
  getTagsTaskIds(organizationId: Id): Promise<TagsTaskIdsMap>;
  getTagsProjectIds(organizationId: Id): Promise<TagsProjectIdsMap>;
  getTagsUsageStatistics(organizationId: Id): Promise<GetTagsUsageStatisticsResult>;
  createTags(tags: TagDbRow[], trx?: Transaction): Promise<void>;
}
