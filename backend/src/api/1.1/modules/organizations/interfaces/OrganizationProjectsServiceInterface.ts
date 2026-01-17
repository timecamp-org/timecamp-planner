import { Id } from '../../common/identifier'
import { ClearInactiveConversationsResult, GetOrganizationUserProjectsWithMetadataResult, OrganizationProjectsQueryParams } from '../types'

export interface OrganizationProjectsServiceInterface {
  getUserOrganizationProjectsWithMetadata(organizationId: Id, userId: Id, queryParams: OrganizationProjectsQueryParams): PromiseLike<GetOrganizationUserProjectsWithMetadataResult>
  clearInactiveConversations(organizationId: Id, userId: Id): PromiseLike<ClearInactiveConversationsResult>
}