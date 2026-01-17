import { inject, injectable } from 'inversify';
import { CommonModule } from "../common/CommonModule";
import { Id, IdGeneratorInterface } from "../common/identifier";
import { DetermineOrderForUnarchivedSpaceJobInterface } from "../projectPersonalStructure/types";
import { ProjectsJobType } from "./types";
import { ProjectsJobFactoryInterface } from "./interfaces/ProjectsJobFactoryInterface";

@injectable()
export class ProjectsJobFactory implements ProjectsJobFactoryInterface {

  constructor(
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) { }

  private createBaseJob(type: ProjectsJobType) {
    return {
      id: this.idGenerator.generateId(),
      type,
    }
  }

  createDetermineOrderForUnarchivedSpaceJob(projectId: Id, organizationId: Id, lastUserId?: Id): DetermineOrderForUnarchivedSpaceJobInterface {
    const baseJob = this.createBaseJob(ProjectsJobType.DETERMINE_ORDER_FOR_UNARCHIVED_SPACE)
    return {
      ...baseJob,
      projectId,
      organizationId,
      lastUserId,
    }
  }
}