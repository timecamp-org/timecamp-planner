import { createSelector } from 'reselect'
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'
import { List, Map } from 'immutable'
import { EntityStatus } from '../../EntityModel/types'

import { getInitials } from '../../../../utils/getInitials'
import { selectUsersStatusInCurrentOrganization, selectAllOrganizationsData, selectCurrentOrganizationActivePeopleRole } from '../../OrganizationsModel/selectors/domain'

import {
  selectUsersData,
  selectCurrentUserId,
  selectUsersFirstName,
  selectUsersLastName,
  selectUsersEmail,
  selectCurrentUserOrganizationIds,
} from './domain'

import createCachedSelector from 're-reselect';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { selectIsCurrentUserOrganizationGuest } from '../../OrganizationsModel/selectors';
import { OrganizationPeopleRole, OrganizationsData } from '../../OrganizationsModel/types';
import { selectProjectPeople } from '../../ProjectsModel/selectors/domain';
import { ApplicationState } from 'common/types'
import { UsersDataInterface } from 'models/domain/UsersModel/types'
import { Id } from 'common/utils/identifier'
import { MentionType, UsersProjectMentionDataInterface } from 'models/domain/MessagesModel/types'

const emptyMap = Map()
const emptyList = List()

export const selectUserIds = createImmutableEqualSelector<
  ApplicationState,
  UsersDataInterface,
  List<Id>>(
    selectUsersData,
    (data: UsersDataInterface): List<Id> => {
      return data.map(user => user.id).keySeq().toList()
    }
  )

export const selectAllUserIds = createImmutableEqualSelector<
  ApplicationState,
  List<Id>,
  Map<Id, EntityStatus>,
  List<Id>>(
    selectUserIds,
    selectUsersStatusInCurrentOrganization,
    (userIds: List<Id>, usersStatusInCurrentOrganization: Map<Id, EntityStatus>): List<Id> =>
      userIds
        .filter(userId => usersStatusInCurrentOrganization.get(userId) === EntityStatus.EXISTS)
        .toList(),
  )

export const selectAllUserIdsExceptCurrent = createSelector<
  ApplicationState,
  List<Id>,
  Id,
  List<Id>
>(
  selectAllUserIds,
  selectCurrentUserId,
  (allUserIds: List<Id>, currentUserId: Id) =>
    allUserIds.filter(userId => userId !== currentUserId) as List<Id>,
)

// args: projectId
export const selectUsersProjectMentionData = createCachedSelector(
  selectUsersData,
  selectAllUserIds,
  selectCurrentOrganizationActivePeopleRole,
  selectProjectPeople,
  selectIsCurrentUserOrganizationGuest,
  (
    usersData: UsersDataInterface,
    usersIds: List<Id>,
    organizationPeopleRole: Map<Id, OrganizationPeopleRole>,
    projectPeople: List<Id>,
    isCurrentUserOrganizationGuest: boolean
  ): List<UsersProjectMentionDataInterface> => {
    let mentionData = emptyList as List<UsersProjectMentionDataInterface>

    usersIds.map(userId => {
      const user = usersData.get(userId)
      const data: UsersProjectMentionDataInterface = {
        userId,
        displayValue: user.get('nickname') || user.get('email').split('@')[0],
        email: user.get('email'),
        fullName: `${usersData.getIn([userId, 'firstName']) || ''} ${usersData.getIn([userId, 'lastName']) || ''}`,
        avatarUrl: usersData.getIn([userId, 'avatarUrl']),
        type: MentionType.USER,
        isBot: user.get('isBot'),
      }
      mentionData = mentionData.push(data)
    })

    return mentionData
      .filter(mention => {
        const isUserGuest = organizationPeopleRole.get(mention.userId) === OrganizationPeopleRole.GUEST
        if (isCurrentUserOrganizationGuest || isUserGuest) {
          return projectPeople.includes(mention.userId)
        }
        return true
      }) as List<UsersProjectMentionDataInterface>
  }
)
  (
    (_, args) => generateSelectorName(args, ['projectId'])
  )


export const selectUsersInitials = createSelector<
  ApplicationState,
  List<Id>,
  Map<Id, string>,
  Map<Id, string>,
  Map<Id, string>,
  Map<Id, string>
>(
  selectUserIds,
  selectUsersFirstName,
  selectUsersLastName,
  selectUsersEmail,
  (
    userIds: List<string>,
    usersFirstName: Map<Id, string>,
    usersLastName: Map<Id, string>,
    usersEmail: Map<Id, string>
  ): Map<Id, string> => {
    let result = emptyMap as Map<Id, string>

    userIds.forEach(userId => {
      const firstName = usersFirstName.get(userId)
      const lastName = usersLastName.get(userId)
      const email = usersEmail.get(userId)

      result = result.set(userId, getInitials(firstName, lastName, email))
    })

    return result
  },
)

/**
* @returns {List}
*/
export const selectCurrentUserExistingOrganizationIds = createSelector<
  ApplicationState,
  List<Id>,
  OrganizationsData,
  List<Id>>(
    selectCurrentUserOrganizationIds,
    selectAllOrganizationsData,
    (organizationIds: List<Id>, organizationsData: OrganizationsData): List<Id> =>
      organizationIds.filter(organizationId => {
        const organization = organizationsData.get(organizationId)
        return organization && organization.status === EntityStatus.EXISTS
      }) as List<Id>,
  )

/**
* @returns {List}
*/
export const selectSortedCurrentUserExistingOrganizationIds = createSelector<
  ApplicationState,
  List<Id>,
  OrganizationsData,
  List<Id>>(
    selectCurrentUserExistingOrganizationIds,
    selectAllOrganizationsData,
    (existingOrganizationIds: List<Id>, organizationsData: OrganizationsData): List<Id> =>
      existingOrganizationIds
        .sort((aId, bId) => {
          const organizationA = organizationsData.get(aId)
          const organizationB = organizationsData.get(bId)
          if (organizationA.name < organizationB.name) {
            return -1
          } else if (organizationA.name > organizationB.name) {
            return 1
          } else {
            return 0
          }
        }) as List<Id>
  )
/**
* @returns {List}
*/
export const selectCurrentUserArchivedOrganizationIds = createSelector<
  ApplicationState,
  List<Id>,
  OrganizationsData,
  List<Id>>(
    selectCurrentUserOrganizationIds,
    selectAllOrganizationsData,
    (organizationIds, organizationsData) => organizationIds.filter(organizationId => {
      const organization = organizationsData.get(organizationId)
      return organization.status === EntityStatus.ARCHIVED
    }) as List<Id>,
  )
