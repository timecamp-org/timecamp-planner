import { injectable, inject } from "inversify";
import { DataImportUserInProjectServiceInterface } from "./interfaces/DataImportUserInProjectServiceInterface";

import { UserInProjectDbRow, ProjectDbRow } from "../../db/schema";
import { ProjectsModule } from "../../projects/ProjectsModule";
import { ExistingEntitiesServiceInterface } from "../interfaces/ExistingEntitiesServiceInterface";
import { IntegrationModule } from "../IntegrationModule";
import { ExternalEntityType } from "../types";
import { Id } from "../../common/identifier";
import { ProjectPeopleServiceInterface } from "../../projects/interfaces/ProjectPeopleServiceInterface";
import { UserInProjectJson } from '../../projects/types';

@injectable()
export class DataImportUserInProjectService implements DataImportUserInProjectServiceInterface {

  protected existingEntitiesService: ExistingEntitiesServiceInterface;
  protected projectPeopleService: ProjectPeopleServiceInterface;

  constructor(
    @inject(IntegrationModule.ExistingEntitiesServiceInterface) existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface) projectPeopleService: ProjectPeopleServiceInterface,
  ) {
    this.existingEntitiesService = existingEntitiesService
    this.projectPeopleService = projectPeopleService
  }

  async createProjectPeople(
    extensionId: Id,
    organizationId: Id,
    newInternalProjects: ProjectDbRow[],
    projectsPeople: UserInProjectDbRow[],
    trx: Transaction,
  ): Promise<UserInProjectJson[]> {
    const projectInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.PROJECT, trx)

    const newInternalProjectIds = newInternalProjects.map(project => project.id)

    const newProjectsPeople: UserInProjectJson[] = projectsPeople
      .map(userInProject => ({
        userId: userInProject.userId,
        role: userInProject.role,
        projectId: projectInternalIdByExternalId[userInProject.projectId],
      }))
      .filter(userInProject => newInternalProjectIds.includes(userInProject.projectId))

    await this.projectPeopleService.doAddProjectPersons(trx, newProjectsPeople)

    return newProjectsPeople
  }

}
