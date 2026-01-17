import * as constants from './constants'
import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../utils/generateSelectorName';
import { JobStatusData } from './types';

export const selectJobsDomain = (state) => state.get(constants.domain)

export const selectJobStatusDataDomain = createSelector(
  selectJobsDomain,
  (domain) => domain.get('jobStatusData') as JobStatusData,
)

// arg: id
export const selectJobStatusData = createCachedSelector(
  selectJobStatusDataDomain,
  (_, args) => args.id,
  (jobStatusData, id) => jobStatusData.get(id),
)
(
  (_, args) => generateSelectorName(args, ['id']),
)

// arg: id
export const selectJobIsDone = createCachedSelector(
  selectJobStatusData,
  (jobStatus) => jobStatus ? Boolean(jobStatus.jobsDone > 0 && jobStatus.jobsSpawned === jobStatus.jobsDone) : false,
)
(
  (_, args) => generateSelectorName(args, ['id']),
)
