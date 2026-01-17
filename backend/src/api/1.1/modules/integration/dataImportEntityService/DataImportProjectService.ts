import { injectable, inject } from "inversify";
import { Id, generateId } from "../../common/identifier";
import { ProjectDbRow, ProjectType } from "../../db/schema";
import { EntityStatus } from "../../common/enum";
import { ColorGeneratorInterface } from "../../common/ColorGenerator";
import { ProjectsModule } from "../../projects/ProjectsModule";
import { ProjectServiceInterface } from "../../projects/interfaces/ProjectServiceInterface";
import { DataImportProjectServiceInterface } from "./interfaces/DataImportProjectServiceInterface";
import { IntegrationModule } from "../IntegrationModule";
import { EntityInternalIdByExternalId, ExternalEntityType, DefaultProject } from "../types";
import { ExistingEntitiesServiceInterface } from "../interfaces/ExistingEntitiesServiceInterface";


@injectable()
export class DataImportProjectService implements DataImportProjectServiceInterface {

  protected projectColorGenerator: ColorGeneratorInterface;
  protected projectService: ProjectServiceInterface;
  protected existingEntitiesService: ExistingEntitiesServiceInterface;

  constructor(
    @inject(ProjectsModule.ProjectColorGeneratorInterface) projectColorGenerator: ColorGeneratorInterface,
    @inject(ProjectsModule.ProjectServiceInterface) projectService: ProjectServiceInterface,
    @inject(IntegrationModule.ExistingEntitiesServiceInterface) existingEntitiesService: ExistingEntitiesServiceInterface,
  ) {
    this.projectColorGenerator = projectColorGenerator
    this.projectService = projectService
    this.existingEntitiesService = existingEntitiesService
  }

  async createProjects(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    externalProjects: Partial<ProjectDbRow>[],
    trx: Transaction,
  ): Promise<ProjectDbRow[]> {
    const newProjectInternalIdByExternalId: EntityInternalIdByExternalId = {}

    const defaultProject = this.makeDefaultProject(userId)

    const internalProjects: ProjectDbRow[] = externalProjects
      .map(externalProject => {
        const newProjectId = generateId()
        newProjectInternalIdByExternalId[externalProject.id] = newProjectId

        return {
          ...defaultProject,
          ...externalProject,
          id: newProjectId,
          organizationId,
        }
      })

    await this.projectService.createProjects(internalProjects, trx)
    await this.existingEntitiesService.saveEntityExternalIdInternalIds(
      organizationId,
      extensionId,
      ExternalEntityType.PROJECT,
      newProjectInternalIdByExternalId,
      trx,
    )

    return internalProjects
  }

  makeDefaultProject(userId: Id): DefaultProject {
    return {
      status: EntityStatus.EXISTS,
      name: 'Imported project',
      projectType: ProjectType.PROJECT,
      isArchived: false,
      isPrivate: false,
      creatorId: userId,
      color: this.projectColorGenerator.generate(),
    }
  }

}
