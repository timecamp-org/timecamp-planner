import { Id } from 'common/utils/identifier'

export interface BaseSpaceTileHookInterface {
  objectId: Id,
  isLoading?: boolean,
  hasAccessToView: boolean,
}

export interface BaseTileProps {
  spaceId: Id,
  viewId: Id,
}