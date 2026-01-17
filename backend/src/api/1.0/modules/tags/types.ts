import { TagDbRow } from "../db/schema";
import { Id } from "../common/identifier";

export enum CreateTagResultStatus {
  OK, TAG_ALREADY_EXISTS
}

export interface CreateTagResult {
  status: CreateTagResultStatus;
  tag?: Partial<TagDbRow>
}

export enum UpdateTagResultStatus {
  OK, TAG_NOT_EXISTS
}

export interface DeleteTagResult {
  status: DeleteTagResultStatus;
}

export enum DeleteTagResultStatus {
  OK, TAG_NOT_EXISTS
}

export interface UpdateTagResult {
  status: UpdateTagResultStatus
}

export enum GetOrganizationTagsResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
}

export interface GetOrganizationTagsResult {
  status: GetOrganizationTagsResultStatus,
  organizationTags?: Array<TagDbRow>,
}

export interface TaskTagIdsMap {
  [taskId: string]: Id[],
}

export interface TaskTagsMap {
  [taskId: string]: TagDbRow[],
}

export interface TagJson {
  id: Id,
  name: string,
  color: string,
  organizationId: string,
}

export interface TagsProjectIdsMap {
  [tagId: string]: Id[],
}
export interface TagsTaskIdsMap {
  [tagId: string]: Id[],
}

export enum GetTagsUsageStatisticsResultStatus {
  OK
}

export interface GetTagsUsageStatisticsResult {
  status: GetTagsUsageStatisticsResultStatus,
  tagsProjectIds: TagsProjectIdsMap,
  tagsTaskIds: TagsTaskIdsMap,
}
