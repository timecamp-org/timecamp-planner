import * as Constants from './constants'
import { action } from 'typesafe-actions'
import { JobStatusInterface, JobStatusRecordInterface } from './types'
import { Id } from 'common/utils/identifier'
import { JobStatus } from './models'
import { getMapOfRecords } from 'common/utils/immutableUtils'

export const onInit = () =>
  action(Constants.onInit)

export const onUpdateJobStatusData = (jobStatus: JobStatusInterface) =>
  action(Constants.onUpdateJobStatusData, { jobStatus })
export const onUpdateJobStatusDataSuccess = (jobStatus: JobStatusInterface) =>
  action(Constants.onUpdateJobStatusDataSuccess, { jobStatus })

export const onFetchJobStatuses = (userId: Id, organizationId: Id) =>
  action(Constants.onFetchJobStatuses, { userId, organizationId })

export const onFetchJobStatusesSuccess = (jobStatuses: JobStatusInterface[]) => {
  const jobStatusData = getMapOfRecords<JobStatusInterface, JobStatusRecordInterface>(jobStatuses, JobStatus)
  return action(Constants.onFetchJobStatusesSuccess, { jobStatusData })
}

