import {
  makeProjectLastOpenedPanelId,
  makeProjectLastOpenedSubPanelId,
} from 'common/utils/generateLocalStorageId';

import { ProjectPanelType } from '../../common/models/domain/ProjectsSettingsModel/types';
import { Id } from '../../common/utils/identifier';

export const getLastOpenedPanel = (projectId: Id): ProjectPanelType => {
  const storedValue = localStorage.getItem(
    makeProjectLastOpenedPanelId(projectId)
  );

  return storedValue === null
    ? ProjectPanelType.CHAT
    : (storedValue as ProjectPanelType);
};

export const onSetProjectLastOpenedPanel = (
  projectId: Id,
  lastOpenedPanel: ProjectPanelType
) => {
  localStorage.setItem(
    makeProjectLastOpenedPanelId(projectId),
    lastOpenedPanel
  );
};

type LastOpenedSubPanelType = Partial<{
  [key in ProjectPanelType]: ProjectPanelType;
}>;
export const onSetProjectLastOpenedSubPanel = (
  projectId: Id,
  lastOpenedSubPanel: LastOpenedSubPanelType
) => {
  localStorage.setItem(
    makeProjectLastOpenedSubPanelId(projectId),
    JSON.stringify(lastOpenedSubPanel)
  );
};

export const getLastOpenedSubPanel = (
  projectId: Id
): LastOpenedSubPanelType => {
  try {
    const storedValue = localStorage.getItem(
      makeProjectLastOpenedSubPanelId(projectId)
    );

    return (storedValue && JSON.parse(storedValue)) || {};
  } catch (e) {
    console.error(e);
  }
};
