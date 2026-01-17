import { JobStatusInterface, JobStatusRecordInterface } from './types'
import { makeTypedFactory } from "typed-immutable-record";

const defaultJobStatus: JobStatusInterface = {
  id: undefined,
  userId: undefined,
  organizationId: undefined,
  namespace: undefined,
  jobsSpawned: undefined,
  jobsDone: undefined,
  iterationCount: undefined,
  isFailed: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}

export const JobStatus = makeTypedFactory<
  JobStatusInterface | JobStatusRecordInterface,
  JobStatusRecordInterface
>
  (defaultJobStatus);
