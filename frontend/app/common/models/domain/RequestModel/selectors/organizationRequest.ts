import { findKey, startsWith } from 'lodash';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { createSelector } from 'reselect';
import { RequestStatus } from '../types';
import { selectRequestStatusDomain } from './domain';

export const selectGetOrganizationProjectsRequestStatus = createSelector(
  selectRequestStatusDomain,
  selectCurrentOrganizationId,
  (requestStatuses, currentOrganizationId) => {
    const loadingKey = findKey(requestStatuses.toJS(), (value, key) =>
      startsWith(key, `getOrganizationProjects::${currentOrganizationId}`),
    );

    const requestStatus = requestStatuses.get(loadingKey);

    return requestStatus;
  },
);

export const selectIsLoadingGetOrganizationProjectsRequestStatus = createSelector(
  selectGetOrganizationProjectsRequestStatus,
  (requestStatus) => requestStatus !== RequestStatus.SUCCESS,
);
