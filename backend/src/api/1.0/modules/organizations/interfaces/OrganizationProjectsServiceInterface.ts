import { Id } from '../../common/identifier'
import { GetOrganizationUserProjectsWithMetadataResult, OrganizationProjectsQueryParams } from '../types'

export interface OrganizationProjectsServiceInterface {
  getUserOrganizationProjectsWithMetadata(organizationId: Id, userId: Id, queryParams: OrganizationProjectsQueryParams): PromiseLike<GetOrganizationUserProjectsWithMetadataResult>
}