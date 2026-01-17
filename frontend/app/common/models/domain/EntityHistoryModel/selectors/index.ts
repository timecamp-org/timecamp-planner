import createCachedSelector from "re-reselect";
import { selectEntityHistoryDomain } from "./domain";
import generateSelectorName from "../../../../utils/generateSelectorName";


// args: entityType
export const selectEntityTypeHistory = createCachedSelector(
  selectEntityHistoryDomain,
  (_, args) => args.entityType,
  (entityHistoryDomain, entityType) => {
    return entityHistoryDomain.get(entityType)
  },
)
  (
    (_, args) => generateSelectorName(args, ['entityType']),
  )

// args: entityType, entityId
export const selectEntityHistory = createCachedSelector(
  selectEntityTypeHistory,
  (_, args) => args.entityId,
  (entityTypeHistory, entityId) => {
    return entityTypeHistory && entityTypeHistory.get(entityId)
  },
)
  (
    (_, args) => generateSelectorName(args, ['entityType', 'entityId']),
  )

// args: entityType, entityId, entityField
export const selectEntityFieldUpdatedAt = createCachedSelector(
  selectEntityHistory,
  (_, args) => args.entityField,
  (entityHistory, entityField) => {
    return entityHistory && entityHistory.get(entityField)
  },
)
  (
    (_, args) => generateSelectorName(args, ['entityType', 'entityId', 'entityField']),
  )