import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { Id } from 'common/utils/identifier';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import {
  selectProjectIdByObjectId,
  selectProjectIsGroupOrDirectChat,
} from 'models/domain/ProjectsModel/selectors';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { selectProjectViewRequestIsLoadingInitially } from 'models/domain/RequestModel/selectors/projectViewRequest';

export type DataProviderHook = {
  projectId: Id;
  isProjectViewDataRequestLoading: boolean;
};

export function useDataProvider(objectId: Id): DataProviderHook {
  const projectId = useSelector((state) =>
    selectProjectIdByObjectId(state, { objectId })
  );
  const isConversation = useSelector((state) =>
    selectProjectIsGroupOrDirectChat(state, { projectId })
  );

  const location = useLocation();

  const isKanban = location.pathname.includes(`/${ProjectPanelType.KANBAN}`);

  const taskFiltersTargetType = isKanban
    ? TaskFiltersTargetType.KANBAN
    : TaskFiltersTargetType.KANBAN_VERTICAL;

  const isProjectViewDataRequestLoading = useSelector((state) =>
    selectProjectViewRequestIsLoadingInitially(state, {
      projectId,
      isConversation,
      taskFiltersTargetType,
    })
  );

  return {
    projectId,
    isProjectViewDataRequestLoading,
  };
}
