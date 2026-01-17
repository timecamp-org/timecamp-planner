import {
  ProjectPanelType,
  RightPanelType,
} from '../../common/models/domain/ProjectsSettingsModel/types';
import { Id } from '../../common/utils/identifier';

import { getLastOpenedPanel } from './lastOpenedPanelController';

const getSpaceUrl = (
  spaceId: Id,
  projectPanelType?: ProjectPanelType,
  rightPanelType?: RightPanelType
): string => {
  if (!projectPanelType) {
    projectPanelType = getLastOpenedPanel(spaceId);
  }

  if (!rightPanelType) {
    if (projectPanelType === ProjectPanelType.CHAT) {
      return `/projects/${spaceId}/${projectPanelType}/${RightPanelType.TASKS}`;
    }

    return `/projects/${spaceId}/${projectPanelType}`;
  }

  return `/projects/${spaceId}/${projectPanelType}/${rightPanelType}`;
};

export default getSpaceUrl;
