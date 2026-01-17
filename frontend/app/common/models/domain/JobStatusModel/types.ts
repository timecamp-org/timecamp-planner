import { ImmutableMap } from 'common/types';
import { Id } from 'common/utils/identifier';
import { TypedRecord } from 'typed-immutable-record';

export interface JobStatusInterface {
  id: Id,
  userId?: Id,
  organizationId?: Id,
  namespace: JobNamespace,
  jobsSpawned: number,
  jobsDone: number,
  iterationCount: number,
  isFailed: boolean,
  createdAt?: Date,
  updatedAt?: Date, 
}

export interface JobStatusRecordInterface extends TypedRecord<JobStatusRecordInterface>, JobStatusInterface { }

export type JobStatusData = Map<string, JobStatusRecordInterface>

export interface JobStatusState extends ImmutableMap<string, any> {
  jobStatusData: JobStatusData,
}

export enum JobNamespace {
  ARCHIVE_NOTIFICATIONS = 'archive_notifications',
  TRELLO_DATA_IMPORT = 'trello_data_import',
}
