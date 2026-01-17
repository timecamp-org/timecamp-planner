import { inject, injectable } from 'inversify';
import { OrganizationProjectsServiceInterface } from './interfaces/OrganizationProjectsServiceInterface';
import { Id } from '../common/identifier';
import {
  GetOrganizationUserProjectsWithMetadataResult,
  GetOrganizationUserProjectsWithMetadataStatus,
  OrganizationProjectsQueryParams,
} from './types';
import { OrganizationsModule } from './OrganizationsModule';
import { OrganizationProjectsResource } from './resources/OrganizationProjectsResource';
import { OrganizationProviderInterface } from './interfaces/OrganizationProviderInterface';
import { UsersModule } from '../users/UsersModule';
import { UserServiceInterface } from '../users/UserServiceInterface';

@injectable()
export class OrganizationProjectsService
implements OrganizationProjectsServiceInterface
{
  constructor(
    @inject(OrganizationsModule.OrganizationProjectsResource)
    private organizationProjectsResource: OrganizationProjectsResource,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
  ) {}

  async getUserOrganizationProjectsWithMetadata(
    organizationId: Id,
    userId: Id,
    queryParams: OrganizationProjectsQueryParams
  ): Promise<GetOrganizationUserProjectsWithMetadataResult> {
    const organization = await this.organizationProvider.getOrganization(
      organizationId
    );
    if (!organizationId) {
      return {
        status:
          GetOrganizationUserProjectsWithMetadataStatus.ORGANIZATION_NOT_FOUND,
      };
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      return {
        status: GetOrganizationUserProjectsWithMetadataStatus.USER_NOT_FOUND,
      };
    }

    return {
      status: GetOrganizationUserProjectsWithMetadataStatus.OK,
      data: await this.organizationProjectsResource.getData(queryParams, {
        organization,
        userId,
      }),
    };
  }
}
