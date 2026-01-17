import { TaskDbRow, ActivityDbRow, ProjectDbRow } from "../db/schema";
import { EncodedPaginationToken } from "../pagination/types";

/******************************************
 * DB data types
 ******************************************/

export interface TaskChanges {
 old: Partial<TaskDbRow>,
 new: Partial<TaskDbRow>,
}

export interface Changes {
  old: Partial<TaskDbRow | ProjectDbRow>,
  new: Partial<TaskDbRow | ProjectDbRow>,
 }

 /******************************************
  * Service return types
  ******************************************/
 export enum GetActivitiesResultStatus {
  OK,
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  LIST_NOT_FOUND = 'LIST_NOT_FOUND',
  NOT_IMPLEMENTED_CONTAINER_TYPE = 'NOT_IMPLEMENTED_CONTAINER_TYPE',
 }

 export interface GetActivitiesResult {
  status: GetActivitiesResultStatus,
  activities?: Array<ActivityDbRow>,
  nextPage?: EncodedPaginationToken
 }

 /** */
