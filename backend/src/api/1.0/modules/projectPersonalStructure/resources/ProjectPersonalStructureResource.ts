import { AbstractResource } from "../../../../../infrastructure/resources/AbstractResource";
import {
  ProjectPersonalStructureResourceContext,
  ProjectPersonalStructureResourceData,
  ProjectPersonalStructureResourceQueryParams,
} from "../types";
import { inject, injectable } from "inversify";
import { ProjectPersonalStructureModule } from "../ProjectPersonalStructureModule";
import { PersonalProjectGroupProviderInterface } from "../interfaces/PersonalProjectGroupProviderInterface";
import { PaginationModule } from "../../pagination/PaginationModule";
import { PaginationServiceFactoryInterface } from "../../pagination/interfaces/PaginationServiceFactoryInterface";
import { keyBy } from "lodash";
import { OrganizationsModule } from "../../organizations/OrganizationsModule";
import { UserInOrganizationProviderInterface } from "../../organizations/interfaces/UserInOrganizationProviderInterface";
import { PersonalProjectOrderServiceInterface } from "../interfaces/PersonalProjectOrderServiceInterface";

@injectable()
export class ProjectPersonalStructureResource
  extends AbstractResource<
    ProjectPersonalStructureResourceQueryParams,
    ProjectPersonalStructureResourceContext,
    ProjectPersonalStructureResourceData
  > {

  constructor(
    @inject(PaginationModule.PaginationServiceFactoryInterface)
      paginationServiceFactory: PaginationServiceFactoryInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectGroupProviderInterface)
    private personalProjectGroupProvider: PersonalProjectGroupProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectOrderServiceInterface)
    private personalProjectOrderService: PersonalProjectOrderServiceInterface,
  ) {
    super(paginationServiceFactory);
  }

  async getData(queryParams: ProjectPersonalStructureResourceQueryParams, context: ProjectPersonalStructureResourceContext): Promise<ProjectPersonalStructureResourceData> {
    const {
      userId,
      organizationId,
    } = context

    const { id: userInOrganizationId } = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId)
    const allGroupsForUserInCurrentOrganization = await this.personalProjectGroupProvider.getAllPersonalProjectGroupsForUserInOrganization(userInOrganizationId)
    const resultProjectGroups = keyBy(allGroupsForUserInCurrentOrganization, 'id')

    const projectOrder = await this.personalProjectOrderService.getPersonalProjectStructure(userInOrganizationId)

    return {
      projectOrder,
      projectGroups: resultProjectGroups,
    }
  }

  getMetadata() {
    return null
  }

  getMetadataPromiseForField() {
    return null
  }

  getPaginatorOptions() {
    return null
  }

  getQueryDecorators() {
    return null
  }

}