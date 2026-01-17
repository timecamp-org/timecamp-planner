import { ProjectPanelType, RightPanelType } from '../ProjectsSettingsModel/types'
import { Id } from 'common/utils/identifier'
import { ImmutableMap } from 'common/types'
import { List } from 'immutable'

export type NavigationStackItemInterface = {
  id: Id,
  objectType: string
  projectId: Id,
  projectPanelType: ProjectPanelType,
  rightPanelType: RightPanelType,
  taskId?: Id,
}

export interface RouterState extends ImmutableMap<string, any> {
  currentPathname: string,
  previousPathname: string,
  appHistoryStack: Map<Id, List<NavigationStackItemInterface>>,
  activeRouteId: Id,
}
