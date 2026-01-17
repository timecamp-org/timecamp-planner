import * as constants from './constants'
import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../utils/generateSelectorName';
import { AppState } from 'models/domain/AppModel/types'
import { EntityState, EntityType } from 'models/domain/EntityModel/types'
import { Id } from 'common/utils/identifier'

export const selectEntityDomain = (state: AppState): EntityState => state.get(constants.domain)

export const selectEntityTypes = createSelector(
  selectEntityDomain,
  (domain ): Map<Id, EntityType> => domain.get('entityTypes'),
)

// arg: entityId
export const selectEntityType = createCachedSelector(
  selectEntityTypes,
  (_, args) => args.entityId,
  (entityTypes, entityId: Id): EntityType => entityTypes.get(entityId),
)
(
  (_, args) => generateSelectorName(args, ['entityId']),
)

// arg: entityId
export const selectContainerType = createCachedSelector(
  selectEntityType,
  (entityType): EntityType => (entityType ? entityType.split('-')[0] as EntityType : null),
)
(
  (_, args) => generateSelectorName(args, ['entityId']),
)
