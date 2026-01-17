import { List } from 'immutable';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectUngroupedSpaceIds,
  selectCurrentOrganizationProjectGroupIds,
} from 'models/domain/PersonalProjectStructureModel/selectors';
import { organizationProjectsWithUnreadMessagesRequestType } from 'models/domain/ProjectsModel/requestQueryParams';
import { selectIsRequestNotFinishedInitially } from 'models/domain/RequestModel/selectors';

export type DataProviderHookInterface = {
  spaceIds: List<Id>;
  projectGroupIds: List<Id>;
  currentOrganizationId: Id;
  isRequestFinished: boolean;
};

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector((state) =>
    selectCurrentOrganizationId(state)
  );
  return {
    spaceIds: useSelector(selectUngroupedSpaceIds),
    projectGroupIds: useSelector(selectCurrentOrganizationProjectGroupIds),
    isRequestFinished: !useSelector((state) =>
      selectIsRequestNotFinishedInitially(state, {
        requestType: organizationProjectsWithUnreadMessagesRequestType,
        objectId: currentOrganizationId,
      })
    ),
    currentOrganizationId,
  };
};
