import {
  OrganizationProjectsParamMetadata,
  OrganizationProjectsQueryParams, ProjectMetadataType,
  ProjectType
} from 'models/domain/ProjectsModel/types'
import { EntityStatus } from 'models/domain/EntityModel/types'
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers'
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'

// fetch available projects (public, not archived, which user is not member of)
export const getAvailableOrganizationProjectsQueryParams: OrganizationProjectsQueryParams = {
  isMember: false,
  projectType: [ProjectType.PROJECT],
  status: EntityStatus.EXISTS,
}
export const fetchAvailableSpacesRequestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, getAvailableOrganizationProjectsQueryParams)

// fetch archived spaces which user is member of
export const getArchivedOrganizationProjectsQueryParams: OrganizationProjectsQueryParams = {
  isMember: true,
  projectType: [ProjectType.PROJECT],
  status: EntityStatus.ARCHIVED,
}
export const fetchArchivedSpacesRequestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, getArchivedOrganizationProjectsQueryParams)

// fetch organization group and direct chats projects along with projectPeople metadata
export const organizationDirectAndGroupChatQueryParams: OrganizationProjectsQueryParams = {
  projectType: [ProjectType.DIRECT_CHAT, ProjectType.GROUP_CHAT],
  isMember: true,
  isVisible: true,
  metadata: [OrganizationProjectsParamMetadata.PEOPLE],
}
export const fetchOrganizationProjectsRequestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, organizationDirectAndGroupChatQueryParams)

export const getOrganizationProjectsWithUnreadMessagesQueryParams: OrganizationProjectsQueryParams = {
  isMember: true,
  projectType: [ProjectType.PROJECT],
  status: EntityStatus.EXISTS,
  metadata: [OrganizationProjectsParamMetadata.UNREAD_MESSAGES],
}

export const organizationProjectsWithUnreadMessagesRequestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, getOrganizationProjectsWithUnreadMessagesQueryParams)

export const getProjectWithPeopleQueryParams = {
  metadata: [ProjectMetadataType.PEOPLE],
}

export const projectWithPeopleRequestType = getRequestTypeWithParams(RequestTypesConstants.getProject, getProjectWithPeopleQueryParams)

export const getHiddenConversationQueryParams: OrganizationProjectsQueryParams = {
  projectType: [ProjectType.GROUP_CHAT, ProjectType.DIRECT_CHAT],
  isMember: true,
  isVisible: false,
  metadata: [OrganizationProjectsParamMetadata.PEOPLE],
}

export const getHiddenConversationsRequestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, getHiddenConversationQueryParams)