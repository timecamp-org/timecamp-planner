import { ApplicationState } from 'common/types'
import { PersonalProjectStructureState, UserProjectGroupRecordInterface } from '../types'
import { domain } from '../constants'
import { createSelector } from 'reselect'
import { Id } from 'common/utils/identifier'
import { Map, List } from 'immutable'
import createCachedSelector from 're-reselect'
import generateSelectorName from 'common/utils/generateSelectorName'

const emptyMap = Map()
const emptyList = List<Id>()

// domain level selectors
export const selectPersonalProjectStructureDomain = (state: ApplicationState): PersonalProjectStructureState => state.get(domain)

export const selectProjectGroupsData = createSelector(
  selectPersonalProjectStructureDomain,
  (domain) => domain.get('groupsData') as Map<Id, UserProjectGroupRecordInterface>
)

export const selectProjectOrderByGroupIdDomain = createSelector(
  selectPersonalProjectStructureDomain,
  (domain) => domain.get('projectOrderByGroupId') as Map<Id, Map<Id, number>>
)

export const selectProjectOrderWithoutGroupDomain = createSelector(
  selectPersonalProjectStructureDomain,
  (domain) => domain.get('projectOrderWithoutGroup') as Map<Id, number>
)

// args: groupId
export const selectProjectGroup = createCachedSelector(
  selectProjectGroupsData,
  (_, args) => args.groupId,
  (groupsData, groupId) => groupsData.get(groupId),
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )

// args: groupId
export const selectProjectGroupName = createCachedSelector(
  selectProjectGroup,
  (group) => group ? group.name : undefined,
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )

// args: groupId
export const selectProjectGroupIsExpanded = createCachedSelector(
  selectProjectGroup,
  (group) => group ? group.isExpanded : undefined,
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )

// args: groupId
export const selectProjectGroupWasJustCreated = createCachedSelector(
  selectProjectGroup,
  (group) => group?.wasJustCreated,
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )

// args: groupId
export const selectProjectOrdersByGroupId = createCachedSelector(
  selectProjectOrderByGroupIdDomain,
  (_, args) => args.groupId,
  (projectOrderByGroupIdDomain, groupId) => projectOrderByGroupIdDomain.get(groupId) || emptyMap as Map<Id, number>
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )


// args: projectId
export const selectGrouplessProjectOrder = createCachedSelector(
  selectProjectOrderWithoutGroupDomain,
  (_, args) => args.projectId,
  (projectOrderWithoutGroupDomain, projectId) => projectOrderWithoutGroupDomain.get(projectId)
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )

export const selectProjectIdsInGroups = createSelector(
  selectProjectOrderByGroupIdDomain,
  (projectOrderByGroupIdDomain) => {
    let projectIds = emptyList
    projectOrderByGroupIdDomain.forEach((projectOrders: Map<Id, number>, projectId: Id) => {
      projectIds = projectIds.concat(projectOrders.keySeq().toList()) as List<Id>
    })
    return projectIds
  }
)